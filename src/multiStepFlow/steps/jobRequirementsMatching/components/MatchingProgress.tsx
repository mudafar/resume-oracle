import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Brain, Target, Zap, Sparkles } from "lucide-react";

interface MatchingProgressProps {
  currentPhase: 'idle' | 'extracting' | 'matching' | 'optimizing' | 'complete';
  isLoading: boolean;
}

export const MatchingProgress: React.FC<MatchingProgressProps> = ({ currentPhase, isLoading }) => {
  const [showCompletion, setShowCompletion] = useState(false);
  const [hideComponent, setHideComponent] = useState(false);

  // Handle completion animation
  useEffect(() => {
    if (currentPhase === 'complete') {
      setShowCompletion(true);
      setHideComponent(false);
      
      // Hide the entire component after 3 seconds
      const hideTimer = setTimeout(() => {
        setHideComponent(true);
      }, 3000);
      
      return () => {
        clearTimeout(hideTimer);
      };
    } else {
      setShowCompletion(false);
      setHideComponent(false);
    }
  }, [currentPhase]);

  // Don't show anything when idle or hidden after completion
  if (currentPhase === 'idle' || hideComponent) {
    return null;
  }

  const phases = [
    {
      key: 'extracting',
      label: 'Extracting Requirements',
      description: 'Analyzing job description...',
      icon: Brain,
    },
    {
      key: 'matching', 
      label: 'AI Matching',
      description: 'Scoring profile sections...',
      icon: Target,
    },
    {
      key: 'optimizing',
      label: 'Optimizing Selection',
      description: 'Finding best matches...',
      icon: Zap,
    },
  ];

  // Show completion state (all steps done)
  if (showCompletion) {
    return (
      <Card className="mb-6 border-green-200 bg-green-50/50 transition-all duration-500">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {phases.map((phase, index) => {
                return (
                  <div key={phase.key} className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        {phase.label}
                      </Badge>
                    </div>
                    {index < phases.length - 1 && (
                      <div className="hidden sm:block h-0.5 w-4 lg:w-8 bg-green-300" />
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center gap-2 text-green-600">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Complete!</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show progress during active phases (only if not idle or complete)
  return (
    <Card className="mb-6 border-blue-200 bg-blue-50/50">
      <CardContent className="py-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {phases.map((phase, index) => {
            const isActive = currentPhase === phase.key;
            const isCompleted = phases.findIndex(p => p.key === currentPhase) > index;
            const Icon = phase.icon;

            return (
              <div key={phase.key} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  {isActive && isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <div className="flex flex-col">
                    <Badge 
                      variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      <span className="hidden sm:inline">{phase.label}</span>
                      <span className="sm:hidden">{phase.label.split(' ')[0]}</span>
                    </Badge>
                    {isActive && (
                      <span className="hidden sm:block text-xs text-muted-foreground mt-1">
                        {phase.description}
                      </span>
                    )}
                  </div>
                </div>
                {index < phases.length - 1 && (
                  <div className={`hidden sm:block h-0.5 w-4 lg:w-8 ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
