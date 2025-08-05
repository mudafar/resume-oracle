import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { editSection } from "@/store/slices/profileSectionsSlice";
// import { updateMatch } from "@/store/slices/matchesSlice";
import { EnhanceProfileSectionModal } from "./EnhanceProfileSectionModal";
import { groupMatchesByProfileSection, MatchedProfileSection } from "../groupMatchesByProfileSection";
import { generateTextPreview } from "@/utils/textPreview";
import { createStep } from "@/utils/createStep";
import { 
  Card, 
  CardContent, 
  CardHeader 
} from "@/components/ui/card";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Badge 
} from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  Sparkles,
  FileText,
  TrendingUp
} from "lucide-react";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";

function hasGapsOrRecommendations(matches: MatchedProfileSection["baseJobRequirementMatches"]): boolean {
  return matches.some(match => match.gap_description || match.recommendation);
}


function getConfidenceBadgeVariant(confidence: number | null) {
  if (confidence === null || confidence === undefined) return "secondary";
  
  if (confidence >= 70) return "default";      // High confidence (70-100)
  if (confidence >= 40) return "secondary";    // Medium confidence (40-69)
  if (confidence >= 1) return "destructive";   // Low confidence (1-39)
  return "secondary";                          // No match (0)
}

function getConfidenceIcon(confidence: number | null) {
  if (confidence === null || confidence === undefined) return null;
  
  if (confidence >= 70) return <CheckCircle className="w-3 h-3" />;      // High confidence
  if (confidence >= 40) return <TrendingUp className="w-3 h-3" />;       // Medium confidence
  if (confidence >= 1) return <AlertTriangle className="w-3 h-3" />;     // Low confidence
  return null;                                                           // No match
}

const MatchedProfileSections: React.FC = () => {
  const dispatch = useDispatch();
  const profileSections = useSelector((state: RootState) => state.profileSections.sections);
  const selectedSections = useSelector((state: RootState) => state.matches.data?.selected_sections || []);
  const [openSections, setOpenSections] = useState<{ [id: string]: boolean }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<MatchedProfileSection | null>(null);

  // Filter out undefined `profileSection` values
  const matchedProfileSections = selectedSections
    .map((section) => {
      const profileSection = profileSections.find(ps => ps.id === section.section_id);
      if (!profileSection) return null; // Skip if no matching profile section

      return {
        profileSection,
        baseJobRequirementMatches: section.matched_clusters.map(cluster => ({
          requirement: cluster.cluster_name,
          confidence: cluster.weighted_score,
          gap_description: cluster.missing.join(", "),
          recommendation: cluster.strength_indicators.join(", ")
        }))
      };
    })
    .filter((item): item is { profileSection: ProfileSection; baseJobRequirementMatches: any[] } => item !== null); // Type guard to remove null values

  // Sort by number of matches (descending)
  matchedProfileSections.sort((a, b) => b.baseJobRequirementMatches.length - a.baseJobRequirementMatches.length);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEnhanceSection = (section: MatchedProfileSection) => {
    setSelectedSection(section);
    setModalOpen(true);
  };

  const handleApplyChanges = (enhancedContent: string) => {
    if (selectedSection) {
      // Update the profile section content
      dispatch(editSection({
        id: selectedSection.profileSection.id,
        type: selectedSection.profileSection.type,
        content: enhancedContent
      }));
      // Remove gaps and recommendations from all matches for this profile section
      selectedSections.forEach((section) => {
        section.matched_clusters.forEach((match) => {
          if (selectedSection?.profileSection.id === match.cluster_name) {
            // dispatch(updateMatch({
            //   id: match.id,
            //   match: {
            //     confidence: null,
            //     gap_description: null,
            //     recommendation: null
            //   }
            // }));
          }
        });
      });
    }
    setModalOpen(false);
    setSelectedSection(null);
  };

  const handleKeepOriginal = () => {
    setModalOpen(false);
    setSelectedSection(null);
  };

  if (matchedProfileSections.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Matched Profile Sections
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                There are currently no profile sections that match the job requirements to display.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <main className="space-y-6">
        {matchedProfileSections.map(({ profileSection: section, baseJobRequirementMatches: matches }: { profileSection: ProfileSection; baseJobRequirementMatches: any[] }) => {
          const { preview, isExpandable } = generateTextPreview(section.content);
          const isOpen = openSections[section.id];
          const hasIssues = hasGapsOrRecommendations(matches);

          return (
            <Card key={section.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <Collapsible
                open={isOpen}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CardHeader className="pb-4">
                  <CollapsibleTrigger asChild>
                    <div className="cursor-pointer hover:bg-gray-50 transition-colors duration-150 -mx-6 -my-6 px-6 py-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {matches.length} {matches.length === 1 ? 'match' : 'matches'}
                            </Badge>
                            {!hasIssues ? (
                              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Complete
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Needs Enhancement
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 leading-relaxed">
                            <div className="whitespace-pre-wrap">
                              {isOpen ? section.content : preview}
                            </div>
                            {isExpandable && !isOpen && (
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSection(section.id);
                                }}
                              >
                                Show More
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  {/* Enhanced button moved outside collapsible trigger */}
                  {hasIssues && (
                    <div className="pt-4 border-t border-gray-100">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnhanceSection({ profileSection: section, baseJobRequirementMatches: matches });
                        }}
                        className="w-full sm:w-auto"
                        variant="default"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Enhance This Section
                      </Button>
                    </div>
                  )}
                </CardHeader>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Job Requirement Matches</h4>
                        <div className="space-y-3">
                          {matches.map((m, i) => (
                            <div 
                              key={i} 
                              className="bg-gray-50 rounded-lg p-4 space-y-3"
                            >
                              <div className="font-medium text-gray-900">
                                "{m.requirement}"
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-700">Confidence:</span>
                                  {m.confidence ? (
                                    <Badge 
                                      variant={getConfidenceBadgeVariant(m.confidence)}
                                      className="text-xs"
                                    >
                                      {getConfidenceIcon(m.confidence)}
                                      <span className="ml-1">{m.confidence}%</span>
                                    </Badge>
                                  ) : (
                                    <span className="text-sm text-gray-500">N/A</span>
                                  )}
                                </div>
                                
                                {m.gap_description && (
                                  <div className="flex items-start gap-2 bg-red-50 p-3 rounded-md">
                                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <span className="text-sm font-medium text-red-800">Gap:</span>
                                      <p className="text-sm text-red-700 mt-1">{m.gap_description}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {m.recommendation && (
                                  <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-md">
                                    <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <span className="text-sm font-medium text-blue-800">Recommendation:</span>
                                      <p className="text-sm text-blue-700 mt-1">{m.recommendation}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </main>
      
      {selectedSection && (
        <EnhanceProfileSectionModal
          profileSection={selectedSection.profileSection}
          baseJobRequirementMatches={selectedSection.baseJobRequirementMatches}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onApplyChanges={handleApplyChanges}
          onKeepOriginal={handleKeepOriginal}
        />
      )}
    </div>
  );
};

export const MatchedProfileSectionsStep = createStep({
  id: "matched-profile-sections",
  label: "Profile Section Analysis",
  description: "Review how your profile sections match job requirements and enhance them where needed."
})(MatchedProfileSections);