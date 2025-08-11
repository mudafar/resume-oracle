'use client';
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { Layout } from "./layout/Layout";
import { SettingsModalWrapper } from "./settingsModal/SettingsModalWrapper";
import { stepComponents } from "./steps/stepComponents";

import { setCurrentStep } from "@/store/slices/stepSlice";

export const MultiStepFlow: React.FC = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.step.currentStep);

  const CurrentStepComponent = stepComponents[currentStep].component;

  return (
    <Layout
      steps={stepComponents}
      currentStep={currentStep}
      onStepChange={(step: number) => dispatch(setCurrentStep(step))}
    >
      <SettingsModalWrapper />
      <div className="relative min-h-screen">
        <CurrentStepComponent />
      </div>
    </Layout>
  );
};