import React from 'react';
import { Card } from '@/components/ui/card';
import { X, Check, AlertTriangle } from 'lucide-react';

const comparisonData = [
  {
    feature: "Remembers your profile",
    chatgpt: { status: "no", text: "Copy-paste every time" },
    linkedin: { status: "yes", text: "Basic storage" },
    resumeOracle: { status: "yes", text: "Smart, improving profile" },
  },
  {
    feature: "Finds hidden job requirements",
    chatgpt: { status: "no", text: "Surface keywords only" },
    linkedin: { status: "no", text: "Template matching" },
    resumeOracle: { status: "yes", text: "Deep JD analysis" },
  },
  {
    feature: "Discovers forgotten skills",
    chatgpt: { status: "no", text: "Only works with what you tell it" },
    linkedin: { status: "no", text: "Shows what's already there" },
    resumeOracle: { status: "yes", text: "Archeology mode" },
  },
  {
    feature: "No fake experience",
    chatgpt: { status: "warning", text: "Often hallucinates" },
    linkedin: { status: "yes", text: "Template-based" },
    resumeOracle: { status: "yes", text: "Only real experience" },
  },
  {
    feature: "Gets easier over time",
    chatgpt: { status: "no", text: "Same effort every time" },
    linkedin: { status: "no", text: "Static templates" },
    resumeOracle: { status: "yes", text: "Progressive improvement" },
  },
];

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "yes":
      return <Check className="h-5 w-5 text-green-600" />;
    case "no":
      return <X className="h-5 w-5 text-red-600" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    default:
      return null;
  }
};

export const CompetitiveAdvantage: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Not Just Use ChatGPT?
          </h2>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">ChatGPT</th>
                  <th className="text-center p-4 font-semibold">LinkedIn Builder</th>
                  <th className="text-center p-4 font-semibold bg-primary/10">Resume Oracle</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={row.feature} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <StatusIcon status={row.chatgpt.status} />
                        <span className="text-xs text-muted-foreground">{row.chatgpt.text}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <StatusIcon status={row.linkedin.status} />
                        <span className="text-xs text-muted-foreground">{row.linkedin.text}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center bg-primary/5">
                      <div className="flex flex-col items-center space-y-1">
                        <StatusIcon status={row.resumeOracle.status} />
                        <span className="text-xs text-muted-foreground font-medium">{row.resumeOracle.text}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
};
