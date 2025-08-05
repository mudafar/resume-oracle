"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from 'lucide-react';
import { SelectedSection } from "@/services/zodModels";

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
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
          <AlertTriangle className="h-4 w-4" />
          Missing Requirements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 mb-3">
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
            <p className="text-sm text-gray-500 italic">
              No missing requirements identified.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
