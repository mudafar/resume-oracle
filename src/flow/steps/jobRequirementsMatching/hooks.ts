"use client";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setMatches, setLastInputsHash, setLastJobDescription } from "@/store/slices/matchesSlice";
import { useLlmService } from "@/hooks/useLlmService";
import { jobRequirementsExtractorService } from "@/services/jobRequirementsExtractorService";
import { jobRequirementsMatchingService } from "@/services/jobRequirementsMatchingService";
import sha1 from "sha1";
import { compareTwoStrings } from "string-similarity";
import { addProfileSectionReturnId } from "../createProfileSection";
import { editSection } from "@/store/slices/profileSectionsSlice";
import {
  HybridSelectionResult,
  JobRequirement,
  JobRequirementMatch,
  RequirementCluster,
} from "@/services/zodModels";

export const useJobMatching = () => {
  const dispatch = useDispatch();
  const matches = useSelector((state: RootState) => ({
    selected_sections: state.matches.selected_sections,
    coverage_gaps: state.matches.coverage_gaps
  }));
  const lastInputsHash = useSelector((state: RootState) => state.matches.lastInputsHash);
  const lastJobDescription = useSelector((state: RootState) => state.matches.lastJobDescription);
  const profileSections = useSelector((state: RootState) => state.profileSections.sections);
  const job_description = useSelector((state: RootState) => state.jobContext.job_description);
  const company_context = useSelector((state: RootState) => state.jobContext.company_context);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMatchId, setModalMatchId] = useState<string | null>(null);
  const [showRematchBanner, setShowRematchBanner] = useState(false);

  const [triggerExtractRequirements, { isLoading: isExtracting, error: extractError }] = useLlmService<RequirementCluster[]>(
    jobRequirementsExtractorService.extractJobRequirements
  );
  const [triggerMatch, { isLoading, error }] = useLlmService<HybridSelectionResult>(
    jobRequirementsMatchingService.findOptimalMatches
  );

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
    // Step 1: Extract requirements from job description using LLM service
    const requirementClusters = await triggerExtractRequirements(job_description, company_context || "");
    // Step 2: Match requirements to profile sections using LLM service
    const result = await triggerMatch(requirementClusters, profileSections, company_context || "");
    
    // Store the full result in Redux
    dispatch(setMatches(result));
    dispatch(setLastInputsHash(inputsHash));
    dispatch(setLastJobDescription(job_description));
  };

  // Initial load effect
  useEffect(() => {
    if (!matches && hasValidInputs) {
      // performMatch();
    }
    // eslint-disable-next-line
  }, [matches, hasValidInputs]);

  // Handle input changes
  useEffect(() => {
    if (!hasValidInputs) {
      setShowRematchBanner(false);
      return;
    }

    if (matches && inputsChanged) {
      // Check for major JD change
      if (isMajorJdChange) {
        // Auto-trigger for major JD changes
        // performMatch();
        setShowRematchBanner(false);
      } else {
        // Show banner for minor changes
        setShowRematchBanner(true);
      }
    }
  }, [inputsChanged, matches, hasValidInputs, isMajorJdChange]);

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
    // Legacy state for components that still use it
    matches,
    // New state for updated components
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