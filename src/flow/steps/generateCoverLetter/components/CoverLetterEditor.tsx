import React from "react";
import { EditorCard, EditorCardProps } from "../../shared/cards/EditorCard";
import { Mail } from "lucide-react";

interface CoverLetterEditorProps {
  editMode: boolean;
  onToggleEdit: (editing: boolean) => void;
  coverLetter: string;
  onContentChange: (content: string) => void;
  actionBarProps?: EditorCardProps['actionBarProps'];
}

export const CoverLetterEditor: React.FC<CoverLetterEditorProps> = ({
  editMode,
  onToggleEdit,
  coverLetter,
  onContentChange,
  actionBarProps
}) => {
  return (
    <EditorCard
      title="Cover Letter Editor"
      icon={<Mail className="h-5 w-5" />}
      editMode={editMode}
      content={coverLetter}
      onToggleEdit={onToggleEdit}
      onContentChange={onContentChange}
      placeholder="Your cover letter content in Markdown format..."
      minHeight="min-h-[500px]"
      actionBarProps={actionBarProps}
    />
  );
};
