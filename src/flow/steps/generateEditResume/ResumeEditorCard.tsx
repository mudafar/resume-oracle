import React, { RefObject } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from "react-markdown";
import { 
  RefreshCw, 
  Edit3, 
  Eye, 
  Save, 
  Download, 
  FileText, 
  Loader2
} from "lucide-react";

interface ResumeEditorCardProps {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  draftSaved: boolean;
  resume: string;
  dispatch: any;
  updateResume: any;
  saveDraft: () => void;
  exportMarkdown: () => void;
  exportPdf: () => void;
  isExportingPdf: boolean;
  onRegenerate: () => void;
  isLoading: boolean;
  markdownContentRef: RefObject<HTMLDivElement>;
}

export const ResumeEditorCard: React.FC<ResumeEditorCardProps> = ({
  editMode,
  setEditMode,
  draftSaved,
  resume,
  dispatch,
  updateResume,
  saveDraft,
  exportMarkdown,
  exportPdf,
  isExportingPdf,
  onRegenerate,
  isLoading,
  markdownContentRef
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Editor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={editMode ? "default" : "secondary"}>
              {editMode ? "Edit Mode" : "Preview Mode"}
            </Badge>
            {draftSaved && (
              <Badge variant="outline" className="text-green-600 border-green-300">
                Draft Saved
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
            onClick={saveDraft}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportMarkdown}
          >
            <Download className="w-4 h-4 mr-2" />
            Export MD
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportPdf}
            disabled={isExportingPdf}
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </>
            )}
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
            Markdown Content
          </label>
          <Textarea
            value={resume}
            onChange={(e) => dispatch(updateResume(e.target.value))}
            className="min-h-[500px] font-mono text-sm resize-y"
            placeholder="Your resume content in Markdown format..."
          />
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Resume Preview
          </label>
          <div className="border rounded-lg bg-background overflow-hidden">
            <div
              ref={markdownContentRef}
              className="prose prose-sm max-w-none p-8 bg-white"
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              <ReactMarkdown
                components={{
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
                  hr: () => (
                    <div className="my-6 border-t border-gray-200" />
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 last:mb-0">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 pl-6 space-y-1">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="list-disc">
                      {children}
                    </li>
                  )
                }}
              >
                {resume}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
); 