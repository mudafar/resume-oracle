import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { getMatchedProfileSectionWithRequirements } from "../../../utils/getMatchedProfileSectionWithRequirements";
import {
  setCoverLetter,
  setOptimizationSummary,
} from "@/store/slices/coverLetterSlice";
import { coverLetterGeneratorService } from "@/services/coverLetterGeneratorService";
import { createStep } from "@/utils/createStep";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared";
import { FileText, Mail } from "lucide-react";
import { OptimizationSummaryCard } from '../../../components/shared/OptimizationSummaryCard';
import { ChangeAlertBanner } from "@/components/shared";
import { LoadingState } from '@/components/shared';
import { ErrorState } from '@/components/shared';
import { CoverLetterEditor } from './components';
import { useAutoRetrigger } from "@/hooks/useAutoRetrigger";
import { useLlmStreamingService } from "@/hooks/useLlmStreamingService";

const GenerateCoverLetter: React.FC = () => {
  const dispatch = useDispatch();
  const profileSections = useSelector((state: RootState) => state.profileSections.sections);
  const companyContext = useSelector((state: RootState) => state.jobContext.company_context);
  const jobDescription = useSelector((state: RootState) => state.jobContext.job_description);
  const coverLetter = useSelector((state: RootState) => state.coverLetter.coverLetter);
  const optimizationSummary = useSelector((state: RootState) => state.coverLetter.optimizationSummary);
  const selectedSections = useSelector((state: RootState) => state.matches.selected_sections || []);

  const [editMode, setEditMode] = useState(false);

  const toneGuidance = useMemo(() => {
    if (!jobDescription) return "";
    const sentences = jobDescription.match(/[^.!?]+[.!?]+/g) || [];
    const guidanceText = sentences.slice(0, 3).join(" ").trim();
    return guidanceText || jobDescription.slice(0, 300);
  }, [jobDescription]);

  const apiPayload = useMemo(() => {
    return {
      profileSectionsWithRequirements: getMatchedProfileSectionWithRequirements(selectedSections, profileSections || []),
      companyContext: companyContext || "",
      toneGuidance: toneGuidance
    };
  }, [selectedSections, profileSections, companyContext, toneGuidance]);

  const [
    generateCoverLetter,
    { isLoading, error, data: streamingData, reset }
  ] = useLlmStreamingService(coverLetterGeneratorService.generateCoverLetter);

  // Effect to dispatch updates to Redux store as data streams in
  useEffect(() => {
    if (streamingData) {
      // Only dispatch if the content has actually changed
      if (streamingData.cover_letter_markdown && streamingData.cover_letter_markdown !== coverLetter) {
        dispatch(setCoverLetter(streamingData.cover_letter_markdown));
      }
      if (streamingData.optimization_summary && streamingData.optimization_summary !== optimizationSummary) {
        dispatch(setOptimizationSummary(streamingData.optimization_summary));
      }
    }
  }, [streamingData, dispatch, coverLetter, optimizationSummary]);

  const onAutoRun = useCallback(async () => {
    // Reset redux state before triggering
    dispatch(setCoverLetter(""));
    dispatch(setOptimizationSummary(""));
    generateCoverLetter(
      apiPayload.profileSectionsWithRequirements,
      apiPayload.companyContext,
      apiPayload.toneGuidance
    );
  }, [generateCoverLetter, apiPayload, dispatch]);

  const { showBanner, setShowBanner, onManualRun: onRegenerate, isRunning, error: autoError } = useAutoRetrigger({
    stepKey: "generate-cover-letter",
    inputs: apiPayload,
    onAutoRun,
  });

  if (!profileSections || !jobDescription) {
    return (
      <EmptyState
        title="Setup required"
        message="Please complete all required steps to generate a cover letter."
        iconType="alert"
        variant="card"
      />
    );
  }

  const handleRegenerate = () => {
    reset(); // Reset hook state
    onRegenerate(); // Trigger auto-retrigger's manual run
  };

  const finalIsLoading = isLoading || isRunning;
  const finalError = error || autoError;

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 space-y-6">
      {showBanner && (
        <ChangeAlertBanner
          message="Your inputs changed slightly since the last cover letter."
          subtitle="Major changes regenerate automatically; minor changes let you choose."
          ctaText="Regenerate now"
          onCta={handleRegenerate}
          onDismiss={() => setShowBanner(false)}
        />
      )}

      {finalIsLoading && !finalError && !coverLetter && !optimizationSummary && (
        <LoadingState
          message="Generating your cover letter..."
          variant="card"
          size="lg"
        />
      )}

      {finalError && (
        <ErrorState
          title="Generation Failed"
          error="Failed to generate cover letter. Please try again."
          onRetry={handleRegenerate}
          variant="card"
        />
      )}

      {!finalIsLoading && !finalError && !coverLetter && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-lg text-muted-foreground">No cover letter generated yet</p>
              <p className="text-sm text-muted-foreground">
                Complete the previous steps to generate your personalized cover letter
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!finalError && coverLetter && (
        <div className="space-y-6">
          <CoverLetterEditor
            coverLetter={coverLetter}
            editMode={editMode}
            onToggleEdit={setEditMode}
            onContentChange={(newContent) => dispatch(setCoverLetter(newContent))}
            actionBarProps={{
              onCopy: async () => {
                try {
                  await navigator.clipboard.writeText(coverLetter);
                } catch (err) {
                  console.error('Failed to copy text: ', err);
                }
              },
              onDownload: () => {
                const blob = new Blob([coverLetter], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "cover_letter.md";
                a.click();
                URL.revokeObjectURL(url);
              },
              onRegenerate: handleRegenerate,
              isLoading: finalIsLoading
            }}
          />

          <OptimizationSummaryCard
            optimizationSummary={optimizationSummary || ''}
          />

          {/* Help Section */}
          <Card className="border-dashed">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Tips for your cover letter</h3>
                  <p className="text-sm text-muted-foreground">
                    Your cover letter has been tailored based on the job requirements and your profile.
                    You can edit it directly or regenerate with updated information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export const GenerateCoverLetterStep = createStep({
  id: "generate-cover-letter",
  label: "Cover Letter",
  description: "Generate a personalized cover letter tailored to the job requirements"
})(GenerateCoverLetter);