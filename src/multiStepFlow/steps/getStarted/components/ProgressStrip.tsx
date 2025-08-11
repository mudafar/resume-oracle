import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ProgressStripProps {}

export const ProgressStrip: React.FC<ProgressStripProps> = () => {
  return (
    <div className="m-8 flex items-center gap-2 text-sm text-gray-500">
      <span className="font-medium text-blue-600"> • Extract</span>
      <ChevronRight className="w-4 h-4" />
      <span> • Match JD</span>
      <ChevronRight className="w-4 h-4" />
      <span> • Refine</span>
      <ChevronRight className="w-4 h-4" />
      <span> • Export</span>
    </div>
  );
};
