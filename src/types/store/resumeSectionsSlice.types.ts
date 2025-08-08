/**
 * ResumeSections slice state & related types.
 * Extracted from src/store/slices/resumeSectionsSlice.ts (no content changes).
 */
export interface ResumeSection {
  profile_section_id: string;
  type: string;
  content: string;
}

export interface ResumeSectionsState {
  resumeSections: ResumeSection[];
  lastInputsHash: string | null;
}
