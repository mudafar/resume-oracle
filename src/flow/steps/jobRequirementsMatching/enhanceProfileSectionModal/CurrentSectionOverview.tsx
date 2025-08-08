"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from 'lucide-react';
import { generateTextPreview } from "@/utils/textPreview";
import { SelectedSection } from "@/schemas/matching";
import { ProfileSection } from "@/types/store";

interface CurrentSectionOverviewProps {
  profileSection: ProfileSection;
  selectedSection: SelectedSection;
}

export const CurrentSectionOverview: React.FC<CurrentSectionOverviewProps> = ({
  profileSection,
  selectedSection,
}) => {
  const { preview: sectionPreview } = generateTextPreview(profileSection.content);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="h-4 w-4" />
          Current Section
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">{profileSection.type}</h4>
          {/* <Badge variant="outline" className="text-xs">
            {Math.round(selectedSection.total_weighted_score)} pts
          </Badge> */}
        </div>
        <div className="bg-gray-50 rounded p-3 text-sm">
          <pre className="whitespace-pre-line text-gray-700 max-h-50 overflow-auto">
            {profileSection.content}
            {/* {sectionPreview} */}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};
