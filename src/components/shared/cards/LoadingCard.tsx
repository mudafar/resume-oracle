import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export interface LoadingCardProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'minimal' | 'centered';
  showSpinner?: boolean;
  customSpinner?: React.ReactNode;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  title = "Loading",
  message = "Please wait while we process your request...",
  icon,
  className = "",
  size = "default",
  variant = "default",
  showSpinner = true,
  customSpinner
}) => {
  const getCardHeight = () => {
    switch (size) {
      case 'sm':
        return "h-32";
      case 'lg':
        return "h-64";
      default:
        return "h-48";
    }
  };

  const getSpinner = () => {
    if (!showSpinner) return null;
    
    if (customSpinner) return customSpinner;
    
    return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
  };

  if (variant === 'minimal') {
    return (
      <Card className={`${getCardHeight()} ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-3">
            {getSpinner()}
            <span className="text-muted-foreground">{message}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'centered') {
    return (
      <Card className={`${getCardHeight()} ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {icon || getSpinner()}
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {message}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon || getSpinner()}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-3">
            {!icon && getSpinner()}
            <p className="text-muted-foreground">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
