"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CoverageGap } from "@/schemas/matching";
import { AlertTriangle, XCircle, Target } from "lucide-react";

interface GapContextPanelProps {
  gap: CoverageGap;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500 text-white';
    case 'important': return 'bg-orange-500 text-white';
    case 'nice_to_have': return 'bg-blue-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getGapTypeIcon = (gapType: string) => {
  switch (gapType) {
    case 'no_match': return <XCircle className="h-4 w-4 text-red-500" />;
    case 'below_threshold': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'covered': return <Target className="h-4 w-4 text-green-500" />;
    default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
  }
};

export const GapContextPanel: React.FC<GapContextPanelProps> = ({ gap }) => {
  return (
    <div className="space-y-4 h-full">
      <Card className="border-l-4 border-red-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getGapTypeIcon(gap.gap_type)}
              <CardTitle className="text-lg">{gap.requirement_cluster.cluster_name}</CardTitle>
            </div>
            <Badge className={getPriorityColor(gap.requirement_cluster.priority_tier)}>
              {gap.requirement_cluster.priority_tier.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Requirements in this cluster */}
          <div>
            <h4 className="font-semibold text-sm mb-2 text-red-700">Requirements in this cluster</h4>
            <ul className="space-y-1">
              {gap.requirement_cluster.requirements && gap.requirement_cluster.requirements.length > 0 ? (
                gap.requirement_cluster.requirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500 italic">No specific requirements listed</li>
              )}
            </ul>
          </div>

          {/* Rationale */}
          <div>
            <h4 className="font-semibold text-sm mb-2 text-blue-700">Rationale</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {gap.requirement_cluster.rationale}
            </p>
          </div>

          {/* Gap Type */}
          <div>
            <h4 className="font-semibold text-sm mb-2 text-gray-700">Gap Type</h4>
            <p className="text-sm text-gray-600">
              {gap.gap_type === 'no_match' && 'No matching profile section found for these requirements'}
              {gap.gap_type === 'below_threshold' && 'Found profile sections but they don\'t meet the minimum threshold'}
              {gap.gap_type === 'covered' && 'Requirements are covered by existing profile sections'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
