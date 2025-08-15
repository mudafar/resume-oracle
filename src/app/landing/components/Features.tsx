import React from 'react';
import { Card } from '@/components/ui/card';
import { ShieldCheck, Code, Brain, UserX } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: "Privacy-First",
    description: "All data stored locally in your browser. No uploads, no tracking.",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: Code,
    title: "Open Source",
    description: "AGPL-licensed, community-driven, transparent development.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Brain,
    title: "AI-Powered",
    description: "Smart resume optimization with intelligent suggestions.",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: UserX,
    title: "No Signup",
    description: "Start immediately, no registration or account required.",
    color: "text-orange-600 bg-orange-50",
  },
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Resume Oracle?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with privacy, transparency, and user experience in mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${feature.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
