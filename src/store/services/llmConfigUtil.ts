import { RootState } from "@/store/store";

export function getLLMConfigHeadersOrParams(state: RootState) {
  const { provider, variant, apiKey, endpointUrl } = state.llmConfig;

  // For free provider, return undefined (no headers needed)
  if (provider === "free" && variant === "default") {
    return undefined;
  }

  // For paid providers, ensure we have all required fields
  // API requires: if x-llm-provider is set, both x-llm-variant and x-llm-api-key must be provided
  if (provider && provider !== "free" && variant && apiKey?.trim()) {
    const headers: Record<string, string> = {};
    headers["x-llm-provider"] = provider;
    headers["x-llm-variant"] = variant;
    headers["x-llm-api-key"] = apiKey.trim();
    
    if (endpointUrl?.trim()) {
      headers["x-llm-endpoint-url"] = endpointUrl.trim();
    }
    
    return headers;
  }

  // If we don't have all required fields for paid provider, fall back to free tier
  return undefined;
}