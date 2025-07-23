import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CoverLetterState {
  coverLetter: string;
  optimizationSummary: string | null;
  lastCoverLetterInputsHash: string | null;
}

const initialState: CoverLetterState = {
  coverLetter: "",
  optimizationSummary: null,
  lastCoverLetterInputsHash: null,
};

export const coverLetterSlice = createSlice({
  name: "coverLetter",
  initialState,
  reducers: {
    setCoverLetter: (state, action: PayloadAction<string>) => {
      state.coverLetter = action.payload;
    },
    setOptimizationSummary: (state, action: PayloadAction<string | null>) => {
      state.optimizationSummary = action.payload;
    },
    setLastCoverLetterInputsHash: (state, action: PayloadAction<string>) => {
      state.lastCoverLetterInputsHash = action.payload;
    },
    updateCoverLetter: (state, action: PayloadAction<string>) => {
      state.coverLetter = action.payload;
    },
    clearCoverLetter: (state) => {
      state.coverLetter = "";
      state.optimizationSummary = null;
      state.lastCoverLetterInputsHash = null;
    },
  },
});

export const {
  setCoverLetter,
  setOptimizationSummary,
  setLastCoverLetterInputsHash,
  updateCoverLetter,
  clearCoverLetter,
} = coverLetterSlice.actions;

export default coverLetterSlice.reducer; 