import React from 'react';
import { FileText } from 'lucide-react';
import { ResumeOracleIcon } from '@/multiStepFlow/ResumeOracleIcon';

interface HeroSectionProps {}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <>
      {/* Illustration */}
      <div className="mb-4 flex items-center justify-center">
        <ResumeOracleIcon size={196} className='' />
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
