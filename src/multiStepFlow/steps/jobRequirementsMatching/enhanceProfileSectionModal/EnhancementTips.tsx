"use client";
import React from "react";
import { Lightbulb } from 'lucide-react';

export const EnhancementTips: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-blue-600" />
        <h3 className="font-semibold text-sm text-blue-700">Enhancement Tips</h3>
      </div>
      
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>• Describe relevant experience that addresses the missing requirements</p>
        <p>• Include specific technologies, tools, or methodologies</p>
        <p>• Add quantifiable results or outcomes when possible</p>
        <p>• Keep additions authentic to your actual experience</p>
      </div>
    </div>
  );
};
