"use client";
import React from "react";
// Utility to get profile sections referenced by matches
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { createStep } from "@/utils/createStep";
import { SuggestedSectionModal } from "./suggestedSectionModal";
import { RematchBanner, MatchCard, useJobMatching } from ".";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileWarning } from 'lucide-react';
import { Match } from "@/store/slices/matchesSlice";


function getTopMatchedProfileSections(matches: Match[], profileSections: ProfileSection[], max=5): ProfileSection[] {
  // Count matches per profile section
  const matchCounts = new Map<string, number>();
  matches.forEach((match) => {
    if (match.profile_section_id) {
      matchCounts.set(match.profile_section_id, (matchCounts.get(match.profile_section_id) || 0) + 1);
    }
  });

  // Filter and sort profile sections by match count (descending)
  return profileSections
    .filter((ps) => matchCounts.has(ps.id))
    .sort((a, b) => (matchCounts.get(b.id) || 0) - (matchCounts.get(a.id) || 0))
    .slice(0, max); // Limit to top 4 sections
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

  // Find the current match for the modal
  const currentMatch = modalMatchId ? matches.find(m => m.id === modalMatchId) : null;

  if (!job_description.trim() || profileSections.length === 0) {
    return <div className="text-gray-500">Please complete previous steps to see job requirements matching.</div>;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={onRematch} />;
  }

  if (!matches.length) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {showRematchBanner && <RematchBanner onRematch={onRematch} onDismiss={() => setShowRematchBanner(false)} />}
      <div className="space-y-4">
        {[
          ...matches.filter(m => !m.profile_section_id),
          ...matches.filter(m => m.profile_section_id)
        ].map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            profileSections={profileSections}
            onSeeSuggestions={handleSeeSuggestions}
          />
        ))}
      </div>
      {currentMatch && (
        <SuggestedSectionModal
          match={currentMatch}
          open={modalOpen}
          profileSections={getTopMatchedProfileSections(matches, profileSections)}
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