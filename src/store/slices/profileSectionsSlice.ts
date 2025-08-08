import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { ProfileSectionsState } from "@/types/store/profileSectionsSlice.types";
import { ProfileSection } from "@/schemas/profile";


const initialState: ProfileSectionsState = {
  sections: [],
};

const profileSectionsSlice = createSlice({
  name: "profileSections",
  initialState,
  reducers: {
    addSection: {
      reducer(state, action: PayloadAction<ProfileSection>) {
        state.sections.push(action.payload);
      },
      prepare(section:  ProfileSection) {
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
    setSections(state, action: PayloadAction<ProfileSection[]>) {
      state.sections = action.payload;
    },
  },
});

export const { addSection, editSection, deleteSection, setSections } = profileSectionsSlice.actions;
export default profileSectionsSlice.reducer;

