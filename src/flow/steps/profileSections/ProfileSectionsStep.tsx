"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  addSection,
  editSection,
  deleteSection,
  ProfileSection,
  SectionTypeEnum,
  setSections,
} from "@/store/slices/profileSectionsSlice";
import { openConfigModal } from "@/store/slices/llmConfigSlice";
import { addProfileSectionReturnId } from "../createProfileSection";
import { exportSectionsToJson, importSectionsFromJson } from "../profileSectionsExportImport";
import { ProfileSectionsActionBar } from "./ProfileSectionsActionBar";
import { NewProfileSectionModal } from "./NewProfileSectionModal";
import { ProfileSectionsExportModal } from "./ProfileSectionsExportModal";
import { ProfileSectionCard } from "./ProfileSectionCard";
import { DeleteAllProfileSectionsModal } from "./DeleteAllProfileSectionsModal";
import { ModelConfigPrompt } from "./ModelConfigPrompt";
import { Toast } from "./Toast";
import { createStep } from "@/utils/createStep";
import { ProfileSectionImportAIModal } from "./ProfileSectionsImportAIModal";
import { ProfileSectionsImportJSONModal } from "./ProfileSectionsImportJSONModal";
import { NoProfileSections } from "./NoProfileSections";

const ProfileSections: React.FC = () => {
  const sections = useSelector((state: RootState) => state.profileSections.sections);
  const llmConfig = useSelector((state: RootState) => state.llmConfig);
  const dispatch = useDispatch();
  const [addType, setAddType] = useState<SectionTypeEnum>(SectionTypeEnum.Experience);
  const [addContent, setAddContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editType, setEditType] = useState<SectionTypeEnum>(SectionTypeEnum.Experience);
  const [editContent, setEditContent] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showPrompt, setShowPrompt] = useState(llmConfig.provider === "free" && llmConfig.variant === "default");
  // const [importAIModalOpen, setImportAIModalOpen] = useState(false);
  const [importJSONModalOpen, setImportJSONModalOpen] = useState(false);
  // const [heroSkipped, setHeroSkipped] = useState(false);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  const [newSectionModalOpen, setNewSectionModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");


  // Collapse all sections by default, and when sections change
  useEffect(() => {
    setCollapsed(prev => {
      const next: Record<string, boolean> = { ...prev };
      sections.forEach(section => {
        if (!(section.id in next)) {
          next[section.id] = true;
        }
      });
      // Remove collapsed state for deleted sections
      Object.keys(next).forEach(id => {
        if (!sections.find(s => s.id === id)) {
          delete next[id];
        }
      });
      return next;
    });
  }, [sections]);

  // Persist heroSkipped in localStorage
  // useEffect(() => {
  //   const stored = localStorage.getItem("profileSectionsHeroSkipped");
  //   if (stored === "true") setHeroSkipped(true);
  // }, []);
  // const handleSkipHero = () => {
  //   setHeroSkipped(true);
  //   setNewSectionModalOpen(true);
  //   // localStorage.setItem("profileSectionsHeroSkipped", "true");
  // };

  const handleAdd = () => {
    if (addContent.trim()) {
      addProfileSectionReturnId(dispatch, addType, addContent);
      setAddContent("");
      setAddType(SectionTypeEnum.Experience);
    }
  };

  const handleEdit = (id: string, type: string, content: string) => {
    dispatch(editSection({ id, type, content }));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this section?")) {
      dispatch(deleteSection(id));
    }
  };

  const handleExport = () => {
    exportSectionsToJson(sections);
  };

  const handleImportClick = () => {
    setImportError(null);
    setImportSuccess(null);
    fileInputRef.current?.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const importedSections = await importSectionsFromJson(file);
      dispatch(setSections(importedSections));
      setImportSuccess("Profile sections imported successfully.");
    } catch (err: any) {
      setImportError(err.message || "Failed to import sections.");
    } finally {
      e.target.value = ""; // reset file input
    }
  };

  const handleOpenModelConfig = () => {
    dispatch(openConfigModal());
  };

  // Delete all handler
  const handleDeleteAll = () => {
    setDeleteAllConfirm(false);
    dispatch(setSections([]));
  };

  // Helper to get first two lines of content
  const getPreview = (content: string) => {
    const lines = content.split("\n");
    let preview = lines.slice(0, 2).join("\n");
    if (lines.length > 2 || content.length > 120) {
      preview = preview.slice(0, 120) + (content.length > 120 ? "..." : "");
    }
    return preview;
  };

  return (
    <div>
      {/* Inline Model Config Prompt */}
      <ModelConfigPrompt
        show={showPrompt}
        onClose={() => setShowPrompt(false)}
        onConfigure={handleOpenModelConfig}
      />
      {/* Action Bar */}
      <ProfileSectionsActionBar
        onNewSection={() => setNewSectionModalOpen(true)}
        // onImportAI={() => setImportAIModalOpen(true)}
        onImportFile={() => setImportJSONModalOpen(true)}
        onExport={() => setExportModalOpen(true)}
        onDeleteAll={() => setDeleteAllConfirm(true)}
        disabledExport={sections.length === 0}
        disabledDeleteAll={sections.length === 0}
      />
      {/* Hero Panel (Empty State, below Action Bar) */}
      {/* {sections.length === 0 && !importAIModalOpen && !heroSkipped && (
        <NoProfileSections
          onImportWithAI={() => setImportAIModalOpen(true)}
          onImportFromJSON={() => setImportJSONModalOpen(true)}
          onStartManually={handleSkipHero}
        />
        // <ProfileSectionsHeroPanel
        //   onPasteExtract={() => setImportAIModalOpen(true)}
        //   onSkip={handleSkipHero}
        // />
      )} */}
      <ProfileSectionsExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        profileSections={sections}
        onToast={(msg, type = "success") => {
          setToastMessage(msg);
          setToastType(type);
          setToastOpen(true);
        }}
      />
      <NewProfileSectionModal
        open={newSectionModalOpen}
        onClose={() => setNewSectionModalOpen(false)}
        onAdd={({ type, content }) => {
          dispatch(addSection({ type, content }));
          setNewSectionModalOpen(false);
        }}
      />
      {/* Delete All Confirmation Modal */}
      <DeleteAllProfileSectionsModal
        open={deleteAllConfirm}
        onCancel={() => setDeleteAllConfirm(false)}
        onConfirm={handleDeleteAll}
      />
      {/* Import Modal (separate component) */}
      {/* <ProfileSectionsImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSection={(section: ProfileSection) => dispatch(addSection(section))}
        onImportAll={(sectionsArr: ProfileSection[]) => sectionsArr.forEach(section => dispatch(addSection(section)))}
        onToast={(msg, type = "success") => {
          setToastMessage(msg);
          setToastType(type);
          setToastOpen(true);
        }}
      /> */}
      {/* ProfileSectionImportAIModal moved to GetStartedStep */}
      <ProfileSectionsImportJSONModal
        open={importJSONModalOpen}
        onClose={() => setImportJSONModalOpen(false)}
        onImportSection={(section: ProfileSection) => dispatch(addSection(section))}
        onImportAll={(sectionsArr: ProfileSection[]) => sectionsArr.forEach(section => dispatch(addSection(section)))}
        onToast={(msg, type = "success") => {
          setToastMessage(msg);
          setToastType(type);
          setToastOpen(true);
        }}
      />

      {/* Remove Add Section Card - now handled by modal only */}
      <div>
      {sections.length === 0 && (
          <div className="text-gray-500">No profile sections yet. Add one above.</div>
        )}
        {sections.map((section) => (
          <ProfileSectionCard
            key={section.id}
            section={section}
            isCollapsed={collapsed[section.id]}
            onToggleCollapse={() => setCollapsed(c => ({ ...c, [section.id]: !c[section.id] }))}
            onEdit={handleEdit}
            onDelete={handleDelete}
            editingId={editingId}
            editType={editType}
            editContent={editContent}
            setEditType={setEditType}
            setEditContent={setEditContent}
            setEditingId={setEditingId}
          />
        ))}
      </div>
      <Toast
        open={toastOpen}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
};

export const ProfileSectionsStep = createStep({
  id: "profile-sections",
  label: "Profile Sections",
  description: "Add and manage your profile sections."
})(ProfileSections); 