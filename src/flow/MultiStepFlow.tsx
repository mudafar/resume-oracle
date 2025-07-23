'use client';
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { AppLayout } from "./layout/AppLayout";
import { SettingsLayout } from "./layout/SettingsLayout";
import { stepComponents } from "./steps/stepComponents";

import { setCurrentStep } from "@/store/slices/stepSlice";

export const MultiStepFlow: React.FC = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.step.currentStep);

  const CurrentStepComponent = stepComponents[currentStep].component;

  return (
    <AppLayout
      steps={stepComponents}
      currentStep={currentStep}
      onStepChange={(step: number) => dispatch(setCurrentStep(step))}
    >
      <SettingsLayout>
        <CurrentStepComponent />
      </SettingsLayout>
    </AppLayout>
  );
};