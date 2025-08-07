import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

interface ModalProps {
  // Core modal props
  open: boolean;
  onClose: () => void;
  
  // Header configuration
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  
  // Size and layout
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  height?: 'auto' | 'full' | 'tall';
  
  // Content
  children: React.ReactNode;
  
  // Footer actions
  actions?: ModalAction[];
  
  // Navigation (for multi-step modals)
  showBackButton?: boolean;
  onBack?: () => void;
  backButtonLabel?: string;
  
  // Styling and behavior
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  
  // Variants for different modal types
  variant?: 'default' | 'confirmation' | 'form' | 'wizard' | 'fullscreen';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg', 
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw]'
};

const heightClasses = {
  auto: '',
  full: 'h-[90vh]',
  tall: 'min-h-[70vh] max-h-[90vh]'
};

const variantClasses = {
  default: '',
  confirmation: 'max-w-md',
  form: 'max-w-lg',
  wizard: 'min-w-[75vw] h-[90vh]',
  fullscreen: 'max-w-[95vw] h-[95vh]'
};

export const SharedModal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  icon,
  badge,
  size = 'md',
  height = 'auto',
  children,
  actions = [],
  showBackButton = false,
  onBack,
  backButtonLabel = 'Back',
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
  variant = 'default'
}) => {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && closeOnOverlayClick) {
      onClose();
    }
  };

  const modalClasses = cn(
    variant !== 'default' ? variantClasses[variant] : sizeClasses[size],
    heightClasses[height],
    'overflow-hidden',
    className
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className={modalClasses}
        showCloseButton={false} // We'll handle close button manually
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b min-h-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {icon && (
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-1">
                <DialogTitle className="text-xl truncate">
                  {title}
                </DialogTitle>
                {badge && (
                  <Badge variant={badge.variant || 'secondary'} className="text-xs flex-shrink-0">
                    {badge.text}
                  </Badge>
                )}
              </div>
              {description && (
                <DialogDescription className="text-sm">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {showBackButton && onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {backButtonLabel}
              </Button>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className={cn(
          'min-h-0 overflow-hidden',
          height === 'full' || height === 'tall' ? 'flex-1' : '',
          actions.length > 0 ? 'pb-0' : 'pb-6'
        )}>
          {children}
        </div>

        {actions.length > 0 && (
          <DialogFooter className="border-t pt-4 flex-shrink-0">
            <div className="flex justify-end gap-2 w-full">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  onClick={action.onClick}
                  disabled={action.disabled || action.loading}
                  className={cn('flex items-center gap-2', action.className)}
                >
                  {action.icon}
                  {action.loading ? 'Loading...' : action.label}
                </Button>
              ))}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
