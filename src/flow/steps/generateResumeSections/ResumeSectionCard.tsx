import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, Save, X, Search } from 'lucide-react';

interface ResumeSectionCardProps {
  section: any;
  editing: { [id: string]: boolean };
  setEditing: (e: { [id: string]: boolean }) => void;
  editedContent: { [id: string]: string };
  setEditedContent: (e: { [id: string]: string }) => void;
  dispatch: any;
  updateResumeSection: any;
  referenceMap: { [id: string]: { requirement: string }[] };
}

export const ResumeSectionCard: React.FC<ResumeSectionCardProps> = ({
  section,
  editing,
  setEditing,
  editedContent,
  setEditedContent,
  dispatch,
  updateResumeSection,
  referenceMap,
}) => (
  <Card key={section.profile_section_id} className="shadow-sm hover:shadow-md transition-shadow duration-200">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="text-xl font-semibold capitalize">
              {section.type}
            </span>
          </div>
        </CardTitle>
        <div className="flex items-center gap-2">
          {editing[section.profile_section_id] ? (
            <>
              <Button
                onClick={() => {
                  setEditing({ ...editing, [section.profile_section_id]: false });
                  const newEditedContent = { ...editedContent };
                  delete newEditedContent[section.profile_section_id];
                  setEditedContent(newEditedContent);
                }}
                variant="outline"
                size="sm"
              >
                <X className="w-3 h-3 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setEditing({ ...editing, [section.profile_section_id]: false });
                  dispatch(updateResumeSection({
                    profile_section_id: section.profile_section_id,
                    content: editedContent[section.profile_section_id] || section.content
                  }));
                }}
                size="sm"
                className=""
              >
                <Save className="w-3 h-3 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setEditing({ ...editing, [section.profile_section_id]: true })}
              variant="outline"
              size="sm"
            >
              <Edit className="w-3 h-3 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Content Section */}
      <div className="space-y-3">
        {editing[section.profile_section_id] ? (
          <Textarea
            className="min-h-[140px] resize-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter your resume section content..."
            value={editedContent[section.profile_section_id] || section.content}
            onChange={(e) => setEditedContent({ 
              ...editedContent, 
              [section.profile_section_id]: e.target.value 
            })}
          />
        ) : (
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed bg-gray-50 rounded-lg p-4 border">
              {editedContent[section.profile_section_id] || section.content}
            </div>
          </div>
        )}
      </div>
      {/* Reference Section */}
      <div className="border-t pt-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Job Requirements Reference
            </span>
          </div>
          <div className="space-y-2">
            {referenceMap[section.profile_section_id]?.map((ref, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-blue-800">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                <span className="leading-relaxed">{ref.requirement}</span>
              </div>
            )) || (
              <p className="text-sm text-blue-700 italic">No specific requirements matched for this section.</p>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
); 