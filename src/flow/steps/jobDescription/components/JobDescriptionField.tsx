import React from "react";
import { TextareaField } from "../../shared/forms/TextareaField";
import { FileText } from "lucide-react";

interface JobDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const JobDescriptionField: React.FC<JobDescriptionFieldProps> = ({
  value,
  onChange
}) => {
  return (
    <TextareaField
      id="job-description"
      label="Job Description"
      value={value}
      onChange={onChange}
      placeholder="We're looking for a Senior Backend Engineer..."
      icon={FileText}
      required
      autoFocus
      minHeight="min-h-[180px]"
      showCharCount
      showWordCount
      error={value.trim() === "" ? "Job description is required." : undefined}
    />
  );
};
