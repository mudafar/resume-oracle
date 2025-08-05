"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles } from 'lucide-react';
import { SelectedSection } from "@/services/zodModels";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { useLlmService } from "@/hooks/useLlmService";
import { profileSectionEnhancerService, EnhancedProfileSection } from "@/services/profileSectionEnhancerService";
import { ContextPanel } from "./ContextPanel";
import { EnhancementInterface } from "./EnhancementInterface";

interface EnhanceProfileSectionModalProps {
  open: boolean;
  onClose: () => void;
  selectedSection: SelectedSection;
  profileSections: ProfileSection[];
  onSaveEnhancement: (sectionId: string, enhancedContent: string) => void;
}

export const EnhanceProfileSectionModal: React.FC<EnhanceProfileSectionModalProps> = ({
  open,
  onClose,
  selectedSection,
  profileSections,
  onSaveEnhancement,
}) => {
  const [phase, setPhase] = useState<'input' | 'review'>('input');
  const [experienceInput, setExperienceInput] = useState<string>("");
  const [additionalContext, setAdditionalContext] = useState<string>("");
  const [enhancedContent, setEnhancedContent] = useState<string>("");

  const [triggerEnhance, { isLoading }] = useLlmService(
    profileSectionEnhancerService.enhanceProfileSection
  );

  const profileSection = profileSections.find(ps => ps.id === selectedSection.profile_section_id);

  const handleGenerate = async () => {
    if (!profileSection || !experienceInput.trim()) {
      return;
    }

    try {
      const result: EnhancedProfileSection = await triggerEnhance(
        profileSection,
        experienceInput,
        additionalContext || undefined
      );
      
      setEnhancedContent(result.enhanced_content);
      setPhase('review');
    } catch (error) {
      console.error("Failed to enhance profile section:", error);
    }
  };

  const handleSave = () => {
    if (profileSection) {
      onSaveEnhancement(profileSection.id, enhancedContent);
    }
    onClose();
  };

  const handleBack = () => {
    setPhase('input');
  };

  const resetModal = () => {
    setPhase('input');
    setExperienceInput("");
    setAdditionalContext("");
    setEnhancedContent("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!profileSection) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-[75vw] min-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Enhance Profile Section
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-6 h-[calc(85vh-6rem)] overflow-hidden">
          {/* Left Panel: Context & Requirements */}
          <div className="w-2/5 flex-shrink-0 space-y-4 overflow-y-auto">
            <ContextPanel
              profileSection={profileSection}
              selectedSection={selectedSection}
            />
          </div>
          
          {/* Right Panel: Enhancement Interface */}
          <div className="flex-1 overflow-y-auto">
            <EnhancementInterface
              phase={phase}
              experienceInput={experienceInput}
              setExperienceInput={setExperienceInput}
              additionalContext={additionalContext}
              setAdditionalContext={setAdditionalContext}
              enhancedContent={enhancedContent}
              setEnhancedContent={setEnhancedContent}
              isLoading={isLoading}
              onGenerate={handleGenerate}
              onSave={handleSave}
              onBack={handleBack}
              onClose={handleClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
