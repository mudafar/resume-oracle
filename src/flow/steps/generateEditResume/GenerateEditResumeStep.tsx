import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { ResumeSection } from "@/store/slices/resumeSectionsSlice";
import {
  setResume,
  setOptimizationSummary,
  setLastResumeInputsHash,
  updateResume
} from "@/store/slices/resumeSlice";
import { useGenerateResumeMutation } from "@/store/services/llmApi";
import jsPDF from "jspdf";
import sha1 from "sha1";
import { createStep } from "@/utils/createStep";
import { RegenerateBanner } from '../shared/RegenerateBanner';
import { OptimizationSummaryCard } from '../shared/OptimizationSummaryCard';
import {
  FileText,
  Loader2,
  AlertTriangle,
  Edit3,
  Download,
  FileDown,
  Save,
  RotateCcw,
  Eye,
  Check
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const GenerateEditResume: React.FC = () => {
  const dispatch = useDispatch();
  const resumeSections = useSelector((state: RootState) => state.resumeSections.resumeSections || []);
  const resume = useSelector((state: RootState) => state.resume.resume);
  const optimizationSummary = useSelector((state: RootState) => state.resume.optimizationSummary);
  const lastResumeInputsHash = useSelector((state: RootState) => state.resume.lastResumeInputsHash);
  const [editMode, setEditMode] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [showRegenerateBanner, setShowRegenerateBanner] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [editedResume, setEditedResume] = useState("");

  const markdownContentRef = useRef<HTMLDivElement>(null);
  const [triggerGenerateResume, { isLoading, error }] = useGenerateResumeMutation();

  const apiPayload = resumeSections.map(s => ({ type: s.type, content: s.content }));

  const inputsHash = useMemo(
    () => sha1(JSON.stringify({ resumeSections })),
    [resumeSections]
  );
  const inputsChanged = inputsHash !== lastResumeInputsHash;

  const convertToMarkdown = (data: any) => {
    const resume = data.data.resume;
    let md = "";
    if (resume.summary) md += `## Summary\n${resume.summary}\n\n---\n\n`;
    if (resume.experience) md += `## Experience\n${resume.experience}\n\n---\n\n`;
    if (resume.skills) md += `## Skills\n${resume.skills}\n\n---\n\n`;
    if (resume.education) md += `## Education\n${resume.education}\n\n---\n\n`;
    if (resume.certifications) md += `## Certifications\n${resume.certifications}\n\n---\n\n`;
    if (resume.projects) md += `## Projects\n${resume.projects}\n\n---\n\n`;
    if (resume.achievements) md += `## Achievements\n${resume.achievements}\n\n---\n\n`;
    if (resume.volunteering) md += `## Volunteering\n${resume.volunteering}\n\n---\n\n`;
    if (resume.language) md += `## Language\n${resume.language}\n\n---\n\n`;
    return md.trim();
  };

  useEffect(() => {
    if (!resume && resumeSections.length > 0) {
      triggerGenerateResume({ sections: apiPayload })
        .unwrap()
        .then((data) => {
          const markdown = convertToMarkdown(data);
          dispatch(setResume(markdown));
          setEditedResume(markdown);
          dispatch(setOptimizationSummary(data.data.optimization_summary || null));
          dispatch(setLastResumeInputsHash(inputsHash));
        });
    }
  }, []);

  useEffect(() => {
    if (resume && !editedResume) {
      setEditedResume(resume);
    }
  }, [resume]);

  useEffect(() => {
    if (inputsChanged) {
      setShowRegenerateBanner(true);
    }
  }, [inputsChanged]);

  const onRegenerate = async () => {
    setShowRegenerateBanner(false);
    await triggerGenerateResume({ sections: apiPayload })
      .unwrap()
      .then((data) => {
        const markdown = convertToMarkdown(data);
        dispatch(setResume(markdown));
        setEditedResume(markdown);
        dispatch(setOptimizationSummary(data.data.optimization_summary || null));
        dispatch(setLastResumeInputsHash(inputsHash));
      });
  };

  const saveDraft = () => {
    dispatch(updateResume(editedResume));
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
        <RegenerateBanner
          show={showRegenerateBanner}
          isLoading={isLoading}
          onRegenerate={onRegenerate}
          onDismiss={() => setShowRegenerateBanner(false)}
          message="Your resume inputs have changed and may be outdated."
        />

        <div className="flex gap-8 py-6">
          <div className="flex-1">
            {!resume && !isLoading && !error && (
              <Card className="shadow-sm">
                <CardContent className="flex items-center justify-center py-20">
                  <div className="text-center space-y-6">
                    <FileText className="h-16 w-16 mx-auto text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">No resume generated yet</h3>
                    <p className="text-sm text-gray-600">
                      Add some resume sections to get started
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {isLoading && (
              <Card className="shadow-sm">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Generating resume...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && (
              <div className="mb-6">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to generate resume. Please try again.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {resume && !isLoading && (
              <Card className="shadow-sm min-h-[800px]">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">Your Resume</CardTitle>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditMode(!editMode)}
                        className="flex items-center space-x-2"
                      >
                        {editMode ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                        <span>{editMode ? 'Preview' : 'Edit'}</span>
                      </Button>

                      {editMode && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={saveDraft}
                          className="flex items-center space-x-2"
                          disabled={draftSaved}
                        >
                          {draftSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                          <span>{draftSaved ? 'Saved' : 'Save'}</span>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportMarkdown}
                        className="flex items-center space-x-2"
                      >
                        <FileDown className="h-4 w-4" />
                        <span>Markdown</span>
                      </Button>

                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={exportPdf}
                        disabled={isExportingPdf}
                        className="flex items-center space-x-2"
                      >
                        {isExportingPdf ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        <span>PDF</span>
                      </Button> */}

                      <Button
                        size="sm"
                        onClick={onRegenerate}
                        disabled={isLoading}
                        className="flex items-center space-x-2"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RotateCcw className="h-4 w-4" />
                        )}
                        <span>Regenerate</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pt-0 pb-8">
                  {editMode ? (
                    <Textarea
                      value={editedResume}
                      onChange={(e) => setEditedResume(e.target.value)}
                      className="w-full h-[800px] font-mono text-sm resize-none border-0 p-4 focus:ring-0 bg-gray-50 rounded-md"
                      placeholder="Edit your resume in Markdown format..."
                    />
                  ) : (
                    <div
                      ref={markdownContentRef}
                      className="prose prose-lg max-w-none"
                      style={{
                        lineHeight: '1.7',
                        color: '#374151',
                      }}
                    >
                      {renderMarkdown(editMode ? editedResume : resume)}
                    </div>
                  )}
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
  label: "Generate & Edit Resume",
  description: "Generate, edit, and export your professional resume"
})(GenerateEditResume);