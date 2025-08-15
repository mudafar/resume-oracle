'use client'

import React from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { ProblemSolution } from './components/ProblemSolution';
import { CompetitiveAdvantage } from './components/CompetitiveAdvantage';
import { OpenSource } from './components/OpenSource';
import { CallToAction } from './components/CallToAction';
import { Privacy } from './components/Privacy';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FullBleedSection } from './components/FullBleedSection';
import { ProfileSectionImportAIModal } from '@/multiStepFlow/steps/profileSections/ProfileSectionsImportAIModal';
import { useDispatch } from 'react-redux';
import { addSection } from '@/store/slices/profileSectionsSlice';
import { setCurrentStep } from '@/store/slices/stepSlice';
import { openConfigModal } from '@/store/slices/llmConfigSlice';
import { useRouter } from 'next/navigation';
import { SettingsModalWrapper } from '@/multiStepFlow/settingsModal/SettingsModalWrapper';

export const Landing: React.FC = () => {
    const [importAIModalOpen, setImportAIModalOpen] = React.useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    function handleAnalyze() {
        setImportAIModalOpen(true);
    }
    function handleSkip() {
        router.push('/wizard');
    }
    function handleOpenSettings() {
         dispatch(openConfigModal());
    }

    return (
        <div className="min-h-screen bg-background overflow-x-clip animate-fade-in">
            <Header />
            
            <FullBleedSection id="hero">
                <HeroSection
                    onAnalyze={handleAnalyze}
                    onSkip={handleSkip}
                    onOpenSettings={handleOpenSettings}
                />
            </FullBleedSection>

            <FullBleedSection id="how-it-works" className="bg-muted/30">
                <HowItWorks />
            </FullBleedSection>

            <FullBleedSection id="features">
                <Features />
            </FullBleedSection>

            <FullBleedSection id="problem-solution" className="bg-muted/30">
                <ProblemSolution />
            </FullBleedSection>

            <FullBleedSection id="competitive-advantage">
                <CompetitiveAdvantage />
            </FullBleedSection>

            <FullBleedSection id="open-source" className="bg-slate-900 text-white">
                <OpenSource />
            </FullBleedSection>

            <FullBleedSection id="call-to-action" className="bg-muted/30">
                <CallToAction
                    onAnalyze={handleAnalyze}
                    onSkip={handleSkip}
                    onOpenSettings={handleOpenSettings}
                />
            </FullBleedSection>

            <FullBleedSection id="privacy" className="bg-green-50/50">
                <Privacy />
            </FullBleedSection>

            <FullBleedSection id="contact">
                <Contact />
            </FullBleedSection>

            <FullBleedSection className="bg-slate-900">
                <Footer />
            </FullBleedSection>

            {/* Modals */}
            <ProfileSectionImportAIModal
                open={importAIModalOpen}
                onClose={() => setImportAIModalOpen(false)}
                onImportAll={(sections) => {
                    sections.forEach(sec => dispatch(addSection(sec)));
                    setImportAIModalOpen(false);
                    dispatch(setCurrentStep(1));
                    router.push('/wizard');
                }}
                onToast={(msg, type = "success") => {
                    // TODO: Handle toast notification
                    console.log(msg, type);
                }}
            />

            <SettingsModalWrapper />
                
            <style jsx>{`    
                @keyframes fade-in {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.6s ease-out; }
                `}
            </style>
        </div>
    );
};
