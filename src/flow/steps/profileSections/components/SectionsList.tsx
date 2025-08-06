import React from "react";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { ProfileSectionCard } from "../ProfileSectionCard";

interface SectionsListProps {
  sections: ProfileSection[];
  collapsed: Record<string, boolean>;
  onToggleCollapse: (id: string) => void;
  onEdit: (id: string, type: string, content: string) => void;
  onDelete: (id: string) => void;
  editingId: string | null;
  editType: any;
  editContent: string;
  setEditType: (type: any) => void;
  setEditContent: (content: string) => void;
  setEditingId: (id: string | null) => void;
}

export const SectionsList: React.FC<SectionsListProps> = ({
  sections,
  collapsed,
  onToggleCollapse,
  onEdit,
  onDelete,
  editingId,
  editType,
  editContent,
  setEditType,
  setEditContent,
  setEditingId
}) => {
  if (sections.length === 0) {
    return (
      <div className="text-gray-500">No profile sections yet. Add one above.</div>
    );
  }

  return (
    <div>
      {sections.map((section) => (
        <ProfileSectionCard
          key={section.id}
          section={section}
          isCollapsed={collapsed[section.id]}
          onToggleCollapse={() => onToggleCollapse(section.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          editingId={editingId}
          editType={editType}
          editContent={editContent}
          setEditType={setEditType}
          setEditContent={setEditContent}
          setEditingId={setEditingId}
        />
      ))}
    </div>
  );
};
