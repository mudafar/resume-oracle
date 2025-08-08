"use client";
import React, { useState, useEffect } from "react";
// Utility to get profile sections referenced by matches
import { createStep } from "@/utils/createStep";
// import { SuggestedSectionModal } from "./suggestedSectionModal";
import { MatchCard, useJobMatching } from ".";
import { ChangeAlertBanner } from "@/flow/steps/shared";
import { LoadingState, EmptyState, ErrorState, CoverageGaps, SelectedSections, MatchingModals } from "./components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import type { ProfileSection } from "@/schemas/profile";
import { addProfileSectionReturnId } from "../shared/createProfileSection";
import { editSection } from "@/store/slices/profileSectionsSlice";
import { markGapAsFilled } from "@/store/slices/matchesSlice";
import { CoverageGap, HybridSelectionResult, SelectedSection } from "@/schemas/matching";


function getOrderedMatchedProfileSections(
  selectedSections: HybridSelectionResult["selected_sections"],
  profileSections: ProfileSection[]
): ProfileSection[] {
  const matchCounts = new Map<string, number>();
  selectedSections.forEach((section) => {
    matchCounts.set(section.profile_section_id, (matchCounts.get(section.profile_section_id) || 0) + 1);
  });

  return profileSections
    .filter((ps) => matchCounts.has(ps.id))
    .sort((a, b) => (matchCounts.get(b.id) || 0) - (matchCounts.get(a.id) || 0));
}

export const JobRequirementsMatching: React.FC = () => {
  const dispatch = useDispatch();
  const [fillGapModalOpen, setFillGapModalOpen] = useState(false);
  const [selectedGap, setSelectedGap] = useState<CoverageGap | null>(null);
  const [selectedGapId, setSelectedGapId] = useState<string>("");
  const [enhanceModalOpen, setEnhanceModalOpen] = useState(false);
  const [selectedSectionForEnhancement, setSelectedSectionForEnhancement] = useState<SelectedSection | null>(null);

  const { 
    profileSections,
    job_description,
    isLoading,
    error,
    showRematchBanner,
    // modalOpen,
    modalMatchId,
    onRematch,
    setShowRematchBanner,
    handleSeeSuggestions,
    // setModalOpen,
    // handleSaveAndMatch,
    // handleSaveOnly,
  } = useJobMatching();

  // Use the flattened Redux state structure
  const matchingResult = useSelector((state: RootState) => ({
    selected_sections: state.matches.selected_sections,
    coverage_gaps: state.matches.coverage_gaps
  }));

  // Update `currentMatch` logic to work with simplified `HybridSelectionResult`
  const currentMatch = modalMatchId
    ? matchingResult?.selected_sections.find(section => section.profile_section_id === modalMatchId)
    : null;

  const handleFillGap = (gap: CoverageGap) => {
    setSelectedGap(gap);
    setSelectedGapId(gap.id);
    setFillGapModalOpen(true);
  };

  const handleEnhanceSection = (selectedSection: SelectedSection) => {
    console.log('handleEnhanceSection called with:', selectedSection);
    setSelectedSectionForEnhancement(selectedSection);
    setEnhanceModalOpen(true);
    console.log('Enhanced modal should be open now, state:', { enhanceModalOpen: true, selectedSection: selectedSection.profile_section_id });
  };

  const handleSaveEnhancement = (sectionId: string, enhancedContent: string) => {
    console.log('handleSaveEnhancement called');
    // Update the profile section with enhanced content
    const profileSection = profileSections.find(ps => ps.id === sectionId);
    if (profileSection) {
      dispatch(editSection({
        id: sectionId,
        type: profileSection.type,
        content: enhancedContent
      }));
    }
    
    setEnhanceModalOpen(false);
    setSelectedSectionForEnhancement(null);
    console.log('Enhanced modal closed');
  };

  const handleSaveAndMarkCovered = (
    content: string,
    isNewSection: boolean,
    sectionId?: string,
    sectionType?: string
  ) => {
    let finalSectionId = sectionId;
    let finalSectionTitle = "";
    let finalSectionType = sectionType || "";

    if (isNewSection && sectionType) {
      // Create new profile section
      const newSectionId = addProfileSectionReturnId(dispatch, sectionType, content);
      finalSectionId = newSectionId;
      finalSectionTitle = sectionType; // Use type as title for new sections
      finalSectionType = sectionType;
    } else if (sectionId) {
      // Update existing profile section
      const existingSection = profileSections.find(ps => ps.id === sectionId);
      if (existingSection) {
        dispatch(editSection({
          id: sectionId,
          type: existingSection.type,
          content: content
        }));
        finalSectionTitle = existingSection.type;
        finalSectionType = existingSection.type;
      }
    }
    
    // Mark the gap as filled in the Redux store (removes gap and adds to selected sections)
    if (finalSectionId) {
      dispatch(markGapAsFilled({
        gapId: selectedGapId,
        profileSectionId: finalSectionId,
      }));
    }
    
    setFillGapModalOpen(false);
    setSelectedGap(null);
    setSelectedGapId("");
  };

  if (!job_description.trim() || profileSections.length === 0) {
    return <div className="text-gray-500">Please complete previous steps to see job requirements matching.</div>;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={onRematch} />;
  }

  if (!matchingResult) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {showRematchBanner && (
        <ChangeAlertBanner
          message="Your inputs changed slightly. Rerun matching to refresh results."
          subtitle="Major changes rerun automatically; minor changes let you choose."
          ctaText="Rematch now"
          onCta={onRematch}
          onDismiss={() => setShowRematchBanner(false)}
        />
      )}

      <CoverageGaps
        coverageGaps={matchingResult?.coverage_gaps || []}
        onSeeSuggestions={handleSeeSuggestions}
        onFillGap={handleFillGap}
      />

      <SelectedSections
        selectedSections={matchingResult?.selected_sections || []}
        profileSections={profileSections}
        onEnhanceSection={handleEnhanceSection}
      />

      <MatchingModals
        selectedGap={selectedGap}
        fillGapModalOpen={fillGapModalOpen}
        onCloseFillGap={() => setFillGapModalOpen(false)}
        onSaveAndMarkCovered={handleSaveAndMarkCovered}
        selectedSectionForEnhancement={selectedSectionForEnhancement}
        enhanceModalOpen={enhanceModalOpen}
        onCloseEnhance={() => {
          console.log('onCloseEnhance called');
          setEnhanceModalOpen(false);
          setSelectedSectionForEnhancement(null);
        }}
        onSaveEnhancement={handleSaveEnhancement}
        profileSections={profileSections}
      />
    </div>
  );
};

export const JobRequirementsMatchingStep = createStep({
  id: 'job-requirements',
  label: 'Job Requirements Matching',
  description: 'Match your skills with job requirements'
})(JobRequirementsMatching);