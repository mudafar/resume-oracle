/**
 * LLM Config slice state & related types.
 * Extracted from src/store/slices/llmConfigSlice.ts (no content changes).
 */
export type LLMProvider = "free" | "google-genai" | "groq" | "openrouter" | "openai" | "custom";
export type LLMVariant = "default" | "balanced" | "high-accuracy";

export interface LLMConfig {
  provider: LLMProvider;
  variant: LLMVariant;
  apiKey: string | null;
  endpointUrl: string | null;
  showConfigModal: boolean;
  temperature?: number;
  topP?: number;
}
