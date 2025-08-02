import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sectionTypes, SectionTypeEnum } from "@/store/slices/profileSectionsSlice";

interface GeneratedSectionAreaProps {
  content: string;
  setContent: (v: string) => void;
  contentLength: number;
  wordCount: number;
  isEditing: boolean;
  type: SectionTypeEnum;
  setType: React.Dispatch<React.SetStateAction<SectionTypeEnum>>;
}

export const GeneratedSectionArea: React.FC<GeneratedSectionAreaProps> = ({
  content,
  setContent,
  contentLength,
  wordCount,
  isEditing,
  type,
  setType,
}) => {
  return (
    <div className="space-y-3 flex-1 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Label htmlFor="section-content" className="text-base font-semibold">
            Generated Section
          </Label>
          <div className="flex gap-2 text-xs text-gray-500">
            <span>{wordCount} words</span>
          </div>
        </div>
        <div className="flex justify-center py-2">
          <Badge variant={isEditing ? "default" : "secondary"} className="px-3 py-1 flex items-center gap-1">
            {isEditing ? (
              <>
                <Edit3 className="h-3 w-3" />
                Editing Existing
              </>
            ) : (
              <>
                <PlusCircle className="h-3 w-3" />
                Adding New
              </>
            )}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="section-type" className="font-semibold">Section Type</Label>
        {/*  // TODO: type is not visible in the dropdown, need to fix this, Summary vs summary maybe */}
        <Select value={type} onValueChange={v => setType(v as SectionTypeEnum)}>
          <SelectTrigger id="section-type">
            <SelectValue placeholder="Select a section type" />
          </SelectTrigger>
          <SelectContent>
            {sectionTypes.map((sectionType) => (
              <SelectItem key={sectionType} value={sectionType}>
                {sectionType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 relative">
        <Label htmlFor="section-content" className="font-semibold mb-3">Section Content</Label>
        <Textarea
          id="section-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h- text-base leading-relaxed resize-none"
          placeholder="Section content will appear here..."
        />
      </div>
    </div>
  );
}; 