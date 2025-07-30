"use client";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setMatches, setLastInputsHash, setLastJobDescription, updateMatch } from "@/store/slices/matchesSlice";
import { useMatchMutation } from "@/store/services/llmApi";
import sha1 from "sha1";
import { compareTwoStrings } from "string-similarity";
import { addProfileSectionReturnId } from "../createProfileSection";
import { editSection } from "@/store/slices/profileSectionsSlice";

export const useJobMatching = () => {
  const dispatch = useDispatch();
  const matches = useSelector((state: RootState) => state.matches.data);
  const lastInputsHash = useSelector((state: RootState) => state.matches.lastInputsHash);
  const lastJobDescription = useSelector((state: RootState) => state.matches.lastJobDescription);
  const profileSections = useSelector((state: RootState) => state.profileSections.sections);
  const job_description = useSelector((state: RootState) => state.jobContext.job_description);
  const company_context = useSelector((state: RootState) => state.jobContext.company_context);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMatchId, setModalMatchId] = useState<string | null>(null);
  const [showRematchBanner, setShowRematchBanner] = useState(false);

  const [triggerMatch, {isLoading, error}] = useMatchMutation();

  const inputsHash = useMemo(
    () => sha1(JSON.stringify({job_description, company_context, profileSections})),
    [job_description, company_context, profileSections]
  );

  // Validation: Check if main inputs are present
  const hasValidInputs = useMemo(() => {
    return !!(job_description?.trim() && profileSections?.length > 0);
  }, [job_description, profileSections]);

  // Calculate JD similarity using string-similarity package
  const jdSimilarity = useMemo(() => {
    if (!lastJobDescription || !job_description) return 0;
    return compareTwoStrings(lastJobDescription, job_description);
  }, [lastJobDescription, job_description]);

  const inputsChanged = inputsHash !== lastInputsHash;
  const isMajorJdChange = jdSimilarity < 0.7; // Threshold for major change

  const performMatch = async () => {
    if (!hasValidInputs) return;

    await triggerMatch({job_description, company_context, profile_sections: profileSections})
      .unwrap()
      .then((data) => {
        dispatch(setMatches((data.job_requirement_matches || []).map((m: any, i: number) => ({
          id: String(i),
          requirement_id: String(i),
          requirement: m.requirement || "",
          profile_section_id: String(m.profile_section_id ?? ''),
          confidence: m.confidence != null ? String(m.confidence) : "",
          gap_description: m.gap_description || "",
          recommendation: m.recommendation || "",
        }))));
        dispatch(setLastInputsHash(inputsHash));
        dispatch(setLastJobDescription(job_description));
      });
  };

  // Initial load effect
  useEffect(() => {
    if (!matches.length && hasValidInputs) {
      performMatch();
    }
    // eslint-disable-next-line
  }, []);

  // Handle input changes
  useEffect(() => {
    if (!hasValidInputs) {
      setShowRematchBanner(false);
      return;
    }

    if (matches.length && inputsChanged) {
      // Check for major JD change
      if (isMajorJdChange) {
        // Auto-trigger for major JD changes
        performMatch();
        setShowRematchBanner(false);
      } else {
        // Show banner for minor changes
        setShowRematchBanner(true);
      }
    }
  }, [inputsChanged, matches.length, hasValidInputs, isMajorJdChange]);

  const onRematch = async () => {
    setShowRematchBanner(false);
    await performMatch();
  };

  const handleSeeSuggestions = (requirement: string, matchId: string) => {
    setModalOpen(true);
    setModalMatchId(matchId);
  };

  const handleSaveAndMatch = ({type, content, baseId}: { type: string, content: string, baseId?: string }) => {
    let id = baseId;
    if (!baseId) {
      id = addProfileSectionReturnId(dispatch, type, content);
    } else {
      dispatch(editSection({id: baseId, type, content}));
    }
    if (modalMatchId && id) {
      dispatch(updateMatch({
        id: modalMatchId,
        match: {profile_section_id: id, confidence: 100, gap_description: '', recommendation: ''}
      }));
    }
    setModalOpen(false);
  };

  const handleSaveOnly = ({type, content, baseId}: { type: string, content: string, baseId?: string }) => {
    if (!baseId) {
      addProfileSectionReturnId(dispatch, type, content);
    } else {
      dispatch(editSection({id: baseId, type, content}));
    }
    setModalOpen(false);
  };

  return {
    matches,
    profileSections,
    job_description,
    isLoading,
    error,
    showRematchBanner,
    modalOpen,
    modalMatchId,
    onRematch,
    setShowRematchBanner,
    handleSeeSuggestions,
    setModalOpen,
    handleSaveAndMatch,
    handleSaveOnly,
  };
};