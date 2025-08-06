import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LucideIcon } from "lucide-react";

interface TextareaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  icon?: LucideIcon;
  required?: boolean;
  optional?: boolean;
  showCharCount?: boolean;
  showWordCount?: boolean;
  error?: string;
  className?: string;
  autoFocus?: boolean;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  minHeight = "min-h-[120px]",
  icon: Icon,
  required = false,
  optional = false,
  showCharCount = false,
  showWordCount = false,
  error,
  className = "",
  autoFocus = false
}) => {
  const charCount = value.length;
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="flex items-center gap-2 text-base font-semibold">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        {label}
        {required && <span className="text-red-500">*</span>}
        {optional && (
          <span className="text-muted-foreground text-xs">(optional)</span>
        )}
      </Label>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${minHeight} ${error ? "border-red-500" : ""}`}
        autoFocus={autoFocus}
      />
      <div className="flex items-center justify-between mt-1">
        <div className="text-muted-foreground text-sm">
          {showCharCount && showWordCount && (
            <span>{charCount} chars / {wordCount} words</span>
          )}
          {showCharCount && !showWordCount && (
            <span>{charCount} chars</span>
          )}
          {!showCharCount && showWordCount && (
            <span>{wordCount} words</span>
          )}
        </div>
        {error && (
          <span className="text-red-500 text-xs">{error}</span>
        )}
      </div>
    </div>
  );
};
