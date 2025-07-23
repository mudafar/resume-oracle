import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCopy, Clipboard, SkipForward } from "lucide-react";

interface ProfileSectionsHeroPanelProps {
  onPasteExtract: () => void;
  onSkip: () => void;
}

export const ProfileSectionsHeroPanel: React.FC<ProfileSectionsHeroPanelProps> = ({
  onPasteExtract,
  onSkip,
}) => {
  return (
<Card className="mb-6 border border-slate-200 bg-slate-50 shadow-sm rounded-xl">
  <CardHeader className="text-center space-y-2">
    <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center justify-center gap-2">
      <Clipboard className="w-6 h-6 text-slate-500" />
      Ready to Populate Your Profile?
    </CardTitle>
    <CardDescription className="text-slate-600 max-w-xl mx-auto">
      Paste your LinkedIn or resume content to extract key profile sections automatically.
    </CardDescription>
  </CardHeader>
  <CardContent className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
    <Button
      onClick={onPasteExtract}
      size="lg"
      className="flex items-center gap-2 px-6"
    >
      <ClipboardCopy className="h-5 w-5" />
      Paste & Extract
    </Button>
    <Button
      variant="outline"
      onClick={onSkip}
      size="lg"
      className="flex items-center gap-2 px-6"
    >
      <SkipForward className="h-5 w-5" />
      Skip for Now
    </Button>
  </CardContent>
</Card>
  );
}; 