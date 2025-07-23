import React, { useMemo, useState } from "react";
import {
  Button
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { X, Download, Copy, Check } from "lucide-react";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";


interface ProfileSectionsExportModalProps {
  open: boolean;
  onClose: () => void;
  profileSections: ProfileSection[];
  onToast: (message: string, type?: "success" | "error") => void;
}

export const ProfileSectionsExportModal: React.FC<ProfileSectionsExportModalProps> = ({
  open,
  onClose,
  profileSections,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);

  const exportData = useMemo(
    () => JSON.stringify(profileSections, null, 2),
    [profileSections]
  );

  const fileName = useMemo(
    () => `profile-sections-${new Date().toISOString().split("T")[0]}.json`,
    []
  );

  if (!open) return null;

  const handleDownload = () => {
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    onToast("Profile sections exported successfully!");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportData);
      setCopied(true);
      onToast("Profile sections copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onToast("Failed to copy to clipboard", "error");
    }
  };

  const resetAndClose = () => {
    setCopied(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <Card className="w-full max-w-lg mx-4 animate-in fade-in zoom-in-95">
        <CardHeader className="flex items-start justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              Export Profile Sections
            </CardTitle>
            <CardDescription>
              Download or copy your profile sections in JSON format.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={resetAndClose}
            aria-label="Close export modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Export Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download JSON
            </Button>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="flex items-center gap-2"
              aria-label="Copy JSON to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </div>

          {/* JSON Preview */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Preview ({profileSections.length} sections)
            </label>
            <div className="max-h-48 overflow-y-auto rounded-md border border-input bg-muted/50 p-3 text-xs font-mono">
              <pre className="whitespace-pre-wrap break-words">
                {exportData}
              </pre>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={resetAndClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
