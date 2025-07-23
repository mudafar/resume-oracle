import { Button } from "@/components/ui/button";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { Check, Edit3, Trash2 } from "lucide-react";
import { useState } from "react";

// Shared Preview Component
export const ProfileSectionsPreview: React.FC<{
  sections: ProfileSection[];
  onEdit: (id: string, content: string) => void;
  onRemove: (id: string) => void;
  onImportAll: () => void;
}> = ({ sections, onEdit, onRemove, onImportAll }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const handleEditStart = (section: ProfileSection) => {
    setEditingId(section.id);
    setEditingContent(section.content);
  };

  const handleEditSave = (id: string) => {
    onEdit(id, editingContent);
    setEditingId(null);
    setEditingContent("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingContent("");
  };

  if (sections.length === 0) return null;

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          Preview ({sections.length} sections)
        </h3>
        <Button
          onClick={onImportAll}
          size="sm"
          className="flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Import All
        </Button>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2">
        {sections.map((section) => (
          <div
            key={section.id}
            className="flex items-start gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground capitalize px-2 py-1 bg-background rounded-md">
                  {section.type}
                </span>
              </div>
              
              {editingId === section.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") handleEditCancel();
                    }}
                    className="w-full min-h-[80px] resize-y rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEditSave(section.id)}
                      disabled={!editingContent.trim()}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-foreground/90 line-clamp-3 leading-relaxed">
                  {section.content}
                </p>
              )}
            </div>

            <div className="flex gap-1">
              {editingId !== section.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditStart(section)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  aria-label="Edit section"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(section.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                aria-label="Remove section"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
