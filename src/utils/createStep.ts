import { StepConfig, StepDefinition } from "@/types/multiStepFlow/step.types";

// Generic createStep factory function

export function createStep<TProps = {}>(config: StepConfig) {
  return (component: React.ComponentType<TProps>): StepDefinition<TProps> => ({
    ...config,
    component
  });
}