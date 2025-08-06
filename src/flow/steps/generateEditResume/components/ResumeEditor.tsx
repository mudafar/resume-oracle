import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface ResumeEditorProps {
  editMode: boolean;
  editedResume: string;
  resume: string;
  onResumeChange: (value: string) => void;
  markdownContentRef: React.RefObject<HTMLDivElement | null>;
  renderMarkdown: (content: string) => React.ReactNode;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  editMode,
  editedResume,
  resume,
  onResumeChange,
  markdownContentRef,
  renderMarkdown
}) => {
  return (
    <>
      {editMode ? (
        <Textarea
          value={editedResume}
          onChange={(e) => onResumeChange(e.target.value)}
          className="w-full h-[800px] font-mono text-sm resize-none border-0 p-4 focus:ring-0 bg-gray-50 rounded-md"
          placeholder="Edit your resume in Markdown format..."
        />
      ) : (
        <div
          ref={markdownContentRef}
          className="prose prose-lg max-w-none"
          style={{
            lineHeight: '1.7',
            color: '#374151',
          }}
        >
          {renderMarkdown(editMode ? editedResume : resume)}
        </div>
      )}
    </>
  );
};
