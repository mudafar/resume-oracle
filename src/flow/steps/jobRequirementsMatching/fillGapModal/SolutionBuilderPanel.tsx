"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CoverageGap } from "@/schemas/matching";
import type { ProfileSection } from "@/schemas/profile";
import { ArrowLeft, Sparkles, Save } from "lucide-react";

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choose Action</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Extend Existing Section */}
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                id="extend"
                name="action"
                value="extend"
                checked={selectedAction === 'extend'}
                onChange={(e) => setSelectedAction(e.target.value as 'extend' | 'create')}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <Label htmlFor="extend" className="font-medium cursor-pointer">
                  Extend existing profile section
                </Label>
                  <p className="text-sm text-gray-600">
                    Add missing experience to your existing content
                  </p>
                  
                  {selectedAction === 'extend' && (
                    <div className="space-y-3 mt-3">
                      <div>
                        <Label htmlFor="section-select">Select Profile Section</Label>
                        <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Choose a section to extend..." />
                          </SelectTrigger>
                          <SelectContent>
                            {profileSections.map((section) => (
                              <SelectItem key={section.id} value={section.id}>
                                {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedSection && (
                        <div>
                          <Label>Current Content Preview</Label>
                          <div className="mt-1 p-3 bg-gray-50 rounded-md border text-sm max-h-32 overflow-y-auto">
                            <pre className="whitespace-pre-wrap font-sans">
                              {selectedSection.content}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Create New Section */}
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  id="create"
                  name="action"
                  value="create"
                  checked={selectedAction === 'create'}
                  onChange={(e) => setSelectedAction(e.target.value as 'extend' | 'create')}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="create" className="font-medium cursor-pointer">
                    Create new profile section
                  </Label>
                  <p className="text-sm text-gray-600">
                    Build a complete new section from scratch
                  </p>
                  
                  {selectedAction === 'create' && (
                    <div className="mt-3">
                      <Label htmlFor="section-type">Section Type</Label>
                      <Input
                        id="section-type"
                        value={newSectionType}
                        onChange={(e) => setNewSectionType(e.target.value)}
                        placeholder="e.g., experience, projects, skills"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
        </CardContent>
      </Card>

      {/* Experience Input */}
      <Card>
        <CardHeader>
          <CardTitle>Experience Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="experience-input">
              {selectedAction === 'extend' ? 'Brief Experience' : 'Your Experience'} *
            </Label>
            <Textarea
              id="experience-input"
              value={experienceInput}
              onChange={(e) => setExperienceInput(e.target.value)}
              placeholder={
                selectedAction === 'extend'
                  ? "Briefly describe the missing experience to add..."
                  : "Provide detailed description of your experience, projects, achievements..."
              }
              className={`mt-1 ${selectedAction === 'extend' ? 'min-h-[100px]' : 'min-h-[200px]'}`}
              required
            />
          </div>

          <div>
            <Label htmlFor="additional-context">Additional Context (optional)</Label>
            <Textarea
              id="additional-context"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Any additional context that might help..."
              className="mt-1 min-h-[80px]"
            />
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
                : 'Generate New Profile Section'
            }
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
