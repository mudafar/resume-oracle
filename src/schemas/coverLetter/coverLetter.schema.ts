import { z } from "zod";
import { ProfileSectionWithRequirementsSchema } from "@/schemas/profile/profileEnhancement.schema";

export const GeneratedCoverLetterResultSchema = z.object({
  optimization_summary: z
    .string()
    .describe(
      "Brief analysis of strategic decisions made to maximize interview potential: key strengths highlighted for this specific role, cultural fit elements emphasized, tone adjustments to match job description style, and requirement coverage strategy. Focus on interview-landing optimizations made (50-100 words)."
    ),
  cover_letter_markdown: z
    .string()
    .describe(
      "Complete cover letter in professional markdown format optimized for interview consideration. STRUCTURE: Strong opening hook → relevant experience highlights → cultural fit demonstration → enthusiastic closing. LENGTH: 250-400 words maximum for optimal readability. TONE: Mirror job description style while maintaining professional authenticity. REQUIREMENTS: Address matched requirements naturally through specific examples from profile sections only. NO ADDITIONS: Do not add skills, experiences, or achievements not present in the original profile sections. ORGANIC INTEGRATION: Requirements should be naturally woven into existing experience narratives, never forced. GOAL: Compelling narrative that positions candidate as ideal fit worthy of interview invitation."
    ),
});

export const CoverLetterGenerationRequestSchema = z.object({
  profile_sections_with_requirements: z
    .array(ProfileSectionWithRequirementsSchema)
    .describe(
      "Array of profile sections with their content and matched requirements"
    ),
  company_context: z
    .string()
    .optional()
    .describe("Brief description of company values and culture"),
  tone_guidance: z
    .string()
    .describe(
      "Snippet of job description to set appropriate tone and wording"
    ),
});

export type GeneratedCoverLetterResult = z.infer<
  typeof GeneratedCoverLetterResultSchema
>;
