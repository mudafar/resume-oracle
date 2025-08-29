import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Brain,
  FileText,
  Linkedin,
} from "lucide-react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { useLlmService } from '@/hooks/useLlmService';
import { profileParserService } from "@/services/profileSectionsParserService";
import { SharedModal } from "../../../../components/shared/modal";

// Mock types - replace with your actual types
interface ProfileSection {
  id: string;
  type: string;
  content: string;
}

interface AIImportModalProps {
  open: boolean;
  onClose: () => void;
  onImportAll: (sections: ProfileSection[]) => void;
}

export const ProfileSectionImportAIModal: React.FC<AIImportModalProps> = ({
  open,
  onClose,
  onImportAll,
}) => {
  const [contentType, setContentType] = useState<"resume" | "linkedin">("resume");
  const [text, setText] = useState("");
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

  // Use isLoading from the hook directly
  const [triggerParseProfileSections, { isLoading }] = useLlmService<ProfileSection[]>(profileParserService.parseProfileSections);

  const handleAnalyzeAndImport = async () => {
    if (!isReady) return;
    try {
      const profileSections = await triggerParseProfileSections(text, contentType);
      if (!Array.isArray(profileSections)) {
        throw new Error("No sections returned from AI");
      }
      const withIds = profileSections.map((section: any) => ({
        ...section,
        id: nanoid(8),
      }));
      
      onImportAll(withIds);
      toast.success(`Successfully imported ${profileSections.length} sections!`);
      resetAndClose();
    } catch (error) {
      toast.error("Failed to analyze content. Please try again.");
    }
  };

  const resetAndClose = () => {
    setText("");
    setContentType("resume");
    onClose();
  };

  return (
    <SharedModal
      open={open}
      onClose={resetAndClose}
      title="Import with AI"
      description="Let AI extract and organize your profile sections"
      icon={<Brain className="w-5 h-5 text-blue-600" />}
      size="full"
      height="full"
      className="min-w-[75vw]"
      actions={[
        {
          label: isLoading ? "Analyzing..." : "Analyze & Import",
          onClick: handleAnalyzeAndImport,
          disabled: !isReady || isLoading,
          loading: isLoading,
          icon: <Sparkles className="w-4 h-4" />,
          variant: "default"
        }
      ]}
    >
      <div className="space-y-6 p-6 flex-auto overflow-auto flex flex-col">
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
        <div className="space-y-3 flex-auto flex flex-col overflow-hidden">
          <label className="text-sm font-medium">Content</label>
          <div className="relative flex-auto overflow-auto">
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholders[contentType]}
              className="h-full resize-none pr-10 overflow-hidden"
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
    </SharedModal>
  );
};
