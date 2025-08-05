"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, XCircle, Target, Sparkles } from 'lucide-react';
import { CoverageGap } from "@/services/zodModels";

interface CoverageGapCardProps {
  gap: CoverageGap;
  onSeeSuggestions: (clusterName: string, gapId: string) => void;
  gapId: string;
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

const getGapTypeLabel = (gapType: string) => {
  switch (gapType) {
    case 'no_match': return 'No Match Found';
    case 'below_threshold': return 'Below Threshold';
    case 'covered': return 'Covered';
    default: return 'Unknown';
  }
};

export const CoverageGapCard: React.FC<CoverageGapCardProps> = ({ 
  gap, 
  onSeeSuggestions, 
  gapId 
}) => {
  const scorePercentage = gap.best_available_score ? 
    Math.min(100, (gap.best_available_score / gap.threshold_needed) * 100) : 0;

  return (
    <Card className="border-l-4 border-red-500 bg-red-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            {getGapTypeIcon(gap.gap_type)}
            <span className="ml-2">Coverage Gap</span>
          </div>
          <Badge className={getPriorityColor(gap.priority)}>
            {gap.priority.replace('_', ' ').toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg">{gap.cluster_name}</h4>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{getGapTypeLabel(gap.gap_type)}</Badge>
            </div>
          </div>

          {gap.best_available_score !== null && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Best Available Score</span>
                <span className="text-sm">{gap.best_available_score}/{gap.threshold_needed}</span>
              </div>
              <Progress value={scorePercentage} className="w-full" />
              <p className="text-xs text-gray-600 mt-1">
                {scorePercentage.toFixed(1)}% of required threshold
              </p>
            </div>
          )}

          <div>
            <h5 className="font-medium mb-2">Recommendations</h5>
            <p className="text-gray-700 text-sm">{gap.recommendations}</p>
          </div>

          <div>
            <h5 className="font-medium mb-2">Requirements</h5>
            {(gap.requirements ?? []).length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {(gap.requirements ?? []).map((requirement, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 text-gray-800">
                    {requirement}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No specific requirements listed.</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => onSeeSuggestions(gap.cluster_name, gapId)}
              size="sm"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              See Suggestions
            </Button>
            <Button variant="ghost" size="sm">
              Skip for Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
