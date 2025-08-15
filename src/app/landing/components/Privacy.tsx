import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Monitor, Database, Key, Eye, AlertTriangle } from 'lucide-react';

const privacyFeatures = [
  {
    icon: Monitor,
    title: "Browser-Only Processing",
    description: "Your resume never leaves your device. All AI processing happens locally or through your own API keys.",
  },
  {
    icon: Database,
    title: "We Don't Want Your Data",
    description: "No analytics, no tracking pixels, no hidden data harvesting. We literally can't see your resume content.",
  },
  {
    icon: Key,
    title: "You Own the AI Connection",
    description: "Use your own OpenAI, Anthropic, or Google API key. Direct connection, no middleman, no data retention.",
  },
  {
    icon: Eye,
    title: "Audit Every Line of Code",
    description: "AGPL-licensed means you can verify exactly what the code does. No trust required, just verification.",
  },
];

export const Privacy: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-green-50/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Data, Your Browser, Your Control
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic">
            Zero uploads, zero tracking, zero compromises
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {privacyFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="p-6 text-center bg-white hover:shadow-lg transition-shadow">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>AI Processing Reminder:</strong> When using AI features, your resume content is sent to your chosen LLM provider (OpenAI, Google, etc.) for processing. 
            Avoid including sensitive personal information like SSN or private addresses.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
};
