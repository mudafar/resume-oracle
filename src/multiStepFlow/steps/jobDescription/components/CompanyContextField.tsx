import React from "react";
import { TextareaField } from "@/components/shared/forms/TextareaField";
import { Building2 } from "lucide-react";

interface CompanyContextFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const CompanyContextField: React.FC<CompanyContextFieldProps> = ({
  value,
  onChange
}) => {
  return (
    <TextareaField
      id="company-context"
      label="Company Culture / Values"
      value={value}
      onChange={onChange}
      placeholder="We value transparency, customer obsession..."
      icon={Building2}
      optional
      minHeight="min-h-[60px]"
      showCharCount
    />
  );
};
