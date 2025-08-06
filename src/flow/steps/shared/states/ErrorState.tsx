import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, RefreshCw } from "lucide-react";

export interface ErrorStateProps {
  error: string | Error;
  title?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
  variant?: 'alert' | 'card' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
  customIcon?: React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  title = "Error",
  onRetry,
  retryText = "Retry",
  className = "",
  variant = "alert",
  size = "default",
  showIcon = true,
  customIcon
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  const getIcon = () => {
    if (!showIcon) return null;
    if (customIcon) return customIcon;
    return variant === 'alert' ? <AlertCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />;
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return "py-6";
      case 'lg':
        return "py-16";
      default:
        return "py-12";
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={`text-center ${getPadding()} ${className}`}>
        <div className="space-y-3">
          {getIcon() && (
            <div className="flex justify-center text-destructive">
              {getIcon()}
            </div>
          )}
          <div className="space-y-1">
            <h3 className="font-medium text-destructive">{title}</h3>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          </div>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {retryText}
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardContent className={`flex items-center justify-center ${getPadding()}`}>
          <div className="text-center space-y-4 max-w-md">
            {getIcon() && (
              <div className="flex justify-center text-destructive">
                {getIcon()}
              </div>
            )}
            <div className="space-y-2">
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </div>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {retryText}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default alert variant
  return (
    <Alert variant="destructive" className={className}>
      {getIcon()}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p className="mb-2">{errorMessage}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {retryText}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
