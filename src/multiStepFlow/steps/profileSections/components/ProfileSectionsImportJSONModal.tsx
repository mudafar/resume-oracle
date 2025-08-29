import React, { useState, useRef } from "react";
import { SharedModal, ModalAction } from "../../../../components/shared/modal";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FileUp, Upload, File, Info } from "lucide-react";
import type { ProfileSection } from "@/schemas/profile";
import { nanoid } from "nanoid";

interface JSONImportModalProps {
  open: boolean;
  onClose: () => void;
  onImportAll: (sections: ProfileSection[]) => void;
  onToast: (message: string, type: "success" | "error") => void;
}

export const ProfileSectionsImportJSONModal: React.FC<JSONImportModalProps> = ({
  open,
  onClose,
  onImportAll,
  onToast,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateJSON = (data: any): ProfileSection[] => {
    // Check if data is an array of sections with required format
    if (!Array.isArray(data)) {
      throw new Error("Please use a JSON file exported from this app");
    }

    return data.map((section) => {
      if (!section || typeof section !== "object") {
        throw new Error("Please use a JSON file exported from this app");
      }

      const { id, type, content } = section;

      if (!type || typeof type !== "string") {
        throw new Error("Please use a JSON file exported from this app");
      }

      if (!content || typeof content !== "string") {
        throw new Error("Please use a JSON file exported from this app");
      }

      return {
        id: id || nanoid(8), // Generate ID only if not provided
        type: type.trim(),
        content: content.trim(),
      };
    });
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const validatedSections = validateJSON(data);

      if (validatedSections.length === 0) {
        throw new Error("No valid sections found in the JSON file");
      }

      onImportAll(validatedSections);
      onToast(`Successfully imported ${validatedSections.length} sections`, "success");
      handleClose();
    } catch (error) {
      console.error("Error processing file:", error);
      onToast(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Failed to process JSON file",
        "error"
      );
      setSelectedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.toLowerCase().endsWith(".json")) {
      onToast("Please select a JSON file", "error");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setIsLoading(false);
    setDragActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  // Define modal actions based on current state
  const getActions = (): ModalAction[] => {
    const actions: ModalAction[] = [
      {
        label: "Cancel",
        onClick: handleClose,
        variant: "outline"
      },
      {
        label: "Import",
        onClick: () => selectedFile && processFile(selectedFile),
        variant: "default",
        icon: <FileUp className="w-4 h-4" />,
        loading: isLoading,
        disabled: isLoading || !selectedFile
      }
    ]

    return actions;
  };

  return (
    <SharedModal
      open={open}
      onClose={handleClose}
      title="Import from JSON"
      description="Upload a JSON file containing profile sections to import"
      icon={<FileUp className="w-5 h-5 text-blue-600" />}
      size="xl"
      height="auto"
      actions={getActions()}
      closeOnOverlayClick={!isLoading}
    >
      <div className="p-6 space-y-6 overflow-y-auto h-full">
        {/* File Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer hover:border-primary/50 hover:bg-muted/20 ${dragActive
              ? "border-primary bg-primary/10"
              : selectedFile
                ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                : "border-muted-foreground/25"
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            aria-label="Select JSON file"
          />

          <div className="flex flex-col items-center gap-4 text-center">
            {selectedFile ? (
              <>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <File className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearFile();
                    }}
                    className="text-xs"
                  >
                    Choose Different File
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 justify-center">
                    <p className="font-medium text-foreground">
                      Drop your JSON file here
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>Expected format: JSON with sections containing "type" and "content" fields</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    or click to browse files
                  </p>
                </div>
              </>
            )}
          </div>

          {dragActive && (
            <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
              <p className="text-primary font-medium">Drop file here</p>
            </div>
          )}
        </div>
      </div>
    </SharedModal>
  );
};

