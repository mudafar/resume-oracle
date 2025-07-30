import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { groupMatchesByProfileSection, MatchedProfileSection } from "../groupMatchesByProfileSection";
import { RegenerateBanner } from "../shared/RegenerateBanner";
import { ResumeSectionCard } from "./ResumeSectionCard"
import { setResumeSections, updateResumeSection, setLastInputsHash } from "@/store/slices/resumeSectionsSlice";
import { useGenerateResumeSectionsMutation } from "@/store/services/llmApi";
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

  // RTK Query mutation
  const [triggerGenerateResumeSections, { isLoading, error }] = useGenerateResumeSectionsMutation();

  // Prepare payload for API
  const matchedProfileSections: MatchedProfileSection[] = groupMatchesByProfileSection(matches, profileSections);
  const apiPayload = matchedProfileSections.map(({ profileSection, baseJobRequirementMatches }) => ({
    profile_section: profileSection,
    requirements: baseJobRequirementMatches.map(match => match.requirement),
  }));

  // Compute hash of current inputs
  const inputsHash = useMemo(
    () => sha1(JSON.stringify({ matchedProfileSections })),
    [matchedProfileSections]
  );
  const inputsChanged = inputsHash !== lastInputsHash;

  // On first entry, auto-generate if no resume sections
  useEffect(() => {
    if (!resumeSections.length) {
      triggerGenerateResumeSections({ profile_sections_with_requirements: apiPayload })
        .unwrap()
        .then(({ data } ) => {
          setEditedContent(Object.fromEntries(data.map(s => [s.profile_section_id, s.content])));
          dispatch(setResumeSections(data));
          dispatch(setLastInputsHash(inputsHash));
        });
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
    await triggerGenerateResumeSections({ profile_sections_with_requirements: apiPayload })
      .unwrap()
      .then(({ data }) => {
        setEditedContent(Object.fromEntries(data.map(s => [s.profile_section_id, s.content])));
        dispatch(setResumeSections(data));
        dispatch(setLastInputsHash(inputsHash));
      });
  };

  // Reference requirements for each section
  const referenceMap: { [id: string]: { requirement: string }[] } = {};
  matchedProfileSections.forEach(({ profileSection, baseJobRequirementMatches }) => {
    referenceMap[profileSection.id] = baseJobRequirementMatches.map(m => ({
      requirement: m.requirement,
    }));
  });



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