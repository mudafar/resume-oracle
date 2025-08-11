import React from 'react';
import { SharedModal, ModalAction } from './SharedModal';
import { AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
  details?: string;
}

const variantConfig = {
  destructive: {
    icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
    confirmVariant: 'destructive' as const,
    titleClass: 'text-destructive',
    detailsClass: 'bg-destructive/10 border-destructive/20 text-destructive-foreground'
  },
  warning: {
    icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
    confirmVariant: 'default' as const,
    titleClass: 'text-amber-600',
    detailsClass: 'bg-amber-50 border-amber-200 text-amber-800'
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-600" />,
    confirmVariant: 'default' as const,
    titleClass: 'text-blue-600',
    detailsClass: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  success: {
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    confirmVariant: 'default' as const,
    titleClass: 'text-green-600',
    detailsClass: 'bg-green-50 border-green-200 text-green-800'
  }
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning',
  isLoading = false,
  details
}) => {
  const config = variantConfig[variant];

  const actions: ModalAction[] = [
    {
      label: cancelLabel,
      onClick: onClose,
      variant: 'outline',
      disabled: isLoading
    },
    {
      label: confirmLabel,
      onClick: onConfirm,
      variant: config.confirmVariant,
      loading: isLoading,
      disabled: isLoading
    }
  ];

  return (
    <SharedModal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      icon={config.icon}
      size="sm"
      variant="confirmation"
      actions={actions}
      closeOnOverlayClick={!isLoading}
    >
      <div className="space-y-4 p-6">
        {details && (
          <div className={`rounded-md border p-3 ${config.detailsClass}`}>
            <p className="text-sm">{details}</p>
          </div>
        )}
      </div>
    </SharedModal>
  );
};
