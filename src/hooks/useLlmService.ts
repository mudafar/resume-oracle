import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectLlmConfig } from "@/store/slices/llmConfigSlice";

/**
 * Generic async hook for LLM services.
 * @param serviceFn - The LLM service function to call (should return a Promise)
 * @returns [trigger, { isLoading, error, data, reset }]
 */
type UseLlmServiceReturn<T> = [
  trigger: (...params: any[]) => Promise<T>,
  state: {
    isLoading: boolean;
    error: any;
    data: T | null;
    reset: () => void;
  }
];

type ServiceFunction<T> = (...params: any[]) => Promise<T>;

export function useLlmService<T = any, U = any>(serviceFn: ServiceFunction<U>): UseLlmServiceReturn<T> {
  const llmConfig = useSelector(selectLlmConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T | null>(null);

  const trigger = useCallback(
    async (...params: any[]) => {
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
