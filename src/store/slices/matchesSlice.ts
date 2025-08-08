import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HybridSelectionResult, SelectedSection, CoverageGap } from "@/services/zodModels";
import { MatchesState, MarkGapAsFilledPayload } from "@/types/store/matchesSlice.types";

// Simplified MatchesState with flat structure
const initialState: MatchesState = {
  selected_sections: [],
  coverage_gaps: [],
  lastInputsHash: null,
  lastJobDescription: null,
};

export const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<HybridSelectionResult>) => {
      state.selected_sections = action.payload.selected_sections;
      state.coverage_gaps = action.payload.coverage_gaps;
    },
    setLastInputsHash: (state, action: PayloadAction<string>) => {
      state.lastInputsHash = action.payload;
    },
    setLastJobDescription: (state, action: PayloadAction<string>) => {
      state.lastJobDescription = action.payload;
    },
    markGapAsFilled: (state, action: PayloadAction<MarkGapAsFilledPayload>) => {
      const { gapId, profileSectionId } = action.payload;
      
      // Find the gap by its ID
      const gapIndex = state.coverage_gaps.findIndex(gap => gap.id === gapId);
      
      if (gapIndex === -1) return;
      
      const gap = state.coverage_gaps[gapIndex];

      // Remove the gap from coverage_gaps array
      state.coverage_gaps.splice(gapIndex, 1);

      // Check if this profile section already exists in selected_sections
      const existingSelectedSection = state.selected_sections.find(
        section => section.profile_section_id === profileSectionId
      );

      if (existingSelectedSection) {
        // Create a new ScoredPair for the filled gap
        const newScoredPair = {
          section_id: profileSectionId,
          cluster_id: gap.requirement_cluster.id,
          cluster_name: gap.requirement_cluster.cluster_name,
          priority_tier: gap.requirement_cluster.priority_tier || 'important',
          raw_score: 85, // High score since gap was filled
          coverage: gap.requirement_cluster.requirements || [gap.requirement_cluster.cluster_name],
          missing: [], // No missing items since gap was filled
          strength_indicators: [`Addressed ${gap.requirement_cluster.cluster_name} requirement through profile enhancement`],
          evidence: "Enhanced profile section to address coverage gap",
          enhancement_suggestions: []
        };

        // Add to existing selected section
        existingSelectedSection.matched_scored_pairs.push(newScoredPair);

      } else {
        // Create new ScoredPair for the new section
        const newScoredPair = {
          section_id: profileSectionId,
          cluster_id: gap.requirement_cluster.id,
          cluster_name: gap.requirement_cluster.cluster_name,
          priority_tier: gap.requirement_cluster.priority_tier || 'important',
          raw_score: 85,
          coverage: gap.requirement_cluster.requirements || [gap.requirement_cluster.cluster_name],
          missing: [],
          strength_indicators: [`Addresses ${gap.requirement_cluster.cluster_name} requirement through targeted enhancement`],
          evidence: "New profile section created to address coverage gap",
          enhancement_suggestions: []
        };


        // Create new selected section
        const newSelectedSection: SelectedSection = {
          profile_section_id: profileSectionId,
          matched_scored_pairs: [newScoredPair],
          total_weighted_score: 85,
          rationale: `Selected to address ${gap.requirement_cluster.cluster_name} requirement that was identified as a coverage gap.`
        };

        // Add to selected sections
        state.selected_sections.push(newSelectedSection);
      }
    },
    clearMatches: (state) => {
      state.selected_sections = [];
      state.coverage_gaps = [];
      state.lastInputsHash = null;
      state.lastJobDescription = null;
    },
  },
});

export const {
  setMatches,
  setLastInputsHash,
  setLastJobDescription,
  markGapAsFilled,
  clearMatches,
} = matchesSlice.actions;

export default matchesSlice.reducer;
