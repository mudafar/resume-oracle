import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Download, 
  RefreshCw, 
  Loader2, 
  Edit3, 
  Eye, 
  Save, 
  FileDown 
} from "lucide-react";

export interface ActionBarProps {
  // Copy functionality
  onCopy?: () => void;
  copied?: boolean;
  copyText?: string;
  
  // Download functionality
  onDownload?: () => void;
  downloadText?: string;
  
  // Export functionality (for PDF/other formats)
  onExport?: () => void;
  exportText?: string;
  isExporting?: boolean;
  
  // Regenerate functionality
  onRegenerate?: () => void;
  regenerateText?: string;
  isLoading?: boolean;
  
  // Edit mode toggle
  editMode?: boolean;
  onToggleEdit?: (editing: boolean) => void;
  
  // Save functionality
  onSave?: () => void;
  saveText?: string;
  saved?: boolean;
  
  // Layout and styling
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'default' | 'lg';
}

export const ActionBar: React.FC<ActionBarProps> = ({
  // Copy props
  onCopy,
  copied = false,
  copyText = "Copy",
  
  // Download props
  onDownload,
  downloadText = "Download",
  
  // Export props
  onExport,
  exportText = "Export",
  isExporting = false,
  
  // Regenerate props
  onRegenerate,
  regenerateText = "Regenerate",
  isLoading = false,
  
  // Edit mode props
  editMode,
  onToggleEdit,
  
  // Save props
  onSave,
  saveText = "Save",
  saved = false,
  
  // Layout props
  className = "",
  size = "sm"
}) => {
  const buttonSize = size;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Edit Mode Toggle */}
      {onToggleEdit && editMode !== undefined && (
        <>
          <Button
            variant="outline"
            size={buttonSize}
            onClick={() => onToggleEdit(!editMode)}
          >
            {editMode ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
          <Separator orientation="vertical" className="h-6" />
        </>
      )}
      
      {/* Save Button */}
      {onSave && (
        <>
          <Button
            variant="outline"
            size={buttonSize}
            onClick={onSave}
          >
            <Save className="w-4 h-4 mr-2" />
            {saveText}
          </Button>
          {saved && (
            <Badge variant="outline" className="text-green-600 border-green-300">
              Saved!
            </Badge>
          )}
        </>
      )}
      
      {/* Copy Button */}
      {onCopy && (
        <>
          <Button
            variant="outline"
            size={buttonSize}
            onClick={onCopy}
          >
            <Copy className="w-4 h-4 mr-2" />
            {copyText}
          </Button>
          {copied && (
            <Badge variant="outline" className="text-green-600 border-green-300">
              Copied!
            </Badge>
          )}
        </>
      )}
      
      {/* Download Button */}
      {onDownload && (
        <Button
          variant="outline"
          size={buttonSize}
          onClick={onDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          {downloadText}
        </Button>
      )}
      
      {/* Export Button */}
      {onExport && (
        <Button
          variant="outline"
          size={buttonSize}
          onClick={onExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileDown className="w-4 h-4 mr-2" />
          )}
          {exportText}
        </Button>
      )}
      
      {/* Separator before regenerate if other actions exist */}
      {onRegenerate && (onCopy || onDownload || onExport || onSave) && (
        <Separator orientation="vertical" className="h-6" />
      )}
      
      {/* Regenerate Button */}
      {onRegenerate && (
        <Button
          size={buttonSize}
          onClick={onRegenerate}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          {regenerateText}
        </Button>
      )}
    </div>
  );
};
