import React, { useState, useEffect } from "react";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { useEnhanceMatchedProfileSectionMutation, EnhancementResponse, BaseJobRequirementMatch } from "@/store/services/llmApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  FileText,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit3
} from "lucide-react";

interface EnhanceProfileSectionModalProps {
  profileSection: ProfileSection;
  baseJobRequirementMatches: BaseJobRequirementMatch[];
  open: boolean;
  onClose: () => void;
  onApplyChanges: (enhancedContent: string) => void;
  onKeepOriginal: () => void;
}

export const EnhanceProfileSectionModal: React.FC<EnhanceProfileSectionModalProps> = ({
  profileSection,
  baseJobRequirementMatches,
  open,
  onClose,
  onApplyChanges,
  onKeepOriginal,
}) => {
  const [enhancedContent, setEnhancedContent] = useState("");
  const [enhancementsMade, setEnhancementsMade] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [triggerEnhance, { data, isLoading, isError, error: apiError, isSuccess, reset }] = useEnhanceMatchedProfileSectionMutation();

  // Fetch enhancement when modal opens
  useEffect(() => {
    if (open) {
      setEnhancedContent("");
      setEnhancementsMade([]);
      setReasoning("");
      setError(null);
      triggerEnhance({
        profile_section: profileSection,
        base_job_requirement_matches: baseJobRequirementMatches,
      });
    } else {
      reset();
      setEnhancedContent("");
      setEnhancementsMade([]);
      setReasoning("");
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, profileSection, baseJobRequirementMatches]);

  // Update state when data is received
  useEffect(() => {
    if (data) {
      setEnhancedContent(data.enhanced_profile_section.content);
      setEnhancementsMade(data.enhancements_made);
      setReasoning(data.reasoning);
    }
  }, [data]);

  // Handle error
  useEffect(() => {
    if (isError && apiError && 'message' in apiError) {
      setError((apiError as any).message || 'Failed to fetch enhancement');
    } else if (isError) {
      setError('Failed to fetch enhancement');
    }
  }, [isError, apiError]);

  const handleApplyChanges = () => {
    onApplyChanges(enhancedContent);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[75vw] max-h-[90vh] overflow-hidden flex flex-col min-w-[75vw] min-h-[90vh]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Enhance Profile Section
          </DialogTitle>
          <DialogDescription>
            AI-powered suggestions to improve your {profileSection.type} section based on job requirements.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex-1 space-y-4 px-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating AI-powered enhancements...
            </div>
            <div className="grid grid-cols-2 gap-6 h-full">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 px-1">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Enhancement Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
            {/* Left Column - Enhanced Content */}
            <div className="flex flex-col space-y-4 min-h-0 overflow-auto col-span-2">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {/* Enhanced Content Section */}
                  <Card className="h-fit">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-green-600" />
                        Enhanced Suggestion
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          AI Generated
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Review and edit the AI-enhanced version of your content
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={enhancedContent}
                        onChange={(e) => setEnhancedContent(e.target.value)}
                        className="min-h-[300px] resize-none"
                        placeholder="Enhanced content will appear here..."
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        {enhancedContent.length} characters
                      </div>
                    </CardContent>
                  </Card>


                  {/* Reasoning Section */}
                  {reasoning && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          AI Reasoning
                        </CardTitle>
                        <CardDescription>
                          Understanding the logic behind these suggestions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="text-sm text-amber-900 leading-relaxed">
                            {reasoning}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Right Column - Original Content & Context */}
            <div className="flex flex-col space-y-4 min-h-0 overflow-auto">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {/* Enhancements Made Section */}
                  {enhancementsMade.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          Key Improvements
                        </CardTitle>
                        <CardDescription>
                          Specific enhancements made to address job requirements
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {enhancementsMade.map((enhancement, index) => (
                            <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-900">{enhancement}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Original Content Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          Original Content
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Reference
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Your current {profileSection.type} section content
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 rounded-lg p-4 border max-h-[300px] overflow-y-auto">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {profileSection.content}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Job Requirements Context */}
                  {baseJobRequirementMatches.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          Matched Requirements
                          <Badge variant="outline">{baseJobRequirementMatches.length}</Badge>
                        </CardTitle>
                        <CardDescription>
                          Job requirements this section addresses
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          {baseJobRequirementMatches.map((match, index) => (
                            <div key={index} className="text-sm p-2 bg-gray-50 rounded border-l-2 border-gray-300">
                              "{match.requirement}"
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        <Separator className="my-4" />

        <DialogFooter className="flex-shrink-0">
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onKeepOriginal}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              Keep Original
            </Button>
            <Button
              onClick={handleApplyChanges}
              disabled={isLoading || !enhancedContent.trim()}
              className="flex-1 sm:flex-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Apply Changes
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};