import React, { useState, useEffect } from "react";
import { useSuggestProfileSectionMutation } from "@/store/services/llmApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {

  FileText,
} from "lucide-react";
import { GeneratedSectionArea } from './GeneratedSectionArea';
import { LoadingState } from "./LoadingState";
import { Sidebar } from "./Sidebar";
import { ModalFooter } from "./ModalFooter";
import { sectionTypes, SectionTypeEnum } from "@/store/slices/profileSectionsSlice";
import { Match } from "@/store/slices/matchesSlice";

interface ProfileSection {
  id: string;
  type: string;
  content: string;
}

interface SuggestedSectionModalProps {
  match: Match;
  open: boolean;
  orderedMatchedProfileSections: ProfileSection[];
  onClose: () => void;
  onSaveAndMatch: (section: {
    type: SectionTypeEnum;
    content: string;
    baseId: string;
  }) => void;
  onSaveOnly: (section: {
    type: SectionTypeEnum;
    content: string;
    baseId: string;
  }) => void;
  onSkip: () => void;
}



export const SuggestedSectionModal: React.FC<SuggestedSectionModalProps> = ({
  match,
  open,
  orderedMatchedProfileSections,
  onClose,
  onSaveAndMatch,
  onSaveOnly,
  onSkip,
}) => {
  const [type, setType] = useState<SectionTypeEnum>(sectionTypes[0]);
  const [content, setContent] = useState("");
  const [baseId, setBaseId] = useState<string | null>(null);
  const [summaryOfChanges, setSummaryOfChanges] = useState<string>("");
  const [isBaseSectionOpen, setIsBaseSectionOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Advanced features state
  const [useAutoSelection, setUseAutoSelection] = useState(true);
  const [selectedProfileSectionId, setSelectedProfileSectionId] = useState<string | null>(null);
  const [customHint, setCustomHint] = useState("");

  // Use mutation similar to triggerEnhance pattern
  const [triggerSuggest, { data, isLoading, isError, error: apiError, isSuccess, reset }] = useSuggestProfileSectionMutation();

  // Helper function to prepare query payload
  const prepareQueryPayload = () => ({
    requirement: match.requirement,
    profile_sections: useAutoSelection
      ? orderedMatchedProfileSections.slice(0, 3) // Top 3 for API optimization
      : selectedProfileSectionId
        ? orderedMatchedProfileSections.filter(ps => ps.id === selectedProfileSectionId)
        : [],
    gap_description: match.gap_description,
    custom_hint: customHint || undefined,
    recommendation: match.recommendation,
  });

  // Trigger suggestion when modal opens
  useEffect(() => {
    if (open) {
      setContent("");
      setBaseId(null);
      setSummaryOfChanges("");
      setError(null);

      const queryPayload = prepareQueryPayload();

      // Only trigger if we have valid data
      if (queryPayload.profile_sections.length > 0) {
        triggerSuggest(queryPayload);
      }
    } else {
      reset();
      setType(sectionTypes[0]);
      setContent("");
      setBaseId(null);
      setSummaryOfChanges("");
      setIsBaseSectionOpen(false);
      setIsSummaryOpen(true);
      setUseAutoSelection(true);
      setSelectedProfileSectionId(null);
      setCustomHint("");
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, orderedMatchedProfileSections, match]);

  // Update state when data is received
  useEffect(() => {
    if (data) {
      setBaseId(data.base_profile_section_id);
      setType((data.suggested_profile_section.type as SectionTypeEnum) || sectionTypes[0]);
      setContent(data.suggested_profile_section.content || "");
      setSummaryOfChanges(data.summary_of_changes || "");
    }
  }, [data]);

  // Handle error
  useEffect(() => {
    if (isError && apiError && 'message' in apiError) {
      setError((apiError as any).message || 'Failed to generate suggestion');
    } else if (isError) {
      setError('Failed to generate suggestion');
    }
  }, [isError, apiError]);

  // Reset selected base when switching to auto mode
  useEffect(() => {
    if (useAutoSelection) {
      setSelectedProfileSectionId(null);
    }
  }, [useAutoSelection]);

  const handleRegenerateClick = () => {
    const queryPayload = prepareQueryPayload();

    if (queryPayload.profile_sections.length > 0) {
      setError(null);
      triggerSuggest(queryPayload);
    }
  };

  function getErrorMessage(error: any): string {
    if (!error) return "";
    if (typeof error === "string") return error;
    if (error.status && error.data && typeof error.data === "string")
      return error.data;
    if (error.message) return error.message;
    return "An error occurred.";
  }

  const baseSection = baseId
    ? orderedMatchedProfileSections.find((s) => s.id === baseId)
    : null;

  const isEditing = !!baseSection;
  const matchBtnLabel = isEditing ? "Update & Match" : "Add & Match";
  const onlyBtnLabel = isEditing ? "Update Only" : "Add Only";
  const contentLength = content.length;
  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90rem] max-h-[90vh] flex flex-col min-w-[75vw] min-h-[90vh]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" /> Suggested Profile Section
          </DialogTitle>
          <DialogDescription>
            We've generated a profile section to better match the job requirements. 
            Review and customize it below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-auto">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            </Alert>
          ) : (
            <div className="flex flex-col h-full lg:flex-row min-h-0 "> 
              {/* Left Content Area */}
              <div className="lg:w-2/3 flex flex-col">
                <GeneratedSectionArea
                  content={content}
                  setContent={setContent}
                  contentLength={contentLength}
                  wordCount={wordCount}
                  isEditing={isEditing}
                  type={type}
                  setType={setType}
                />
              </div>
              {/* Right Sidebar */}
              <div className="lg:w-1/3 flex flex-col mt-6 lg:mt-0 lg:ml-6">
                <div className="flex-1 space-y-4 py-1 min-h-0">
                  <Sidebar
                    requirement={match.requirement}
                    type={type}
                    setType={setType}
                    isEditing={isEditing}
                    summaryOfChanges={summaryOfChanges}
                    isSummaryOpen={isSummaryOpen}
                    setIsSummaryOpen={setIsSummaryOpen}
                    baseSection={baseSection}
                    isBaseSectionOpen={isBaseSectionOpen}
                    setIsBaseSectionOpen={setIsBaseSectionOpen}
                    profileSections={orderedMatchedProfileSections}
                    useAutoSelection={useAutoSelection}
                    setUseAutoSelection={setUseAutoSelection}
                    selectedProfileSectionId={selectedProfileSectionId}
                    setSelectedProfileSectionId={setSelectedProfileSectionId}
                    customHint={customHint}
                    setCustomHint={setCustomHint}
                    onRegenerateClick={handleRegenerateClick}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 flex-shrink-0 flex items-center gap-3">
          <ModalFooter
            isLoading={isLoading}
            onSkip={onSkip}
            isEditing={isEditing}
            baseId={baseId}
            onSaveOnly={onSaveOnly}
            onSaveAndMatch={onSaveAndMatch}
            type={type}
            content={content}
            onlyBtnLabel={onlyBtnLabel}
            matchBtnLabel={matchBtnLabel}
            disabled={isLoading || !content.trim()}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
