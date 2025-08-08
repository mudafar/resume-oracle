/**
 * ProfileSections slice state & related types.
 * Extracted from src/store/slices/profileSectionsSlice.ts (no content changes).
 */
import { ProfileSection } from "@/schemas/profile";

// export interface ProfileSectionBase {
//   type: string;
//   content: string;
// }
//
// export interface ProfileSection extends ProfileSectionBase {
//   id: string;
// }

// export interface ResumeSection {
//   profile_section_id: string;
//   type: string;
//   content: string;
// }

export interface ProfileSectionsState {
  sections: ProfileSection[];
  // resumeSections: ResumeSection[];
}

export enum SectionTypeEnum {
  Summary = "Summary",
  Experience = "Experience",
  Skills = "Skills",
  Education = "Education",
  Project = "Project",
  Certification = "Certification",
  Volunteering = "Volunteering",
  Language = "Language",
  Award = "Award",
  Course = "Course",
  Custom = "Custom Section",
}

export const sectionTypes = Object.values(SectionTypeEnum);
