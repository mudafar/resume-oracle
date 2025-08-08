/**
 * Resume slice state types.
 * Extracted from src/store/slices/resumeSlice.ts (no content changes).
 */
export interface ResumeState {
  resume: string;
  optimizationSummary: string | null;
  lastResumeInputsHash: string | null;
}
