import { z } from "zod";
import { ProfileSectionSchema } from "./profileSection.schema";

export const ProfileSectionWithRequirementsSchema = z.object({
  profile_section: ProfileSectionSchema.describe("The profile section to process"),
  requirement_clusters: z
    .array(
      z.object({
        cluster_name: z.string().describe("Name of the requirement cluster this section matches"),
        priority_tier: z
          .enum(["critical", "important", "nice_to_have"]).describe(
            "Priority level of the cluster"
          ),
        requirements: z
          .array(z.string())
          .describe("List of requirements in this cluster that this section matches"),
      })
    )
    .describe("List of requirement clusters this profile section matches"),
});

export const ProfileSectionSuggestionSchema = z.object({
  base_profile_section_id: z
    .string()
    .describe(
      "ID of the existing profile section used as foundation for enhancement"
    ),
  suggested_profile_section: ProfileSectionSchema.describe(
    "Enhanced version of the profile section incorporating the missing requirement"
  ),
  summary_of_changes: z
    .string()
    .describe(
      "Specific description of enhancements made and rationale for section selection"
    ),
});

export const EnhancedMatchedProfileSectionSchema = z.object({
  original_profile_section: ProfileSectionSchema.describe(
    "The original profile section that already matched job requirements"
  ),
  enhanced_profile_section: ProfileSectionSchema.describe(
    "Optimized version of the profile section that maintains exact original structure while strengthening language, presentation, and keyword integration based on gap analysis recommendations"
  ),
  enhancements_made: z
    .array(z.string())
    .describe(
      "Specific improvements made based on gap descriptions and recommendations, such as: 'Strengthened action verbs in leadership experience', 'Added quantifiable metrics to project outcomes', or 'Integrated requirement-relevant keywords naturally'"
    ),
  reasoning: z
    .array(z.string())
    .describe(
      "Concise explanation of how each enhancement addresses the identified gaps and strengthens alignment with job requirements, connecting improvements to specific gap analysis recommendations"
    ),
});

export const ProfileSectionsWithRequirementsListSchema = z.object({
  profile_sections_with_requirements: z
    .array(ProfileSectionWithRequirementsSchema)
    .describe(
      "Array of profile sections with their content and matched requirements to generate resume sections from"
    ),
});

export type ProfileSectionWithRequirements = z.infer<
  typeof ProfileSectionWithRequirementsSchema
>;
export type ProfileSectionSuggestion = z.infer<
  typeof ProfileSectionSuggestionSchema
>;
export type EnhancedMatchedProfileSection = z.infer<
  typeof EnhancedMatchedProfileSectionSchema
>;
