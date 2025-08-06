import React from "react";
import { LoadingState } from "../../shared/states/LoadingState";
import { ErrorState } from "../../shared/states/ErrorState";
import { EmptyState } from "../../shared/states/EmptyState";
import { FileText } from "lucide-react";

interface ResumeSectionsStatesProps {
  isLoading: boolean;
  error: any;
  hasResumeSections: boolean;
  onRetry?: () => void;
}

export const ResumeSectionsStates: React.FC<ResumeSectionsStatesProps> = ({
  isLoading,
  error,
  hasResumeSections,
  onRetry
}) => {
  if (isLoading) {
    return (
      <LoadingState
        message="Generating resume sections..."
        variant="card"
        size="lg"
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Generation Failed"
        error="Unable to generate resume sections. Please try again."
        onRetry={onRetry}
        variant="card"
      />
    );
  }

  if (!hasResumeSections) {
    return (
      <EmptyState
        icon={<FileText className="w-12 h-12" />}
        title="No Resume Sections"
        message="No sections have been generated yet. They will appear here once processing is complete."
        variant="card"
      />
    );
  }

  return null;
};
