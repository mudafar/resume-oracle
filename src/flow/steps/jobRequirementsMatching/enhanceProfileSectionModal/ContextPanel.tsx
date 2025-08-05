"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, AlertTriangle } from 'lucide-react';
import { SelectedSection } from "@/services/zodModels";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { generateTextPreview } from "@/utils/textPreview";
import { CurrentSectionOverview } from "./CurrentSectionOverview";
import { MissingRequirements } from "./MissingRequirements";
import { EnhancementTips } from "./EnhancementTips";

interface ContextPanelProps {
  profileSection: ProfileSection;
  selectedSection: SelectedSection;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({
  profileSection,
  selectedSection,
}) => {
  return (
    <>
      <CurrentSectionOverview
        profileSection={profileSection}
        selectedSection={selectedSection}
      />
      
      <MissingRequirements
        selectedSection={selectedSection}
      />
      
      <EnhancementTips />
    </>
  );
};
