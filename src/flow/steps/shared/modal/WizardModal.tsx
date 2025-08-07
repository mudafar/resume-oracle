import React from 'react';
import { SharedModal, ModalAction } from './SharedModal';

interface WizardModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  stepLabel?: string;
  
  // Navigation
  onNext?: () => void;
  onBack?: () => void;
  onFinish?: () => void;
  
  // Button labels
  nextLabel?: string;
  backLabel?: string;
  finishLabel?: string;
  cancelLabel?: string;
  
  // State
  isLoading?: boolean;
  canNext?: boolean;
  canFinish?: boolean;
  
  // Styling
  icon?: React.ReactNode;
}

export const WizardModal: React.FC<WizardModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  currentStep,
  totalSteps,
  stepLabel,
  onNext,
  onBack,
  onFinish,
  nextLabel = 'Next',
  backLabel = 'Back',
  finishLabel = 'Finish',
  cancelLabel = 'Cancel',
  isLoading = false,
  canNext = true,
  canFinish = true,
  icon
}) => {
  const isLastStep = currentStep >= totalSteps;
  const isFirstStep = currentStep <= 1;

  const actions: ModalAction[] = [
    {
      label: cancelLabel,
      onClick: onClose,
      variant: 'outline',
      disabled: isLoading
    }
  ];

  if (!isFirstStep && onBack) {
    actions.push({
      label: backLabel,
      onClick: onBack,
      variant: 'ghost',
      disabled: isLoading
    });
  }

  if (isLastStep && onFinish) {
    actions.push({
      label: finishLabel,
      onClick: onFinish,
      variant: 'default',
      loading: isLoading,
      disabled: isLoading || !canFinish
    });
  } else if (!isLastStep && onNext) {
    actions.push({
      label: nextLabel,
      onClick: onNext,
      variant: 'default',
      loading: isLoading,
      disabled: isLoading || !canNext
    });
  }

  const badge = stepLabel || `Step ${currentStep} of ${totalSteps}`;

  return (
    <SharedModal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      icon={icon}
      badge={{ text: badge, variant: 'secondary' }}
      variant="wizard"
      actions={actions}
      showBackButton={!isFirstStep && !!onBack}
      onBack={onBack}
      backButtonLabel={backLabel}
      closeOnOverlayClick={!isLoading}
    >
      {children}
    </SharedModal>
  );
};
