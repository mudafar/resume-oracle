import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RootState } from "@/store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Sparkles,
  Loader2,
  Brain,
  ArrowLeft,
  FileText,
  Linkedin,
  CheckCircle,
} from "lucide-react";
import { nanoid } from "nanoid";
import { ProfileSectionsPreview } from "./ProfileSectionsPreview";
import { useLlmService } from '@/hooks/useLlmService';
import { profileParserService } from "@/services/profileSectionsParserService";

// Mock types - replace with your actual types
interface ProfileSection {
  id: string;
  type: string;
  content: string;
}

interface AIImportModalProps {
  open: boolean;
  onClose: () => void;
  // onImportSection: (section: ProfileSection) => void;
  onImportAll: (sections: ProfileSection[]) => void;
  onToast: (message: string, type?: "success" | "error") => void;
}

type Step = "input" | "preview";

export const ProfileSectionImportAIModal: React.FC<AIImportModalProps> = ({
  open,
  onClose,
  // onImportSection,
  onImportAll,
  onToast,
}) => {
  const [step, setStep] = useState<Step>("input");
  const [contentType, setContentType] = useState<"resume" | "linkedin">("resume");
  const [text, setText] = useState("");
  const [sections, setSections] = useState<ProfileSection[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const placeholders = {
    resume: "Paste your resume or CV here...\n\nInclude your work experience, education, skills, and any other relevant information.",
    linkedin: "Paste the content copied from your LinkedIn profile...\n\nInclude your summary, experience, education, skills, and accomplishments.",
  };

  const charCount = text.length;
  const isReady = charCount >= 50;

  // Use isLoading from the hook directly, rename isAnalyzing to isLoading in usage
  const [triggerParseProfileSections, { isLoading }] = useLlmService<ProfileSection[]>(profileParserService.parseProfileSections);

  const handleAnalyze = async () => {
    if (!isReady) return;
    try {
      const profileSections = await triggerParseProfileSections( text, contentType);
      if (!Array.isArray(profileSections)) {
        throw new Error("No sections returned from AI");
      }
      const withIds = profileSections.map((section: any) => ({
        ...section,
        id: nanoid(8),
      }));
      setSections(withIds);
      onToast(`Successfully analyzed and found ${profileSections.length} sections!`);
      setStep("preview");
    } catch (error) {
      onToast("Failed to analyze content. Please try again.", "error");
    }
  };

  const handleEditSection = (id: string, content: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, content } : section
      )
    );
  };

  const handleRemoveSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
  };

  const handleImportAll = () => {
    onImportAll(sections);
    // sections.forEach(section => {
    //   onImportSection(section);
    // });
    onToast(`Imported ${sections.length} sections!`);
    resetAndClose();
  };

  const handleBackToInput = () => {
    setStep("input");
  };

  const resetAndClose = () => {
    setText("");
    setSections([]);
    setContentType("resume");
    setStep("input");
    onClose();
  };

  if (!open) return null;

  const stepTitles = {
    input: "Import with AI",
    preview: "Preview & Import"
  };

  const stepDescriptions = {
    input: "Let AI extract and organize your profile sections",
    preview: `Review ${sections.length} extracted sections before importing`
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <Card className="w-full max-w-[75vw] mx-4 max-h-[90vh] h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 gap-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b min-h-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <CardTitle className="text-xl">
                  {stepTitles[step]}
                </CardTitle>
                {step === "preview" && (
                  <Badge variant="secondary" className="text-xs">
                    Step 2 of 2
                  </Badge>
                )}
              </div>
              <CardDescription>
                {stepDescriptions[step]}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {step === "preview" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToInput}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={resetAndClose}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 min-h-0 overflow-hidden grow">
          {step === "input" && (
            <div className="px-6 space-y-6  overflow-y-auto h-full flex flex-col">
              {/* Content Type Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Content Type</label>
                <Tabs value={contentType} onValueChange={(value) => setContentType(value as "resume" | "linkedin")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="resume" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Resume Text
                    </TabsTrigger>
                    <TabsTrigger value="linkedin" className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn Profile
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>


              {/* Unified Textarea */}
              <div className="space-y-3 grow flex flex-col min-h-0">
                <label className="text-sm font-medium">Content</label>
                <div className="relative min-h-0 h-full">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholders[contentType]}
                    className="w-full min-h-full max-h-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 pr-16"
                  />
                  <div className="absolute bottom-3 right-3">
                    <Badge
                      variant={charCount >= 50 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {charCount}
                    </Badge>
                  </div>
                </div>
                {/* {charCount < 50 && ( */}
                <p className="text-xs text-muted-foreground">
                  Please add at least 50 characters to analyze your content.
                </p>
                {/* )} */}
              </div>

              {/* <Separator /> */}


            </div>
          )}

          {step === "preview" && (
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">
                  Analysis Complete
                </span>
                <Badge variant="outline" className="ml-auto">
                  {sections.length} sections found
                </Badge>
              </div>

              <ProfileSectionsPreview
                sections={sections}
                onEdit={handleEditSection}
                onRemove={handleRemoveSection}
                onImportAll={handleImportAll}
              />
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-0 border-t bg-muted/30">
          {step === "preview" && (
            <div className="p-4 flex justify-between items-center w-full">
              <div className="text-sm text-muted-foreground">
                {sections.length} sections ready to import
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button onClick={handleImportAll} disabled={sections.length === 0}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Import All Sections
                </Button>
              </div>
            </div>
          )}

          {step === "input" && (
            <div className="p-4 w-full">
              <div className="flex justify-end items-center gap-4">
                <Button variant="outline" onClick={resetAndClose}>
                  Cancel
                </Button>

                {/* <div className="flex-1 text-center">
          <p className="text-xs text-muted-foreground">
            We'll detect Experience, Education, Projects, and more.
          </p>
        </div> */}

                <Button
                  onClick={handleAnalyze}
                  disabled={!isReady || isLoading}
                  className="text-base font-medium"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analyze & Preview
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
