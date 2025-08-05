"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, ChevronDown, ChevronUp, Star, Target } from 'lucide-react';
import { SelectedSection } from "@/services/zodModels";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { generateTextPreview } from "@/utils/textPreview";

interface SelectedSectionCardProps {
  selectedSection: SelectedSection;
  profileSections: ProfileSection[];
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500 text-white';
    case 'important': return 'bg-orange-500 text-white';
    case 'nice_to_have': return 'bg-blue-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'critical': return '🔥';
    case 'important': return '⚡';
    case 'nice_to_have': return '✨';
    default: return '📋';
  }
};

export const SelectedSectionCard: React.FC<SelectedSectionCardProps> = ({ 
  selectedSection, 
  profileSections 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [clustersExpanded, setClustersExpanded] = useState(false);

  const profileSection = profileSections.find(ps => ps.id === selectedSection.section_id);
  
  const { preview, isExpandable } = profileSection
    ? generateTextPreview(profileSection.content)
    : { preview: "", isExpandable: false };

  const totalWeightedScore = Math.round(selectedSection.total_weighted_score);

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
              <h4 className="font-semibold text-lg">{selectedSection.section_title}</h4>
              <Badge variant="outline">{selectedSection.section_type}</Badge>
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

          {/* Selection Rationale */}
          <div className="bg-blue-50 rounded p-3">
            <h5 className="font-medium mb-1 text-blue-800">Why This Section Was Selected</h5>
            <p className="text-sm text-blue-700">{selectedSection.selection_rationale}</p>
          </div>

          {/* Matched Clusters */}
          <Collapsible open={clustersExpanded} onOpenChange={setClustersExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Matched Requirements ({selectedSection.matched_clusters.length})</span>
                {clustersExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3">
              {selectedSection.matched_clusters.map((cluster, index) => (
                <div key={index} className="border rounded p-3 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{getPriorityIcon(cluster.priority)}</span>
                      <h6 className="font-semibold">{cluster.cluster_name}</h6>
                      <Badge className={getPriorityColor(cluster.priority)}>
                        {cluster.priority.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{Math.round(cluster.weighted_score)} pts</div>
                      <div className="text-xs text-gray-500">
                        Raw: {Math.round(cluster.raw_score)}
                      </div>
                    </div>
                  </div>

                  {/* Coverage Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Score:</span>
                      <Progress value={cluster.raw_score} className="flex-1" />
                      <span className="text-sm">{Math.round(cluster.raw_score)}%</span>
                    </div>

                    {cluster.coverage.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-green-700">✓ Covered:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cluster.coverage.map((item, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-800">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {cluster.missing.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-orange-700">⚠ Missing:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cluster.missing.map((item, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {cluster.strength_indicators.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-blue-700">💪 Strengths:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cluster.strength_indicators.map((item, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};
