import React, { useState } from "react";
import { FormModal } from "../../../components/shared/modal";
import { SectionTypeEnum, sectionTypes } from "@/types/store";
import { Plus } from "lucide-react";

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

  const handleSubmit = () => {
    if (!content.trim()) return;
    onAdd({ type, content: content.trim() });
    resetAndClose();
  };

  const resetAndClose = () => {
    setType(SectionTypeEnum.Experience);
    setContent("");
    onClose();
  };

  const isValid = content.trim().length > 0;

  return (
    <FormModal
      open={open}
      onClose={resetAndClose}
      onSubmit={handleSubmit}
      title="New Profile Section"
      description="Add content that reflects your experience, skills, or accomplishments."
      submitLabel="Add Section"
      cancelLabel="Cancel"
      isValid={isValid}
      icon={<Plus className="w-5 h-5 text-blue-600" />}
      size="md"
    >
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
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
      </form>
    </FormModal>
  );
};
