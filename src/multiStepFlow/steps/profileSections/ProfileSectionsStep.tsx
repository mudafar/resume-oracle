"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { openConfigModal } from "@/store/slices/llmConfigSlice";
import { createStep } from "@/utils/createStep";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useProfileSections, useModalManager } from "./hooks";
import { ProfileSectionsActions } from "./components/ProfileSectionsActions";
import { ModalsManager } from "./components/ModalsManager";
import { toast } from "sonner";
import { SectionsList } from "./components/SectionsList";
import { SectionTypeEnum } from "@/types/store";

const ProfileSections: React.FC = () => {
  const llmConfig = useSelector((state: RootState) => state.llmConfig);
  const dispatch = useDispatch();

  // Custom hooks
  const profileSections = useProfileSections();
  const modalManager = useModalManager();

  // Local state for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editType, setEditType] = useState<SectionTypeEnum>(SectionTypeEnum.Experience);
  const [editContent, setEditContent] = useState("");
  const [showPrompt, setShowPrompt] = useState(llmConfig.provider === "free");

  useScrollToTop();

  // Handle model config
  const handleOpenModelConfig = () => {
    dispatch(openConfigModal());
  };

  // Handle section editing
  const handleEditSection = (id: string, type: string, content: string) => {
    profileSections.editSection(id, type, content);
    setEditingId(null);
    toast.success("Profile section updated successfully!");
  };

  // Handle section deletion
  const handleDeleteSection = (id: string) => {
    profileSections.deleteSection(id);
    toast.success("Profile section deleted successfully!");
  };

  return (
    <div>
      <ProfileSectionsActions
        showPrompt={showPrompt}
        onClosePrompt={() => setShowPrompt(false)}
        onConfigure={handleOpenModelConfig}
        onNewSection={modalManager.openNewSectionModal}
        onImportFile={modalManager.openImportModal}
        onExport={modalManager.openExportModal}
        onDeleteAll={modalManager.openDeleteAllConfirm}
        disabledExport={profileSections.sections.length === 0}
        disabledDeleteAll={profileSections.sections.length === 0}
      />

      <ModalsManager
        profileSections={profileSections}
        newSectionModalOpen={modalManager.newSectionModalOpen}
        exportModalOpen={modalManager.exportModalOpen}
        importModalOpen={modalManager.importModalOpen}
        deleteAllConfirm={modalManager.deleteAllConfirm}
        onCloseNewSection={modalManager.closeNewSectionModal}
        onCloseExport={modalManager.closeExportModal}
        onCloseImport={modalManager.closeImportModal}
        onCancelDeleteAll={modalManager.closeDeleteAllConfirm}
      />

      <SectionsList
        sections={profileSections.sections}
        collapsedSections={profileSections.collapsedSections}
        onToggleCollapse={profileSections.toggleCollapse}
        onEdit={handleEditSection}
        onDelete={handleDeleteSection}
        editingId={editingId}
        editType={editType}
        editContent={editContent}
        setEditType={setEditType}
        setEditContent={setEditContent}
        setEditingId={setEditingId}
      />
    </div>
  );
};

export const ProfileSectionsStep = createStep({
  id: "profile-sections",
  label: "Your Profile",
  description: "Add and manage your profile sections."
})(ProfileSections);
