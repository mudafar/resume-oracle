import React from 'react';
import { FileText } from 'lucide-react';

interface HeroSectionProps {}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <>
      {/* Illustration */}
      <div className="w-32 h-32 mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center shadow-lg">
        <FileText className="w-16 h-16 text-blue-600" />
      </div>

      {/* Headline & Subtext */}
      <h1 className="text-3xl font-bold text-gray-900 max-w-xl">
        Let AI Craft Your Resume, the Right Way
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
        Just paste your resume, and we'll help you build a targeted, high-impact resume and cover letter for any job—No signup required!
      </p>
    </>
  );
};
