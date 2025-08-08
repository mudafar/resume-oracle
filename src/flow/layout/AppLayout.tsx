import React, { useState } from "react";
import { StepDefinition } from "@/types/flow/step.types";
import {
  ScrollText
} from "lucide-react";

import {
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LeftSidebar } from "./LeftSidebar";
import { MultiStepLayout } from "./MultiStepLayout";


interface AppLayout {
  steps: StepDefinition[];
  currentStep: number;
  onStepChange: (step: number) => void;
  children: React.ReactNode;
  appName?: string;
  appIcon?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayout> = ({
    steps,
    currentStep,
    onStepChange,
    children,
    appName = "Resume Oracle",
    appIcon = <ScrollText className="w-6 h-6" />
  }) => {
    const isFirst = currentStep === 0;
    const isLast = currentStep === steps.length - 1;
    const currentStepData = steps[currentStep];
  
    return (
      <TooltipProvider delayDuration={300}>
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <LeftSidebar
              steps={steps}
              currentStep={currentStep}
              onStepChange={onStepChange}
              appName={appName}
              appIcon={appIcon}
            />
            
            {/* Main Content */}
            <MultiStepLayout
              steps={steps}
              currentStep={currentStep}
              onStepChange={onStepChange}
              isFirst={isFirst}
              isLast={isLast}
              currentStepData={currentStepData}
            >
              {children}
            </MultiStepLayout>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    );
  };