import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileDown, FileText } from "lucide-react";

export interface DownloadButtonProps {
  onDownload: () => void;
  text?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  downloadType?: 'file' | 'markdown' | 'pdf' | 'generic';
  loadingText?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  onDownload,
  text = "Download",
  variant = "outline",
  size = "sm",
  disabled = false,
  isLoading = false,
  className = "",
  downloadType = "generic",
  loadingText = "Downloading..."
}) => {
  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-4 h-4 mr-2 animate-spin" />;
    }
    
    switch (downloadType) {
      case 'file':
        return <FileDown className="w-4 h-4 mr-2" />;
      case 'markdown':
        return <FileText className="w-4 h-4 mr-2" />;
      case 'pdf':
        return <FileDown className="w-4 h-4 mr-2" />;
      default:
        return <Download className="w-4 h-4 mr-2" />;
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return loadingText;
    }
    return text;
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onDownload}
      disabled={disabled || isLoading}
      className={className}
    >
      {getIcon()}
      {getButtonText()}
    </Button>
  );
};
