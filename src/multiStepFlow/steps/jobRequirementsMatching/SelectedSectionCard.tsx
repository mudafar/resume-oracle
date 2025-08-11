"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, ChevronDown, ChevronUp, Star, Sparkles } from 'lucide-react';
import { ProfileSection } from "@/types/store";
import { generateTextPreview } from "@/utils/textPreview";
import { SelectedSection } from "@/schemas/matching";

interface SelectedSectionCardProps {
  selectedSection: SelectedSection;
  profileSections: ProfileSection[];
  onEnhanceSection?: (selectedSection: SelectedSection) => void;
}

export const SelectedSectionCard: React.FC<SelectedSectionCardProps> = ({ 
  selectedSection, 
  profileSections,
  onEnhanceSection
}) => {
  const [expanded, setExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const profileSection = profileSections.find(ps => ps.id === selectedSection.profile_section_id);
  
  const { preview, isExpandable } = profileSection
    ? generateTextPreview(profileSection.content)
    : { preview: "", isExpandable: false };

  const totalWeightedScore = Math.round(selectedSection.total_weighted_score);

  // Check if there are any missing requirements across all matched pairs
  const hasMissingRequirements = selectedSection.matched_scored_pairs.some(pair => 
    pair.missing && pair.missing.length > 0
  );

  return (
    <Card className="border-l-4 border-green-500 bg-green-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            <span>Selected Profile Section</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-bold">{totalWeightedScore} pts</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Section Details */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-lg">{profileSection?.type || 'Unknown Section'}</h4>
              <Badge variant="outline">{profileSection?.type || 'Unknown Type'}</Badge>
            </div>
            
            {/* Section Content */}
            {profileSection && (
              <div>
                <pre className="bg-white rounded p-3 text-sm whitespace-pre-line border">
                  {expanded ? profileSection.content : preview}
                </pre>
                {isExpandable && (
                  <Button 
                    variant="link" 
                    onClick={() => setExpanded(!expanded)} 
                    className="px-0 mt-2"
                  >
                    {expanded ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Show More
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Enhancement CTA */}
          {hasMissingRequirements && onEnhanceSection && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-orange-800 mb-1">Section Can Be Enhanced</h5>
                  <p className="text-sm text-orange-700">
                    This section has some missing requirements that could be addressed through enhancement.
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    console.log('Enhance Section button clicked for:', selectedSection);
                    onEnhanceSection?.(selectedSection);
                  }}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 ml-4"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Enhance Section
                </Button>
              </div>
            </div>
          )}

          {/* Selection Details - Grouped in Collapsible */}
          <Collapsible open={detailsExpanded} onOpenChange={setDetailsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Selection Details</span>
                {detailsExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-3">
              {/* Selection Rationale */}
              <div className="bg-blue-50 rounded p-3">
                <h5 className="font-medium mb-1 text-blue-800">Why This Section Was Selected</h5>
                <p className="text-sm text-blue-700">{selectedSection.rationale}</p>
              </div>

              {/* Matched Requirements */}
              <div>
                <h5 className="font-medium mb-3 text-gray-800">
                  Matched Requirements ({selectedSection.matched_scored_pairs.length})
                </h5>
                <div className="space-y-3">
                  {selectedSection.matched_scored_pairs.map((pair, index) => (
                    <div key={index} className="border rounded p-3 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>📋</span>
                          <h6 className="font-semibold">Job Requirement Match</h6>
                        </div>
                        <div className="flex items-center gap-2 flex-1 max-w-xs">
                          <span className="text-sm font-medium">Score:</span>
                          <Progress value={pair.raw_score} className="flex-1" />
                          <span className="text-sm">{Math.round(pair.raw_score)}%</span>
                        </div>
                      </div>

                      {/* Coverage Details */}
                      <div className="space-y-2">


                        {pair.coverage.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-green-700">✓ Covered:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {pair.coverage.map((item: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {pair.missing.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-orange-700">⚠ Missing:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {pair.missing.map((item: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* {pair.strength_indicators.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-blue-700">💪 Strengths:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {pair.strength_indicators.map((item: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )} */}

                        {/* {pair.evidence && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-gray-700">Evidence:</span>
                            <p className="text-sm text-gray-600 mt-1">{pair.evidence}</p>
                          </div>
                        )} */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};
