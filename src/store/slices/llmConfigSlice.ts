import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LLMProvider = "free" | "google" | "groq" | "openrouter" | "custom";
export type LLMVariant = "default" | "balanced" | "high-accuracy";

export interface LLMConfigState {
  provider: LLMProvider;
  variant: LLMVariant;
  apiKey: string | null;
  endpointUrl: string | null;
  showConfigModal: boolean;
  hasSeenConfigModal: boolean;
  invitationCode: string | null;
}

const initialState: LLMConfigState = {
  provider: "free",
  variant: "default",
  apiKey: null,
  endpointUrl: null,
  showConfigModal: false,
  hasSeenConfigModal: false,
  invitationCode: null,
};

const llmConfigSlice = createSlice({
  name: "llmConfig",
  initialState,
  reducers: {
    setLLMConfig(state, action: PayloadAction<Omit<LLMConfigState, 'showConfigModal' | 'hasSeenConfigModal'>>) {
      return { ...action.payload, showConfigModal: false, hasSeenConfigModal: state.hasSeenConfigModal };
    },
    updateLLMConfig(state, action: PayloadAction<Partial<Omit<LLMConfigState, 'showConfigModal' | 'hasSeenConfigModal'>>>) {
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
    setHasSeenConfigModal(state, action: PayloadAction<boolean>) {
      state.hasSeenConfigModal = action.payload;
    },
    resetHasSeenConfigModal(state) {
      state.hasSeenConfigModal = false;
    },
  },
});

export const { setLLMConfig, updateLLMConfig, resetLLMConfig, openConfigModal, closeConfigModal, setHasSeenConfigModal, resetHasSeenConfigModal } = llmConfigSlice.actions;
export default llmConfigSlice.reducer; 