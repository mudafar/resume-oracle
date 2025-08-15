import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, ShieldCheck, Code, UserX, Key } from 'lucide-react';
import { ResumeOracleIcon } from '@/multiStepFlow/ResumeOracleIcon';

interface HeroSectionProps {
  onAnalyze: () => void;
  onSkip: () => void;
  onOpenSettings: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAnalyze,
  onSkip,
  onOpenSettings
}) => {
  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className=" rounded-2xl flex items-center justify-center">
              <ResumeOracleIcon size={148} className="" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Let AI Craft Your Resume,{' '}
          <span className="text-primary">the Right Way</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
          Just paste your resume, and we'll help you build a targeted, high-impact resume
          and cover letter for any job—No signup required!
        </p>

        {/* Badges */}
        {/* <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <span>Privacy-First</span>
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <span>Open Source</span>
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
            <UserX className="h-4 w-4 text-muted-foreground" />
            <span>No Signup</span>
          </Badge>
        </div> */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            size="lg"
            onClick={onAnalyze}
            className="px-8 py-3 text-lg font-semibold"
          >
            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
            Import with AI
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            variant="link"
            size="lg"
            onClick={onSkip}
            className="px-2 py-3 text-sm text-muted-foreground hover:text-foreground underline"
          >
            Skip and start manually
          </Button>
        </div>

        {/* Free Mode Banner */}
        <div className="inline-flex items-center m-4 text-sm text-slate-600 bg-purple-50 border border-purple-200 px-4 py-2 rounded-md justify-between">
          <span>
            FREE mode — 5 requests/minute.{" "}
            <Button
              variant="link"
              size="sm"
              className="text-purple-700"
              onClick={onOpenSettings}
            >
              <Key className="w-4 h-4 inline-block mr-1" />
              Use your own API key for premium AI
            </Button>
          </span>
        </div>


      </div>
    </section>
  );
};
// import React from 'react';
// import { FileText } from 'lucide-react';
// import { ResumeOracleIcon } from '@/multiStepFlow/ResumeOracleIcon';

// interface HeroSectionProps {}

// export const HeroSection: React.FC<HeroSectionProps> = () => {
//   return (
//     <>
//       {/* Illustration */}
//       <div className="mb-4 flex items-center justify-center">
//         <ResumeOracleIcon size={196} className='' />
//       </div>

//       {/* Headline & Subtext */}
//       <h1 className="text-3xl font-bold text-gray-900 max-w-xl">
//         Let AI Craft Your Resume, the Right Way
//       </h1>
//       <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
//         Just paste your resume, and we'll help you build a targeted, high-impact resume and cover letter for any job—No signup required!
//       </p>
//     </>
//   );
// };
