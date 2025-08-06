import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  message?: string;
  className?: string;
  variant?: 'spinner' | 'skeleton' | 'card' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  skeletonCount?: number;
  customSpinner?: React.ReactNode;
  showMessage?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  className = "",
  variant = "spinner",
  size = "default",
  skeletonCount = 3,
  customSpinner,
  showMessage = true
}) => {
  const getSpinner = () => {
    if (customSpinner) return customSpinner;
    return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
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

  const getSkeletonHeight = () => {
    switch (size) {
      case 'sm':
        return "h-16";
      case 'lg':
        return "h-24";
      default:
        return "h-20";
    }
  };

  if (variant === 'skeleton') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(skeletonCount)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className={`w-full ${getSkeletonHeight()}`} />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardContent className={`flex items-center justify-center ${getPadding()}`}>
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              {getSpinner()}
            </div>
            {showMessage && (
              <p className="text-muted-foreground">{message}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center space-x-2 ${getPadding()} ${className}`}>
        {getSpinner()}
        {showMessage && (
          <span className="text-muted-foreground">{message}</span>
        )}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={`text-center ${getPadding()} ${className}`}>
      <div className="space-y-3">
        <div className="flex justify-center">
          {getSpinner()}
        </div>
        {showMessage && (
          <p className="text-lg text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
};
