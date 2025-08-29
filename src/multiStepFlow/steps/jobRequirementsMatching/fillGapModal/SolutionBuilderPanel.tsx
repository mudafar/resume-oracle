"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { CoverageGap } from "@/schemas/matching";
import type { ProfileSection } from "@/schemas/profile";
import { SectionTypeEnum, sectionTypes } from "@/types/store";
import { ArrowLeft, Sparkles, Save, Edit3, Plus } from "lucide-react";

interface SolutionBuilderPanelProps {
  phase: 'input' | 'review';
  selectedAction: 'extend' | 'create';
  setSelectedAction: (action: 'extend' | 'create') => void;
  selectedSectionId: string;
  setSelectedSectionId: (id: string) => void;
  newSectionType: string;
  setNewSectionType: (type: string) => void;
  experienceInput: string;
  setExperienceInput: (input: string) => void;
  additionalContext: string;
  setAdditionalContext: (context: string) => void;
  generatedContent: string;
  setGeneratedContent: (content: string) => void;
  profileSections: ProfileSection[];
  gap: CoverageGap;
  isLoading?: boolean;
  onGenerate: () => void;
  onSave: () => void;
  onBack: () => void;
  structureRationale?: string;
  keyHighlights?: string[];
}

export const SolutionBuilderPanel: React.FC<SolutionBuilderPanelProps> = ({
  phase,
  selectedAction,
  setSelectedAction,
  selectedSectionId,
  setSelectedSectionId,
  newSectionType,
  setNewSectionType,
  experienceInput,
  setExperienceInput,
  additionalContext,
  setAdditionalContext,
  generatedContent,
  setGeneratedContent,
  profileSections,
  gap,
  isLoading = false,
  onGenerate,
  onSave,
  onBack,
  structureRationale = "",
  keyHighlights = [],
}) => {
  const selectedSection = profileSections.find(ps => ps.id === selectedSectionId);
  const canGenerate = experienceInput.trim().length > 0 && 
    (selectedAction === 'create' || (selectedAction === 'extend' && selectedSectionId));

  if (phase === 'review') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Edit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedAction === 'extend' ? 'Enhanced Profile Section' : 'New Profile Section'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="generated-content">Generated Content</Label>
                <Textarea
                  id="generated-content"
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[300px] mt-2"
                  placeholder="Generated content will appear here..."
                />
              </div>

              {/* Structure Rationale and Key Highlights */}
              {(structureRationale || (keyHighlights && keyHighlights.length > 0)) && (
                <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                  <h3 className="text-lg font-semibold mb-2">Structure Rationale</h3>
                  {structureRationale && (
                    <p className="mb-2 text-gray-700">{structureRationale}</p>
                  )}
                  {keyHighlights && keyHighlights.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-1">Key Highlights:</h4>
                      <ul className="list-disc list-inside text-gray-700">
                        {keyHighlights.map((highlight, idx) => (
                          <li key={idx}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={onSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save & Mark Gap Covered
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>How would you like to address this gap?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Action Toggle */}
          <div>
            <ToggleGroup
              type="single"
              value={selectedAction}
              onValueChange={(value) => value && setSelectedAction(value as 'extend' | 'create')}
              className="w-full"
            >
              <ToggleGroupItem value="extend" className="flex-1 flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Extend Existing
              </ToggleGroupItem>
              <ToggleGroupItem value="create" className="flex-1 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Conditional Content */}
          {selectedAction === 'extend' && (
            <div>
              <Label htmlFor="section-select">Select Profile Section</Label>
              <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Choose a section to extend..." />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {profileSections.map((section) => (
                    <SelectItem key={section.id} value={section.id} className="w-full">
                      <span className="text-sm truncate w-full">
                        <span className="font-medium">
                          {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                        </span>
                        <span className="text-muted-foreground">
                          : {section.content.slice(0, 80)}...
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedAction === 'create' && (
            <div>
              <Label htmlFor="section-type">Profile Section Type</Label>
              <Select value={newSectionType} onValueChange={setNewSectionType}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Choose a section type..." />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {Object.entries(sectionTypes).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Experience Input - Show after action selection */}
          {(selectedAction && ((selectedAction === 'extend' && selectedSectionId) || selectedAction === 'create')) && (
            <>
              <div className="border-t pt-4">
                <div>
                  <Label htmlFor="experience-input">
                    {selectedAction === 'extend' ? 'What experience is missing?' : `Describe your ${sectionTypes[newSectionType as keyof typeof sectionTypes]?.toLowerCase() || 'experience'}`} *
                  </Label>
                  <Textarea
                    id="experience-input"
                    value={experienceInput}
                    onChange={(e) => setExperienceInput(e.target.value)}
                    placeholder={
                      selectedAction === 'extend'
                        ? "Briefly describe the missing experience to add..."
                        : `Provide details about your ${sectionTypes[newSectionType as keyof typeof sectionTypes]?.toLowerCase() || 'experience'}...`
                    }
                    className="mt-1 min-h-[120px] resize-y"
                    required
                  />
                </div>

                {/* Collapsible Additional Context */}
                <details className="mt-3">
                  <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                    Additional Context (optional)
                  </summary>
                  <div className="mt-2">
                    <Textarea
                      id="additional-context"
                      value={additionalContext}
                      onChange={(e) => setAdditionalContext(e.target.value)}
                      placeholder="Any additional context that might help..."
                      className="min-h-[60px] resize-y"
                    />
                  </div>
                </details>
              </div>

              <Button 
                onClick={onGenerate} 
                disabled={!canGenerate || isLoading}
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isLoading 
                  ? 'Generating...'
                  : selectedAction === 'extend' 
                    ? `Enhance ${selectedSection?.type || 'Section'}` 
                    : `Generate ${sectionTypes[newSectionType as keyof typeof sectionTypes]} Section`
                }
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
