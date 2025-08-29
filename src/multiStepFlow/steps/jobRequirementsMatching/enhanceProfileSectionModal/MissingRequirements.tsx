"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from 'lucide-react';
import type { SelectedSection } from "@/schemas/matching";

interface MissingRequirementsProps {
  selectedSection: SelectedSection;
}

export const MissingRequirements: React.FC<MissingRequirementsProps> = ({
  selectedSection,
}) => {
  // Collect all missing requirements across all matched pairs
  const allMissingRequirements = selectedSection.matched_scored_pairs
    .flatMap(pair => pair.missing)
    .filter((requirement, index, arr) => arr.indexOf(requirement) === index); // Remove duplicates

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <h3 className="font-semibold text-sm text-orange-700">Missing Requirements</h3>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          These requirements are not fully covered by your current section:
        </p>
        <div className="flex flex-wrap gap-2">
          {allMissingRequirements.map((requirement, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
              <span className="text-wrap">{requirement}</span>
            </Badge>
          ))}
        </div>
        {allMissingRequirements.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            No missing requirements identified.
          </p>
        )}
      </div>
    </div>
  );
};
