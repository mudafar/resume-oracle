"use client";
import React, { useState, useEffect } from "react";
// Utility to get profile sections referenced by matches
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { createStep } from "@/utils/createStep";
// import { SuggestedSectionModal } from "./suggestedSectionModal";
import { RematchBanner, MatchCard, useJobMatching } from ".";
import { CoverageGapCard } from "./CoverageGapCard";
import { SelectedSectionCard } from "./SelectedSectionCard";
import { FillGapModal } from "./fillGapModal/FillGapModal";
import { EnhanceProfileSectionModal } from "./enhanceProfileSectionModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileWarning } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { HybridSelectionResult, CoverageGap, SelectedSection } from "@/services/zodModels";
import { addProfileSectionReturnId } from "../createProfileSection";
import { editSection } from "@/store/slices/profileSectionsSlice";
import { markGapAsFilled } from "@/store/slices/matchesSlice";


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

const LoadingState = () => (
  <div className="space-y-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="border rounded p-4 bg-white shadow">
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <FileWarning className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-lg font-semibold">No Job Requirements Found</h3>
    <p className="mt-1 text-gray-500">Please check your job description to get started.</p>
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      <p>Failed to fetch matches. Please try again.</p>
      <Button onClick={onRetry} className="mt-4">Retry</Button>
    </AlertDescription>
  </Alert>
);

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
    setSelectedSectionForEnhancement(selectedSection);
    setEnhanceModalOpen(true);
  };

  const handleSaveEnhancement = (sectionId: string, enhancedContent: string) => {
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
      {(showRematchBanner || true) && (
        <RematchBanner onRematch={onRematch} onDismiss={() => setShowRematchBanner(false)} />
      )}
    

      {/* Coverage Gaps Section */}
      {matchingResult?.coverage_gaps?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Coverage Gaps</h2>
          <p className="text-gray-600 text-sm">
            These job requirements need attention to strengthen your application.
          </p>
          
          {/* Display all coverage gaps (Redux automatically removes filled ones) */}
          {matchingResult.coverage_gaps.map((gap) => (
            <CoverageGapCard
              key={gap.id}
              gap={gap}
              // gapId={gap.id}
              onSeeSuggestions={handleSeeSuggestions}
              onFillGap={handleFillGap}
            />
          ))}
          
          {/* Show message when no gaps remain */}
          {matchingResult.coverage_gaps.length === 0 && (
            <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
              <div className="text-green-600 text-lg font-semibold mb-2">
                🎉 All Coverage Gaps Addressed!
              </div>
              <p className="text-green-700 text-sm">
                You've successfully filled all identified gaps. Your profile now better matches the job requirements.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Selected Sections */}
      {matchingResult.selected_sections?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Selected Profile Sections</h2>
          <p className="text-gray-600 text-sm">
            These sections from your profile best match the job requirements.
          </p>
          {matchingResult.selected_sections.map((selectedSection, index) => (
            <SelectedSectionCard
              key={selectedSection.profile_section_id}
              selectedSection={selectedSection}
              profileSections={profileSections}
              onEnhanceSection={handleEnhanceSection}
            />
          ))}
        </div>
      )}

      {/* {currentMatch && matchingResult && (
        <SuggestedSectionModal
          match={currentMatch}
          open={modalOpen}
          orderedMatchedProfileSections={getOrderedMatchedProfileSections(matchingResult.selected_sections, profileSections)}
          onClose={() => setModalOpen(false)}
          onSaveAndMatch={handleSaveAndMatch}
          onSaveOnly={handleSaveOnly}
          onSkip={() => setModalOpen(false)}
        />
      )} */}

      {selectedGap && (
        <FillGapModal
          open={fillGapModalOpen}
          onClose={() => setFillGapModalOpen(false)}
          gap={selectedGap}
          profileSections={profileSections}
          onSaveAndMarkCovered={handleSaveAndMarkCovered}
        />
      )}

      {selectedSectionForEnhancement && (
        <EnhanceProfileSectionModal
          open={enhanceModalOpen}
          onClose={() => setEnhanceModalOpen(false)}
          selectedSection={selectedSectionForEnhancement}
          profileSections={profileSections}
          onSaveEnhancement={handleSaveEnhancement}
        />
      )}
    </div>
  );
};

export const JobRequirementsMatchingStep = createStep({
  id: 'job-requirements',
  label: 'Job Requirements Matching',
  description: 'Match your skills with job requirements'
})(JobRequirementsMatching);