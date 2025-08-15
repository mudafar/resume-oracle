import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Bug, Lightbulb, Code } from 'lucide-react';

const contactItems = [
  {
    icon: HelpCircle,
    title: "General Support",
    description: "Questions about features, usage, or getting started with Resume Oracle.",
    cta: "Ask in Discussions",
    link: "#",
    color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
  },
  {
    icon: Bug,
    title: "Found an Issue?",
    description: "Help make Resume Oracle better by reporting bugs or unexpected behavior.",
    cta: "Report on GitHub",
    link: "#",
    color: "text-red-600 bg-red-50 hover:bg-red-100",
  },
  {
    icon: Lightbulb,
    title: "Suggest Improvements",
    description: "Have ideas for new features or workflow improvements? We'd love to hear them.",
    cta: "Share Your Ideas",
    link: "#",
    color: "text-yellow-600 bg-yellow-50 hover:bg-yellow-100",
  },
  {
    icon: Code,
    title: "Want to Contribute Code?",
    description: "Join the development community and help build the future of AI-powered resume tools.",
    cta: "See Contributing Guide",
    link: "#",
    color: "text-green-600 bg-green-50 hover:bg-green-100",
  },
];

export const Contact: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Questions, Ideas, or Want to Contribute?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic">
            Built by the community, supported by the community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="mb-4 flex justify-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{item.description}</p>
                <Button variant="ghost" size="sm">
                  {item.cta}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
