import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";

export interface CopyButtonProps {
  onCopy: () => void;
  copied?: boolean;
  text?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  disabled?: boolean;
  className?: string;
  showBadge?: boolean;
  badgeText?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  onCopy,
  copied = false,
  text = "Copy",
  variant = "outline",
  size = "sm",
  disabled = false,
  className = "",
  showBadge = true,
  badgeText = "Copied!"
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={variant}
        size={size}
        onClick={onCopy}
        disabled={disabled}
        className={className}
      >
        {copied ? (
          <Check className="w-4 h-4 mr-2" />
        ) : (
          <Copy className="w-4 h-4 mr-2" />
        )}
        {text}
      </Button>
      {copied && showBadge && (
        <Badge variant="outline" className="text-green-600 border-green-300">
          {badgeText}
        </Badge>
      )}
    </div>
  );
};
