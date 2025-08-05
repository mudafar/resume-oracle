"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EnhancementTips: React.FC = () => {
  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-sm text-blue-700">Enhancement Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Describe relevant experience that addresses the missing requirements</p>
          <p>• Include specific technologies, tools, or methodologies</p>
          <p>• Add quantifiable results or outcomes when possible</p>
          <p>• Keep additions authentic to your actual experience</p>
        </div>
      </CardContent>
    </Card>
  );
};
