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
  onClose: () => void;
}

export const InputPhase: React.FC<InputPhaseProps> = ({
  experienceInput,
  setExperienceInput,
  additionalContext,
  setAdditionalContext,
  isLoading,
  onGenerate,
  onClose,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="experience" className="text-base font-medium">
            Additional Experience or Skills *
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Describe relevant experience, projects, or skills that address the missing requirements above.
          </p>
          <Textarea
            id="experience"
            placeholder="Example: Led a team of 5 developers using React and TypeScript to build a customer portal that increased user engagement by 40%. Implemented automated testing with Jest and managed CI/CD pipelines..."
            value={experienceInput}
            onChange={(e) => setExperienceInput(e.target.value)}
            className="min-h-[120px] resize-vertical"
          />
        </div>

        <div>
          <Label htmlFor="context" className="text-base font-medium">
            Additional Context <span className="text-gray-500">(Optional)</span>
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Provide any additional context about the role, company, or specific focus areas.
          </p>
          <Textarea
            id="context"
            placeholder="Example: This role focuses on scalable web applications for enterprise clients, emphasizing security and performance..."
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            className="min-h-[80px] resize-vertical"
          />
        </div>
      </div>

      {/* <div className="flex gap-3 pt-4 border-t">
        <Button 
          onClick={onGenerate}
          disabled={!experienceInput.trim() || isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enhancing...
            </div>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Enhance Section
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div> */}
    </div>
  );
};
