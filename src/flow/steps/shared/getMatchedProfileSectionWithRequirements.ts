import { groupMatchesByProfileSection, MatchedProfileSection } from "../groupMatchesByProfileSection";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { ProfileSectionWithRequirements } from "@/services/zodModels";
/**
 * Prepares matched profile sections payload for API calls
 * Used by both GenerateResumeSectionsStep and GenerateCoverLetterStep
 */
export const getMatchedProfileSectionWithRequirements = (
  matches: any[],
  profileSections: ProfileSection[]
): ProfileSectionWithRequirements => {
  const matchedProfileSections: MatchedProfileSection[] = groupMatchesByProfileSection(matches, profileSections);
  return matchedProfileSections.map(({ profileSection, baseJobRequirementMatches }) => ({
    profile_section: profileSection,
    requirements: baseJobRequirementMatches.map(match => match.requirement),
  }));
};
