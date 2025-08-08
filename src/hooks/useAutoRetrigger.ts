import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { setLastSignature } from "@/store/slices/signaturesSlice";
import { selectStepSignature } from "@/store/slices/signaturesSlice";
import { compareTwoStrings } from "string-similarity";
import { SIMILARITY_THRESHOLD } from "@/constants/LLM";

export interface UseAutoRetriggerOptions {
  stepKey: string;
  inputs: Record<string, unknown>;
  /**
   * Callback invoked for auto/ manual runs. Receives a predicate `isLatest` that
   * returns true only for the most recent invocation, allowing callers to avoid
   * dispatching stale results.
   */
  onAutoRun: (isLatest: () => boolean) => Promise<void>;
  similarityThreshold?: number; // default 0.7
}

export interface UseAutoRetriggerState {
  showBanner: boolean;
  acknowledgeMinorChange: () => void;
  onManualRun: () => Promise<void>;
  setShowBanner: (show: boolean) => void;
  isRunning: boolean;
  error: unknown | null;
}

export function useAutoRetrigger({
  stepKey,
  inputs,
  onAutoRun,
  similarityThreshold = SIMILARITY_THRESHOLD,
}: UseAutoRetriggerOptions): UseAutoRetriggerState {
  const dispatch = useDispatch();
  const [showBanner, setShowBanner] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const runIdRef = useRef(0);

  const currentSignature = useMemo(() => JSON.stringify(inputs), [inputs]);

  // select last signature from the generic signatures slice
  // NOTE: slice selectors created via createSlice.selectors expect RootState
  const lastSignature = useSelector((state: RootState) => selectStepSignature((state as any), stepKey)?.lastSignature ?? null);

  const changed = useMemo(() => currentSignature !== lastSignature, [currentSignature, lastSignature]);

  const runWithGuard = useCallback(async () => {
    const myRunId = ++runIdRef.current;
    setIsRunning(true);
    setError(null);
    try {
      const isLatest = () => runIdRef.current === myRunId;
      await onAutoRun(isLatest);
      // only persist if this run is still the latest
      if (runIdRef.current === myRunId) {
        dispatch(setLastSignature({ stepKey, signature: currentSignature }));
      }
    } catch (e) {
      if (runIdRef.current === myRunId) {
        setError(e);
      }
    } finally {
      if (runIdRef.current === myRunId) {
        setIsRunning(false);
      }
    }
  }, [dispatch, onAutoRun, stepKey, currentSignature]);

  // auto-detect on mount/changes
  useEffect(() => {
    if (!changed) {
      setShowBanner(false);
      return;
    }

    // Prevent re-entrancy loops while a run is in progress
    if (isRunning) {
      return;
    }

    // First run: lastSignature is null => auto-run
    if (lastSignature == null) {
      runWithGuard();
      setShowBanner(false);
      return;
    }

    const similarity = compareTwoStrings(currentSignature, lastSignature);
    if (similarity < similarityThreshold) {
      // Major change => auto-run
      runWithGuard();
      setShowBanner(false);
    } else {
      // Minor change => show banner
      setShowBanner(true);
    }
  }, [changed, lastSignature, currentSignature, similarityThreshold, runWithGuard, isRunning]);

  const acknowledgeMinorChange = useCallback(() => setShowBanner(false), []);

  const onManualRun = useCallback(async () => {
    setShowBanner(false);
    await runWithGuard();
  }, [runWithGuard]);

  return {
    showBanner,
    setShowBanner,
    acknowledgeMinorChange,
    onManualRun,
    isRunning,
    error,
  };
}
