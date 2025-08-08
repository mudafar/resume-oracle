/**
 * CoverLetter slice state types.
 * Extracted from src/store/slices/coverLetterSlice.ts (no content changes).
 */
export interface CoverLetterState {
  coverLetter: string;
  optimizationSummary: string | null;
  lastCoverLetterInputsHash: string | null;
}