import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SignaturesState, StepSignatureRecord, SetLastSignaturePayload, ClearStepSignaturePayload } from "@/types/store";

const initialState: SignaturesState = {
  steps: {},
};

export const signaturesSlice = createSlice({
  name: "signatures",
  initialState,
  reducers: {
    setLastSignature: (state, action: PayloadAction<SetLastSignaturePayload>) => {
      const { stepKey, signature, signatureHash = null } = action.payload;
      state.steps[stepKey] = {
        lastSignature: signature,
        lastSignatureHash: signatureHash ?? null,
      };
    },
    clearStepSignature: (state, action: PayloadAction<ClearStepSignaturePayload>) => {
      const { stepKey } = action.payload;
      delete state.steps[stepKey];
    },
    resetAll: () => initialState,
  },
  selectors: {
    selectSignatures: (slice: SignaturesState) => slice,
    selectStepSignature: (slice: SignaturesState, stepKey: string): StepSignatureRecord | undefined => slice.steps[stepKey],
  },
});

export const { setLastSignature, clearStepSignature, resetAll } = signaturesSlice.actions;
export const { selectSignatures, selectStepSignature } = signaturesSlice.selectors;

export default signaturesSlice.reducer;
