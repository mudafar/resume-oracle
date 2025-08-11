import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Loader2, AlertTriangle } from "lucide-react";

interface ResumeStatesProps {
  isLoading: boolean;
  error: any;
  hasResume: boolean;
}

export const ResumeStates: React.FC<ResumeStatesProps> = ({
  isLoading,
  error,
  hasResume
}) => {
  // Empty state - when no resume is generated yet
  if (!hasResume && !isLoading && !error) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex items-center justify-center py-20">
          <div className="text-center space-y-6">
            <FileText className="h-16 w-16 mx-auto text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">No resume generated yet</h3>
            <p className="text-sm text-gray-600">
              Add some resume sections to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">Generating resume...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mb-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to generate resume. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
};
