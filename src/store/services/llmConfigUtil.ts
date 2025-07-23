import { RootState } from "@/store/store";

export function getLLMConfigHeadersOrParams(state: RootState) {
  const { provider, variant, apiKey, endpointUrl } = state.llmConfig;
  if (provider === "free" && variant === "default") {
    return undefined;
  }
  return {
    "x-llm-provider": provider,
    "x-llm-variant": variant,
    ...(apiKey ? { "x-llm-api-key": apiKey } : {}),
    ...(endpointUrl ? { "x-llm-endpoint-url": endpointUrl } : {}),
  };
} 