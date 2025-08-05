import { useState, useCallback, useRef, useEffect } from "react";
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

type CacheEntry<T> = {
  params: any[];
  llmConfig: any;
  result: T;
  timestamp: number;
};

export function useLlmService<T = any>(serviceFn: ServiceFunction<T>): UseLlmServiceReturn<T> {
  const llmConfig = useSelector(selectLlmConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T | null>(null);
  const cacheRef = useRef<CacheEntry<T> | null>(null);

  // Helper function to compare parameters
  const areParamsEqual = (params1: any[], params2: any[], config1: any, config2: any): boolean => {
    try {
      return JSON.stringify([params1, config1]) === JSON.stringify([params2, config2]);
    } catch {
      // Fallback if JSON.stringify fails (circular references, etc.)
      return false;
    }
  };

  // Load cache from localStorage on mount
  useEffect(() => {
    const cachedData = localStorage.getItem("llmServiceCache");
    if (cachedData) {
      try {
        cacheRef.current = JSON.parse(cachedData);
      } catch {
        console.error("Failed to parse cached data from localStorage");
      }
    }
  }, []);

  const trigger = useCallback(
    async (...params: any[]) => {
      // Check cache first
      if (cacheRef.current && areParamsEqual(params, cacheRef.current.params, llmConfig, cacheRef.current.llmConfig)) {
        console.log("[CACHE] Using cached result for LLM service call");
        setData(cacheRef.current.result);
        return cacheRef.current.result;
      }

      setIsLoading(true);
      setError(null);
      setData(null);
      try {
        console.log("[LLM] Making new service call");
        // Inject llmConfig into the service call
        const result = await serviceFn(...params, llmConfig);

        // Cache the result
        cacheRef.current = {
          params,
          llmConfig,
          result,
          timestamp: Date.now()
        };

        // Persist cache to localStorage
        localStorage.setItem("llmServiceCache", JSON.stringify(cacheRef.current));

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
    // Clear cache on reset
    cacheRef.current = null;
    localStorage.removeItem("llmServiceCache");
  }, []);

  return [trigger, { isLoading, error, data, reset }];
}
