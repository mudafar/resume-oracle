import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ContentCardProps {
  title: string;
  icon?: React.ReactNode;
  content: string | React.ReactNode;
  subtitle?: string;
  badges?: Array<{
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
  }>;
  actions?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  variant?: 'default' | 'outline' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  icon,
  content,
  subtitle,
  badges = [],
  actions,
  className = "",
  contentClassName = "",
  headerClassName = "",
  variant = "default",
  size = "default"
}) => {
  const getCardClassName = () => {
    let baseClasses = "";
    
    switch (variant) {
      case 'outline':
        baseClasses = "border-2 border-dashed";
        break;
      case 'elevated':
        baseClasses = "shadow-lg";
        break;
      default:
        baseClasses = "";
    }
    
    return `${baseClasses} ${className}`;
  };

  const getContentPadding = () => {
    switch (size) {
      case 'sm':
        return "p-3";
      case 'lg':
        return "p-8";
      default:
        return "p-6";
    }
  };

  return (
    <Card className={getCardClassName()}>
      <CardHeader className={`${getContentPadding()} pb-3 ${headerClassName}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center gap-2">
              {icon}
              <span>{title}</span>
            </CardTitle>
            
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            
            {badges.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant={badge.variant || 'secondary'}
                    className={badge.className}
                  >
                    {badge.text}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {actions && (
            <div className="flex items-center gap-2 ml-4">
              {actions}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={`${getContentPadding()} pt-0 ${contentClassName}`}>
        {typeof content === 'string' ? (
          <div className="whitespace-pre-wrap text-sm">
            {content}
          </div>
        ) : (
          content
        )}
      </CardContent>
    </Card>
  );
};
