import { useState, useCallback } from "react";

interface UseModalManagerReturn {
  // Modal states
  newSectionModalOpen: boolean;
  exportModalOpen: boolean;
  importModalOpen: boolean;
  deleteAllConfirm: boolean;

  // Modal actions
  openNewSectionModal: () => void;
  closeNewSectionModal: () => void;

  openExportModal: () => void;
  closeExportModal: () => void;

  openImportModal: () => void;
  closeImportModal: () => void;

  openDeleteAllConfirm: () => void;
  closeDeleteAllConfirm: () => void;
}

export const useModalManager = (): UseModalManagerReturn => {
  // Modal states
  const [newSectionModalOpen, setNewSectionModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);

  // Modal actions
  const openNewSectionModal = useCallback(() => {
    setNewSectionModalOpen(true);
  }, []);

  const closeNewSectionModal = useCallback(() => {
    setNewSectionModalOpen(false);
  }, []);

  const openExportModal = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  const closeExportModal = useCallback(() => {
    setExportModalOpen(false);
  }, []);

  const openImportModal = useCallback(() => {
    setImportModalOpen(true);
  }, []);

  const closeImportModal = useCallback(() => {
    setImportModalOpen(false);
  }, []);

  const openDeleteAllConfirm = useCallback(() => {
    setDeleteAllConfirm(true);
  }, []);

  const closeDeleteAllConfirm = useCallback(() => {
    setDeleteAllConfirm(false);
  }, []);

  return {
    // Modal states
    newSectionModalOpen,
    exportModalOpen,
    importModalOpen,
    deleteAllConfirm,

    // Modal actions
    openNewSectionModal,
    closeNewSectionModal,
    openExportModal,
    closeExportModal,
    openImportModal,
    closeImportModal,
    openDeleteAllConfirm,
    closeDeleteAllConfirm,
  };
};
