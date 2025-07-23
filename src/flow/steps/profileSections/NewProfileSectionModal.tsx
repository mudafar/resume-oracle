import React, { useState } from "react";
import {
  Button,
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionTypeEnum, sectionTypes } from "@/store/slices/profileSectionsSlice";
import { Plus, X } from "lucide-react";

interface NewProfileSectionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: { type: SectionTypeEnum; content: string }) => void;
}

export const NewProfileSectionModal: React.FC<NewProfileSectionModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [type, setType] = useState<SectionTypeEnum>(SectionTypeEnum.Experience);
  const [content, setContent] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAdd({ type, content: content.trim() });
    resetAndClose();
  };

  const resetAndClose = () => {
    setType(SectionTypeEnum.Experience);
    setContent("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 animate-in fade-in zoom-in-95">
        <CardHeader className="flex items-start justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              New Profile Section
            </CardTitle>
            <CardDescription>
              Add content that reflects your experience, skills, or accomplishments.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={resetAndClose}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Section Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">
                Section Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as SectionTypeEnum)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {Object.entries(sectionTypes).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your section content here..."
                className="w-full min-h-[120px] resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={resetAndClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!content.trim()}>
                <Plus className="w-4 h-4 mr-1" />
                Add Section
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
