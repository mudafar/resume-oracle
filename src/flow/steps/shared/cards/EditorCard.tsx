import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { ActionBar, type ActionBarProps } from "../actions";

export interface EditorCardProps {
  title: string;
  icon?: React.ReactNode;
  content: string;
  editMode: boolean;
  onToggleEdit: (editing: boolean) => void;
  onContentChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  
  // Action bar props
  actionBarProps?: Omit<ActionBarProps, 'editMode' | 'onToggleEdit'>;
  
  // Status badges
  statusBadges?: React.ReactNode;
  
  // Custom header content
  headerActions?: React.ReactNode;
}

export const EditorCard: React.FC<EditorCardProps> = ({
  title,
  icon,
  content,
  editMode,
  onToggleEdit,
  onContentChange,
  placeholder = "Enter your content here...",
  minHeight = "300px",
  className = "",
  actionBarProps,
  statusBadges,
  headerActions
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={editMode ? "default" : "secondary"}>
                {editMode ? "Edit Mode" : "Preview Mode"}
              </Badge>
              {statusBadges}
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {headerActions}
            {actionBarProps && (
              <ActionBar
                {...actionBarProps}
                editMode={editMode}
                onToggleEdit={onToggleEdit}
              />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {editMode ? (
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={placeholder}
            className="resize-none"
            style={{ minHeight }}
          />
        ) : (
          <div 
            className="prose prose-sm max-w-none dark:prose-invert"
            style={{ minHeight }}
          >
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">
                No content available. Switch to edit mode to add content.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
