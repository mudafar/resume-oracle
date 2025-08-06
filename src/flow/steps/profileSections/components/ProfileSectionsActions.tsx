import React from "react";
import { ProfileSectionsActionBar } from "../ProfileSectionsActionBar";
import { ModelConfigPrompt } from "../ModelConfigPrompt";

interface ProfileSectionsActionsProps {
  // Model Config Prompt
  showPrompt: boolean;
  onClosePrompt: () => void;
  onConfigure: () => void;

  // Action Bar
  onNewSection: () => void;
  onImportFile: () => void;
  onExport: () => void;
  onDeleteAll: () => void;
  disabledExport: boolean;
  disabledDeleteAll: boolean;
}

export const ProfileSectionsActions: React.FC<ProfileSectionsActionsProps> = ({
  showPrompt,
  onClosePrompt,
  onConfigure,
  onNewSection,
  onImportFile,
  onExport,
  onDeleteAll,
  disabledExport,
  disabledDeleteAll
}) => {
  return (
    <>
      <ModelConfigPrompt
        show={showPrompt}
        onClose={onClosePrompt}
        onConfigure={onConfigure}
      />
      
      <ProfileSectionsActionBar
        onNewSection={onNewSection}
        onImportFile={onImportFile}
        onExport={onExport}
        onDeleteAll={onDeleteAll}
        disabledExport={disabledExport}
        disabledDeleteAll={disabledDeleteAll}
      />
    </>
  );
};
