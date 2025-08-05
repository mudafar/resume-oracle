import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { getMatchedProfileSectionWithRequirements } from "../shared/getMatchedProfileSectionWithRequirements";
import sha1 from "sha1";
import {
  setCoverLetter,
  setOptimizationSummary,
  setLastCoverLetterInputsHash,
  updateCoverLetter
} from "@/store/slices/coverLetterSlice";
import { useLlmService } from "@/hooks/useLlmService";
import { coverLetterGeneratorService } from "@/services/coverLetterGeneratorService";
import { GeneratedCoverLetterResult } from "@/services/zodModels";
import { createStep } from "@/utils/createStep";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Loader2,
  AlertTriangle,
  Mail
} from "lucide-react";
import { OptimizationSummaryCard } from '../shared/OptimizationSummaryCard';
import { RegenerateBanner } from '../shared/RegenerateBanner';
import { CoverLetterEditorCard } from './CoverLetterEditorCard'

const GenerateCoverLetter: React.FC = () => {
  const dispatch = useDispatch();
  const profileSections = useSelector((state: RootState) => state.profileSections.sections);
  const companyContext = useSelector((state: RootState) => state.jobContext.company_context);
  const jobDescription = useSelector((state: RootState) => state.jobContext.job_description);
  const coverLetter = useSelector((state: RootState) => state.coverLetter.coverLetter);
  const optimizationSummary = useSelector((state: RootState) => state.coverLetter.optimizationSummary);
  const lastCoverLetterInputsHash = useSelector((state: RootState) => state.coverLetter.lastCoverLetterInputsHash);
  const [editMode, setEditMode] = useState(false);
  const [showRegenerateBanner, setShowRegenerateBanner] = useState(false);
  const [copied, setCopied] = useState(false);

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
  const selectedSections = useSelector((state: RootState) => state.matches.data?.selected_sections || []);

  // Prepare payload using the shared utility - memoize to prevent unnecessary re-computations
  const apiPayload = useMemo(() => {
    return {
      profileSectionsWithRequirements: getMatchedProfileSectionWithRequirements(selectedSections, profileSections || []),
      companyContext: companyContext || "",
      toneGuidance: toneGuidance
    };
  }, [selectedSections, profileSections, companyContext, toneGuidance]);

  // Compute hash of current inputs
  const inputsHash = useMemo(
    () => sha1(JSON.stringify({ profileSections, selectedSections, companyContext, jobDescription })),
    [profileSections, selectedSections, companyContext, jobDescription]
  );
  const inputsChanged = inputsHash !== lastCoverLetterInputsHash;

  useEffect(() => {
    if (!coverLetter && apiPayload.profileSectionsWithRequirements.length > 0) {
      generateCoverLetter(
        apiPayload.profileSectionsWithRequirements,
        apiPayload.companyContext,
        apiPayload.toneGuidance
      ).then((data) => {
        if (!data) return;
        dispatch(setCoverLetter(data.cover_letter_markdown || ""));
        dispatch(setOptimizationSummary(data.optimization_summary || null));
        dispatch(setLastCoverLetterInputsHash(inputsHash));
      });
    }
  }, []);

  useEffect(() => {
    if (inputsChanged) {
      setShowRegenerateBanner(true);
    }
  }, [inputsChanged]);

  const onRegenerate = async () => {
    setShowRegenerateBanner(false);
    const data = await generateCoverLetter(
      apiPayload.profileSectionsWithRequirements,
      apiPayload.companyContext,
      apiPayload.toneGuidance
    );
    if (data) {
      dispatch(setCoverLetter(data.cover_letter_markdown || ""));
      dispatch(setOptimizationSummary(data.optimization_summary || null));
      dispatch(setLastCoverLetterInputsHash(inputsHash));
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([coverLetter], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover_letter.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 space-y-6">

      {/* Regenerate Banner */}
      <RegenerateBanner
        message="Your inputs have changed since the last cover letter generation."
        show={showRegenerateBanner}
        isLoading={isLoading}
        onRegenerate={onRegenerate}
        onDismiss={() => setShowRegenerateBanner(false)}
      />

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-lg">Generating your cover letter...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to generate cover letter. Please try again.
          </AlertDescription>
        </Alert>
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
      {coverLetter && !isLoading && (
        <div className="space-y-6">

          {/* Main Editor Card */}
          <CoverLetterEditorCard
            editMode={editMode}
            setEditMode={setEditMode}
            copied={copied}
            coverLetter={coverLetter}
            dispatch={dispatch}
            updateCoverLetter={updateCoverLetter}
            copyToClipboard={copyToClipboard}
            downloadMarkdown={downloadMarkdown}
            onRegenerate={onRegenerate}
            isLoading={isLoading}
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