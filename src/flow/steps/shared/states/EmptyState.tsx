import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileWarning, 
  Inbox, 
  Search, 
  Plus, 
  FileText,
  AlertCircle 
} from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  actionButton?: {
    text: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  className?: string;
  variant?: 'card' | 'minimal' | 'bordered';
  size?: 'sm' | 'default' | 'lg';
  iconType?: 'warning' | 'inbox' | 'search' | 'add' | 'file' | 'alert';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionButton,
  secondaryButton,
  className = "",
  variant = "minimal",
  size = "default",
  iconType = "inbox"
}) => {
  const getDefaultIcon = () => {
    if (icon) return icon;
    
    const iconClass = "h-12 w-12 text-muted-foreground";
    
    switch (iconType) {
      case 'warning':
        return <FileWarning className={iconClass} />;
      case 'search':
        return <Search className={iconClass} />;
      case 'add':
        return <Plus className={iconClass} />;
      case 'file':
        return <FileText className={iconClass} />;
      case 'alert':
        return <AlertCircle className={iconClass} />;
      default:
        return <Inbox className={iconClass} />;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return "py-8";
      case 'lg':
        return "py-20";
      default:
        return "py-12";
    }
  };

  const content = (
    <div className={`text-center ${getPadding()}`}>
      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex justify-center">
          {getDefaultIcon()}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground">{message}</p>
        </div>
        {(actionButton || secondaryButton) && (
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
            {actionButton && (
              <Button
                variant={actionButton.variant || 'default'}
                onClick={actionButton.onClick}
              >
                {actionButton.text}
              </Button>
            )}
            {secondaryButton && (
              <Button
                variant={secondaryButton.variant || 'outline'}
                onClick={secondaryButton.onClick}
              >
                {secondaryButton.text}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'bordered') {
    return (
      <div className={`border-2 border-dashed border-muted-foreground/25 rounded-lg ${className}`}>
        {content}
      </div>
    );
  }

  // Default minimal variant
  return (
    <div className={className}>
      {content}
    </div>
  );
};
