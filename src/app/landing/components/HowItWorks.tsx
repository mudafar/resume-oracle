import React from 'react';
import { Card } from '@/components/ui/card';
import { ClipboardPaste, Search, Zap, Download, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: ClipboardPaste,
    title: "Paste Resume",
    description: "Simply paste your existing resume content or start fresh",
  },
  {
    number: 2,
    icon: Search,
    title: "Extract Job Requirements",
    description: "AI analyzes job descriptions to identify key requirements",
  },
  {
    number: 3,
    icon: Zap,
    title: "Match & Improve",
    description: "Smart suggestions to optimize your resume for the role",
  },
  {
    number: 4,
    icon: Download,
    title: "Export",
    description: "Download your optimized resume as Markdown",
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to create your perfect resume
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                <Card className="p-6 h-full text-center hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-4 pt-4 flex justify-center">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </Card>

                {/* Arrow (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
