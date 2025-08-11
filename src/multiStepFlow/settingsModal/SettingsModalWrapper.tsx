import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { SettingsModal } from "./SettingsModal";
import { closeConfigModal } from "@/store/slices/llmConfigSlice";

export const SettingsModalWrapper: React.FC = () => {
  const showModelConfig = useSelector((state: RootState) => state.llmConfig.showConfigModal);
  const dispatch = useDispatch();


  const handleClose = () => {
    dispatch(closeConfigModal());
  };

  return (
      showModelConfig && (
        <SettingsModal open={showModelConfig} onClose={handleClose} />
      )
  );
}; 