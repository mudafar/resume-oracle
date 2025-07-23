import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Trash2, Bot, FileText, Sparkle, Sparkles } from "lucide-react";

interface ProfileSectionsActionBarProps {
  onNewSection: () => void;
  onImportAI: () => void;
  onImportFile: () => void;
  onExport: () => void;
  onDeleteAll: () => void;
  disabledExport?: boolean;
  disabledDeleteAll?: boolean;
}

export const ProfileSectionsActionBar: React.FC<ProfileSectionsActionBarProps> = ({
  onNewSection,
  onImportAI,
  onImportFile,
  onExport,
  onDeleteAll,
  disabledExport = false,
  disabledDeleteAll = false,
}) => {
  return (
    <div className="flex flex-row gap-2 mb-4">
      <Button onClick={onNewSection} className="flex items-center gap-2 bg-primary">
        <Plus className="h-4 w-4" />
        New Profile Section
      </Button>
      
      <Button variant="outline" onClick={onImportAI} className="flex items-center gap-2">
        <Sparkles className="w-4 text-blue-500" />
        Import With AI
      </Button>
      
      <Button variant="outline" onClick={onImportFile} className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Import from File
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onExport} 
        disabled={disabledExport}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
      
      <Button 
        variant="destructive" 
        onClick={onDeleteAll} 
        disabled={disabledDeleteAll}
        className="flex items-center ml-auto gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Delete All
      </Button>
    </div>
  );
};