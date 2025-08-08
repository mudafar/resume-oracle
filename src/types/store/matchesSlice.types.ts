/**
 * Matches slice state & related payload types.
 * Extracted from src/store/slices/matchesSlice.ts (no content changes).
 */
import { SelectedSection, CoverageGap } from '@/schemas/matching';

export type MatchesState = {
  selected_sections: SelectedSection[];
  coverage_gaps: CoverageGap[];
  lastInputsHash: string | null;
  lastJobDescription: string | null;
};

export interface MarkGapAsFilledPayload {
  gapId: string;
  profileSectionId: string;
}
