"use client";
import React from "react";
import { InputPhase } from "./InputPhase";
import { ReviewPhase } from "./ReviewPhase";

interface EnhancementInterfaceProps {
  phase: 'input' | 'review';
  experienceInput: string;
  setExperienceInput: (value: string) => void;
  additionalContext: string;
  setAdditionalContext: (value: string) => void;
  enhancedContent: string;
  setEnhancedContent: (value: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
  onSave: () => void;
  onBack: () => void;
  onClose: () => void;
  integrationSummary?: string;
  keyAdditions?: string[];
}

export const EnhancementInterface: React.FC<EnhancementInterfaceProps> = ({
  phase,
  experienceInput,
  setExperienceInput,
  additionalContext,
  setAdditionalContext,
  enhancedContent,
  setEnhancedContent,
  isLoading,
  onGenerate,
  onSave,
  onBack,
  onClose,
  integrationSummary,
  keyAdditions,
}) => {
  if (phase === 'input') {
    return (
      <InputPhase
        experienceInput={experienceInput}
        setExperienceInput={setExperienceInput}
        additionalContext={additionalContext}
        setAdditionalContext={setAdditionalContext}
        isLoading={isLoading}
        onGenerate={onGenerate}
        onClose={onClose}
      />
    );
  }

  return (
    <ReviewPhase
      enhancedContent={enhancedContent}
      setEnhancedContent={setEnhancedContent}
      onSave={onSave}
      onBack={onBack}
      integrationSummary={integrationSummary}
      keyAdditions={keyAdditions}
    />
  );
};
