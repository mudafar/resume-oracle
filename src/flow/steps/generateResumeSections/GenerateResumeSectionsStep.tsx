import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { getMatchedProfileSectionWithRequirements } from "../shared/getMatchedProfileSectionWithRequirements";
import { RegenerateBanner } from "../shared/RegenerateBanner";
import { setResumeSections, updateResumeSection, setLastInputsHash } from "@/store/slices/resumeSectionsSlice";
import { useLlmService } from "@/hooks/useLlmService";
import { resumeSectionsGeneratorService } from "@/services/resumeSectionsGeneratorService";
import { GeneratedResumeSectionResult } from "@/services/zodModels";
import sha1 from "sha1";
import { createStep } from "@/utils/createStep";
import { ResumeSectionsList, ResumeSectionsStates } from "./components";

interface ResumeSection {
  profile_section_id: string;
  type: string;
  content: string;
}

const GenerateResumeSections: React.FC = () => {
  const dispatch = useDispatch();
  const selectedSections = useSelector((state: RootState) => state.matches.selected_sections);
  const profileSections = useSelector((state: RootState) => state.profileSections.sections || []);
  const resumeSections = useSelector((state: RootState) => state.resumeSections.resumeSections || []);
  const lastInputsHash = useSelector((state: RootState) => state.resumeSections.lastInputsHash);
  const [editing, setEditing] = useState<{ [id: string]: boolean }>({});
  const [editedContent, setEditedContent] = useState<{ [id: string]: string }>({});
  const [showRegenerateBanner, setShowRegenerateBanner] = useState(false);

  // LLM service trigger
  const [triggerGenerate, { data, isLoading, error, reset }] = useLlmService<GeneratedResumeSectionResult[]>(
    resumeSectionsGeneratorService.generateResumeSection
  );

  // Prepare payload for API - memoize to prevent unnecessary re-computations
  const apiPayload = useMemo(() => {
    return getMatchedProfileSectionWithRequirements(selectedSections, profileSections);
  }, [selectedSections, profileSections]);

  // Compute hash of current inputs
  const inputsHash = useMemo(
    () => sha1(JSON.stringify(apiPayload)),
    [apiPayload]
  );
  const inputsChanged = inputsHash !== lastInputsHash;

  // On first entry, auto-generate if no resume sections
  useEffect(() => {
    // Adjust logic to check if `apiPayload` has entries
    if (!resumeSections.length && Object.keys(apiPayload).length > 0) {
      // triggerGenerate(apiPayload);
    }
    // eslint-disable-next-line
  }, []);

  // Show banner if inputs changed
  useEffect(() => {
    if (inputsChanged) {
      setShowRegenerateBanner(true);
    }
  }, [inputsChanged]);

  // Regenerate handler
  const onRegenerate = async () => {
    setShowRegenerateBanner(false);
    await triggerGenerate(apiPayload);
  };

  // Reference requirements for each section - memoize to prevent unnecessary re-computations
  const referenceMap = useMemo(() => {
    const map: { [id: string]: { requirement: string }[] } = {};
    selectedSections.forEach((section) => {
      map[section.profile_section_id] = section.matched_scored_pairs.map(pair => ({
        requirement: pair.coverage.join(', '), // Join coverage requirements
      }));
    });
    return map;
  }, [selectedSections]);


  // Trigger generation when needed (e.g., on mount or when matches/profileSections change)
  useEffect(() => {
    if (selectedSections.length && profileSections.length) {
      if (apiPayload) {
        // triggerGenerate(apiPayload);
      }
    }
    // eslint-disable-next-line
  }, [selectedSections, profileSections, apiPayload]);

  // Handle result
  useEffect(() => {
    if (data) {
      dispatch(setResumeSections(data));
    }
  }, [data, dispatch]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">

      {/* Regeneration Banner */}
      <RegenerateBanner
        show={showRegenerateBanner}
        isLoading={isLoading}
        onRegenerate={onRegenerate}
        onDismiss={() => setShowRegenerateBanner(false)}
        message="Your inputs have changed since the last generation. Consider regenerating for the most up-to-date resume."
      />

      {/* Main Content */}
      <main className="space-y-6">
        <ResumeSectionsStates
          isLoading={isLoading}
          error={error}
          hasResumeSections={resumeSections.length > 0}
          onRetry={onRegenerate}
        />
        
        {resumeSections.length > 0 && !isLoading && !error && (
          <ResumeSectionsList
            resumeSections={resumeSections}
            editing={editing}
            setEditing={setEditing}
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            dispatch={dispatch}
            referenceMap={referenceMap}
          />
        )}
      </main>
    </div>
  );
};

export const GenerateResumeSectionsStep = createStep({
  id: "generate-resume-sections",
  label: "Generate Resume Sections",
  description: "AI-generated resume sections tailored to your profile and job matches."
})(GenerateResumeSections);

export default GenerateResumeSections;
