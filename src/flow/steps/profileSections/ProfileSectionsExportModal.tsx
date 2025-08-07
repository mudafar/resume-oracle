import React, { useMemo, useState } from "react";
import { SharedModal, ModalAction } from "../shared/modal";
import { Download, Copy, Check, FileText } from "lucide-react";
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

  const actions: ModalAction[] = [
    {
      label: "Download JSON",
      onClick: handleDownload,
      variant: "default",
      icon: <Download className="w-4 h-4" />
    },
    {
      label: copied ? "Copied!" : "Copy to Clipboard",
      onClick: handleCopy,
      variant: "outline",
      icon: copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />
    },
    {
      label: "Close",
      onClick: resetAndClose,
      variant: "ghost"
    }
  ];

  return (
    <SharedModal
      open={open}
      onClose={resetAndClose}
      title="Export Profile Sections"
      description="Download or copy your profile sections in JSON format."
      icon={<FileText className="w-5 h-5 text-blue-600" />}
      badge={{ text: `${profileSections.length} sections`, variant: "secondary" }}
      size="lg"
      actions={actions}
    >
      <div className="p-6 space-y-4">
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
      </div>
    </SharedModal>
  );
};
