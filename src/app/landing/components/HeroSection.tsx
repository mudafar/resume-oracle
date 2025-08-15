import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, ArrowRight, Key } from 'lucide-react';
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
            <div className="rounded-2xl flex items-center justify-center">
              <ResumeOracleIcon size={148} className="" />
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Discover Skills You{' '}
          <span className="text-primary">Forgot You Had</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-4xl mx-auto leading-relaxed font-medium italic">
          AI-powered job description analysis that uncovers hidden requirements and matches them to your forgotten experiences
        </p>

        {/* Supporting Copy */}
        <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
          Stop losing opportunities because your resume doesn't show what you're actually capable of. Resume Oracle finds the relevant skills buried in your background and creates targeted resumes that get noticed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            size="lg"
            onClick={onAnalyze}
            className="px-8 py-3 text-lg font-semibold"
          >
            <Upload className="mr-2 h-5 w-5" />
            Import Your Current Resume
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            variant="link"
            size="lg"
            onClick={onSkip}
            className="px-2 py-3 text-sm text-muted-foreground hover:text-foreground underline"
          >
            Start Fresh Instead
          </Button>
        </div>

        {/* Free Mode Banner */}
        <div className="inline-flex items-center m-4 text-sm text-slate-600 bg-purple-50 border border-purple-200 px-4 py-2 rounded-md justify-between">
          <span>
            <strong>FREE Mode Active</strong> — Limited Gemini Flash for testing •{" "}
            <Button
              variant="link"
              size="sm"
              className="text-purple-700 p-0 h-auto"
              onClick={onOpenSettings}
            >
              <Key className="w-4 h-4 inline-block mr-1" />
              Use your API key for full power
            </Button>
          </span>
        </div>
      </div>
    </section>
  );
};
