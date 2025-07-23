import React, { useState } from "react";
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';

interface OptimizationSummaryCardProps {
  optimizationSummary: string | null;
  badgeLabel?: string;
}

export const OptimizationSummaryCard: React.FC<OptimizationSummaryCardProps> = ({
  optimizationSummary,
  badgeLabel = 'AI Analysis',
}) => {
  const [showSummary, setShowSummary] = useState(true);
  if (!optimizationSummary) return null;
  return (
    <Card className="border-blue-200">
      <CardContent className="p-0">
        <Collapsible open={showSummary} onOpenChange={setShowSummary}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Optimization Summary</span>
                <Badge variant="secondary" className="ml-2">
                  {badgeLabel}
                </Badge>
              </div>
              {showSummary ? (
                <ChevronDown className="h-4 w-4 text-blue-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-blue-600" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 pt-0">
              <Separator className="mb-4" />
              <div className="text-blue-800 text-sm whitespace-pre-line bg-blue-50 p-3 rounded-md">
                {optimizationSummary}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}; 