import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { getMatchedProfileSectionWithRequirements } from "../../../utils/getMatchedProfileSectionWithRequirements";
import {
  setCoverLetter,
  setOptimizationSummary,
  updateCoverLetter
} from "@/store/slices/coverLetterSlice";
import { useLlmService } from "@/hooks/useLlmService";
import { coverLetterGeneratorService } from "@/services/coverLetterGeneratorService";
import type { GeneratedCoverLetterResult } from "@/schemas/coverLetter";
import { createStep } from "@/utils/createStep";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Mail
} from "lucide-react";
import { OptimizationSummaryCard } from '../../../components/shared/OptimizationSummaryCard';
import { ChangeAlertBanner } from "@/components/shared";
import { LoadingState } from '@/components/shared';
import { ErrorState } from '@/components/shared';
import { CoverLetterEditor } from './components';
import { useAutoRetrigger } from "@/hooks/useAutoRetrigger";

const GenerateCoverLetter: React.FC = () => {
  const dispatch = useDispatch();
  const profileSections = useSelector((state: RootState) => state.profileSections.sections);
  const companyContext = useSelector((state: RootState) => state.jobContext.company_context);
  const jobDescription = useSelector((state: RootState) => state.jobContext.job_description);
  const coverLetter = useSelector((state: RootState) => state.coverLetter.coverLetter);
  const optimizationSummary = useSelector((state: RootState) => state.coverLetter.optimizationSummary);
  const [editMode, setEditMode] = useState(false);
  const [showRegenerateBanner, setShowRegenerateBanner] = useState(false);

  if (!profileSections || !companyContext || !jobDescription) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-md text-gray-500">Please complete all required steps to generate a cover letter.</p>
        </CardContent>
      </Card>
    );
  }

  const [generateCoverLetter, { isLoading, error, data, reset }] = useLlmService<GeneratedCoverLetterResult>(
    coverLetterGeneratorService.generateCoverLetter
  );

  // Use first 2-3 sentences of job description for tone_guidance
  const toneGuidance = useMemo(() => {
    if (!jobDescription) return "";
    const sentences = jobDescription.match(/[^.!?]+[.!?]+/g) || [];
    const guidanceText = sentences.slice(0, 3).join(" ").trim();
    return guidanceText || jobDescription.slice(0, 300);
  }, [jobDescription]);

  // Update `matches` selector to use `selected_sections` from `HybridSelectionResult`
  const selectedSections = useSelector((state: RootState) => state.matches.selected_sections || []);

  // Prepare payload using the shared utility - memoize to prevent unnecessary re-computations
  const apiPayload = useMemo(() => {
    return {
      profileSectionsWithRequirements: getMatchedProfileSectionWithRequirements(selectedSections, profileSections || []),
      companyContext: companyContext || "",
      toneGuidance: toneGuidance
    };
  }, [selectedSections, profileSections, companyContext, toneGuidance]);

  // Auto-retrigger integration
  const onAutoRun = useCallback(async (isLatest: () => boolean) => {
    const data = await generateCoverLetter(
      apiPayload.profileSectionsWithRequirements,
      apiPayload.companyContext,
      apiPayload.toneGuidance
    );
    if (!isLatest() || !data) return;
    dispatch(setCoverLetter(data.cover_letter_markdown || ""));
    dispatch(setOptimizationSummary(data.optimization_summary || null));
  }, [generateCoverLetter, apiPayload, dispatch]);

  const { showBanner, setShowBanner, onManualRun: onRegenerate, isRunning, error: autoError } = useAutoRetrigger({
    stepKey: "generate-cover-letter",
    inputs: apiPayload,
    onAutoRun,
  });


  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 space-y-6">

      {/* Regenerate Banner */}
      {showBanner && (
        <ChangeAlertBanner
          message="Your inputs changed slightly since the last cover letter."
          subtitle="Major changes regenerate automatically; minor changes let you choose."
          ctaText="Regenerate now"
          onCta={onRegenerate}
          onDismiss={() => setShowBanner(false)}
        />
      )}

      {/* Loading State */}
  {(isLoading || isRunning) && (
        <LoadingState
          message="Generating your cover letter..."
          variant="card"
          size="lg"
        />
      )}

      {/* Error State */}
  {(error || autoError) && (
        <ErrorState
          title="Generation Failed"
          error="Failed to generate cover letter. Please try again."
          onRetry={onRegenerate}
          variant="card"
        />
      )}

      {/* No Cover Letter State */}
      {!coverLetter && !isLoading && !error && (
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

      {/* Cover Letter Content */}
  {coverLetter && !(isLoading || isRunning) && (
        <div className="space-y-6">

          {/* Main Editor Card */}
          <CoverLetterEditor
            coverLetter={coverLetter}
            editMode={editMode}
            onToggleEdit={setEditMode}
            onContentChange={(newContent) => dispatch(updateCoverLetter(newContent))}
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
              onRegenerate,
              isLoading
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
  label: "Generate Cover Letter",
  description: "Generate a personalized cover letter tailored to the job requirements"
})(GenerateCoverLetter);