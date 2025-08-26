import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ScoredPair } from "@/schemas/matching";
import type { ProfileSection } from "@/schemas/profile";
import type { RequirementCluster } from "@/schemas/job";

interface RawMatchingResultsProps {
  matchScoredPairs?: any; // Allow any type since the actual LLM response structure may vary
  requirementClusters: RequirementCluster[];
  profileSections: ProfileSection[];
  isMatching: boolean;
}

export const RawMatchingResults: React.FC<RawMatchingResultsProps> = ({
  matchScoredPairs: matchScoredPairs,
  requirementClusters,
  profileSections,
  isMatching
}) => {
  if (!matchScoredPairs?.scored_pairs?.length && !isMatching) {
    return null;
  }

  const scoredPairs = matchScoredPairs?.scored_pairs || [];
  
  // Group pairs by section for display
  const pairsBySection = scoredPairs.reduce((acc: Record<string, any[]>, pair: any) => {
    if (!acc[pair.section_id]) {
      acc[pair.section_id] = [];
    }
    acc[pair.section_id].push(pair);
    return acc;
  }, {} as Record<string, any[]>);

  const getProfileSectionTitle = (sectionId: string) => {
    const section = profileSections.find(ps => ps.id === sectionId);
    return section ? `${section.type}: ${section.content.slice(0, 50)}...` : `Section ${sectionId}`;
  };

  const getClusterName = (clusterId: string) => {
    const cluster = requirementClusters.find(c => c.id === clusterId);
    return cluster?.cluster_name || `Cluster ${clusterId}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎯 Raw Matching Scores
          {isMatching && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Analyzing matches...
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Found {scoredPairs.length} potential matches across {Object.keys(pairsBySection).length} profile sections
          </div>
          
          {Object.entries(pairsBySection).slice(0, 5).map(([sectionId, pairs]) => (
            <div key={sectionId} className="border rounded-lg p-4">
              <h4 className="font-medium text-sm mb-3">
                {getProfileSectionTitle(sectionId)}
              </h4>
              
              <div className="space-y-2">
                {(pairs as any[]).slice(0, 3).map((pair: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">
                        {getClusterName(pair.cluster_id)}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {pair.evidence?.slice(0, 80)}...
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <div className="w-16">
                        <Progress 
                          value={pair.raw_score} 
                          className="h-2"
                        />
                      </div>
                      <div className="text-xs font-mono w-8 text-right">
                        {Math.round(pair.raw_score)}
                      </div>
                    </div>
                  </div>
                ))}
                {(pairs as any[]).length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    + {(pairs as any[]).length - 3} more matches
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {Object.keys(pairsBySection).length > 5 && (
            <div className="text-xs text-muted-foreground text-center">
              + {Object.keys(pairsBySection).length - 5} more profile sections with matches
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
