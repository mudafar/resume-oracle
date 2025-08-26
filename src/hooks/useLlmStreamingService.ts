import { useState, useCallback, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLlmConfig } from "@/store/slices/llmConfigSlice";
import { useLlmError } from "./useLlmError";
import { IterableReadableStream } from "@langchain/core/utils/stream";
import { LLMConfig } from "@/types/store";



type ServiceFunction<T> = (...args: any[]) => Promise<IterableReadableStream<T>>;

type UseLlmServiceReturn<T> = [
  trigger:(...params: any[]) => Promise<void>,
  state: {
    isLoading: boolean;
    error: any;
    data: T | null;
    reset: () => void;
  }
];

type CacheEntry<T> = {
  params: any[];
  llmConfig: any;
  result: T;
  timestamp: number;
};


export function useLlmStreamingService<T>(serviceFn: ServiceFunction<T>): UseLlmServiceReturn<T> {
  const llmConfig = useSelector(selectLlmConfig);
  const { handleError } = useLlmError();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T | null>(null);
  const cacheRef = useRef<CacheEntry<T> | null>(null);

  const areParamsEqual = useCallback((params1: any[], params2: any[], config1: LLMConfig, config2: LLMConfig) => {
    try {
      return JSON.stringify([params1, config1]) === JSON.stringify([params2, config2]);
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const cachedData = localStorage.getItem("llmStreamingServiceCache");
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
      if (cacheRef.current && cacheRef.current.result && areParamsEqual(params, cacheRef.current.params, llmConfig, cacheRef.current.llmConfig)) {
        console.log("[CACHE] Using cached result for LLM streaming service call");
        setData(cacheRef.current.result);
        return;
      }

      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        console.log("[LLM STREAM] Making new service call");
        const stream = await serviceFn(...params, llmConfig);

        let finalData = null;

        for await (const chunk of stream) {
          if (chunk) {
            finalData = chunk;
            setData(finalData);
          }
        }

        if (finalData) {
          cacheRef.current = {
            params,
            llmConfig,
            result: finalData,
            timestamp: Date.now()
          };
          localStorage.setItem("llmStreamingServiceCache", JSON.stringify(cacheRef.current));
        }

        setIsLoading(false);

      } catch (err) {
        setError(error);
        setIsLoading(false);
        handleError(err);
        throw err;
      }
    },
    [serviceFn, llmConfig, handleError, areParamsEqual]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
    cacheRef.current = null;
    localStorage.removeItem("llmStreamingServiceCache");
  }, []);

  return [trigger, { isLoading, error, data, reset }];
}
