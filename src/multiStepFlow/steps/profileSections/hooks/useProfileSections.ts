import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  editSection,
  deleteSection,
  setSections,
} from "@/store/slices/profileSectionsSlice";
import { SectionTypeEnum } from "@/types/store";
import { addProfileSectionReturnId } from "@/utils/createProfileSection";
import { exportSectionsToJson, importSectionsFromJson } from "../utils/profileSectionsExportImport";
import type { ProfileSection } from "@/schemas/profile";

interface UseProfileSectionsReturn {
  sections: ProfileSection[];
  isLoading: boolean;
  error: string | null;

  // CRUD operations
  addSection: (type: SectionTypeEnum, content: string) => void;
  editSection: (id: string, type: string, content: string) => void;
  deleteSection: (id: string) => void;
  deleteAllSections: () => void;

  // Import/Export
  exportSections: () => void;
  importSections: (file: File) => Promise<void>;

  // UI state
  collapsedSections: Record<string, boolean>;
  toggleCollapse: (id: string) => void;
}

export const useProfileSections = (): UseProfileSectionsReturn => {
  const sections = useSelector((state: RootState) => state.profileSections.sections);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Initialize collapsed state for all sections
  useEffect(() => {
    setCollapsedSections(prev => {
      const next: Record<string, boolean> = { ...prev };
      sections.forEach(section => {
        if (!(section.id in next)) {
          next[section.id] = true; // Default to collapsed
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

  const handleAddSection = useCallback((type: SectionTypeEnum, content: string) => {
    if (content.trim()) {
      addProfileSectionReturnId(dispatch, type, content);
    }
  }, [dispatch]);

  const handleEditSection = useCallback((id: string, type: string, content: string) => {
    dispatch(editSection({ id, type, content }));
  }, [dispatch]);

  const handleDeleteSection = useCallback((id: string) => {
    if (window.confirm("Delete this section?")) {
      dispatch(deleteSection(id));
    }
  }, [dispatch]);

  const handleDeleteAllSections = useCallback(() => {
    dispatch(setSections([]));
  }, [dispatch]);

  const handleExportSections = useCallback(() => {
    exportSectionsToJson(sections);
  }, [sections]);

  const handleImportSections = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const importedSections = await importSectionsFromJson(file);
      dispatch(setSections(importedSections));
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Failed to import sections.");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const toggleCollapse = useCallback((id: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  return {
    sections,
    isLoading,
    error,
    addSection: handleAddSection,
    editSection: handleEditSection,
    deleteSection: handleDeleteSection,
    deleteAllSections: handleDeleteAllSections,
    exportSections: handleExportSections,
    importSections: handleImportSections,
    collapsedSections,
    toggleCollapse,
  };
};
