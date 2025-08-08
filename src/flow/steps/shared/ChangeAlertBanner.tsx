"use client";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export interface ChangeAlertBannerProps {
  title?: string;
  message: string;
  subtitle?: string;
  ctaText: string;
  onCta: () => void;
  onDismiss: () => void;
  className?: string;
}

export const ChangeAlertBanner: React.FC<ChangeAlertBannerProps> = ({
  title = "Inputs changed",
  message,
  subtitle,
  ctaText,
  onCta,
  onDismiss,
  className,
}) => {
  return (
    <Alert className={`top-0 z-10 mb-4 ${className ?? ""}`}>
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{message}</span>
            {subtitle ? (
              <span className="text-xs text-muted-foreground/80">{subtitle}</span>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button onClick={onCta} size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> {ctaText}
            </Button>
            <Button onClick={onDismiss} size="sm" variant="outline">
              Dismiss
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ChangeAlertBanner;
