import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setLLMConfig, resetLLMConfig, LLMProvider, LLMVariant } from "@/store/slices/llmConfigSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings, 
  Key, 
  Globe, 
  Zap, 
  Shield, 
  RotateCcw, 
  Save,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronRight
} from "lucide-react";

const PROVIDERS: { value: LLMProvider; label: string; icon: React.ReactNode }[] = [
  { 
    value: "free", 
    label: "Free limited model", 
    icon: <Zap className="w-4 h-4 text-amber-500" />
  },
  { 
    value: "google-genai",
    label: "Google AI", 
    icon: <Globe className="w-4 h-4 text-blue-500" />
  },
  { 
    value: "groq", 
    label: "Groq AI", 
    icon: <Zap className="w-4 h-4 text-purple-500" />
  },
  { 
    value: "openai", 
    label: "OpenRouter", 
    icon: <Shield className="w-4 h-4 text-green-500" />
  },
];

const PROVIDER_VARIANTS: Record<LLMProvider, { value: LLMVariant; label: string }[]> = {
  free: [
    { value: "default", label: "Default (small, cost‑efficient)" },
  ],
  ['google-genai']: [
    { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Light" },
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

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onSkip?: () => void;
  blockSkip?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  open, 
  onClose, 
  onSkip, 
  blockSkip 
}) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.llmConfig);
  const [provider, setProvider] = useState<LLMProvider>(config.provider);
  const [variant, setVariant] = useState<LLMVariant>(config.variant);
  const [apiKey, setApiKey] = useState<string>(config.apiKey || "");
  const [endpointUrl, setEndpointUrl] = useState<string>(config.endpointUrl || "");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(!!config.endpointUrl);
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
    if (newProvider === "free") {
      setEndpointUrl("");
      setShowAdvanced(false);
    }
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
    setShowAdvanced(false);
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
      setShowAdvanced(!!config.endpointUrl);
      setTouched(false);
      setEndpointUrlError(null);
    }
  }, [open, config]);

  const handleEndpointUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndpointUrl(value);
    if (value && !/^https:\/\/.+/.test(value)) {
      setEndpointUrlError("Must be a valid HTTPS URL");
    } else {
      setEndpointUrlError(null);
    }
  };

  const variantOptions = PROVIDER_VARIANTS[provider];
  const selectedProvider = PROVIDERS.find(p => p.value === provider);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Model Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your AI model settings and credentials
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contextual Info Card */}
          <Alert className="border-blue-200 bg-blue-50/50">
            <Info className="w-4 h-4 text-blue-600" />
            <div className="text-sm text-blue-800">
              <strong>Tip:</strong> <br/>
              Select <em>Free limited model</em> for basic usage, or provide your own <em>API key</em> to use more powerful models.
            </div>
          </Alert>

          {/* 1. Model Provider & Variant */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Model Provider & Variant
              </Label>
              
              {/* Provider */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wide">Provider</Label>
                <Select value={provider} onValueChange={handleProviderChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {selectedProvider && (
                        <div className="flex items-center gap-2">
                          {selectedProvider.icon}
                          <span>{selectedProvider.label}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.map(p => (
                      <SelectItem key={p.value} value={p.value}>
                        <div className="flex items-center gap-2">
                          {p.icon}
                          <span>{p.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Variant */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wide">Variant</Label>
                <Select value={variant} onValueChange={setVariant}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {variantOptions.map(v => (
                      <SelectItem key={v.value} value={v.value}>
                        {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 2. API Key (if needed) */}
          {needsApiKey && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Key className="w-4 h-4" />
                API Key
                <span className="text-red-500 text-xs">*required</span>
              </Label>
              <div className="relative">
                <Input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className={`pr-10 ${touched && !validApiKey ? 'border-red-300 focus:border-red-300' : ''}`}
                  autoComplete="off"
                />
                {apiKey && (
                  validApiKey ? (
                    <CheckCircle2 className="absolute right-3 top-2.5 w-4 h-4 text-green-500" />
                  ) : touched && (
                    <AlertCircle className="absolute right-3 top-2.5 w-4 h-4 text-red-500" />
                  )
                )}
              </div>
              {touched && !validApiKey && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  API Key is required for this provider
                </p>
              )}
            </div>
          )}

          {/* 3. Advanced Options (Endpoint URL) */}
          {needsApiKey && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {showAdvanced ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                Advanced options
              </button>
              
              {showAdvanced && (
                <div className="pl-5 space-y-2 border-l-2 border-gray-100">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">
                    Custom Endpoint URL
                  </Label>
                  <div className="relative">
                    <Input
                      type="url"
                      value={endpointUrl}
                      onChange={handleEndpointUrlChange}
                      placeholder="https://your-endpoint.com"
                      className={endpointUrlError ? 'border-red-300 focus:border-red-300' : ''}
                      autoComplete="off"
                    />
                    {endpointUrl && (
                      validEndpointUrl ? (
                        <CheckCircle2 className="absolute right-3 top-2.5 w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="absolute right-3 top-2.5 w-4 h-4 text-red-500" />
                      )
                    )}
                  </div>
                  {endpointUrlError && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {endpointUrlError}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Row - Sticky on scroll */}
        <div className="sticky bottom-0 bg-white pt-6 border-t flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          
          <div className="flex-1" />
          
          {onSkip && !blockSkip && (
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={saving}
              className="text-gray-600"
            >
              Skip
            </Button>
          )}
          
          <Button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};