"use client";
import { useCallback, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setMatches } from "@/store/slices/matchesSlice";
import { useLlmService } from "@/hooks/useLlmService";
import { jobRequirementsExtractorService } from "@/services/jobRequirementsExtractorService";
import { jobRequirementsMatchingService } from "@/services/jobRequirementsMatchingService";
import { useAutoRetrigger } from "@/hooks/useAutoRetrigger";
import { addProfileSectionReturnId } from "../../../utils/createProfileSection";
import { editSection } from "@/store/slices/profileSectionsSlice";
import { HybridSelectionResult } from "@/schemas/matching";
import type { RequirementCluster } from "@/schemas/job";


export const useJobMatching = () => {
  const dispatch = useDispatch();
  const matches = useSelector((state: RootState) => ({
    selected_sections: state.matches.selected_sections,
    coverage_gaps: state.matches.coverage_gaps
  }));
  const profileSections = useSelector((state: RootState) => state.profileSections.sections);
  const job_description = useSelector((state: RootState) => state.jobContext.job_description);
  const company_context = useSelector((state: RootState) => state.jobContext.company_context);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMatchId, setModalMatchId] = useState<string | null>(null);

  const [triggerExtractRequirements, { isLoading: isExtracting, error: extractError }] = useLlmService<RequirementCluster[]>(
    jobRequirementsExtractorService.extractJobRequirements
  );
  const [triggerMatch, { isLoading, error }] = useLlmService<HybridSelectionResult>(
    jobRequirementsMatchingService.findOptimalMatches
  );

  // Validation: Check if main inputs are present
  const hasValidInputs = useMemo(() => {
    return !!(job_description?.trim() && profileSections?.length > 0);
  }, [job_description, profileSections]);

  const performMatch = useCallback(async (isLatest: () => boolean) => {
    if (!hasValidInputs) {
      return;
    }
    const requirementClusters = await triggerExtractRequirements(job_description, company_context || "");
    if (!isLatest()) {
      return;
    }
    const result = await triggerMatch(requirementClusters, profileSections, company_context || "");
    if (!isLatest()) {
      return;
    }

    dispatch(setMatches(result));
  },
    [
      hasValidInputs,
      triggerExtractRequirements,
      job_description,
      company_context,
      triggerMatch,
      profileSections,
      dispatch,
    ]
  );

  // TODO: change inputs to rely more on job description for the string-similarity
  const inputs = useMemo(() => ({ job_description, company_context, profileSections }),
    [job_description, company_context, profileSections]
  );
  const { showBanner, setShowBanner, acknowledgeMinorChange, onManualRun, isRunning, error: autoError } = useAutoRetrigger({
    stepKey: "job-requirements",
    inputs,
    onAutoRun: performMatch,
  });


  const handleSeeSuggestions = (requirement: string, matchId: string) => {
    setModalOpen(true);
    setModalMatchId(matchId);
  };

  const handleSaveAndMatch = ({ type, content, baseId }: { type: string, content: string, baseId?: string }) => {
    let id = baseId;
    if (!baseId) {
      id = addProfileSectionReturnId(dispatch, type, content);
    } else {
      dispatch(editSection({ id: baseId, type, content }));
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
    // Legacy state for components that still use it
    matches,
    // 
    profileSections,
    job_description,
    isLoading: isLoading || isExtracting || isRunning,
    error: error || autoError,
    showRematchBanner: showBanner,
    modalOpen,
    modalMatchId,
    onRematch: onManualRun,
    setShowRematchBanner: setShowBanner,
    handleSeeSuggestions,
    setModalOpen,
    handleSaveAndMatch,
    handleSaveOnly,
  };
};