import React from 'react';
import { Separator } from '@/components/ui/separator';
import { AppIcon } from '@/multiStepFlow/layout/AppIcon';

const footerSections = [
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "AGPL License", href: "#" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Documentation", href: "#" },
      { label: "GitHub Repository", href: "#" },
      { label: "Contributing", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Issues", href: "#" },
      { label: "Discussions", href: "#" },
      { label: "Roadmap", href: "#" },
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
            </div>
            <p className="text-slate-400 text-sm">
              Open source AI-powered resume builder that respects your privacy.
            </p>
            <div className="text-slate-400 text-sm">
              <div>Version 0.1</div>
              <div>Built with ❤️</div>
            </div>
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
              <strong>Disclaimer:</strong> This tool is provided as-is under AGPL license. 
              AI suggestions are recommendations only—review all generated content before use. 
              Data stored locally—clearing browser data will remove your resumes.
            </p>
          </div>
          <p className="text-slate-400 text-sm">
            © 2025 Resume Oracle. Open source under AGPL-3.0 license.
          </p>
        </div>
      </div>
    </footer>
  );
};
