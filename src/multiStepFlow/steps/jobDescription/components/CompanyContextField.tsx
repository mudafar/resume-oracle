import React, { memo } from "react";
import { TextareaField } from "@/components/shared/forms/TextareaField";
import { Building2 } from "lucide-react";

interface CompanyContextFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const CompanyContextField: React.FC<CompanyContextFieldProps> = memo(({
  value,
  onChange
}) => {
  return (
    <div role="group" aria-labelledby="company-context-label">
      <TextareaField
        id="company-context"
        label="Company Culture & Values"
        value={value}
        onChange={onChange}
        placeholder="We value transparency, customer obsession, and continuous learning. Our team embraces agile methodologies..."
        icon={Building2}
        optional
        minHeight="min-h-[120px]"
        showCharCount
        className="transition-colors focus-within:ring-2 focus-within:ring-primary/20"
      />
    </div>
  );
});

CompanyContextField.displayName = "CompanyContextField";
