"use client";
import React from "react";
// Utility to get profile sections referenced by matches
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { createStep } from "@/utils/createStep";
import { SuggestedSectionModal } from "./suggestedSectionModal";
import { RematchBanner, MatchCard, useJobMatching } from ".";
import { CoverageGapCard } from "./CoverageGapCard";
import { SelectedSectionCard } from "./SelectedSectionCard";
import { MatchingSummary } from "./MatchingSummary";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileWarning } from 'lucide-react';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { HybridSelectionResult } from "@/services/zodModels";


function getOrderedMatchedProfileSections(
  selectedSections: HybridSelectionResult["selected_sections"],
  profileSections: ProfileSection[]
): ProfileSection[] {
  const matchCounts = new Map<string, number>();
  selectedSections.forEach((section: { section_id: string }) => {
    matchCounts.set(section.section_id, (matchCounts.get(section.section_id) || 0) + 1);
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
  const { 
    matches,
    profileSections,
    job_description,
    isLoading,
    error,
    showRematchBanner,
    modalOpen,
    modalMatchId,
    onRematch,
    setShowRematchBanner,
    handleSeeSuggestions,
    setModalOpen,
    handleSaveAndMatch,
    handleSaveOnly,
  } = useJobMatching();

  // Replace `matchingResult` with the Redux state
  const matchingResult = useSelector((state: RootState) => state.matches.data);

  // Update `currentMatch` logic to work with `HybridSelectionResult`
  const currentMatch = modalMatchId
    ? matchingResult?.selected_sections.find(section => section.section_id === modalMatchId)
    : null;

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
      
      {/* Summary Section */}
      <MatchingSummary result={matchingResult} />

      {/* Coverage Gaps Section */}
      {matchingResult?.coverage_gaps?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Coverage Gaps</h2>
          <p className="text-gray-600 text-sm">
            These job requirements need attention to strengthen your application.
          </p>
          {matchingResult.coverage_gaps.map((gap, index) => (
            <CoverageGapCard
              key={`gap-${index}`}
              gap={gap}
              gapId={`gap-${index}`}
              onSeeSuggestions={handleSeeSuggestions}
            />
          ))}
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
              key={selectedSection.section_id}
              selectedSection={selectedSection}
              profileSections={profileSections}
            />
          ))}
        </div>
      )}

      {currentMatch && matchingResult && (
        <SuggestedSectionModal
          match={currentMatch}
          open={modalOpen}
          orderedMatchedProfileSections={getOrderedMatchedProfileSections(matchingResult.selected_sections, profileSections)}
          onClose={() => setModalOpen(false)}
          onSaveAndMatch={handleSaveAndMatch}
          onSaveOnly={handleSaveOnly}
          onSkip={() => setModalOpen(false)}
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