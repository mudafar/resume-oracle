"use client";
import React from "react";
import { createStep } from "@/utils/createStep";
import { SuggestedSectionModal } from "./suggestedSectionModal";
import { RematchBanner, MatchCard, useJobMatching } from ".";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileWarning } from 'lucide-react';

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
    modalRequirement,
    onRematch,
    setShowRematchBanner,
    handleSeeSuggestions,
    setModalOpen,
    handleSaveAndMatch,
    handleSaveOnly,
  } = useJobMatching();

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
      <SuggestedSectionModal
        requirement={modalRequirement || ""}
        open={modalOpen}
        profileSections={profileSections}
        onClose={() => setModalOpen(false)}
        onSaveAndMatch={handleSaveAndMatch}
        onSaveOnly={handleSaveOnly}
        onSkip={() => setModalOpen(false)}
      />
    </div>
  );
};

export const JobRequirementsMatchingStep = createStep({
  id: 'job-requirements',
  label: 'Job Requirements Matching',
  description: 'Match your skills with job requirements'
})(JobRequirementsMatching);