import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setLLMConfig, resetLLMConfig, LLMProvider, LLMVariant } from "@/store/slices/llmConfigSlice";

const PROVIDERS: { value: LLMProvider; label: string }[] = [
  { value: "free", label: "Free limited model (default, no key)" },
  { value: "google_genai", label: "Google AI" },
  { value: "groq", label: "Groq AI" },
  { value: "openai", label: "OpenRouter" },
];

const PROVIDER_VARIANTS: Record<LLMProvider, { value: LLMVariant; label: string }[]> = {
  free: [
    { value: "default", label: "Default (small, cost‑efficient)" },
  ],
  google_genai: [
    { value: "gemini-2.5-flash-lite-preview-06-17", label: "Gemini 2.5 Flash Light" },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 PRO" },
  ],
  groq: [
    { value: "deepseek-r1-distill-llama-70b", label: "Deepseek R1" },
    { value: "qwen/qwen3-32b", label: "Qwen3" },
    { value: "meta-llama/llama-4-maverick-17b-128e-instruct", label: "llama 4 Maverick" },
  ],
  openai: [
    { value: "deepseek/deepseek-r1-0528:free", label: "Deepseek R1" },
  ],
};

interface LLMConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSkip?: () => void;
  blockSkip?: boolean;
}

export const LLMConfigModal: React.FC<LLMConfigModalProps> = ({ open, onClose, onSkip, blockSkip }) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.llmConfig);
  const [provider, setProvider] = useState<LLMProvider>(config.provider);
  const [variant, setVariant] = useState<LLMVariant>(config.variant);
  const [apiKey, setApiKey] = useState<string>(config.apiKey || "");
  const [endpointUrl, setEndpointUrl] = useState<string>(config.endpointUrl || "");
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [endpointUrlError, setEndpointUrlError] = useState<string | null>(null);

  const needsApiKey = provider !== "free";
  const validApiKey = !needsApiKey || (apiKey && apiKey.trim().length > 0);
  const validEndpointUrl = !endpointUrl || /^https:\/\/.+/.test(endpointUrl);
  const canSave = provider && variant && validApiKey && validEndpointUrl;

  // When provider changes, reset variant to first available for that provider
  const handleProviderChange = (newProvider: LLMProvider) => {
    setProvider(newProvider);
    const variants = PROVIDER_VARIANTS[newProvider];
    setVariant(variants[0].value);
    setEndpointUrl("");
    setEndpointUrlError(null);
  };

  const handleSave = () => {
    setTouched(true);
    if (!canSave) return;
    setSaving(true);
    dispatch(setLLMConfig({
      provider,
      variant,
      apiKey: needsApiKey ? apiKey : null,
      endpointUrl: needsApiKey && endpointUrl ? endpointUrl : null,
    }));
    setSaving(false);
    onClose();
  };

  const handleReset = () => {
    setProvider("free");
    setVariant("default");
    setApiKey("");
    setEndpointUrl("");
    setEndpointUrlError(null);
    dispatch(resetLLMConfig());
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
    onClose();
  };

  React.useEffect(() => {
    if (open) {
      setProvider(config.provider);
      setVariant(config.variant);
      setApiKey(config.apiKey || "");
      setEndpointUrl(config.endpointUrl || "");
      setTouched(false);
      setEndpointUrlError(null);
    }
  }, [open, config]);

  const handleEndpointUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndpointUrl(value);
    if (value && !/^https:\/\/.+/.test(value)) {
      setEndpointUrlError("Endpoint URL must be a valid HTTPS URL.");
    } else {
      setEndpointUrlError(null);
    }
  };

  if (!open) return null;

  const variantOptions = PROVIDER_VARIANTS[provider];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto p-10 relative mt-10">
        <button
          className="absolute top-3 right-3 text-gray-400 text-2xl hover:text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="text-xl font-semibold mb-4">Model Configuration</div>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          {/* Provider */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">1. LLM Provider</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={provider}
              onChange={e => handleProviderChange(e.target.value as LLMProvider)}
            >
              {PROVIDERS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          {/* Variant */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">2. Model Variant</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={variant}
              onChange={e => setVariant(e.target.value as LLMVariant)}
            >
              {variantOptions.map(v => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </div>
          {/* API Key */}
          {needsApiKey && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">3. API Key (required)</label>
                <input
                  type="password"
                  className="border rounded px-3 py-2 w-full"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  autoComplete="off"
                />
                {touched && !validApiKey && (
                  <div className="text-red-600 text-xs mt-1">API Key is required for this provider.</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">4. Endpoint URL (optional)</label>
                <input
                  type="url"
                  className="border rounded px-3 py-2 w-full"
                  value={endpointUrl}
                  onChange={handleEndpointUrlChange}
                  placeholder="https://your-endpoint.com"
                  autoComplete="off"
                />
                {endpointUrlError && (
                  <div className="text-red-600 text-xs mt-1">{endpointUrlError}</div>
                )}
                <div className="text-xs text-gray-500 mt-1">If provided, must be a valid HTTPS URL.</div>
              </div>
            </>
          )}
          {/* Buttons */}
          <div className="flex gap-2 mt-6 justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              onClick={handleReset}
              disabled={saving}
            >
              Reset to Default
            </button>
            {onSkip && !blockSkip && (
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                onClick={handleSkip}
                disabled={saving}
              >
                Skip for now
              </button>
            )}
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"} transition`}
              disabled={!canSave || saving}
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 