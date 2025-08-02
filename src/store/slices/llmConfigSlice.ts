import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LLMProvider = "free" | "google" | "groq" | "openrouter" | "custom";
export type LLMVariant = "default" | "balanced" | "high-accuracy";

export interface LLMConfig {
  provider: LLMProvider;
  variant: LLMVariant;
  apiKey: string | null;
  endpointUrl: string | null;
  showConfigModal: boolean;
  invitationCode: string | null;
  temperature?: number;
  topP?: number;
}

//  TODO unify type with service
const initialState: LLMConfig = {
  provider: "free",
  variant: "default",
  apiKey: null,
  endpointUrl: null,
  showConfigModal: false,
  invitationCode: null,
  temperature: undefined,
  topP: undefined,
};

const llmConfigSlice = createSlice({
  name: "llmConfig",
  initialState,
  reducers: {
    setLLMConfig(state, action: PayloadAction<Omit<LLMConfig, 'showConfigModal'>>) {
      return { ...action.payload, showConfigModal: false };
    },
    updateLLMConfig(state, action: PayloadAction<Partial<Omit<LLMConfig, 'showConfigModal'>>>) {
      return { ...state, ...action.payload };
    },
    resetLLMConfig() {
      return { ...initialState };
    },
    openConfigModal(state) {
      state.showConfigModal = true;
    },
    closeConfigModal(state) {
      state.showConfigModal = false;
    },
  },
  selectors: {
    selectLlmConfig: (sliceState) => sliceState,
  },
});

export const { setLLMConfig, updateLLMConfig, resetLLMConfig, openConfigModal, closeConfigModal } = llmConfigSlice.actions;
export default llmConfigSlice.reducer;

export const { selectLlmConfig } = llmConfigSlice.selectors;
