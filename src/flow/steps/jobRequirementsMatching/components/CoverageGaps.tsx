import React from "react";
import { CoverageGap } from "@/services/zodModels";
import { CoverageGapCard } from "../CoverageGapCard";

interface CoverageGapsProps {
  coverageGaps: CoverageGap[];
  onSeeSuggestions: (clusterName: string, gapId: string) => void;
  onFillGap: (gap: CoverageGap) => void;
}

export const CoverageGaps: React.FC<CoverageGapsProps> = ({
  coverageGaps,
  onSeeSuggestions,
  onFillGap
}) => {
  if (!coverageGaps || coverageGaps.length === 0) {
    return (
      <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
        <div className="text-green-600 text-lg font-semibold mb-2">
          🎉 All Coverage Gaps Addressed!
        </div>
        <p className="text-green-700 text-sm">
          You've successfully filled all identified gaps. Your profile now better matches the job requirements.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Coverage Gaps</h2>
      <p className="text-gray-600 text-sm">
        These job requirements need attention to strengthen your application.
      </p>
      
      {coverageGaps.map((gap) => (
        <CoverageGapCard
          key={gap.id}
          gap={gap}
          onSeeSuggestions={onSeeSuggestions}
          onFillGap={onFillGap}
        />
      ))}
    </div>
  );
};
