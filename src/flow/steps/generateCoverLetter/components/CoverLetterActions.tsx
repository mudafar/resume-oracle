import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, RotateCcw } from "lucide-react";

interface CoverLetterActionsProps {
  coverLetter: string;
  isGenerating: boolean;
  onRegenerate: () => void;
}

export const CoverLetterActions = ({ 
  coverLetter, 
  isGenerating, 
  onRegenerate 
}: CoverLetterActionsProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([coverLetter], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover_letter.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={copyToClipboard}
        variant="outline"
        size="sm"
        disabled={!coverLetter}
      >
        <Copy className="h-4 w-4 mr-2" />
        {copied ? "Copied!" : "Copy"}
      </Button>
      <Button
        onClick={downloadMarkdown}
        variant="outline"
        size="sm"
        disabled={!coverLetter}
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
      <Button
        onClick={onRegenerate}
        variant="outline"
        size="sm"
        disabled={isGenerating}
      >
        <RotateCcw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
        Regenerate
      </Button>
    </div>
  );
};
