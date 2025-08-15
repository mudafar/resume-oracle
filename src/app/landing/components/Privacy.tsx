import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Shield, HardDrive, Cookie, EyeOff, AlertTriangle } from 'lucide-react';

const privacyFeatures = [
  {
    icon: Shield,
    title: "No Data Collection",
    description: "Everything stays in your browser",
  },
  {
    icon: HardDrive,
    title: "Local Storage Only",
    description: "No server uploads or cloud storage",
  },
  {
    icon: Cookie,
    title: "No Cookies",
    description: "Currently cookie-free application",
  },
  {
    icon: EyeOff,
    title: "No Tracking",
    description: "No analytics or third-party scripts",
  },
];

export const Privacy: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-green-50/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Privacy & Data Protection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy is our priority. Here's how we protect your data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {privacyFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="p-6 text-center bg-white">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Important:</strong> AI models process the data you provide to generate suggestions. 
            Avoid including sensitive personal information if you don't want it processed by AI models.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
};
