"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw } from 'lucide-react';

interface RematchBannerProps {
  onRematch: () => void;
  onDismiss: () => void;
}

export const RematchBanner: React.FC<RematchBannerProps> = ({ onRematch, onDismiss }) => (
  <Alert className="sticky top-0 z-10 bg-yellow-50 border-yellow-400 text-yellow-800 mb-4">
    <AlertTitle>Inputs Changed</AlertTitle>
    <AlertDescription>
      <div className="flex items-center justify-between">
        <span>
          Your job description or profile sections have changed since the last match. Your matches may be outdated.
        </span>
        <div className="flex gap-2 ml-4">
          <Button onClick={onRematch} size="sm"><RefreshCw className="mr-2 h-4 w-4" /> Rematch Now</Button>
          <Button onClick={onDismiss} size="sm" variant="outline">Dismiss</Button>
        </div>
      </div>
    </AlertDescription>
  </Alert>
);