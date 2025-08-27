import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Trash2, FileText } from "lucide-react";

interface ProfileSectionsActionBarProps {
  onNewSection: () => void;
  onImportFile: () => void;
  onExport: () => void;
  onDeleteAll: () => void;
  disabledExport?: boolean;
  disabledDeleteAll?: boolean;
}

export const ProfileSectionsActionBar: React.FC<ProfileSectionsActionBarProps> = ({
  onNewSection,
  onImportFile,
  onExport,
  onDeleteAll,
  disabledExport = false,
  disabledDeleteAll = false,
}) => {
  return (
    <div className="flex flex-row gap-2 mb-4 justify-between">
      <Button onClick={onNewSection} className="flex items-center gap-2 bg-primary">
        <Plus className="h-4 w-4" />
        New Profile Section
      </Button>

      <div className="flex flex-row gap-2">
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
    </div>
  );
};
