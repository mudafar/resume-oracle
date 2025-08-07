import React, { useState, useRef } from "react";
import { SharedModal, ModalAction } from "../shared/modal";
import { Button } from "@/components/ui/button";
import { FileUp, Upload, File, AlertCircle } from "lucide-react";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { nanoid } from "nanoid";
import { ProfileSectionsPreview } from "./ProfileSectionsPreview";

interface JSONImportModalProps {
  open: boolean;
  onClose: () => void;
  onImportSection: (section: ProfileSection) => void;
  onImportAll: (sections: ProfileSection[]) => void;
  onToast: (message: string, type: "success" | "error") => void;
}

export const ProfileSectionsImportJSONModal: React.FC<JSONImportModalProps> = ({
  open,
  onClose,
  onImportSection,
  onImportAll,
  onToast,
}) => {
  const [sections, setSections] = useState<ProfileSection[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateJSON = (data: any): ProfileSection[] => {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid JSON format");
    }

    let sectionsToValidate: any[] = [];

    // Handle different JSON structures
    if (Array.isArray(data)) {
      sectionsToValidate = data;
    } else if (data.sections && Array.isArray(data.sections)) {
      sectionsToValidate = data.sections;
    } else if (data.profile && Array.isArray(data.profile)) {
      sectionsToValidate = data.profile;
    } else {
      // Try to extract sections from object properties
      sectionsToValidate = Object.entries(data).map(([key, value]) => ({
        type: key,
        content: typeof value === "string" ? value : JSON.stringify(value),
      }));
    }

    return sectionsToValidate.map((section, index) => {
      if (!section || typeof section !== "object") {
        throw new Error(`Invalid section format at index ${index}`);
      }

      const { type, content } = section;

      if (!type || typeof type !== "string") {
        throw new Error(`Missing or invalid type in section ${index}`);
      }

      if (!content || typeof content !== "string") {
        throw new Error(`Missing or invalid content in section ${index}`);
      }

      return {
        id: nanoid(8),
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

      setSections(validatedSections);
      onToast(`Successfully loaded ${validatedSections.length} sections`, "success");
    } catch (error) {
      console.error("Error processing file:", error);
      onToast(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Failed to process JSON file",
        "error"
      );
      setSections([]);
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
    setSections([]); // Clear previous sections
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

  const handleImportAndPreview = () => {
    if (!selectedFile) return;
    processFile(selectedFile);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setSections([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditSection = (id: string, content: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, content } : section
      )
    );
  };

  const handleRemoveSection = (id: string) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
  };

  const handleImportAll = () => {
    if (sections.length === 0) return;
    onImportAll(sections);
    onToast(`Imported ${sections.length} sections successfully`, "success");
    handleClose();
  };

  const handleClose = () => {
    setSections([]);
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
      }
    ];

    if (sections.length > 0) {
      actions.push(
        {
          label: "Clear Preview",
          onClick: () => setSections([]),
          variant: "ghost"
        },
        {
          label: `Import All (${sections.length})`,
          onClick: handleImportAll,
          variant: "default",
          icon: <FileUp className="w-4 h-4" />
        }
      );
    }

    return actions;
  };

  return (
    <SharedModal
      open={open}
      onClose={handleClose}
      title="Import from JSON"
      description="Upload a JSON file containing profile sections to import and preview"
      icon={<FileUp className="w-5 h-5 text-blue-600" />}
      badge={sections.length > 0 ? { text: `${sections.length} sections loaded`, variant: "secondary" } : undefined}
      size="xl"
      height="full"
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
                  <p className="font-medium text-foreground">
                    Drop your JSON file here
                  </p>
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

        {/* Format Helper */}
        {!selectedFile && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">
                  Expected JSON Format
                </h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Your JSON should contain sections with "type" and "content" fields:</p>
                  <pre className="bg-background rounded px-2 py-1 mt-2 text-xs overflow-x-auto">
                    {`[
  {
    "id": "12345678",
    "type": "summary",
    "content": "Professional summary text..."
  },
  {
    "id": "87654321",
    "type": "experience", 
    "content": "Work experience details..."
  }
]`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Import Button */}
        {selectedFile && sections.length === 0 && (
          <div className="flex justify-center">
            <Button
              onClick={handleImportAndPreview}
              disabled={isLoading}
              className="flex items-center gap-2"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileUp className="w-4 h-4" />
                  Import & Preview
                </>
              )}
            </Button>
          </div>
        )}

        {/* Preview Section */}
        {sections.length > 0 && (
          <ProfileSectionsPreview
            sections={sections}
            onEdit={handleEditSection}
            onRemove={handleRemoveSection}
            onImportAll={handleImportAll}
          />
        )}
      </div>
    </SharedModal>
  );
};

