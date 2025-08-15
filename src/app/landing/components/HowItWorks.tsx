import React from 'react';
import { Card } from '@/components/ui/card';
import { Upload, Search, Lightbulb, Target, Edit, Download, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Start with What You Have",
    description: "Import from your existing resume or LinkedIn profile. AI extracts and structures your experience into reusable sections.",
  },
  {
    number: 2,
    icon: Search,
    title: "Decode What Jobs Really Want",
    description: "Paste any job description and watch AI extract clustered requirements, including hidden qualifications you might miss.",
  },
  {
    number: 3,
    icon: Lightbulb,
    title: "Find Your Forgotten Skills",
    description: "See how your experience maps to requirements, plus discover relevant skills you never thought to mention.",
  },
  {
    number: 4,
    icon: Target,
    title: "Address What's Missing",
    description: "Clearly see skill gaps and get guided help to fill them with experiences you already have.",
  },
  {
    number: 5,
    icon: Edit,
    title: "Create Resume-Ready Content",
    description: "AI creates 3-4 bullet point summaries of each experience, highlighting what matters most for the job.",
  },
  {
    number: 6,
    icon: Download,
    title: "Get Your Optimized Resume",
    description: "Download as Markdown with targeted cover letter. Your profile stays for next time – no starting over.",
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Like Having a Career Coach Who Remembers Everything
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic">
            Six smart steps that get easier every time you use them
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
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

                {/* Arrow for desktop (fewer arrows needed with 3-column layout) */}
                {index < steps.length - 1 && (index + 1) % 3 !== 0 && (
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
