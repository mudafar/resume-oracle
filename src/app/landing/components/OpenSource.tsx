import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, FileText, Users, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const openSourceItems = [
  {
    icon: Github,
    title: "GitHub Repository",
    description: "View source code, contribute, and report issues",
    link: "#",
  },
  {
    icon: FileText,
    title: "AGPL-3.0 License",
    description: "Free to use, modify, and distribute",
    link: "#",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built by developers, for developers",
    link: "#",
  },
  {
    icon: MapPin,
    title: "Roadmap",
    description: "See planned features and contribute ideas",
    link: "#",
  },
];

export const OpenSource: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-slate-900 text-white">
      <div className="container mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Open Source & Transparent
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Built in the open, for the community. Every line of code is auditable and contributable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {openSourceItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="bg-slate-800 border-slate-700 p-6 text-center hover:bg-slate-750 transition-colors">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-slate-300 text-sm mb-4">{item.description}</p>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" asChild>
                  <Link href={item.link} target="_blank" rel="noopener noreferrer">
                    Learn more <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </Card>
            );
          })}
        </div>

        <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-slate-900" asChild>
          <Link href="https://github.com/mudafar/resume-oracle" target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-5 w-5" />
            View on GitHub
          </Link>
        </Button>
      </div>
    </section>
  );
};
