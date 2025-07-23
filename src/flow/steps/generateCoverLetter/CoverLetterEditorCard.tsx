import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from "react-markdown";
import { Mail, Edit3, Eye, Copy, Download, Loader2, RefreshCw } from 'lucide-react';

interface CoverLetterEditorCardProps {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  copied: boolean;
  coverLetter: string;
  dispatch: any;
  updateCoverLetter: any;
  copyToClipboard: () => void;
  downloadMarkdown: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
}

export const CoverLetterEditorCard: React.FC<CoverLetterEditorCardProps> = ({
  editMode,
  setEditMode,
  copied,
  coverLetter,
  dispatch,
  updateCoverLetter,
  copyToClipboard,
  downloadMarkdown,
  onRegenerate,
  isLoading
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Cover Letter Editor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={editMode ? "default" : "secondary"}>
              {editMode ? "Edit Mode" : "Preview Mode"}
            </Badge>
            {copied && (
              <Badge variant="outline" className="text-green-600 border-green-300">
                Copied!
              </Badge>
            )}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadMarkdown}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            size="sm"
            onClick={onRegenerate}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Regenerate
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {editMode ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Cover Letter Content (Markdown)
          </label>
          <Textarea
            value={coverLetter}
            onChange={(e) => dispatch(updateCoverLetter(e.target.value))}
            className="min-h-[500px] font-mono text-sm resize-y"
            placeholder="Your cover letter content in Markdown format..."
          />
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Cover Letter Preview
          </label>
          <div className="border rounded-lg bg-background overflow-hidden">
            <div className="prose prose-sm max-w-none p-8 bg-white">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mb-6 text-center">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 last:mb-0 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 pl-6 space-y-2">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="list-disc">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-700">
                      {children}
                    </em>
                  )
                }}
              >
                {coverLetter}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
); 