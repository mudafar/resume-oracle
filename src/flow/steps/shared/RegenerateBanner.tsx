import React from "react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

interface RegenerateBannerProps {
  show: boolean;
  isLoading: boolean;
  onRegenerate: () => void;
  onDismiss: () => void;
  message?: string;
}

export const RegenerateBanner: React.FC<RegenerateBannerProps> = ({ show, isLoading, onRegenerate, onDismiss, message }) => {
  if (!show) return null;
  return (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span className="text-amber-800">
          {message || 'Your inputs have changed since the last generation.'}
        </span>
        <div className="flex gap-2 ml-4">
          <Button
            size="sm"
            onClick={onRegenerate}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate Now
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDismiss}
          >
            <X className="w-4 h-4 mr-2" />
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}; 