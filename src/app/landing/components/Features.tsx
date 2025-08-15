import React from 'react';
import { Card } from '@/components/ui/card';
import { Search, ShieldCheck, TrendingUp, Lock } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: "Uncover What You Actually Know",
    description: "Discover relevant skills from your past experience that you forgot to mention. Like finding money in old jacket pockets.",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: ShieldCheck,
    title: "Never Invents Fake Experience",
    description: "Unlike chat tools, Resume Oracle only suggests what you actually have. No hallucinations, no made-up qualifications.",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: TrendingUp,
    title: "Each Job Application Gets Easier",
    description: "Your profile learns and improves. What takes 2 hours the first time takes 20 minutes the fifth time.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Lock,
    title: "Your Data Never Leaves Your Browser",
    description: "Everything runs locally. No uploads, no tracking, no data harvesting. AGPL-licensed and fully transparent.",
    color: "text-orange-600 bg-orange-50",
  },
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Developers and Job Seekers Choose Resume Oracle
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic">
            Built by developers, for everyone who's tired of generic resume advice
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
