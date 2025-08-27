import React from "react";
import {
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

interface SectionTypeIconProps {
  type: string;
  className?: string;
}

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

export const SectionTypeIcon: React.FC<SectionTypeIconProps> = ({
  type,
  className = ""
}) => {
  return (
    <span className={className}>
      {iconMap[type] || <Folder className="w-5 h-5 text-gray-500" />}
    </span>
  );
};
