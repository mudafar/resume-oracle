"use client";
import { useCallback } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { openConfigModal } from "@/store/slices/llmConfigSlice";

/**
 * Centralized LLM error handler.
 * Shows actionable toasts and can open the Settings modal for API key issues.
 */
export function useLlmError() {
  const dispatch = useDispatch();

  const openSettings = useCallback(() => {
    dispatch(openConfigModal());
  }, [dispatch]);

  const handleError = useCallback((err: unknown) => {
    const anyErr = err as any;
    const status: number | undefined = anyErr?.status || anyErr?.response?.status || anyErr?.cause?.status;
    const message: string = String(anyErr?.message || anyErr?.response?.statusText || anyErr || "Unexpected error");

    // Detect API key / auth issues
    const apiKeyPatterns = [
      /api\s*key/i,
      /unauthorized/i,
      /invalid\s*api/i,
      /missing\s*api/i,
      /401/,
      /forbidden/i,
    ];
    const isApiKeyIssue = apiKeyPatterns.some((re) => re.test(message));

    if (isApiKeyIssue) {
      toast.error("API key required to use AI services.", {
        description: "Add your API key or try the Free limited model in Settings.",
        action: {
          label: "Open Settings",
          onClick: openSettings,
        },
        duration: 8000,
      });
      return;
    }

    // Bad request or provider-side request errors
    if (status === 400 || /\b400\b/.test(message)) {
      toast.error("Request rejected by AI provider.", {
        description: "Check model variant and endpoint settings, then try again.",
        action: {
          label: "Open Settings",
          onClick: openSettings,
        },
        duration: 7000,
      });
      return;
    }

    // Generic fallback
    toast.error("LLM request failed.", {
      description: message,
      action: {
        label: "Settings",
        onClick: openSettings,
      },
      duration: 6000,
    });
  }, [openSettings]);

  return { handleError };
}
