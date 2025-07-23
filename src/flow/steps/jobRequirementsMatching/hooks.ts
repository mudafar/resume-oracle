"use client";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setMatches, setLastInputsHash, updateMatch } from "@/store/slices/matchesSlice";
import { useMatchMutation } from "@/store/services/llmApi";
import sha1 from "sha1";
import { addProfileSectionReturnId } from "../createProfileSection";
import { editSection } from "@/store/slices/profileSectionsSlice";

export const useJobMatching = () => {
  const dispatch = useDispatch();
  const matches = useSelector((state: RootState) => state.matches.data);
  const lastInputsHash = useSelector((state: RootState) => state.matches.lastInputsHash);
  const profileSections = useSelector((state: RootState) => state.profileSections.sections);
  const job_description = useSelector((state: RootState) => state.jobContext.job_description);
  const company_context = useSelector((state: RootState) => state.jobContext.company_context);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRequirement, setModalRequirement] = useState<string | null>(null);
  const [modalMatchId, setModalMatchId] = useState<string | null>(null);
  const [showRematchBanner, setShowRematchBanner] = useState(false);

  const [triggerMatch, { isLoading, error }] = useMatchMutation();

  const inputsHash = useMemo(
    () => sha1(JSON.stringify({ job_description, company_context, profileSections })),
    [job_description, company_context, profileSections]
  );

  const inputsChanged = inputsHash !== lastInputsHash;

  useEffect(() => {
    if (!matches.length) {
      triggerMatch({ job_description, company_context, profile_sections: profileSections })
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
        });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (matches.length && inputsChanged) {
      setShowRematchBanner(true);
    }
  }, [inputsChanged, matches.length]);

  const onRematch = async () => {
    setShowRematchBanner(false);
    await triggerMatch({ job_description, company_context, profile_sections: profileSections })
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
      });
  };

  const handleSeeSuggestions = (requirement: string, matchId: string) => {
    setModalOpen(true);
    setModalRequirement(requirement);
    setModalMatchId(matchId);
  };

  const handleSaveAndMatch = ({ type, content, baseId }: { type: string, content: string, baseId?: string }) => {
    let id = baseId;
    if (!baseId) {
      id = addProfileSectionReturnId(dispatch, type, content);
    } else {
      dispatch(editSection({ id: baseId, type, content }));
    }
    if (modalMatchId && id) {
      dispatch(updateMatch({ id: modalMatchId, match: { profile_section_id: id } }));
    }
    setModalOpen(false);
  };

  const handleSaveOnly = ({ type, content, baseId }: { type: string, content: string, baseId?: string }) => {
    if (!baseId) {
      addProfileSectionReturnId(dispatch, type, content);
    } else {
      dispatch(editSection({ id: baseId, type, content }));
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
    modalRequirement,
    onRematch,
    setShowRematchBanner,
    handleSeeSuggestions,
    setModalOpen,
    handleSaveAndMatch,
    handleSaveOnly,
  };
};