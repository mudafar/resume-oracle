export interface StepSignatureRecord {
  lastSignature: string | null;
  lastSignatureHash?: string | null;
}

export interface SignaturesState {
  steps: Record<string, StepSignatureRecord>;
}

// Action payload types for the signatures slice
export interface SetLastSignaturePayload {
  stepKey: string;
  signature: string | null;
  signatureHash?: string | null;
}

export interface ClearStepSignaturePayload {
  stepKey: string;
}
