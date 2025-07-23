import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, X, Trash2 } from "lucide-react";

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
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <Card className="w-full max-w-md mx-4 animate-in fade-in zoom-in-95">
        <CardHeader className="flex items-start justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <CardTitle className="text-lg text-destructive">
              Delete All Sections
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={onCancel}
            aria-label="Close delete confirmation modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Warning Message */}
          <CardDescription className="text-base">
            Are you sure you want to delete all profile sections? This action cannot be undone.
          </CardDescription>

          {/* Confirmation Details */}
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
            <p className="text-sm text-destructive-foreground">
              All your experience, skills, education, and other profile sections will be permanently removed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={onConfirm}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 