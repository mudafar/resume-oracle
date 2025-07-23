export interface StepConfig {
    id: string;
    label: string;
    description?: string;
    isOptional?: boolean;
  }
  
  export interface StepDefinition<TProps = {}> extends StepConfig {
    component: React.ComponentType<TProps>;
  }