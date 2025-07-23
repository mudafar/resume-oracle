import React from "react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

interface OptimizationSummaryAlertProps {
  optimizationSummary: string;
}

export const OptimizationSummaryAlert: React.FC<OptimizationSummaryAlertProps> = ({ optimizationSummary }) => {
  if (!optimizationSummary) return null;
  return (
    <Alert className="border-blue-200 bg-blue-50">
      <CheckCircle className="h-4 w-4 text-blue-600" />
      <AlertDescription>
        <div className="space-y-1">
          <p className="font-medium text-blue-900">Optimization Summary</p>
          <p className="text-blue-800 text-sm">{optimizationSummary}</p>
        </div>
      </AlertDescription>
    </Alert>
  );
}; 