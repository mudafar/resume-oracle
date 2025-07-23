import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Bell, ArrowRight } from "lucide-react";

interface ModelConfigPromptProps {
  show: boolean;
  onClose: () => void;
  onConfigure: () => void;
}

export const ModelConfigPrompt: React.FC<ModelConfigPromptProps> = ({ show, onClose, onConfigure }) => {
  if (!show) return null;
  return (
    <Alert className="mb-4 flex items-center justify-between">
      <AlertTitle className="flex items-center gap-2">
        <Bell className="w-6 h-6" />
        You’re using the Free limited model by default <ArrowRight/>
        <Button variant="link" onClick={onConfigure}>
          Configure Model
        </Button>
      </AlertTitle>
      <Button variant="ghost" size="icon" onClick={onClose} aria-label="Dismiss">
        <X className="w-6 h-6" />
      </Button>
    </Alert>
  );
}; 