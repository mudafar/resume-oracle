import React from "react";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { NewProfileSectionModal } from "../NewProfileSectionModal";
import { ProfileSectionsExportModal } from "../ProfileSectionsExportModal";
import { DeleteAllProfileSectionsModal } from "../DeleteAllProfileSectionsModal";
import { ProfileSectionsImportJSONModal } from "../ProfileSectionsImportJSONModal";

interface ModalsManagerProps {
  // New Section Modal
  newSectionModalOpen: boolean;
  onCloseNewSection: () => void;
  onAddSection: (section: { type: any; content: string }) => void;

  // Export Modal
  exportModalOpen: boolean;
  onCloseExport: () => void;
  profileSections: ProfileSection[];

  // Delete All Modal
  deleteAllConfirm: boolean;
  onCancelDeleteAll: () => void;
  onConfirmDeleteAll: () => void;

  // Import JSON Modal
  importJSONModalOpen: boolean;
  onCloseImportJSON: () => void;
  onImportSection: (section: ProfileSection) => void;
  onImportAll: (sections: ProfileSection[]) => void;

  // Toast callback
  onToast: (message: string, type?: "success" | "error") => void;
}

export const ModalsManager: React.FC<ModalsManagerProps> = ({
  newSectionModalOpen,
  onCloseNewSection,
  onAddSection,
  exportModalOpen,
  onCloseExport,
  profileSections,
  deleteAllConfirm,
  onCancelDeleteAll,
  onConfirmDeleteAll,
  importJSONModalOpen,
  onCloseImportJSON,
  onImportSection,
  onImportAll,
  onToast
}) => {
  return (
    <>
      <ProfileSectionsExportModal
        open={exportModalOpen}
        onClose={onCloseExport}
        profileSections={profileSections}
        onToast={onToast}
      />
      
      <NewProfileSectionModal
        open={newSectionModalOpen}
        onClose={onCloseNewSection}
        onAdd={onAddSection}
      />
      
      <DeleteAllProfileSectionsModal
        open={deleteAllConfirm}
        onCancel={onCancelDeleteAll}
        onConfirm={onConfirmDeleteAll}
      />
      
      <ProfileSectionsImportJSONModal
        open={importJSONModalOpen}
        onClose={onCloseImportJSON}
        onImportSection={onImportSection}
        onImportAll={onImportAll}
        onToast={onToast}
      />
    </>
  );
};
