"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { ProfileSection } from "@/schemas/profile";
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
    <Card className="border-l-4 border-green-500 bg-green-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-medium">Selected Section</span>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {totalWeightedScore} pts
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Section Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h4 className="font-semibold text-base">{profileSection?.type || 'Unknown Section'}</h4>
            </div>
            
            {/* Section Content */}
            {profileSection && (
              <div>
                <div className="bg-white rounded-md border p-3 text-sm">
                  <pre className="whitespace-pre-wrap font-sans">
                    {expanded ? profileSection.content : preview}
                  </pre>
                </div>
                {isExpandable && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setExpanded(!expanded)} 
                    className="mt-2 p-0 h-auto text-xs text-gray-600 hover:text-gray-900"
                  >
                    {expanded ? (
                      <>
                        <ChevronUp className="mr-1 h-3 w-3" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-1 h-3 w-3" />
                        Show More
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-3 pt-2">
            {/* Enhancement CTA */}
            {hasMissingRequirements && onEnhanceSection && (
              <Button 
                onClick={() => onEnhanceSection?.(selectedSection)}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                Enhance
              </Button>
            )}

            {/* View Details Toggle */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="border-gray-300"
            >
              {detailsExpanded ? (
                <>
                  <ChevronUp className="mr-1 h-3 w-3" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-3 w-3" />
                  View Details
                </>
              )}
            </Button>
          </div>

          {/* Missing Requirements Indicator */}
          {hasMissingRequirements && (
            <div className="text-xs text-orange-600 bg-orange-50 rounded px-2 py-1 border border-orange-200">
              Some requirements missing • Enhancement recommended
            </div>
          )}

          {/* Selection Details */}
          {detailsExpanded && (
            <div className="border-t pt-4 mt-4">
              <div className="space-y-4">
                {/* Selection Rationale */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Why Selected</h5>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-3">{selectedSection.rationale}</p>
                </div>

                {/* Matched Requirements */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">
                    Requirement Matches ({selectedSection.matched_scored_pairs.length})
                  </h5>
                  <div className="space-y-3">
                    {selectedSection.matched_scored_pairs.map((pair, index) => (
                      <div key={index} className="bg-white border rounded-md p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{pair.cluster_name}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={pair.raw_score} className="w-16 h-2" />
                            <span className="text-xs font-medium text-gray-600 w-8">{Math.round(pair.raw_score)}%</span>
                          </div>
                        </div>

                        {/* Coverage/Missing */}
                        <div className="space-y-2">
                          {pair.coverage.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {pair.coverage.slice(0, 3).map((item: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  {item}
                                </Badge>
                              ))}
                              {pair.coverage.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{pair.coverage.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}

                          {pair.missing.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {pair.missing.slice(0, 2).map((item: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                  {item}
                                </Badge>
                              ))}
                              {pair.missing.length > 2 && (
                                <Badge variant="outline" className="text-xs text-red-600">
                                  +{pair.missing.length - 2} missing
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
