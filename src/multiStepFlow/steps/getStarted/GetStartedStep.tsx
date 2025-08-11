import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openConfigModal } from '@/store/slices/llmConfigSlice';
import { setCurrentStep } from '@/store/slices/stepSlice';
import { createStep } from '@/utils/createStep';
import { ProfileSectionImportAIModal } from '../profileSections/ProfileSectionsImportAIModal';
import { addSection } from '@/store/slices/profileSectionsSlice';
import {
  HeroSection,
  ActionButtons,
  ProgressStrip,
  FreeModeBanner,
  RequirementsChecklist
} from './components';

const GetStarted: React.FC = () => {
  const dispatch = useDispatch();
  const [importAIModalOpen, setImportAIModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAnalyze = () => {
    setImportAIModalOpen(true);
    setShowTooltip(false);
  };

  const handleSkip = () => {
    dispatch(setCurrentStep(1));
  };

  const openSettings = () => dispatch(openConfigModal());

  return (
    <div className="relative p-6 min-h-[600px] flex flex-col items-center text-center animate-fade-in">
      <HeroSection />
      
      <ActionButtons onAnalyze={handleAnalyze} onSkip={handleSkip} />
      
      <ProgressStrip />
      
      <FreeModeBanner onOpenSettings={openSettings} />
      
      <RequirementsChecklist />

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
      <style jsx>{`    
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export const GetStartedStep = createStep({
  id: 'get-started',
  label: 'Get Started',
  description: 'Start your journey to a stronger, job-focused resume and cover letter.'
})(GetStarted);
