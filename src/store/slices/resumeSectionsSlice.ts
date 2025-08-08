import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeSectionsState, ResumeSection } from "@/types/store/resumeSectionsSlice.types";


const initialState: ResumeSectionsState = {
  resumeSections: [],
  lastInputsHash: null,
};

export const resumeSectionsSlice = createSlice({
  name: "resumeSections",
  initialState,
  reducers: {
    setResumeSections: (state, action: PayloadAction<ResumeSection[]>) => {
      state.resumeSections = action.payload;
    },
    setLastInputsHash: (state, action: PayloadAction<string>) => {
      state.lastInputsHash = action.payload;
    },
    updateResumeSection: (state, action: PayloadAction<{ profile_section_id: string; content: string }>) => {
      const { profile_section_id, content } = action.payload;
      const section = state.resumeSections.find(s => s.profile_section_id === profile_section_id);
      if (section) {
        section.content = content;
      }
    },
    clearResumeSections: (state) => {
      state.resumeSections = [];
      state.lastInputsHash = null;
    },
  },
});

export const {
  setResumeSections,
  setLastInputsHash,
  updateResumeSection,
  clearResumeSections,
} = resumeSectionsSlice.actions;

export default resumeSectionsSlice.reducer;