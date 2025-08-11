import React from "react";
import { ResumeSectionCard } from "./ResumeSectionCard";
import { updateResumeSection } from "@/store/slices/resumeSectionsSlice";
import { Dispatch } from "@reduxjs/toolkit";

interface ResumeSection {
  profile_section_id: string;
  type: string;
  content: string;
}

interface ResumeSectionsListProps {
  resumeSections: ResumeSection[];
  editing: { [id: string]: boolean };
  setEditing: React.Dispatch<React.SetStateAction<{ [id: string]: boolean }>>;
  editedContent: { [id: string]: string };
  setEditedContent: React.Dispatch<React.SetStateAction<{ [id: string]: string }>>;
  dispatch: Dispatch;
  referenceMap: { [id: string]: { requirement: string }[] };
}

export const ResumeSectionsList: React.FC<ResumeSectionsListProps> = ({
  resumeSections,
  editing,
  setEditing,
  editedContent,
  setEditedContent,
  dispatch,
  referenceMap
}) => {
  return (
    <div className="grid gap-6">
      {resumeSections.map((section) => (
        <ResumeSectionCard
          key={section.profile_section_id}
          section={section}
          editing={editing}
          setEditing={setEditing}
          editedContent={editedContent}
          setEditedContent={setEditedContent}
          dispatch={dispatch}
          updateResumeSection={updateResumeSection}
          referenceMap={referenceMap}
        />
      ))}
    </div>
  );
};
