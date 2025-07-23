import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Save,
  X,
  AlertTriangle,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Zap,
  Rocket,
  Award,
  FileBadge,
  Folder
} from "lucide-react";
import {
  ProfileSection,
  SectionTypeEnum,
  sectionTypes
} from "@/store/slices/profileSectionsSlice";

interface ProfileSectionCardProps {
  section: ProfileSection;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onEdit: (id: string, type: string, content: string) => void;
  onDelete: (id: string) => void;
  editingId: string | null;
  editType: SectionTypeEnum;
  editContent: string;
  setEditType: (type: SectionTypeEnum) => void;
  setEditContent: (content: string) => void;
  setEditingId: (id: string | null) => void;
}

export const ProfileSectionCard: React.FC<ProfileSectionCardProps> = ({
  section,
  isCollapsed,
  onToggleCollapse,
  onEdit,
  onDelete,
  editingId,
  editType,
  editContent,
  setEditType,
  setEditContent,
  setEditingId,
}) => {
  const isEditing = editingId === section.id;
  const hasUnsavedChanges = isEditing && (editType !== section.type || editContent !== section.content);

  const handleEdit = () => {
    setEditType(section.type as SectionTypeEnum);
    setEditContent(section.content);
    setEditingId(section.id);
  };

  const handleSave = () => {
    onEdit(section.id, editType, editContent.trim());
    setEditingId(null);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        setEditingId(null);
        setEditContent("");
      }
    } else {
      setEditingId(null);
      setEditContent("");
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the "${section.type}" section? This action cannot be undone.`)) {
      onDelete(section.id);
    }
  };

  const getSectionIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'personal_info': <User className="w-5 h-5 text-blue-500" />,
      'summary': <FileText className="w-5 h-5 text-green-500" />,
      'experience': <Briefcase className="w-5 h-5 text-purple-500" />,
      'education': <GraduationCap className="w-5 h-5 text-indigo-500" />,
      'skills': <Zap className="w-5 h-5 text-yellow-500" />,
      'projects': <Rocket className="w-5 h-5 text-orange-500" />,
      'awards': <Award className="w-5 h-5 text-amber-500" />,
      'certifications': <FileBadge className="w-5 h-5 text-teal-500" />
    };
    return iconMap[type] || <Folder className="w-5 h-5 text-gray-500" />;
  };

  return (
    <Card className={`mb-6 border transition-all duration-200 hover:shadow-md ${
      isEditing ? 'ring-2 ring-blue-200 shadow-lg' : 'shadow-sm hover:border-gray-300'
    } rounded-xl overflow-hidden justify-content gap-0`}>
      <CardHeader className="pb-3 h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="p-1.5 h-auto hover:bg-gray-100 rounded-md transition-colors"
              aria-label={isCollapsed ? "Expand section" : "Collapse section"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            <div className="flex items-center gap-2">
              {getSectionIcon(section.type)}
              <CardTitle className="text-lg font-semibold text-gray-800 capitalize tracking-tight">
                {sectionTypes[section.type as SectionTypeEnum] || section.type}
              </CardTitle>
              {isEditing && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  Editing
                </span>
              )}
            </div>
          </div>
          
          {!isEditing && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
                aria-label="Edit section"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                aria-label="Delete section"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 h-full">
        {isEditing ? (
          <div className="space-y-5">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-700">You have unsaved changes</span>
              </div>
            )}
            
            {/* Section Type */}
            <div className="space-y-2">
              <label htmlFor="section-type" className="block text-sm font-semibold text-gray-700">
                Section Type
              </label>
              <div className="relative">
                <select
                  id="section-type"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as SectionTypeEnum)}
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                >
                  {Object.entries(sectionTypes).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Section Content */}
            <div className="space-y-2">
              <label htmlFor="section-content" className="block text-sm font-semibold text-gray-700">
                Content
              </label>
              <textarea
                id="section-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Enter section content..."
                className="w-full min-h-[120px] resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                rows={4}
              />
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{editContent.length} characters</span>
                {editContent.trim().length === 0 && (
                  <span className="text-red-500">Content cannot be empty</span>
                )}
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
                className="px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!editContent.trim()}
                className="px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {isCollapsed ? (
              <div className="line-clamp-3 text-gray-600 text-sm leading-relaxed">
                {section.content}
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                {section.content}
              </div>
            )}
            
            {isCollapsed && section.content.length > 150 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs px-3 py-1 h-auto"
              >
                Show more
              </Button>
            )}
            
            {!isCollapsed && section.content.length > 150 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs px-3 py-1 h-auto"
              >
                Show less
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};