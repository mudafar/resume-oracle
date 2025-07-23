import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { BaseJobRequirementMatch, JobRequirementMatch } from "@/store/slices/matchesSlice";

export type MatchedProfileSection = {
  profileSection: ProfileSection;
  baseJobRequirementMatches: BaseJobRequirementMatch[];
};

export function groupMatchesByProfileSection(
  matches: JobRequirementMatch[],
  profileSections: ProfileSection[]
): MatchedProfileSection[] {
  // Only include matches that are linked to a profile section
  const grouped: { [id: string]: BaseJobRequirementMatch[] } = {};
  matches.forEach((match) => {
    if (!match.profile_section_id) return;
    if (!grouped[match.profile_section_id]) grouped[match.profile_section_id] = [];
    grouped[match.profile_section_id].push({
      requirement: match.requirement,
      confidence: match.confidence,
      gap_description: match.gap_description,
      recommendation: match.recommendation,
    });
  });
  // Return array of { profileSection, baseJobRequirementMatches }
  return Object.entries(grouped)
    .map(([profileSectionId, baseJobRequirementMatches]) => {
      const profileSection = profileSections.find((s) => s.id === profileSectionId);
      return profileSection ? { profileSection, baseJobRequirementMatches } : null;
    })
    .filter((g): g is MatchedProfileSection => Boolean(g));
} 