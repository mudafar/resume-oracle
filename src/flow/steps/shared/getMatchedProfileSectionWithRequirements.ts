import { groupMatchesByProfileSection, MatchedProfileSection } from "../groupMatchesByProfileSection";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { GenerateResumeSectionsRequest } from "@/store/services/llmApi";



/**
 * Prepares matched profile sections payload for API calls
 * Used by both GenerateResumeSectionsStep and GenerateCoverLetterStep
 */
export const getMatchedProfileSectionWithRequirements = (
  matches: any[],
  profileSections: ProfileSection[]
): GenerateResumeSectionsRequest => {
  const matchedProfileSections: MatchedProfileSection[] = groupMatchesByProfileSection(matches, profileSections);

  const pswr =  matchedProfileSections.map(({ profileSection, baseJobRequirementMatches }) => ({
    profile_section: profileSection,
    requirements: baseJobRequirementMatches.map(match => match.requirement),
  }));

  return {
    profile_sections_with_requirements: pswr
  }
};
