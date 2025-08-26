"use client";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setMatches } from "@/store/slices/matchesSlice";
import { useLlmStreamingService } from "@/hooks/useLlmStreamingService";
import { hybridSelectionService } from "@/services/matching/hybridSelection";
import { jobRequirementsExtractorService } from "@/services/jobRequirementsExtractorService";
import { jobRequirementsMatchingService } from "@/services/jobRequirementsMatchingService";
import { useAutoRetrigger } from "@/hooks/useAutoRetrigger";
import { addProfileSectionReturnId } from "../../../utils/createProfileSection";
import { editSection } from "@/store/slices/profileSectionsSlice";
import { HybridSelectionResult } from "@/schemas/matching";
import type { RequirementCluster } from "@/schemas/job";


export const useJobMatching = () => {
  const dispatch = useDispatch();
  const profileSections = useSelector((state: RootState) => state.profileSections.sections);
  const job_description = useSelector((state: RootState) => state.jobContext.job_description);
  const company_context = useSelector((state: RootState) => state.jobContext.company_context);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMatchId, setModalMatchId] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'extracting' | 'matching' | 'optimizing' | 'complete'>('idle');
  // State to store intermediate results
  const [requirementClusters, setRequirementClusters] = useState<RequirementCluster[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const matchingTriggeredRef = useRef(false);

  const [triggerExtractRequirements, { isLoading: isExtracting, error: extractError, data: extractedData, reset: resetExtract }] = useLlmStreamingService(
    jobRequirementsExtractorService.extractJobRequirements
  );
  const [triggerRawMatch, { isLoading: isMatching, error: matchError, data: matchScoredPairs, reset: resetMatch }] = useLlmStreamingService(
    jobRequirementsMatchingService.streamRawLlmMatching
  );



  // Effect to handle extracted requirements - only store them, don't trigger matching yet
  useEffect(() => {
    if (extractedData?.requirement_clusters) {
      setRequirementClusters(extractedData.requirement_clusters);
    }
  }, [extractedData]);

  // Effect to detect when extraction stream completes and trigger matching
  useEffect(() => {
    // Stream is complete when we have data, extraction is no longer loading, and we haven't triggered matching yet
    if (extractedData?.requirement_clusters && !isExtracting && !matchingTriggeredRef.current && profileSections?.length > 0) {
      matchingTriggeredRef.current = true;
      triggerRawMatch(extractedData.requirement_clusters, profileSections, company_context || "");
    }
  }, [extractedData, isExtracting, profileSections, company_context, triggerRawMatch]);

  // Effect to handle raw match results and apply hybrid optimization
  useEffect(() => {
    if (matchScoredPairs?.scored_pairs && requirementClusters.length > 0 && !isMatching) {
      setIsOptimizing(true);

      // Apply hybrid selection using existing service method
      hybridSelectionService.selectOptimalSections(
        matchScoredPairs.scored_pairs,
        requirementClusters,
        { max_sections: 8, critical_threshold: 50 }
      ).then((optimizedResult: HybridSelectionResult) => {
        dispatch(setMatches(optimizedResult));
      }).catch(() => {
        console.error("Hybrid selection failed");
      }).finally(() => {
        setIsOptimizing(false);
      });
    }
  }, [matchScoredPairs, requirementClusters, isMatching, dispatch]);

  // Validation: Check if main inputs are present
  const hasValidInputs = useMemo(() => {
    return !!(job_description?.trim() && profileSections?.length > 0);
  }, [job_description, profileSections]);

  const performMatch = useCallback(async () => {
    if (!hasValidInputs) {
      return;
    }
    // Reset previous state
    setCurrentPhase('idle');
    setRequirementClusters([]);
    setIsOptimizing(false);
    matchingTriggeredRef.current = false;
    dispatch(setMatches({ selected_sections: [], coverage_gaps: [] }));

    // Start the extraction process (matching will be triggered automatically via useEffect)
    triggerExtractRequirements(job_description, company_context || "");
  }, [hasValidInputs, triggerExtractRequirements, job_description, company_context, dispatch]);

  // TODO: change inputs to rely more on job description for the string-similarity
  const inputs = useMemo(() => ({ job_description, company_context, profileSections }),
    [job_description, company_context, profileSections]
  );
  const { showBanner, setShowBanner, acknowledgeMinorChange, onManualRun, isRunning, error: autoError } = useAutoRetrigger({
    stepKey: "job-requirements",
    inputs,
    onAutoRun: performMatch,
  });

  const handleRegenerate = () => {
    resetExtract(); // Reset extraction hook state
    resetMatch(); // Reset matching hook state
    onManualRun(); // Trigger auto-retrigger's manual run
  };

  const finalIsLoading = isMatching || isExtracting || isRunning || isOptimizing;
  const finalError = matchError || extractError || autoError;

  // Track phases for progress indicator
  useEffect(() => {
    if (isExtracting) {
      setCurrentPhase('extracting');
    } else if (extractedData?.requirement_clusters && isMatching) {
      setCurrentPhase('matching');
    } else if (!isMatching && isOptimizing) {
      setCurrentPhase('optimizing');
    } else if (!isMatching && !isOptimizing) {
      setCurrentPhase('complete');
    }
  }, [isExtracting, isMatching, isOptimizing, extractedData]);


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
    profileSections,
    job_description,
    isLoading: finalIsLoading,
    error: finalError,
    showRematchBanner: showBanner,
    modalOpen,
    modalMatchId,
    currentPhase,
    matchScoredPairs,
    requirementClusters,
    isExtracting,
    isMatching,
    isOptimizing,
    onRematch: handleRegenerate,
    setShowRematchBanner: setShowBanner,
    handleSeeSuggestions,
    setModalOpen,
    handleSaveAndMatch,
    handleSaveOnly,
  };
};