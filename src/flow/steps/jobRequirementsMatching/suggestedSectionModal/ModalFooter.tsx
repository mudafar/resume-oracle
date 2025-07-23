import React from "react";
import { Button } from "@/components/ui/button";
import { SkipForward, Save, ArrowRight, Plus } from "lucide-react";

export const ModalFooter = ({
  isLoading,
  onSkip,
  isEditing,
  baseId,
  onSaveOnly,
  onSaveAndMatch,
  type,
  content,
  onlyBtnLabel,
  matchBtnLabel,
  disabled,
}) => (
  <>
    <Button
      variant="outline"
      onClick={onSkip}
      disabled={isLoading}
      className="mr-auto"
    >
      <SkipForward className="mr-2 h-4 w-4" />
      Skip
    </Button>
    <div className="flex gap-2">
      <Button
        variant="secondary"
        onClick={() =>
          isEditing
            ? baseId && onSaveOnly({ type, content, baseId })
            : onSaveOnly({ type, content, baseId: "" })
        }
        disabled={disabled}
      >
        <Save className="mr-2 h-4 w-4" />
        {onlyBtnLabel}
      </Button>
      <Button
        onClick={() =>
          isEditing
            ? baseId && onSaveAndMatch({ type, content, baseId })
            : onSaveAndMatch({ type, content, baseId: "" })
        }
        disabled={disabled}
        className=""
      >
        {isEditing ? (
          <ArrowRight className="mr-2 h-4 w-4" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        {matchBtnLabel}
      </Button>
    </div>
  </>
); 