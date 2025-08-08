import { z } from "zod";

export const BaseJobRequirementMatchSchema = z.object({
  requirement: z.string().describe("The original requirement text"),
  confidence: z.number().describe("Confidence score (0-100) indicating how well the profile section meets the requirement. Scoring guidelines: 90-100% = Strong, recent, direct experience with clear evidence; 70-89% = Good experience with some gaps or older timeline; 50-69% = Basic experience or transferable skills, needs strengthening; 0-49% = Insufficient evidence, no match found (use empty profile_section_id)"),
  gap_description: z.string().describe("Specific, actionable description of what's missing or could be improved to better meet this requirement. Focus on concrete deficiencies such as: missing specific technologies, lack of recent experience, insufficient depth of experience, or missing relevant context. Use empty string ('') if no gaps identified and confidence is above 90%."),
  recommendation: z.string().describe("Concrete, actionable steps to strengthen the profile section for this requirement. Provide specific guidance such as: 'Add recent project examples using [technology]', 'Quantify achievements with specific metrics', 'Highlight leadership aspects of the experience', or 'Include certification or training details'. Use empty string ('') if no improvements needed and confidence is above 90%."),
});

export const JobRequirementMatchSchema = BaseJobRequirementMatchSchema.extend({
  profile_section_id: z.string().describe("ID of the ONE best matching profile section for this requirement. Selection criteria: Choose the profile section with the strongest evidence of the required skill/experience. Use empty string ('') when confidence is below 50% or no relevant profile section demonstrates the capability. Maintain consistency in matching logic across similar requirements."),
});

export const JobRequirementMatchListSchema = z.object({
  job_requirement_matches: z.array(JobRequirementMatchSchema),
});

export type BaseJobRequirementMatch = z.infer<typeof BaseJobRequirementMatchSchema>;
export type JobRequirementMatch = z.infer<typeof JobRequirementMatchSchema>;
