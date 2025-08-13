import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollToTop } from "@/hooks/useScrollToTop";

interface MultiStepLayoutProps {
  steps: any[];
  currentStep: number;
  onStepChange: (step: number) => void;
  isFirst: boolean;
  isLast: boolean;
  currentStepData: any;
  children?: React.ReactNode;
}

interface StepFallbackProps {
  currentStepData: { label?: string; description?: string; icon?: React.ReactNode };
}


const StepFallback: React.FC<StepFallbackProps> = ({ currentStepData }) => {
  return (
    <div className="bg-card rounded-lg border p-8 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        {currentStepData.icon || <FileText className="w-8 h-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold mb-2">
        Welcome to {currentStepData.label}
      </h3>
      <p className="text-muted-foreground mb-6">
        {currentStepData.description || "This is where your content will appear."}
      </p>
      <div className="flex justify-center gap-3">
        <Button variant="outline" size="sm">
          Learn More
        </Button>
        <Button size="sm">
          Get Started
        </Button>
      </div>
    </div>
  )
}

export const MainLayout: React.FC<MultiStepLayoutProps> = ({
  steps,
  currentStep,
  onStepChange,
  isFirst,
  isLast,
  currentStepData,
  children,
}) => {
  const mainContentDivRef = React.useRef<HTMLDivElement>(null);
  // Scroll to top when currentStep changes
  useScrollToTop(mainContentDivRef, currentStep, { behavior: "smooth" });

  return (
    <div className="flex-1 flex flex-col min-w-0 ">
      {/* Header */}
      <header className="flex h-8 shrink-0 items-center px-4">
        {/* SidebarTrigger should be rendered by parent if needed */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold">
                {currentStepData.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-xs">
              Step {currentStep + 1} of {steps.length}
            </Badge>
            <div className="w-24 bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Description Bar */}
      {currentStepData.description && (
        <div className="border-b bg-muted/30 px-4">
          <p className="text-md text-muted-foreground">
            {currentStepData.description}
          </p>
        </div>
      )}


      {/* Main Content Area */}
      {/* Make the scroll container full-width so the scrollbar sits at the browser edge */}
      <main className="flex-1 overflow-auto" ref={mainContentDivRef}>
        {/* Keep the content centered and constrained inside the scrolling area */}
        <div className="mx-auto w-full max-w-5xl p-6 h-full">
          {children || <StepFallback currentStepData={currentStepData} />}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto px-5">
          <Button
            variant="outline"
            onClick={() => onStepChange(currentStep - 1)}
            disabled={isFirst}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {isFirst ? "Previous" : steps[currentStep - 1]?.label}
          </Button>

          <div className="flex items-center gap-2">
            {steps.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => idx <= currentStep && onStepChange(idx)}
                disabled={idx > currentStep}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  idx <= currentStep ? "bg-primary" : "bg-muted-foreground/30",
                  idx === currentStep && "w-6"
                )}
              />
            ))}
          </div>

          <Button
            onClick={() => onStepChange(currentStep + 1)}
            disabled={isLast}
            className="flex items-center gap-2"
          >
            {isLast ? "Complete" : steps[currentStep + 1]?.label}
            {!isLast && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </footer>
    </div>
  );
};