import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Edit3, 
  Download, 
  FileDown, 
  Save, 
  RotateCcw, 
  Eye, 
  Check, 
  Loader2 
} from "lucide-react";

interface ResumeActionsProps {
  editMode: boolean;
  draftSaved: boolean;
  isLoading: boolean;
  isExportingPdf: boolean;
  onToggleEdit: () => void;
  onSaveDraft: () => void;
  onExportMarkdown: () => void;
  onExportPdf?: () => void;
  onRegenerate: () => void;
}

export const ResumeActions: React.FC<ResumeActionsProps> = ({
  editMode,
  draftSaved,
  isLoading,
  isExportingPdf,
  onToggleEdit,
  onSaveDraft,
  onExportMarkdown,
  onExportPdf,
  onRegenerate
}) => {
  return (
    <div className="flex items-center space-x-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleEdit}
        className="flex items-center space-x-2"
      >
        {editMode ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
        <span>{editMode ? 'Preview' : 'Edit'}</span>
      </Button>

      {editMode && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSaveDraft}
          className="flex items-center space-x-2"
          disabled={draftSaved}
        >
          {draftSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{draftSaved ? 'Saved' : 'Save'}</span>
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onExportMarkdown}
        className="flex items-center space-x-2"
      >
        <FileDown className="h-4 w-4" />
        <span>Markdown</span>
      </Button>

      {onExportPdf && (
        <Button
          variant="outline"
          size="sm"
          onClick={onExportPdf}
          disabled={isExportingPdf}
          className="flex items-center space-x-2"
        >
          {isExportingPdf ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>PDF</span>
        </Button>
      )}

      <Button
        size="sm"
        onClick={onRegenerate}
        disabled={isLoading}
        className="flex items-center space-x-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RotateCcw className="h-4 w-4" />
        )}
        <span>Regenerate</span>
      </Button>
    </div>
  );
};
