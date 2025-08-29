import React from "react";
import type { ProfileSection } from "@/schemas/profile";
import { NewProfileSectionModal } from "./NewProfileSectionModal";
import { ProfileSectionsExportModal } from "./ProfileSectionsExportModal";
import { DeleteAllProfileSectionsModal } from "./DeleteAllProfileSectionsModal";
import { ProfileSectionsImportJSONModal } from "./ProfileSectionsImportJSONModal";
import { SectionTypeEnum } from "@/types/store";
import { toast } from "sonner";

interface ProfileSectionsService {
  sections: ProfileSection[];
  addSection: (type: SectionTypeEnum, content: string) => void;
  deleteAllSections: () => void;
}

interface ModalsManagerProps {
  // Services
  profileSections: ProfileSectionsService;

  // Modal states
  newSectionModalOpen: boolean;
  exportModalOpen: boolean;
  importModalOpen: boolean;
  deleteAllConfirm: boolean;

  // Modal actions
  onCloseNewSection: () => void;
  onCloseExport: () => void;
  onCloseImport: () => void;
  onCancelDeleteAll: () => void;
}

export const ModalsManager: React.FC<ModalsManagerProps> = ({
  profileSections,
  newSectionModalOpen,
  exportModalOpen,
  importModalOpen,
  deleteAllConfirm,
  onCloseNewSection,
  onCloseExport,
  onCloseImport,
  onCancelDeleteAll
}) => {
  const handleAddSection = ({ type, content }: { type: SectionTypeEnum; content: string }) => {
    profileSections.addSection(type, content);
    onCloseNewSection();
  };

  const handleConfirmDeleteAll = () => {
    profileSections.deleteAllSections();
    onCancelDeleteAll();
  };

  const handleImportSection = (section: ProfileSection) => {
    profileSections.addSection(section.type as SectionTypeEnum, section.content);
  };

  const handleImportAll = (sections: ProfileSection[]) => {
    sections.forEach(section => {
      profileSections.addSection(section.type as SectionTypeEnum, section.content);
    });
  };

  return (
    <>
      <ProfileSectionsExportModal
        open={exportModalOpen}
        onClose={onCloseExport}
        profileSections={profileSections.sections}
        onToast={(message, type) => type === "error" ? toast.error(message) : toast.success(message)}
      />

      <NewProfileSectionModal
        open={newSectionModalOpen}
        onClose={onCloseNewSection}
        onAdd={handleAddSection}
      />

      <DeleteAllProfileSectionsModal
        open={deleteAllConfirm}
        onCancel={onCancelDeleteAll}
        onConfirm={handleConfirmDeleteAll}
      />

      <ProfileSectionsImportJSONModal
        open={importModalOpen}
        onClose={onCloseImport}
        // onImportSection={handleImportSection}
        onImportAll={handleImportAll}
        onToast={(message, type) => type === "error" ? toast.error(message) : toast.success(message)}
      />
    </>
  );
};
