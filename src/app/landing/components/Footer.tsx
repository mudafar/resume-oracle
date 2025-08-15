import React from 'react';
import { Separator } from '@/components/ui/separator';
import { AppIcon } from '@/multiStepFlow/layout/AppIcon';

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Privacy Details", href: "#privacy" },
      { label: "Contact Support", href: "#contact" },
    ],
  },
  {
    title: "Open Source",
    links: [
      { label: "GitHub Repository", href: "https://github.com/mudafar/resume-oracle" },
      { label: "Contributing Guide", href: "#" },
      { label: "Issue Tracker", href: "#" },
      { label: "Community Discussions", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "AGPL-3.0 License", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Use", href: "#" },
    ],
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <AppIcon size={24} />
              </div>
              <span className="font-semibold text-lg">Resume Oracle</span>
              <span className="text-slate-400 text-sm">v0.1 Alpha</span>
            </div>
            <p className="text-slate-400 text-sm">
              Discover skills you forgot you had
            </p>
            <p className="text-slate-400 text-sm">
              Built with ❤️ by the open source community
            </p>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                      target={link.href.startsWith('http') ? "_blank" : undefined}
                      rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-slate-700 mb-6" />

        <div className="text-center">
          <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-4 mb-6">
            <p className="text-amber-200 text-sm">
              <strong>⚠️ Alpha Release:</strong> Resume Oracle v0.1 is in active development. 
              AI suggestions are recommendations only. All data is stored locally in your browser - clearing browser data will remove your profiles.
            </p>
          </div>
          <p className="text-slate-400 text-sm">
            © 2025 Resume Oracle Contributors • Open source under AGPL-3.0 license
          </p>
        </div>
      </div>
    </footer>
  );
};
