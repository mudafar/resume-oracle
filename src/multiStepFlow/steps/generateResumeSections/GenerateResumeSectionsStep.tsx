import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { getMatchedProfileSectionWithRequirements } from "../../../utils/getMatchedProfileSectionWithRequirements";
import { ChangeAlertBanner } from "@/components/shared";
import { setResumeSections } from "@/store/slices/resumeSectionsSlice";
import { useLlmStreamingService } from "@/hooks/useLlmStreamingService";
import { resumeSectionsGeneratorService } from "@/services/resumeSectionsGeneratorService";
import { useAutoRetrigger } from "@/hooks/useAutoRetrigger";
import { createStep } from "@/utils/createStep";
import { ResumeSectionsList, ResumeSectionsStates } from "./components";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared";

const GenerateResumeSections: React.FC = () => {
  const dispatch = useDispatch();
  const selectedSections = useSelector((state: RootState) => state.matches.selected_sections);
  const profileSections = useSelector((state: RootState) => state.profileSections.sections || []);
  const resumeSections = useSelector((state: RootState) => state.resumeSections.resumeSections || []);
  const [editing, setEditing] = useState<{ [id: string]: boolean }>({});
  const [editedContent, setEditedContent] = useState<{ [id: string]: string }>({});

      if (!profileSections?.length || !selectedSections?.length) {
      return (
        <EmptyState
          title="Setup required"
          message="Please complete all required steps to generate resume sections."
          iconType="alert"
          variant="card"
        />
      );
    }
  // LLM service trigger
  const [
    triggerGenerate,
    { isLoading, error, data: streamingData, reset }
  ] = useLlmStreamingService(resumeSectionsGeneratorService.generateResumeSection);

  // Effect to dispatch updates to Redux store as data streams in
  useEffect(() => {
    if (streamingData?.generated_resume_section_result_list) {
      dispatch(setResumeSections(streamingData.generated_resume_section_result_list));
    }
  }, [streamingData, dispatch]);

  // Prepare payload for API - memoize to prevent unnecessary re-computations
  const apiPayload = useMemo(() => {
    return getMatchedProfileSectionWithRequirements(selectedSections, profileSections);
  }, [selectedSections, profileSections]);

  // Auto-retrigger integration using generic hook
  const inputs = useMemo(() => ({ payload: apiPayload }), [apiPayload]);
  
  const onAutoRun = useCallback(async () => {
    // Reset redux state before triggering
    dispatch(setResumeSections([]));
    triggerGenerate(apiPayload);
  }, [triggerGenerate, apiPayload, dispatch]);

  const { showBanner: showRegenerateBanner, setShowBanner: setShowRegenerateBanner, onManualRun: onRegenerate, isRunning, error: autoError } = useAutoRetrigger({
    stepKey: "generate-resume-sections",
    inputs,
    onAutoRun,
  });

  const handleRegenerate = () => {
    reset(); // Reset hook state
    onRegenerate(); // Trigger auto-retrigger's manual run
  };

  const finalIsLoading = isLoading || isRunning;
  const finalError = error || autoError;

  // Reference requirements for each section - memoize to prevent unnecessary re-computations
  const referenceMap = useMemo(() => {
    const map: { [id: string]: { requirement: string }[] } = {};
    selectedSections.forEach((section) => {
      map[section.profile_section_id] = section.matched_scored_pairs.map(pair => ({
        requirement: pair.coverage.join(', '), // Join coverage requirements
      }));
    });
    return map;
  }, [selectedSections]);


  // Trigger generation when needed (e.g., on mount or when matches/profileSections change)
  useEffect(() => {
    if (selectedSections.length && profileSections.length) {
      if (apiPayload) {
        // triggerGenerate(apiPayload);
      }
    }
    // eslint-disable-next-line
  }, [selectedSections, profileSections, apiPayload]);

  // Handle result (dispatch handled inside onAutoRun with isLatest guard)

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">

      {/* Regeneration Banner */}
      {(showRegenerateBanner) && (
        <ChangeAlertBanner
          message="Your inputs changed slightly. Regenerate sections to refresh results."
          subtitle="Major changes regenerate automatically; minor changes let you choose."
          ctaText="Regenerate now"
          onCta={handleRegenerate}
          onDismiss={() => setShowRegenerateBanner(false)}
        />
      )}

      {/* Main Content */}
      <main className="space-y-6">
        <ResumeSectionsStates
          isLoading={finalIsLoading && resumeSections.length === 0}
          error={finalError}
          hasResumeSections={resumeSections.length > 0}
          onRetry={handleRegenerate}
        />
        
        {resumeSections.length > 0 && !finalError && (
          <ResumeSectionsList
            resumeSections={resumeSections}
            editing={editing}
            setEditing={setEditing}
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            dispatch={dispatch}
            referenceMap={referenceMap}
          />
        )}
      </main>
    </div>
  );
};

export const GenerateResumeSectionsStep = createStep({
  id: "generate-resume-sections",
  label: "Resume Sections",
  description: "AI-generated resume sections tailored to your profile and job matches."
})(GenerateResumeSections);

export default GenerateResumeSections;
