import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileWarning } from 'lucide-react';

export const LoadingState = () => (
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

export const EmptyState = () => (
  <div className="text-center py-12">
    <FileWarning className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-lg font-semibold">No Job Requirements Found</h3>
    <p className="mt-1 text-gray-500">Please check your job description to get started.</p>
  </div>
);

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      <p>Failed to fetch matches. Please try again.</p>
      <Button onClick={onRetry} className="mt-4">Retry</Button>
    </AlertDescription>
  </Alert>
);
