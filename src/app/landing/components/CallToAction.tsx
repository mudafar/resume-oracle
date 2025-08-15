import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText, Settings, Check } from 'lucide-react';

interface CallToActionProps {
  onAnalyze: () => void;
  onSkip: () => void;
  onOpenSettings: () => void;
}

const trustSignals = [
  "No signup required",
  "Data stays in your browser", 
  "Free to use, always",
  "Open source & transparent",
];

export const CallToAction: React.FC<CallToActionProps> = ({
  onAnalyze,
  onSkip,
  onOpenSettings
}) => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Discover Your Hidden Skills?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who've stopped losing opportunities to incomplete resumes. 
            Import your profile in 2 minutes and see what you've been missing.
          </p>

          {/* Primary CTA */}
          <div className="mb-8">
            <Button
              size="lg"
              onClick={onAnalyze}
              className="px-8 py-4 text-lg font-semibold"
            >
              <Upload className="mr-2 h-5 w-5" />
              Import Your Resume Now
            </Button>
          </div>

          {/* Secondary Options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button variant="outline" onClick={onSkip} className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Start with a blank profile instead
            </Button>
            
            <Button variant="ghost" onClick={onOpenSettings} className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Configure your API key for best results
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {trustSignals.map((signal, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>{signal}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};
