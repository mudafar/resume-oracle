import React from "react";
import { CoverageGap, SelectedSection } from "@/services/zodModels";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { FillGapModal } from "../fillGapModal/FillGapModal";
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
