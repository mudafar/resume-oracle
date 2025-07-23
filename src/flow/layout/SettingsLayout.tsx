import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { SettingsModal } from "../steps/SettingsModal";
import { openConfigModal, closeConfigModal, setHasSeenConfigModal } from "@/store/slices/llmConfigSlice";

export const SettingsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const showModelConfig = useSelector((state: RootState) => state.llmConfig.showConfigModal);
  const hasSeenConfigModal = useSelector((state: RootState) => state.llmConfig.hasSeenConfigModal);

  // Show modal on first visit
  useEffect(() => {
    if (!hasSeenConfigModal) {
      dispatch(openConfigModal());
    }
  }, [hasSeenConfigModal, dispatch]);

  const handleClose = () => {
    dispatch(closeConfigModal());
    dispatch(setHasSeenConfigModal(true));
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