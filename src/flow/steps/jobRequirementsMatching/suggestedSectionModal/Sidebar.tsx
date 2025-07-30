import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { ChevronUp, ChevronDown, Settings } from "lucide-react";
import { sectionTypes, SectionTypeEnum, ProfileSection } from "@/store/slices/profileSectionsSlice";

interface SidebarProps {
  requirement: string;
  type: SectionTypeEnum;
  setType: React.Dispatch<React.SetStateAction<SectionTypeEnum>>;
  isEditing: boolean;
  summaryOfChanges: string;
  isSummaryOpen: boolean;
  setIsSummaryOpen: (open: boolean) => void;
  baseSection: any;
  isBaseSectionOpen: boolean;
  setIsBaseSectionOpen: (open: boolean) => void;
  // Advanced features props
  profileSections: ProfileSection[];
  useAutoSelection: boolean;
  setUseAutoSelection: (value: boolean) => void;
  selectedProfileSectionId: string | null;
  setSelectedProfileSectionId: (value: string | null) => void;
  customHint: string;
  setCustomHint: (value: string) => void;
  onRegenerateClick: () => void;
  isLoading?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  requirement,
  summaryOfChanges,
  isSummaryOpen,
  setIsSummaryOpen,
  baseSection,
  isBaseSectionOpen,
  setIsBaseSectionOpen,
  profileSections,
  useAutoSelection,
  setUseAutoSelection,
  selectedProfileSectionId,
  setSelectedProfileSectionId,
  customHint,
  setCustomHint,
  onRegenerateClick,
  isLoading,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);

  return (
    <>
      <Alert className="border-blue-200 bg-blue-50">
        <AlertDescription>
          <span className="font-semibold text-blue-800">Target Requirement:</span>
          <div className="mt-1 text-blue-700 italic">"{requirement}"</div>
        </AlertDescription>
      </Alert>

      {/* Advanced Options - Now contains Base Section Selection and Custom Instructions */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-2 h-auto"
          >
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="font-semibold">Advanced Options</span>
            </div>
            {isAdvancedOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardContent className="p-4 space-y-4">
              {/* Base Section Selection */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Base Section Selection</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="auto-selection"
                      checked={useAutoSelection}
                      onChange={() => setUseAutoSelection(true)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="auto-selection" className="text-sm">Let AI choose automatically</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="manual-selection"
                      checked={!useAutoSelection}
                      onChange={() => setUseAutoSelection(false)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="manual-selection" className="text-sm">Choose manually</Label>
                  </div>

                  {!useAutoSelection && (
                    <div className="mt-3">
                      <Select value={selectedProfileSectionId || ""} onValueChange={setSelectedProfileSectionId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a profile section..." />
                        </SelectTrigger>
                        <SelectContent>
                          {profileSections.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {section.type}
                                </Badge>
                                <span className="truncate max-w-[200px]">
                                  {section.content.substring(0, 50)}...
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Instructions */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Custom Instructions</Label>
                <Textarea
                  placeholder="Provide specific instructions for the AI (e.g., 'Focus on leadership skills', 'Use technical terminology', etc.)"
                  value={customHint}
                  onChange={(e) => setCustomHint(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
              </div>

              {/* Regenerate Button */}
              <div>
                <Button
                  onClick={onRegenerateClick}
                  disabled={isLoading || (!useAutoSelection && !selectedProfileSectionId)}
                  className="w-full"
                  variant="default"
                >
                  {isLoading ? "Generating..." : "Generate New Suggestion"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Summary of Changes */}
      {summaryOfChanges && (
        <Collapsible open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center p-2 h-auto"
            >
              <span className="font-semibold">Summary of Changes</span>
              {isSummaryOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2">
              <CardContent className="p-3">
                <ScrollArea className="">
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {summaryOfChanges}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Original Section */}
      {baseSection && (
        <Collapsible open={isBaseSectionOpen} onOpenChange={setIsBaseSectionOpen} className="">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center p-2 h-auto"
            >
              <span className="font-semibold">Original Section</span>
              {isBaseSectionOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2">
              <CardContent className="p-3">
                <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm whitespace-pre-wra font-sans">
                  {baseSection.content}
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  );
};
