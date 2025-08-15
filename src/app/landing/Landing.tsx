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
            
            {/* Hero - Clean start with subtle gradient */}
            <FullBleedSection id="hero" className="bg-gradient-to-b from-background to-slate-50/50">
                <HeroSection
                    onAnalyze={handleAnalyze}
                    onSkip={handleSkip}
                    onOpenSettings={handleOpenSettings}
                />
            </FullBleedSection>

            {/* How It Works - Soft blue gradient for process explanation */}
            <FullBleedSection id="how-it-works" className="bg-gradient-to-b from-blue-50/30 to-blue-100/40">
                <HowItWorks />
            </FullBleedSection>

            {/* Features - Light with subtle accent */}
            <FullBleedSection id="features" className="bg-gradient-to-b from-slate-50/50 to-purple-50/30">
                <Features />
            </FullBleedSection>

            {/* Problem Solution - Warm attention-grabbing gradient */}
            <FullBleedSection id="problem-solution" className="bg-gradient-to-b from-orange-50/40 to-red-50/30">
                <ProblemSolution />
            </FullBleedSection>

            {/* Competitive Advantage - Professional blue tone */}
            <FullBleedSection id="competitive-advantage" className="bg-gradient-to-b from-indigo-50/50 to-blue-50/40">
                <CompetitiveAdvantage />
            </FullBleedSection>

            {/* Open Source - Bold dark with gradient */}
            <FullBleedSection id="open-source" className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
                <OpenSource />
            </FullBleedSection>

            {/* Call to Action - Primary brand gradient */}
            <FullBleedSection id="call-to-action" className="bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5">
                <CallToAction
                    onAnalyze={handleAnalyze}
                    onSkip={handleSkip}
                    onOpenSettings={handleOpenSettings}
                />
            </FullBleedSection>

            {/* Privacy - Trust-building green gradient */}
            <FullBleedSection id="privacy" className="bg-gradient-to-b from-emerald-50/60 to-green-50/50">
                <Privacy />
            </FullBleedSection>

            {/* Contact - Neutral transition to footer */}
            <FullBleedSection id="contact" className="bg-gradient-to-b from-slate-50/40 to-slate-100/50">
                <Contact />
            </FullBleedSection>

            {/* Footer - Deep dark with subtle gradient */}
            <FullBleedSection className="bg-gradient-to-b from-slate-900 to-slate-950">
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
                
            <style>{`    
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
