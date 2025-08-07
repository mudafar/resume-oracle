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
  integrationSummary?: string;
  keyAdditions?: string[];
}

export const ReviewPhase: React.FC<ReviewPhaseProps> = ({
  enhancedContent,
  setEnhancedContent,
  onSave,
  onBack,
  integrationSummary = "",
  keyAdditions = [],
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

      {/* Integration Summary and Key Additions */}
      {(integrationSummary || (keyAdditions && keyAdditions.length > 0)) && (
        <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Integration Summary</h3>
          {integrationSummary && (
            <p className="mb-2 text-gray-700">{integrationSummary}</p>
          )}
          {keyAdditions && keyAdditions.length > 0 && (
            <div>
              <h4 className="font-medium mb-1">Key Additions:</h4>
              <ul className="list-disc list-inside text-gray-700">
                {keyAdditions.map((addition, idx) => (
                  <li key={idx}>{addition}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

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
