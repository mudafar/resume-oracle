import React from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { AppIcon } from '@/multiStepFlow/layout/AppIcon';
import Link from 'next/link';

const navItems = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Why Not ChatGPT?", href: "#competitive-advantage" },
  { label: "Open Source", href: "#open-source" },
  { label: "Privacy", href: "#privacy" },
  { label: "Contact", href: "#contact" },
];

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between max-w-6xl mx-auto px-4">
        <Link href="/#hero" className="flex items-center space-x-2" aria-label="Homepage">
          <AppIcon size={24} />
          <span className="font-semibold text-md">Resume Oracle</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <Button variant="outline" size="sm" asChild>
          <a href="https://github.com/mudafar/resume-oracle" target="_blank" rel="noopener noreferrer">
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </Button>
      </div>
    </header>
  );
};
