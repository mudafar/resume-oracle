"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles } from 'lucide-react';

interface InputPhaseProps {
  experienceInput: string;
  setExperienceInput: (value: string) => void;
  additionalContext: string;
  setAdditionalContext: (value: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
}

export const InputPhase: React.FC<InputPhaseProps> = ({
  experienceInput,
  setExperienceInput,
  additionalContext,
  setAdditionalContext,
  isLoading,
  onGenerate,
}) => {
  const canGenerate = experienceInput.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="experience" className="text-base font-medium">
          Additional Experience or Skills *
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Describe relevant experience, projects, or skills that address the missing requirements above.
        </p>
        <Textarea
          id="experience"
          placeholder="Example: Led a team of 5 developers using React and TypeScript to build a customer portal that increased user engagement by 40%. Implemented automated testing with Jest and managed CI/CD pipelines..."
          value={experienceInput}
          onChange={(e) => setExperienceInput(e.target.value)}
          className="min-h-[120px] resize-y"
        />
      </div>

      {/* Collapsible Additional Context */}
      <details className="space-y-3">
        <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground">
          Additional Context (Optional)
        </summary>
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Provide any additional context about the role, company, or specific focus areas.
          </p>
          <Textarea
            id="context"
            placeholder="Example: This role focuses on scalable web applications for enterprise clients, emphasizing security and performance..."
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            className="min-h-[60px] resize-y"
          />
        </div>
      </details>

      <Button 
        onClick={onGenerate} 
        disabled={!canGenerate || isLoading}
        className="w-full"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {isLoading ? 'Generating Enhancement...' : 'Generate Enhancement'}
      </Button>
    </div>
  );
};
