import React from 'react';
import { cn } from '@/lib/utils';

interface FullBleedSectionProps {
  id?: string; // HTML id for anchor navigation
  className?: string; // apply background/colors/padding to the full-bleed area
  innerClassName?: string; // apply spacing/constraints to inner container
  children: React.ReactNode;
}

/**
 * FullBleedSection
 * - Outer section bleeds to viewport width for background color bands
 * - Inner container constrains content to a readable max width
 */
export function FullBleedSection({ id, className, innerClassName, children }: FullBleedSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        // Bleed the background to the viewport edges regardless of parent constraints
        'relative left-1/2 right-1/2 -mx-[50vw] w-screen scroll-mt-14',
        className,
      )}
    >
      <div className={cn('mx-auto w-full max-w-7xl px-6 md:px-8', innerClassName)}>
        {children}
      </div>
    </section>
  );
}
