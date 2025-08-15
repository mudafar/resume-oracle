import React from 'react';
import { Card } from '@/components/ui/card';
import { EyeOff, Brain, Repeat, CheckCircle2 } from 'lucide-react';

const problemBlocks = [
  {
    icon: EyeOff,
    title: "The Hidden Requirements Problem",
    description: "Job descriptions hide 40% of real requirements in buzzwords and assumptions. You're missing qualifications you don't even know they want.",
    color: "text-red-600 bg-red-50",
  },
  {
    icon: Brain,
    title: "The Forgotten Skills Problem",
    description: "You have more relevant experience than you realize, but it's scattered across years of work. Important skills get buried or overlooked.",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: Repeat,
    title: "The Copy-Paste Hell Problem",
    description: "Every application means starting from scratch with ChatGPT, losing context, and hoping it doesn't make up fake experience.",
    color: "text-yellow-600 bg-yellow-50",
  },
];

const solutionPoints = [
  "Extracts both obvious AND hidden job requirements",
  "Surfaces forgotten skills from your actual experience",
  "Builds a smart profile that improves with each use",
];

export const ProblemSolution: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop Losing Jobs to Incomplete Resumes
          </h2>
        </div>

        {/* Problem Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {problemBlocks.map((problem) => {
            const Icon = problem.icon;
            return (
              <Card key={problem.title} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="mb-4 flex justify-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${problem.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-3">{problem.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {problem.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Solution Block */}
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 bg-primary/5 border-primary/20">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-primary mb-2">
                Resume Oracle Solves All Three
              </h3>
            </div>
            <div className="space-y-3">
              {solutionPoints.map((point, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{point}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
