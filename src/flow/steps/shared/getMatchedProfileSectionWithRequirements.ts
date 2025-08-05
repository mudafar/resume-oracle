import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { ProfileSectionWithRequirements } from "@/services/zodModels";
/**
 * Prepares matched profile sections payload for API calls
 * Used by both GenerateResumeSectionsStep and GenerateCoverLetterStep
 */
export const getMatchedProfileSectionWithRequirements = (
  selectedSections: { section_id: string; matched_clusters: { cluster_name: string }[] }[],
  profileSections: ProfileSection[]
): ProfileSectionWithRequirements[] => {
  return selectedSections.map((section) => {
    const profileSection = profileSections.find(ps => ps.id === section.section_id);
    if (!profileSection) return null; // Skip if no matching profile section

    return {
      profile_section: profileSection,
      requirements: section.matched_clusters.map(cluster => cluster.cluster_name),
    };
  }).filter(Boolean) as ProfileSectionWithRequirements[]; // Remove null values and cast to correct type
};
