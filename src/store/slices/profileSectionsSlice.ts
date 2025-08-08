import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { ProfileSectionsState, ProfileSection, ProfileSectionBase, ResumeSection, SectionTypeEnum, sectionTypes } from "@/types/store/profileSectionsSlice.types";


const initialState: ProfileSectionsState = {
  sections: [],
  resumeSections: [],
};

const profileSectionsSlice = createSlice({
  name: "profileSections",
  initialState,
  reducers: {
    addSection: {
      reducer(state, action: PayloadAction<ProfileSection>) {
        state.sections.push(action.payload);
      },
      prepare(section:  ProfileSectionBase | ProfileSection) {
        const id = "id" in section ? section.id : nanoid(8);
        return { payload: { id, type: section.type, content: section.content } };
      },
    },
    editSection(state, action: PayloadAction<{ id: string; type: string; content: string }>) {
      const section = state.sections.find(s => s.id === action.payload.id);
      if (section) {
        section.type = action.payload.type;
        section.content = action.payload.content;
      }
    },
    deleteSection(state, action: PayloadAction<string>) {
      state.sections = state.sections.filter(s => s.id !== action.payload);
    },
    reorderSections(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const [moved] = state.sections.splice(from, 1);
      state.sections.splice(to, 0, moved);
    },
    setResumeSections(state, action: PayloadAction<ResumeSection[]>) {
      state.resumeSections = action.payload;
    },
    setSections(state, action: PayloadAction<ProfileSection[]>) {
      state.sections = action.payload;
    },
  },
});

export const { addSection, editSection, deleteSection, reorderSections, setResumeSections, setSections } = profileSectionsSlice.actions;
export default profileSectionsSlice.reducer;

