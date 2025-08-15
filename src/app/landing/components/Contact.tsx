import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Linkedin, Github, MessageCircle, Bug } from 'lucide-react';

const contactItems = [
  {
    icon: Linkedin,
    title: "LinkedIn",
    description: "Professional contact",
    link: "#",
    color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
  },
  {
    icon: Github,
    title: "GitHub",
    description: "Repository & issues",
    link: "#",
    color: "text-gray-900 bg-gray-50 hover:bg-gray-100",
  },
  {
    icon: MessageCircle,
    title: "Discussions",
    description: "GitHub Discussions",
    link: "#",
    color: "text-green-600 bg-green-50 hover:bg-green-100",
  },
  {
    icon: Bug,
    title: "Bug Reports",
    description: "Feature requests",
    link: "#",
    color: "text-red-600 bg-red-50 hover:bg-red-100",
  },
];

export const Contact: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Questions, suggestions, or want to contribute? We'd love to hear from you.
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
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                <Button variant="ghost" size="sm">
                  Contact
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
