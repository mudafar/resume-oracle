import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { SettingsModal } from "../steps/SettingsModal";
import { closeConfigModal } from "@/store/slices/llmConfigSlice";

export const SettingsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showModelConfig = useSelector((state: RootState) => state.llmConfig.showConfigModal);
  const dispatch = useDispatch();


  const handleClose = () => {
    dispatch(closeConfigModal());
  };

  return (
    <div className="relative min-h-screen">
      {showModelConfig && (
        <SettingsModal open={showModelConfig} onClose={handleClose} />
      )}
      {children}
    </div>
  );
}; 