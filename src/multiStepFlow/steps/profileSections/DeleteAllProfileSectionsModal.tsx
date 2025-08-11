import React from "react";
import { ConfirmationModal } from "../../../components/shared/modal";
import { Trash2 } from "lucide-react";

interface DeleteAllProfileSectionsModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteAllProfileSectionsModal: React.FC<DeleteAllProfileSectionsModalProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  return (
    <ConfirmationModal
      open={open}
      onClose={onCancel}
      onConfirm={onConfirm}
      title="Delete All Sections"
      description="Are you sure you want to delete all profile sections? This action cannot be undone."
      confirmLabel="Delete All"
      cancelLabel="Cancel"
      variant="destructive"
      details="All your experience, skills, education, and other profile sections will be permanently removed."
    />
  );
}; 