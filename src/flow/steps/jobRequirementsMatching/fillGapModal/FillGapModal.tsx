"use client";
import React, { useState } from "react";
import { CoverageGap } from "@/services/zodModels";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { GapContextPanel } from "./GapContextPanel";
import { SolutionBuilderPanel } from "./SolutionBuilderPanel";
import { useLlmService } from "@/hooks/useLlmService";
import { profileSectionEnhancerService, EnhancedProfileSection } from "@/services/profileSectionEnhancerService";
import { profileSectionGeneratorService, NewProfileSection } from "@/services/profileSectionGeneratorService";
import { WizardModal } from "../../shared/modal";
import { Search } from "lucide-react";

interface FillGapModalProps {
  open: boolean;
  onClose: () => void;
  gap: CoverageGap;
  profileSections: ProfileSection[];
  onSaveAndMarkCovered: (content: string, isNewSection: boolean, sectionId?: string, sectionType?: string) => void;
}

export const FillGapModal: React.FC<FillGapModalProps> = ({
  open,
  onClose,
  gap,
  profileSections,
  onSaveAndMarkCovered,
}) => {
  const [phase, setPhase] = useState<'input' | 'review'>('input');
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<'extend' | 'create'>('extend');
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [newSectionType, setNewSectionType] = useState<string>("experience");
  const [experienceInput, setExperienceInput] = useState<string>("");
  const [additionalContext, setAdditionalContext] = useState<string>("");

  // LLM service hooks
  const [triggerEnhance, { isLoading: isEnhancing }] = useLlmService(
    profileSectionEnhancerService.enhanceProfileSection
  );
  const [triggerGenerate, { isLoading: isGenerating }] = useLlmService(
    profileSectionGeneratorService.generateProfileSection
  );

  const isLoading = isEnhancing || isGenerating;

  const handleGenerate = async () => {
    try {
      if (selectedAction === 'extend') {
        const selectedSection = profileSections.find(ps => ps.id === selectedSectionId);
        if (!selectedSection) {
          console.error("No section selected for enhancement");
          return;
        }

        const result: EnhancedProfileSection = await triggerEnhance(
          selectedSection,
          experienceInput,
          additionalContext || undefined
        );
        
        setGeneratedContent(result.enhanced_content);
      } else {
        const result: NewProfileSection = await triggerGenerate(
          newSectionType,
          experienceInput,
          additionalContext || undefined
        );
        
        setGeneratedContent(result.content);
      }
      
      setPhase('review');
    } catch (error) {
      console.error("Failed to generate content:", error);
      // Handle error - could show an error message to user
    }
  };

  const handleSave = () => {
    const isNewSection = selectedAction === 'create';
    onSaveAndMarkCovered(
      generatedContent,
      isNewSection,
      isNewSection ? undefined : selectedSectionId,
      isNewSection ? newSectionType : undefined
    );
    onClose();
  };

  const handleBack = () => {
    setPhase('input');
  };

  const resetModal = () => {
    setPhase('input');
    setGeneratedContent("");
    setSelectedAction('extend');
    setSelectedSectionId("");
    setNewSectionType("experience");
    setExperienceInput("");
    setAdditionalContext("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <WizardModal
      open={open}
      onClose={handleClose}
      title="Fill Coverage Gap"
      description={`Address gap: ${gap.requirement_cluster.cluster_name}`}
      icon={<Search className="w-5 h-5 text-blue-600" />}
      currentStep={phase === 'input' ? 1 : 2}
      totalSteps={2}
      onNext={phase === 'input' ? handleGenerate : undefined}
      onBack={phase === 'review' ? handleBack : undefined}
      onFinish={phase === 'review' ? handleSave : undefined}
      nextLabel={isLoading ? "Generating..." : "Generate Solution"}
      finishLabel="Save & Mark Covered"
      isLoading={isLoading}
      canNext={experienceInput.trim().length > 0}
      canFinish={generatedContent.trim().length > 0}
    >
      <div className="flex gap-6 h-[calc(80vh-2rem)] overflow-hidden">
        {/* Left Panel: Gap Context */}
        <div className="w-1/3 flex-shrink-0">
          <GapContextPanel gap={gap} />
        </div>
        
        {/* Right Panel: Solution Builder */}
        <div className="flex-1 overflow-y-auto">
          <SolutionBuilderPanel
            phase={phase}
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
            selectedSectionId={selectedSectionId}
            setSelectedSectionId={setSelectedSectionId}
            newSectionType={newSectionType}
            setNewSectionType={setNewSectionType}
            experienceInput={experienceInput}
            setExperienceInput={setExperienceInput}
            additionalContext={additionalContext}
            setAdditionalContext={setAdditionalContext}
            generatedContent={generatedContent}
            setGeneratedContent={setGeneratedContent}
            profileSections={profileSections}
            gap={gap}
            isLoading={isLoading}
            onGenerate={handleGenerate}
            onSave={handleSave}
            onBack={handleBack}
          />
        </div>
      </div>
    </WizardModal>
  );
};
