import React from "react";
import { FillGapModal } from "../fillGapModal/FillGapModal";
import { CoverageGap, SelectedSection } from "@/schemas/matching";
import { ProfileSection } from "@/types/store";
import { EnhanceProfileSectionModal } from "../enhanceProfileSectionModal";

interface MatchingModalsProps {
  // Fill Gap Modal
  selectedGap: CoverageGap | null;
  fillGapModalOpen: boolean;
  onCloseFillGap: () => void;
  onSaveAndMarkCovered: (content: string, isNewSection: boolean, sectionId?: string, sectionType?: string) => void;

  // Enhance Modal
  selectedSectionForEnhancement: SelectedSection | null;
  enhanceModalOpen: boolean;
  onCloseEnhance: () => void;
  onSaveEnhancement: (sectionId: string, enhancedContent: string) => void;

  // Common
  profileSections: ProfileSection[];
}

export const MatchingModals: React.FC<MatchingModalsProps> = ({
  selectedGap,
  fillGapModalOpen,
  onCloseFillGap,
  onSaveAndMarkCovered,
  selectedSectionForEnhancement,
  enhanceModalOpen,
  onCloseEnhance,
  onSaveEnhancement,
  profileSections
}) => {
  console.log('MatchingModals render:', { 
    enhanceModalOpen, 
    selectedSectionForEnhancement: selectedSectionForEnhancement?.profile_section_id,
    profileSectionsCount: profileSections.length,
    profileSectionIds: profileSections.map(ps => ps.id)
  });

  return (
    <>
      {selectedGap && (
        <FillGapModal
          open={fillGapModalOpen}
          onClose={onCloseFillGap}
          gap={selectedGap}
          profileSections={profileSections}
          onSaveAndMarkCovered={onSaveAndMarkCovered}
        />
      )}

      {selectedSectionForEnhancement && (
        <EnhanceProfileSectionModal
          open={enhanceModalOpen}
          onClose={onCloseEnhance}
          selectedSection={selectedSectionForEnhancement}
          profileSections={profileSections}
          onSaveEnhancement={onSaveEnhancement}
        />
      )}
    </>
  );
};
