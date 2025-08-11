import React from 'react';
import { SharedModal, ModalAction } from './SharedModal';
import { Save, Plus } from 'lucide-react';

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  isValid?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const FormModal: React.FC<FormModalProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  description,
  children,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isLoading = false,
  isValid = true,
  icon,
  size = 'md'
}) => {
  const actions: ModalAction[] = [
    {
      label: cancelLabel,
      onClick: onClose,
      variant: 'outline',
      disabled: isLoading
    },
    {
      label: submitLabel,
      onClick: onSubmit,
      variant: 'default',
      loading: isLoading,
      disabled: isLoading || !isValid,
      icon: submitLabel.toLowerCase().includes('add') ? <Plus className="w-4 h-4" /> : <Save className="w-4 h-4" />
    }
  ];

  return (
    <SharedModal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      icon={icon}
      size={size}
      variant="form"
      actions={actions}
      closeOnOverlayClick={!isLoading}
    >
      <div className="p-6">
        {children}
      </div>
    </SharedModal>
  );
};
