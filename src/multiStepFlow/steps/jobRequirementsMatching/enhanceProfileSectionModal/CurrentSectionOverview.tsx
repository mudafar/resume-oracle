"use client";
import React from "react";
import { Target } from 'lucide-react';
import { generateTextPreview } from "@/utils/textPreview";
import { SelectedSection } from "@/schemas/matching";
import type { ProfileSection } from "@/schemas/profile";

interface CurrentSectionOverviewProps {
  profileSection: ProfileSection;
  selectedSection: SelectedSection;
}

export const CurrentSectionOverview: React.FC<CurrentSectionOverviewProps> = ({
  profileSection,
  selectedSection,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm">Current Section</h3>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">{profileSection.type}</h4>
        <div className="bg-muted rounded p-3 text-sm">
          <pre className="whitespace-pre-line text-muted-foreground max-h-40 overflow-auto">
            {profileSection.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
