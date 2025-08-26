import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RequirementCluster } from "@/schemas/job";

interface ExtractedRequirementsProps {
  requirementClusters: RequirementCluster[];
  isExtracting: boolean;
}

export const ExtractedRequirements: React.FC<ExtractedRequirementsProps> = ({
  requirementClusters,
  isExtracting
}) => {
  if (!requirementClusters.length && !isExtracting) {
    return null;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "destructive";
      case "important": return "default";
      case "nice_to_have": return "secondary";
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📋 Extracted Job Requirements
          {isExtracting && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Extracting...
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requirementClusters.map((cluster, index) => (
            <div key={cluster?.id || index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm">{cluster?.cluster_name}</h4>
                <Badge variant={getPriorityColor(cluster?.priority_tier)}>
                  {cluster?.priority_tier}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {cluster?.rationale}
              </p>
              
              <div className="space-y-1">
                {cluster?.requirements?.slice(0, 3).map((req, reqIndex) => (
                  <div key={reqIndex} className="text-xs text-muted-foreground">
                    • {req}
                  </div>
                ))}
                {cluster?.requirements?.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    + {cluster?.requirements.length - 3} more requirements
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
