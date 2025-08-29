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
    case 'no_match': return <XCircle className="h-5 w-5 text-red-500" />;
    case 'below_threshold': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case 'covered': return <Target className="h-5 w-5 text-green-500" />;
    default: return <AlertTriangle className="h-5 w-5 text-gray-500" />;
  }
};

export const GapContextPanel: React.FC<GapContextPanelProps> = ({ gap }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex-shrink-0 mt-0.5">
          {getGapTypeIcon(gap.gap_type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 leading-tight">
            {gap.requirement_cluster.cluster_name}
          </h3>
          <Badge className={`${getPriorityColor(gap.requirement_cluster.priority_tier)} mt-2`}>
            {gap.requirement_cluster.priority_tier.replaceAll('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Requirements</h4>
        <ul className="space-y-1.5">
          {gap.requirement_cluster.requirements && gap.requirement_cluster.requirements.length > 0 ? (
            gap.requirement_cluster.requirements.map((req: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                <span className="leading-relaxed">{req}</span>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-400 italic">No specific requirements listed</li>
          )}
        </ul>
      </div>

      {/* Rationale */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Why this matters</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {gap.requirement_cluster.rationale}
        </p>
      </div>
    </div>
  );
};
