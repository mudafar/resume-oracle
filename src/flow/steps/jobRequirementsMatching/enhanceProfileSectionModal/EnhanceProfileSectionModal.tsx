"use client";
import React, { useState } from "react";
import { Sparkles } from 'lucide-react';
import { SelectedSection } from "@/services/zodModels";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { useLlmService } from "@/hooks/useLlmService";
import { profileSectionEnhancerService, EnhancedProfileSection } from "@/services/profileSectionEnhancerService";
import { ContextPanel } from "./ContextPanel";
import { EnhancementInterface } from "./EnhancementInterface";
import { WizardModal } from "../../shared/modal";

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
  const [integrationSummary, setIntegrationSummary] = useState<string>("");
  const [keyAdditions, setKeyAdditions] = useState<string[]>([]);

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
      setIntegrationSummary(result.integration_summary || "");
      setKeyAdditions(result.key_additions || []);
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
    setIntegrationSummary("");
    setKeyAdditions([]);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!profileSection) {
    return null;
  }

  return (
    <WizardModal
      open={open}
      onClose={handleClose}
      title="Enhance Profile Section"
      description={`Enhance: ${profileSection.type}`}
      icon={<Sparkles className="w-5 h-5 text-blue-600" />}
      currentStep={phase === 'input' ? 1 : 2}
      totalSteps={2}
      onNext={phase === 'input' ? handleGenerate : undefined}
      onBack={phase === 'review' ? handleBack : undefined}
      onFinish={phase === 'review' ? handleSave : undefined}
      nextLabel={isLoading ? "Enhancing..." : "Generate Enhancement"}
      finishLabel="Save Enhancement"
      isLoading={isLoading}
      canNext={experienceInput.trim().length > 0}
      canFinish={enhancedContent.trim().length > 0}
    >
      <div className="flex gap-6 h-[calc(80vh-2rem)] overflow-hidden">
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
            integrationSummary={integrationSummary}
            keyAdditions={keyAdditions}
          />
        </div>
      </div>
    </WizardModal>
  );
};
