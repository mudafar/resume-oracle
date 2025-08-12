import React from "react";
import { StepDefinition } from "@/types/multiStepFlow/step.types";

import {
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LeftSidebarLayout } from "./LeftSidebarLayout";
import { MainLayout } from "./MainLayout";
import { AppIcon } from "./AppIcon";


interface AppLayout {
  steps: StepDefinition[];
  currentStep: number;
  onStepChange: (step: number) => void;
  children: React.ReactNode;
  appName?: string;
  appIcon?: React.ReactNode;
}

export const Layout: React.FC<AppLayout> = ({
    steps,
    currentStep,
    onStepChange,
    children,
    appName = "Resume Oracle",
    appIcon = <AppIcon size={32} className="" />
  }) => {
    const isFirst = currentStep === 0;
    const isLast = currentStep === steps.length - 1;
    const currentStepData = steps[currentStep];
  
    return (
      <TooltipProvider delayDuration={300}>
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <LeftSidebarLayout
              steps={steps}
              currentStep={currentStep}
              onStepChange={onStepChange}
              appName={appName}
              appIcon={appIcon}
            />
            
            {/* Main Content */}
            <MainLayout
              steps={steps}
              currentStep={currentStep}
              onStepChange={onStepChange}
              isFirst={isFirst}
              isLast={isLast}
              currentStepData={currentStepData}
            >
              {children}
            </MainLayout>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    );
  };