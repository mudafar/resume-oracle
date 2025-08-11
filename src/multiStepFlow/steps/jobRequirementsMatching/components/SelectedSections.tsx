import React from "react";
import  { ProfileSection } from "@/types/store";
import { SelectedSectionCard } from "../SelectedSectionCard";
import { SelectedSection } from "@/schemas/matching";

interface SelectedSectionsProps {
  selectedSections: SelectedSection[];
  profileSections: ProfileSection[];
  onEnhanceSection: (selectedSection: SelectedSection) => void;
}

export const SelectedSections: React.FC<SelectedSectionsProps> = ({
  selectedSections,
  profileSections,
  onEnhanceSection
}) => {
  if (!selectedSections || selectedSections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Selected Profile Sections</h2>
      <p className="text-gray-600 text-sm">
        These sections from your profile best match the job requirements.
      </p>
      {selectedSections.map((selectedSection, index) => (
        <SelectedSectionCard
          key={selectedSection.profile_section_id}
          selectedSection={selectedSection}
          profileSections={profileSections}
          onEnhanceSection={onEnhanceSection}
        />
      ))}
    </div>
  );
};
