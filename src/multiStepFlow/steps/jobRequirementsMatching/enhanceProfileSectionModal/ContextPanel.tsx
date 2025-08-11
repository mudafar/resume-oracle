"use client";
import React from "react";
import { CurrentSectionOverview } from "./CurrentSectionOverview";
import { MissingRequirements } from "./MissingRequirements";
import { EnhancementTips } from "./EnhancementTips";
import { ProfileSection } from "@/types/store";
import { SelectedSection } from "@/schemas/matching";

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
