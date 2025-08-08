import type { ProfileSection } from "@/schemas/profile";
import type { ProfileSectionWithRequirements } from "@/schemas/profile";
import type { SelectedSection } from "@/schemas/matching";
/**
 * Prepares matched profile sections payload for API calls
 * Used by both GenerateResumeSectionsStep and GenerateCoverLetterStep
 */
export const getMatchedProfileSectionWithRequirements = (
  selectedSections: SelectedSection[],
  profileSections: ProfileSection[]
): ProfileSectionWithRequirements[] => {
  return selectedSections.map((section) => {
    const profileSection = profileSections.find(ps => ps.id === section.profile_section_id);
    if (!profileSection) return null; // Skip if no matching profile section

    const requirementClusters = section.matched_scored_pairs.map(pair => ({
      cluster_name: pair.cluster_name,
      priority_tier: pair.priority_tier,
      requirements: [...pair.coverage, ...pair.missing],
    }));
    // Extract all requirements from coverage arrays across all matched pairs
    const allRequirements = section.matched_scored_pairs.flatMap(pair => [
      ...pair.coverage,
      ...pair.missing,
    ]);
    
    // Remove duplicates while preserving order
    const uniqueRequirements = allRequirements.filter((requirement, index, arr) => 
      arr.indexOf(requirement) === index
    );

    return {
      profile_section: profileSection,
      requirement_clusters: requirementClusters
    };
  }).filter(Boolean) as ProfileSectionWithRequirements[]; // Remove null values and cast to correct type
};
