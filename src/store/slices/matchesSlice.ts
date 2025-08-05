import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HybridSelectionResult } from "@/services/zodModels";

// Update MatchesState to store HybridSelectionResult
type MatchesState = {
  data: HybridSelectionResult | null;
  lastInputsHash: string | null;
  lastJobDescription: string | null;
};

// Update initialState
const initialState: MatchesState = {
  data: null,
  lastInputsHash: null,
  lastJobDescription: null,
};

export const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<HybridSelectionResult>) => {
      state.data = action.payload;
    },
    setLastInputsHash: (state, action: PayloadAction<string>) => {
      state.lastInputsHash = action.payload;
    },
    setLastJobDescription: (state, action: PayloadAction<string>) => {
      state.lastJobDescription = action.payload;
    },
    clearMatches: (state) => {
      state.data = null;
      state.lastInputsHash = null;
      state.lastJobDescription = null;
    },
  },
});

export const {
  setMatches,
  setLastInputsHash,
  setLastJobDescription,
  clearMatches,
} = matchesSlice.actions;

export default matchesSlice.reducer;
