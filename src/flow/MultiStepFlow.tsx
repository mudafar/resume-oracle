'use client';
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { AppLayout } from "./layout/AppLayout";
import { LLMConfigLayout } from "./layout/LLMConfigLayout";
import { stepComponents } from "./steps/stepComponents";

export const MultiStepFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const CurrentStepComponent = stepComponents[currentStep].component;


  return (
    <AppLayout
      steps={stepComponents}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
    >
      <LLMConfigLayout>
        <CurrentStepComponent />
      </LLMConfigLayout>
    </AppLayout>
  )
};