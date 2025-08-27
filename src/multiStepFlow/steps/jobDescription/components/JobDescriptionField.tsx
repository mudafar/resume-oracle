import React, { memo } from "react";
import { TextareaField } from "@/components/shared/forms/TextareaField";
import { FileText } from "lucide-react";

interface JobDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const JobDescriptionField: React.FC<JobDescriptionFieldProps> = memo(({
  value,
  onChange
}) => {
  const isValid = value.trim().length > 0;
  const error = !isValid ? "Job description is required." : undefined;

  return (
    <div role="group" aria-labelledby="job-description-label">
      <TextareaField
        id="job-description"
        label="Job Description"
        value={value}
        onChange={onChange}
        placeholder="We're looking for a Senior Backend Engineer with experience in Node.js, React, and cloud technologies..."
        icon={FileText}
        required
        autoFocus
        minHeight="min-h-[180px]"
        showCharCount
        showWordCount
        error={error}
        className="transition-colors focus-within:ring-2 focus-within:ring-primary/20"
      />
    </div>
  );
});

JobDescriptionField.displayName = "JobDescriptionField";
