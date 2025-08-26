import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  setResume,
  setOptimizationSummary
} from "@/store/slices/resumeSlice";
import { useLlmStreamingService } from "@/hooks/useLlmStreamingService";
import { resumeGeneratorService } from "@/services/resumeGeneratorService";
import jsPDF from "jspdf";
import { createStep } from "@/utils/createStep";
import { ChangeAlertBanner, EmptyState } from "@/components/shared";
import { OptimizationSummaryCard } from '../../../components/shared/OptimizationSummaryCard';
import { ResumeEditor, ResumeActions, ResumeStates } from './components';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAutoRetrigger } from "@/hooks/useAutoRetrigger";
import type { ResumeOutput } from "@/schemas/resume";

const GenerateEditResume: React.FC = () => {
  const dispatch = useDispatch();
  const resumeSections = useSelector((state: RootState) => state.resumeSections.resumeSections || []);
  const resume = useSelector((state: RootState) => state.resume.resume);
  const optimizationSummary = useSelector((state: RootState) => state.resume.optimizationSummary);
  const [editMode, setEditMode] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [editedResume, setEditedResume] = useState("");
  const markdownContentRef = useRef<HTMLDivElement>(null);


    if (!resumeSections?.length) {
      return (
        <EmptyState
          title="Setup required"
          message="Please complete all required steps to generate a resume."
          iconType="alert"
          variant="card"
        />
      );
    }

  const [
    triggerGenerateResume,
    { isLoading, error, data: streamingData, reset }
  ] = useLlmStreamingService(resumeGeneratorService.buildResume);

  // Effect to dispatch updates to Redux store as data streams in
  useEffect(() => {
    if (streamingData) {
      const markdown = convertToMarkdown(streamingData);
      
      // Only dispatch if the content has actually changed
      if (markdown && markdown !== resume) {
        dispatch(setResume(markdown));
        setEditedResume(markdown);
      }
      if (streamingData.optimization_summary && streamingData.optimization_summary !== optimizationSummary) {
        dispatch(setOptimizationSummary(streamingData.optimization_summary));
      }
    }
  }, [streamingData, dispatch, resume, optimizationSummary]);

  // Auto-retrigger integration
  const onAutoRun = useCallback(async () => {
    // Reset redux state before triggering
    dispatch(setResume(""));
    dispatch(setOptimizationSummary(""));
    setEditedResume("");
    triggerGenerateResume(resumeSections);
  }, [triggerGenerateResume, resumeSections, dispatch]);

  const convertToMarkdown = (data: ResumeOutput) => {
    const resume = data.resume;
    let md = "";
    if (resume?.summary) md += `${resume.summary}\n\n---\n\n`;
    if (resume?.experience) md += `${resume.experience}\n\n---\n\n`;
    if (resume?.skills) md += `${resume.skills}\n\n---\n\n`;
    if (resume?.education) md += `${resume.education}\n\n---\n\n`;
    if (resume?.certifications) md += `${resume.certifications}\n\n---\n\n`;
    if (resume?.projects) md += `${resume.projects}\n\n---\n\n`;
    if (resume?.achievements) md += `${resume.achievements}\n\n---\n\n`;
    if (resume?.volunteering) md += `${resume.volunteering}\n\n---\n\n`;
    if (resume?.languages) md += `${resume.languages}\n\n---\n\n`;
    return md.trim();
  };

  useEffect(() => {
    if (resume && !editedResume) {
      setEditedResume(resume);
    }
  }, [resume]);
  const { showBanner, setShowBanner, onManualRun: onRegenerate, isRunning, error: autoError } = useAutoRetrigger({
    stepKey: "generate-edit-resume",
    inputs: { resumeSections },
    onAutoRun,
  });

  const handleRegenerate = () => {
    reset(); // Reset hook state
    onRegenerate(); // Trigger auto-retrigger's manual run
  };

  const finalIsLoading = isLoading || isRunning;
  const finalError = error || autoError;



  const saveDraft = () => {
    dispatch(setResume(editedResume));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const exportMarkdown = () => {
    const content = editMode ? editedResume : resume;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = async () => {
    if (!markdownContentRef.current) return;
    setIsExportingPdf(true);
    try {
      const element = markdownContentRef.current;
      if (!element) return;

      const doc = new jsPDF({
        unit: "pt",
        format: "letter",
        orientation: "portrait",
        compress: true
      });

      doc.setProperties({
        title: "Resume",
        subject: "Professional Resume",
        author: "Resume Generator"
      });

      const margin = { top: 50, left: 50, right: 50, bottom: 50 };

      await doc.html(element, {
        x: margin.left,
        y: margin.top,
        html2canvas: {
          scale: 1,
          useCORS: true,
          letterRendering: true,
          allowTaint: false
        },
        autoPaging: true,
        width: doc.internal.pageSize.getWidth() - margin.left - margin.right,
        callback: (pdf) => pdf.save("resume.pdf"),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const renderMarkdown = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0 border-b border-gray-200 pb-2">
              {line.substring(3)}
            </h2>
          );
        } else if (line === '---') {
          return <div key={index} className="my-6" />;
        } else if (line.trim()) {
          return (
            <p key={index} className="text-gray-700 leading-relaxed mb-3">
              {line}
            </p>
          );
        }
        return <br key={index} />;
      });
  };

  return (
    <div className="w-full h-full bg-gray-50">
      <div className="w-full">
        {/* Regenerate Banner */}
        {showBanner && (
          <ChangeAlertBanner
            message="Your inputs changed slightly since the last resume build."
            subtitle="Major changes regenerate automatically; minor changes let you choose."
            ctaText="Regenerate now"
            onCta={handleRegenerate}
            onDismiss={() => setShowBanner(false)}
          />
        )}

        <div className="flex gap-8 py-6">
          <div className="flex-1">
            <ResumeStates
              isLoading={finalIsLoading && !resume}
              error={finalError}
              hasResume={!!resume}
            />

            {resume && !finalError && (
              <Card className="shadow-sm min-h-[800px]">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">Your Resume</CardTitle>
                    <ResumeActions
                      editMode={editMode}
                      draftSaved={draftSaved}
                      isLoading={finalIsLoading}
                      isExportingPdf={isExportingPdf}
                      onToggleEdit={() => setEditMode(!editMode)}
                      onSaveDraft={saveDraft}
                      onExportMarkdown={exportMarkdown}
                      onRegenerate={handleRegenerate}
                    />
                  </div>
                </CardHeader>
                <CardContent className="px-8 pt-0 pb-8">
                  <ResumeEditor
                    editMode={editMode}
                    editedResume={editedResume}
                    resume={resume}
                    onResumeChange={setEditedResume}
                    markdownContentRef={markdownContentRef}
                    renderMarkdown={renderMarkdown}
                  />
                </CardContent>
              </Card>
            )}

            {optimizationSummary && (
              <div className="mt-6">
                <OptimizationSummaryCard optimizationSummary={optimizationSummary} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const GenerateEditResumeStep = createStep({
  id: "generate-edit-resume",
  label: "Build Resume",
  description: "Generate, edit, and export your professional resume"
})(GenerateEditResume);