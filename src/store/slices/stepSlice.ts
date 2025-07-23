import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StepState {
  currentStep: number;
}

const initialState: StepState = {
  currentStep: 0,
};

const stepSlice = createSlice({
  name: 'step',
  initialState,
  reducers: {
    setCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    nextStep(state) {
      state.currentStep += 1;
    },
    prevStep(state) {
      state.currentStep = Math.max(0, state.currentStep - 1);
    },
    resetStep(state) {
      state.currentStep = 0;
    },
  },
});

export const { setCurrentStep, nextStep, prevStep, resetStep } = stepSlice.actions;
export default stepSlice.reducer;
