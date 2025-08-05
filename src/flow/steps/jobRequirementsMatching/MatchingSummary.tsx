"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { HybridSelectionResult } from "@/services/zodModels";

interface MatchingSummaryProps {
  result: HybridSelectionResult;
}

export const MatchingSummary: React.FC<MatchingSummaryProps> = ({ result }) => {
  const { summary } = result;

  if (!summary) {
    return (
        <Card className="bg-gray-50">
            <CardHeader>
                <CardTitle>No Matching Summary Available</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Please ensure your profile is complete and try again.</p>
            </CardContent>
        </Card>
    );
  }

  const criticalCoveragePercentage = summary.critical_clusters_total > 0
    ? (summary.critical_clusters_covered / summary.critical_clusters_total) * 100
    : 100;
    
  const importantCoveragePercentage = summary.important_clusters_total > 0 
    ? (summary.important_clusters_covered / summary.important_clusters_total) * 100 
    : 100;

  const overallCoverageValue = parseInt(summary.overall_coverage.replace('%', ''));

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCoverageIcon = (percentage: number) => {
    if (percentage >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (percentage >= 60) return <Target className="h-5 w-5 text-yellow-500" />;
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <BarChart3 className="mr-2 h-6 w-6 text-blue-600" />
          Matching Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Overall Coverage */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {getCoverageIcon(overallCoverageValue)}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {summary.overall_coverage}
            </div>
            <div className="text-sm text-gray-600">Overall Coverage</div>
            <Progress value={overallCoverageValue} className="mt-2" />
          </div>

          {/* Critical Requirements */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-red-100 rounded-full">
                <Target className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">
              <span className={getCoverageColor(criticalCoveragePercentage)}>
                {summary.critical_clusters_covered}
              </span>
              <span className="text-gray-400">/{summary.critical_clusters_total}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">Critical Requirements</div>
            <Progress value={criticalCoveragePercentage} className="mt-2" />
            {summary.critical_gaps > 0 && (
              <Badge variant="destructive" className="mt-2 text-xs">
                {summary.critical_gaps} gaps
              </Badge>
            )}
          </div>

          {/* Important Requirements */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">
              <span className={getCoverageColor(importantCoveragePercentage)}>
                {summary.important_clusters_covered}
              </span>
              <span className="text-gray-400">/{summary.important_clusters_total}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">Important Requirements</div>
            <Progress value={importantCoveragePercentage} className="mt-2" />
          </div>

          {/* Profile Sections Used */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {summary.profile_sections_used}
            </div>
            <div className="text-sm text-gray-600">Profile Sections Used</div>
            <div className="text-xs text-gray-500 mt-1">
              Optimal for resume space
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <div className="mt-6 space-y-2">
          {summary.critical_gaps === 0 ? (
            <div className="flex items-center text-green-700 bg-green-50 p-3 rounded">
              <CheckCircle className="mr-2 h-4 w-4" />
              <span className="text-sm">All critical requirements are covered!</span>
            </div>
          ) : (
            <div className="flex items-center text-red-700 bg-red-50 p-3 rounded">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span className="text-sm">
                {summary.critical_gaps} critical requirement{summary.critical_gaps > 1 ? 's' : ''} need{summary.critical_gaps === 1 ? 's' : ''} attention
              </span>
            </div>
          )}

          {overallCoverageValue >= 80 ? (
            <div className="flex items-center text-blue-700 bg-blue-50 p-3 rounded">
              <Target className="mr-2 h-4 w-4" />
              <span className="text-sm">Excellent coverage! Your profile strongly matches this job.</span>
            </div>
          ) : overallCoverageValue >= 60 ? (
            <div className="flex items-center text-yellow-700 bg-yellow-50 p-3 rounded">
              <Target className="mr-2 h-4 w-4" />
              <span className="text-sm">Good coverage with room for improvement in some areas.</span>
            </div>
          ) : (
            <div className="flex items-center text-orange-700 bg-orange-50 p-3 rounded">
              <Target className="mr-2 h-4 w-4" />
              <span className="text-sm">Consider enhancing your profile to better match job requirements.</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
