"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from 'lucide-react';

interface ReviewPhaseProps {
  enhancedContent: string;
  setEnhancedContent: (value: string) => void;
  onSave: () => void;
  onBack: () => void;
}

export const ReviewPhase: React.FC<ReviewPhaseProps> = ({
  enhancedContent,
  setEnhancedContent,
  onSave,
  onBack,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Enhanced Section Content</Label>
        <p className="text-sm text-gray-600 mb-3">
          Review the enhanced version and make any adjustments before saving.
        </p>
        <Textarea
          value={enhancedContent}
          onChange={(e) => setEnhancedContent(e.target.value)}
          className="min-h-[300px] resize-vertical font-mono text-sm"
        />
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button onClick={onSave} className="flex-1">
          <Save className="mr-2 h-4 w-4" />
          Save Enhancement
        </Button>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Edit
        </Button>
      </div>
    </div>
  );
};
