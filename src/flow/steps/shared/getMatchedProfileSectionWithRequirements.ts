import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { ProfileSectionWithRequirements, SelectedSection } from "@/services/zodModels";
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

    // Extract all requirements from coverage arrays across all matched pairs
    const allRequirements = section.matched_scored_pairs.flatMap(pair => [
      ...pair.coverage,
    ]);
    
    // Remove duplicates while preserving order
    const uniqueRequirements = allRequirements.filter((requirement, index, arr) => 
      arr.indexOf(requirement) === index
    );

    return {
      profile_section: profileSection,
      requirements: uniqueRequirements,
    };
  }).filter(Boolean) as ProfileSectionWithRequirements[]; // Remove null values and cast to correct type
};
