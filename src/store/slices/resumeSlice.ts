import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeState } from "@/types/store/resumeSlice.types";

const initialState: ResumeState = {
  resume: "",
  optimizationSummary: null,
  lastResumeInputsHash: null,
};

export const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setResume: (state, action: PayloadAction<string>) => {
      state.resume = action.payload;
    },
    setOptimizationSummary: (state, action: PayloadAction<string | null>) => {
      state.optimizationSummary = action.payload;
    },
    setLastResumeInputsHash: (state, action: PayloadAction<string>) => {
      state.lastResumeInputsHash = action.payload;
    },
    updateResume: (state, action: PayloadAction<string>) => {
      state.resume = action.payload;
    },
    clearResume: (state) => {
      state.resume = "";
      state.optimizationSummary = null;
      state.lastResumeInputsHash = null;
    },
  },
});

export const {
  setResume,
  setOptimizationSummary,
  setLastResumeInputsHash,
  updateResume,
  clearResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;