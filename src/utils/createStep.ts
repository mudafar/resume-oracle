import { StepConfig, StepDefinition } from "@/types/stepTypes";

// Generic createStep factory function

export function createStep<TProps = {}>(config: StepConfig) {
  return (component: React.ComponentType<TProps>): StepDefinition<TProps> => ({
    ...config,
    component
  });
}