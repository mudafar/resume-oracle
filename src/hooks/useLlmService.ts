import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectLlmConfig } from "@/store/slices/llmConfigSlice";

/**
 * Generic async hook for LLM services.
 * @param serviceFn - The LLM service function to call (should return a Promise)
 * @returns [trigger, { isLoading, error, data, reset }]
 */
export function useLlmService(serviceFn) {
  const llmConfig = useSelector(selectLlmConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const trigger = useCallback(
    async (...params) => {
      setIsLoading(true);
      setError(null);
      setData(null);
      try {
        // Inject llmConfig into the service call
        const result = await serviceFn(...params, llmConfig);
        setData(result);
        setIsLoading(false);
        return result;
      } catch (err) {
        setError(err);
        setIsLoading(false);
        throw err;
      }
    },
    [serviceFn, llmConfig]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return [trigger, { isLoading, error, data, reset }];
}
