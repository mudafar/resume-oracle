import React from 'react';
import { Sparkles, FileText, Upload, CheckCircle, ArrowRight, Zap, Settings, Key, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDispatch } from "react-redux";
import { openConfigModal } from "@/store/slices/llmConfigSlice";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addSection, ProfileSection } from "@/store/slices/profileSectionsSlice";
import { ProfileSectionImportAIModal } from "../profileSections/ProfileSectionsImportAIModal";
import { useState } from "react";
import { setSections } from "@/store/slices/profileSectionsSlice";
import { useCallback } from "react";
import { createStep } from '@/utils/createStep';




const GetStarted: React.FC = () => {
    const dispatch = useDispatch();
    const sections = useSelector((state: RootState) => state.profileSections.sections);

    // Modal state for AI import
    const [importAIModalOpen, setImportAIModalOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");

    function onImportWithAI() {
      setImportAIModalOpen(true);
    }
    function onStartManually() {}

    // TODO add logic to pull from the store
    const settings = {
      hasInviteCode: false,
      hasCustomApiKey: false,
    }

    function openSettings() {
      dispatch(openConfigModal())
    }

    // Render the access status or nudge
    const renderAccessNudge = () => {
      if (settings.hasInviteCode || settings.hasCustomApiKey) {
        // Success state - clean status with subtle card
        return (
          <Card className="max-w-lg mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-green-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-4 text-sm">
                {settings.hasInviteCode && (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4"/>
                    <span className="font-medium">20 calls/min active</span>
                  </div>
                )}

                {settings.hasInviteCode && settings.hasCustomApiKey && (
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                )}

                {settings.hasCustomApiKey && (
                  <div className="flex items-center gap-2 text-blue-700">
                    <Key className="w-4 h-4"/>
                    <span className="font-medium">Premium AI active</span>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openSettings}
                  className="h-auto p-2 text-slate-600 hover:text-slate-900 hover:bg-white/50"
                >
                  <Settings className="w-3 h-3"/>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      } else {
        // Initial nudge - subtle but noticeable
        return (
          <div className="max-w-lg mx-auto">
            <div className="relative">
              {/* Subtle background glow */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl blur-sm opacity-60"></div>

              {/* Main content */}
              <Card
                className="relative bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-amber-500"/>
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
                            className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"/>
                          <span className="font-medium">Invitation code</span>
                          <ChevronRight className="w-3 h-3 opacity-60"/>
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
                            className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"/>
                          <span className="font-medium">Custom API key</span>
                          <ChevronRight className="w-3 h-3 opacity-60"/>
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
            </div>
          </div>
        );
      }
    };

    return (
      <div className="flex items-center justify-center p-6 min-h-[600px]">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          {/* Hero Illustration */}
          <div className="relative mb-8">
            <div
              className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center shadow-lg">
              <FileText className="w-16 h-16 text-blue-600"/>
              <div className="absolute -top-2 -right-2">
                <div
                  className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4 text-yellow-800"/>
                </div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Import your resume with <span className="text-blue-600">AI</span>
          </h1>

          {/* Subtext */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto">
            Paste your resume text and our AI will extract structured sections instantly.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button
              onClick={onImportWithAI}
              size="lg"
              className="px-8 py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse"/>
              Import with AI
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"/>
            </Button>
          </div>

          {/* Access Nudge / Status */}
          <div className="mb-8">
            {renderAccessNudge()}
          </div>

          {/* Checklist */}
          <Card className="max-w-md mx-auto mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4 text-left">You can use this if you
                have:</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0"/>
                  <span
                    className="text-muted-foreground">A resume in Word or PDF (just copy-paste)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0"/>
                  <span className="text-muted-foreground">Your LinkedIn profile content</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0"/>
                  <span className="text-muted-foreground">Exported sections from this app</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skip Option */}
          <Button
            onClick={onStartManually}
            variant="link"
            className="text-muted-foreground hover:text-foreground font-medium underline underline-offset-4"
          >
            Skip this and start manually
          </Button>
        </div>

        {/* ProfileSectionImportAIModal moved from ProfileSectionsStep */}
        <ProfileSectionImportAIModal
          open={importAIModalOpen}
          onClose={() => setImportAIModalOpen(false)}
          onImportSection={(section: ProfileSection) => dispatch(addSection(section))}
          onImportAll={(sectionsArr: ProfileSection[]) => sectionsArr.forEach(section => dispatch(addSection(section)))}
          onToast={(msg, type = "success") => {
            setToastMessage(msg);
            setToastType(type);
            setToastOpen(true);
          }}
        />

        {/* Toast for feedback (optional, if you want to show feedback here) */}
        {/*
        <Toast
          open={toastOpen}
          message={toastMessage}
          type={toastType}
          onClose={() => setToastOpen(false)}
        />
        */}

        <style jsx>{`
            @keyframes fade-in {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .animate-fade-in {
                animation: fade-in 0.6s ease-out;
            }
        `}</style>
      </div>
    );
  };



  export const GetStartedStep = createStep({
  id: "get-started",
  label: "Get Started",
  description: "See a quick preview of how AI will structure your resume."
})(GetStarted);