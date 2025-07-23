import { RootState } from "@/store/store";

export function getLLMConfigHeadersOrParams(state: RootState) {
  const { provider, variant, apiKey, endpointUrl, invitationCode } = state.llmConfig;

  // Always include invitation code if present, even for free tier
  const headers: Record<string, string> = {};
  
  if (invitationCode) {
    headers["X-Invite-Code"] = invitationCode;
  }

  // For free provider, only return invitation code (if any)
  if (provider === "free" && variant === "default") {
    return Object.keys(headers).length > 0 ? headers : undefined;
  }

  // For paid providers, ensure we have all required fields
  // API requires: if x-llm-provider is set, both x-llm-variant and x-llm-api-key must be provided
  if (provider && provider !== "free" && variant && apiKey?.trim()) {
    headers["x-llm-provider"] = provider;
    headers["x-llm-variant"] = variant;
    headers["x-llm-api-key"] = apiKey.trim();
    
    if (endpointUrl?.trim()) {
      headers["x-llm-endpoint-url"] = endpointUrl.trim();
    }
    
    return headers;
  }

  // If we don't have all required fields for paid provider, 
  // fall back to free tier behavior (only invitation code if present)
  return Object.keys(headers).length > 0 ? headers : undefined;
}