import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobDescriptionState } from "@/types/store/jobDescriptionSlice.types";

const initialState: JobDescriptionState = {
  job_description: "",
  company_context: "",
};

const jobDescriptionSlice = createSlice({
  name: "jobContext",
  initialState,
  reducers: {
    setJobDescription(state, action: PayloadAction<string>) {
      state.job_description = action.payload;
    },
    setCompanyContext(state, action: PayloadAction<string>) {
      state.company_context = action.payload;
    },
  },
});

export const { setJobDescription, setCompanyContext } = jobDescriptionSlice.actions;
export default jobDescriptionSlice.reducer;