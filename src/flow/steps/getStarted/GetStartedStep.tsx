import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Zap,
  ArrowRight,
  Settings,
  Key,
  ChevronRight,
  Ticket,
  User,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { openConfigModal } from '@/store/slices/llmConfigSlice';
import { setCurrentStep } from '@/store/slices/stepSlice';
import { createStep } from '@/utils/createStep';
import { ProfileSectionImportAIModal } from '../profileSections/ProfileSectionsImportAIModal';
import { addSection } from '@/store/slices/profileSectionsSlice';

const GetStarted: React.FC = () => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.llmConfig);
  const [importAIModalOpen, setImportAIModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // if (!localStorage.getItem('hideOnboardingTooltip')) {
      const timer = setTimeout(() => setShowTooltip(true), 500);
      // return () => clearTimeout(timer);
    // }
  }, []);

  const handleAnalyze = () => {
    setImportAIModalOpen(true);
    setShowTooltip(false);
    // localStorage.setItem('hideOnboardingTooltip', 'true');
  };

  // Move to next step (step 1) after import or skip
  const handleSkip = () => {
    dispatch(setCurrentStep(1));
  };
  const openSettings = () => dispatch(openConfigModal());

  const hasInvite = Boolean(config.invitationCode);
  const hasKey = Boolean(config.apiKey);
  const accessText = hasKey
    ? 'Premium AI Active'
    : hasInvite
      ? 'Invitation Code Active'
      : 'Guest • 5 calls/hr';
  const accessStyle = hasKey
    ? 'bg-purple-50 text-purple-700 border-purple-200'
    : hasInvite
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <div className="relative p-6 min-h-[600px] flex flex-col items-center text-center animate-fade-in">
      {/* Access Badge */}
      {/* TODO: move to the left side bar? */}
      <button
        onClick={openSettings}
        className={`absolute top-4 right-4 flex items-center gap-1 text-xs font-medium px-2 py-0.5 border rounded-full hover:bg-opacity-80 transition ${accessStyle}`}
      >
        {hasKey ? <User className="w-4 h-4" /> : <Key className="w-4 h-4" />} {accessText}
      </button>

      {/* Illustration */}
      <div className="w-32 h-32 mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center shadow-lg">
        <FileText className="w-16 h-16 text-blue-600" />
      </div>

      {/* Headline & Subtext */}
      <h1 className="text-3xl font-bold text-gray-900 max-w-xl">
        Let AI Craft Your Resume, the Right Way
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
        Just paste your resume, and we’ll help you build a targeted, high-impact resume and cover letter for any job—No signup required!
      </p>

      {/* CTA + Tooltip */}
      <div className="mt-8 relative">
        <Button onClick={handleAnalyze} size="lg" className="px-8 py-4 shadow-lg hover:shadow-xl transition transform hover:scale-105 group">
          <Zap className="w-5 h-5 mr-2 animate-pulse" /> Import with AI
          <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition" />
        </Button>
        {/* {showTooltip && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap animate-fade-in">
            Click to get started—no registration needed!
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )} */}

        <button onClick={handleSkip} className="mt-4 ml-4 text-sm text-muted-foreground hover:text-foreground underline">
          Skip and start manually
        </button>
      </div>


      {/* Progress Strip */}
      <div className="m-8 flex items-center gap-2 text-sm text-gray-500">
        <span className="font-medium text-blue-600"> • Extract</span>
        <ChevronRight className="w-4 h-4" />
        <span> • Match JD</span>
        <ChevronRight className="w-4 h-4" />
        <span> • Refine</span>
        <ChevronRight className="w-4 h-4" />
        <span> • Export</span>
      </div>



      {/* Premium AI Benefits */}
      {!hasInvite && !hasKey && (
        <Card
          className="relative m-4 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span
                  className="text-sm font-medium text-slate-700">Unlock more access</span>
              </div>

              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
                <button
                  onClick={openSettings}
                  className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  aria-label="Enter invitation code to unlock twenty calls per minute"
                >
                  <div className="flex items-center gap-1.5">
                    <Key
                      className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Invitation code</span>
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  </div>
                  <span
                    className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    20x faster
                  </span>
                </button>

                <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>

                <button
                  onClick={openSettings}
                  className="group flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                  aria-label="Provide your API key for better AI performance"
                >
                  <div className="flex items-center gap-1.5">
                    <Zap
                      className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Custom API key</span>
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  </div>
                  <span
                    className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    Premium AI
                  </span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}



      {/* Checklist */}
      <Card className="max-w-md mx-auto mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4 text-left">You can use this if you
            have:</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span
                className="text-muted-foreground">A resume in Word or PDF (just copy-paste)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-muted-foreground">Your LinkedIn profile content</span>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* AI Import Modal */}
      <ProfileSectionImportAIModal
        open={importAIModalOpen}
        onClose={() => setImportAIModalOpen(false)}
        onImportAll={(sections) => {
          sections.forEach(sec => dispatch(addSection(sec)));
          setImportAIModalOpen(false);
          dispatch(setCurrentStep(1));
        }}
        onToast={(msg, type = "success") => {
          // TODO: Handle toast notification
          console.log(msg, type);
        }}
      />
    </div>
  );
};

export const GetStartedStep = createStep({
  id: 'get-started',
  label: 'Get Started',
  description: 'Start your journey to a stronger, job-focused resume and cover letter.'
})(GetStarted);

// Animations
<style jsx>{`    
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in { animation: fade-in 0.6s ease-out; }
`}</style>
