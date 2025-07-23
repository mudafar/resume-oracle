import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Match {
  id: string;
  requirement_id: string;
  requirement: string;
  profile_section_id: string;
  confidence: number;
  gap_description: string;
  recommendation: string;
}

interface MatchesState {
  data: Match[];
  lastInputsHash: string | null;
}

const initialState: MatchesState = {
  data: [],
  lastInputsHash: null,
};

export const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<Match[]>) => {
      state.data = action.payload;
    },
    setLastInputsHash: (state, action: PayloadAction<string>) => {
      state.lastInputsHash = action.payload;
    },
    updateMatch: (state, action: PayloadAction<{ id: string; match: Partial<Match> }>) => {
      const { id, match } = action.payload;
      const index = state.data.findIndex(m => m.id === id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...match };
      }
    },
    clearMatches: (state) => {
      state.data = [];
      state.lastInputsHash = null;
    },
  },
});

export const {
  setMatches,
  setLastInputsHash,
  updateMatch,
  clearMatches,
} = matchesSlice.actions;

export default matchesSlice.reducer; 