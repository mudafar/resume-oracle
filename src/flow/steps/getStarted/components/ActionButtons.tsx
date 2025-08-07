import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onAnalyze: () => void;
  onSkip: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onAnalyze, onSkip }) => {
  return (
    <div className="mt-8 relative">
      <Button onClick={onAnalyze} size="lg" className="px-8 py-4 shadow-lg hover:shadow-xl transition transform hover:scale-105 group">
        <Zap className="w-5 h-5 mr-2 animate-pulse" /> Import with AI
        <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition" />
      </Button>
      
      <button onClick={onSkip} className="mt-4 ml-4 text-sm text-muted-foreground hover:text-foreground underline">
        Skip and start manually
      </button>
    </div>
  );
};
