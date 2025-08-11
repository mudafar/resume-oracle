import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Loader2,
  Brain,
  FileText,
  Linkedin,
  CheckCircle,
} from "lucide-react";
import { nanoid } from "nanoid";
import { ProfileSectionsPreview } from "./ProfileSectionsPreview";
import { useLlmService } from '@/hooks/useLlmService';
import { profileParserService } from "@/services/profileSectionsParserService";
import { WizardModal } from "../../../components/shared/modal";

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

  const currentStepNumber = step === "input" ? 1 : 2;
  const totalSteps = 2;

  const stepTitles = {
    input: "Import with AI",
    preview: "Preview & Import"
  };

  const stepDescriptions = {
    input: "Let AI extract and organize your profile sections",
    preview: `Review ${sections.length} extracted sections before importing`
  };

  const renderStepContent = () => {
    if (step === "input") {
      return (
        <div className="space-y-6 p-6">
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

          {/* Content Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Content</label>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholders[contentType]}
                className="w-full min-h-[300px] resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 pr-16"
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
            <p className="text-xs text-muted-foreground">
              Please add at least 50 characters to analyze your content.
            </p>
          </div>
        </div>
      );
    }

    if (step === "preview") {
      return (
        <div className="p-6">
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
      );
    }

    return null;
  };

  return (
    <WizardModal
      open={open}
      onClose={resetAndClose}
      title={stepTitles[step]}
      description={stepDescriptions[step]}
      icon={<Brain className="w-5 h-5 text-blue-600" />}
      currentStep={currentStepNumber}
      totalSteps={totalSteps}
      onNext={step === "input" ? handleAnalyze : undefined}
      onBack={step === "preview" ? handleBackToInput : undefined}
      onFinish={step === "preview" ? handleImportAll : undefined}
      nextLabel={isLoading ? "Analyzing..." : "Analyze & Preview"}
      finishLabel="Import All Sections"
      isLoading={isLoading}
      canNext={isReady && !isLoading}
      canFinish={sections.length > 0}
    >
      {renderStepContent()}
    </WizardModal>
  );
};
