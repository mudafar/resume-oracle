import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { getMatchedProfileSectionWithRequirements } from "../shared/getMatchedProfileSectionWithRequirements";
import { groupMatchesByProfileSection, MatchedProfileSection } from "../groupMatchesByProfileSection";
import { RegenerateBanner } from "../shared/RegenerateBanner";
import { ResumeSectionCard } from "./ResumeSectionCard"
import { setResumeSections, updateResumeSection, setLastInputsHash } from "@/store/slices/resumeSectionsSlice";
import { useLlmService } from "@/hooks/useLlmService";
import { resumeSectionsGeneratorService } from "@/services/resumeSectionsGeneratorService";
import { ProfileSectionWithRequirements, GeneratedResumeSectionResult } from "@/services/zodModels";
import sha1 from "sha1";
import { createStep } from "@/utils/createStep";
import { 
  AlertTriangle, 
  Loader2,
  FileText,
} from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResumeSection {
  profile_section_id: string;
  type: string;
  content: string;
}

const GenerateResumeSections: React.FC = () => {
  const dispatch = useDispatch();
  const matches = useSelector((state: RootState) => state.matches.data || []);
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
    return getMatchedProfileSectionWithRequirements(matches, profileSections);
  }, [matches, profileSections]);

  // Compute hash of current inputs
  const inputsHash = useMemo(
    () => sha1(JSON.stringify(apiPayload)),
    [apiPayload]
  );
  const inputsChanged = inputsHash !== lastInputsHash;

  // On first entry, auto-generate if no resume sections
  useEffect(() => {
    if (!resumeSections.length && apiPayload.length > 0) {
      triggerGenerate(apiPayload);
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
    const matchedProfileSections: MatchedProfileSection[] = groupMatchesByProfileSection(matches, profileSections);
    const map: { [id: string]: { requirement: string }[] } = {};
    matchedProfileSections.forEach(({ profileSection, baseJobRequirementMatches }) => {
      map[profileSection.id] = baseJobRequirementMatches.map(m => ({
        requirement: m.requirement,
      }));
    });
    return map;
  }, [matches, profileSections]);


  // Trigger generation when needed (e.g., on mount or when matches/profileSections change)
  useEffect(() => {
    if (matches.length && profileSections.length) {
      if (apiPayload) {
        triggerGenerate(apiPayload);
      }
    }
    // eslint-disable-next-line
  }, [matches, profileSections, apiPayload]);

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
        {isLoading ? (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                <p className="text-gray-600 font-medium">Generating resume sections...</p>
                <p className="text-sm text-gray-500">This may take a few moments</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Generation Failed:</strong> Unable to generate resume sections. Please try again.
            </AlertDescription>
          </Alert>
        ) : resumeSections.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="text-center py-12 space-y-4">
              <FileText className="w-12 h-12 mx-auto text-gray-400" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">No Resume Sections</h3>
                <p className="text-gray-600">No sections have been generated yet. They will appear here once processing is complete.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
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
