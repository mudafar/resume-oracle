// zodModels.ts
// Zod schemas for all models in pydantic_models.py, preserving field descriptions and optionality
import { z } from "zod";

export const ProfileSectionSchema = z.object({
  id: z.string().describe("The ID of the profile section"),
  type: z.string().describe("The type of the profile section"),
  content: z.string().describe("The content of the profile section"),
});

export const ProfileSectionListSchema = z.object({
  profile_sections: z.array(ProfileSectionSchema).describe("The list of profile sections"),
});

export const JobRequirementSchema = z.object({
  job_requirement: z.string().describe("The job requirement"),
});

export const JobRequirementListSchema = z.object({
  job_requirements: z.array(z.string()).describe(
    "Comprehensive list of all job requirements extracted from the job description. Each requirement should be: (1) specific enough for profile matching, (2) follow the granularity provided in the job description, (3) use clear and precise language, (4) cover every hiring criterion including both explicit and implied requirements, and (5) avoid redundancy by combining similar requirements when appropriate."
  ),
});

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

export const MatchedProfileSectionSchema = z.object({
  profile_section: ProfileSectionSchema,
  base_job_requirement_matches: z.array(BaseJobRequirementMatchSchema),
});

export const ProfileSectionWithRequirementsSchema = z.object({
  profile_section: ProfileSectionSchema.describe("The profile section to process"),
  requirements: z.array(z.string()).describe("List of job requirements to optimize for"),
});

export const ProfileSectionSuggestionSchema = z.object({
  base_profile_section_id: z.string().describe("ID of the existing profile section used as foundation for enhancement"),
  suggested_profile_section: ProfileSectionSchema.describe("Enhanced version of the profile section incorporating the missing requirement"),
  summary_of_changes: z.string().describe("Specific description of enhancements made and rationale for section selection"),
});

export const EnhancedMatchedProfileSectionSchema = z.object({
  original_profile_section: ProfileSectionSchema.describe("The original profile section that already matched job requirements"),
  enhanced_profile_section: ProfileSectionSchema.describe("Optimized version of the profile section that maintains exact original structure while strengthening language, presentation, and keyword integration based on gap analysis recommendations"),
  enhancements_made: z.array(z.string()).describe("Specific improvements made based on gap descriptions and recommendations, such as: 'Strengthened action verbs in leadership experience', 'Added quantifiable metrics to project outcomes', or 'Integrated requirement-relevant keywords naturally'"),
  reasoning: z.array(z.string()).describe("Concise explanation of how each enhancement addresses the identified gaps and strengthens alignment with job requirements, connecting improvements to specific gap analysis recommendations"),
});

export const ResumeSectionSchema = z.object({
  type: z.string().describe("The type of the resume section (Experience, Education, Projects, Summary, Skills, etc.)"),
  content: z.string().describe("Resume-optimized summary that preserves requirement evidence from the original profile section. SUMMARIZATION RULES: Extract only the most relevant content that demonstrates the matched requirements. REQUIREMENT HIGHLIGHTING: Ensure all matched requirement keywords/concepts remain visible in the condensed format. NO ADDITIONS: Do not add skills, experiences, or achievements not present in the original profile section. ORGANIC INTEGRATION: Requirements should be naturally highlighted through existing content, not forced. FORMATTING BY TYPE: • Experience: **Job Title** | Company Name | Location | Date Range, followed by 2-4 bullet points with strong action verbs and quantifiable results. • Education: **Degree** | Institution Name | Graduation Year, with relevant coursework, GPA (if 3.5+), or honors if applicable. • Projects: **Project Name** | Technologies Used | Date Range, followed by 2-3 bullet points describing achievements and technologies. • Summary: 2-3 sentences in paragraph format highlighting key qualifications and value proposition, no header needed. • Skills: **Category**: Skill1, Skill2, Skill3 format, grouped by logical categories (Technical, Languages, Tools, etc.). • Certifications: **Certification Name** | Issuing Organization | Date, with expiration dates if relevant. Use standard resume terminology, strong action verbs, and optimize for ATS scanning with clean formatting."),
});

export const GeneratedResumeSectionResultSchema = ResumeSectionSchema.extend({
  profile_section_id: z.string().describe("ID of the original profile section that was summarized into this resume section"),
});

export const GeneratedResumeSectionResultListSchema = z.object({
  generated_resume_section_result_list: z.array(GeneratedResumeSectionResultSchema).describe("List of generated resume section result"),
});

export const GeneratedCoverLetterResultSchema = z.object({
  optimization_summary: z.string().describe("Brief analysis of strategic decisions made to maximize interview potential: key strengths highlighted for this specific role, cultural fit elements emphasized, tone adjustments to match job description style, and requirement coverage strategy. Focus on interview-landing optimizations made (50-100 words)."),
  cover_letter_markdown: z.string().describe("Complete cover letter in professional markdown format optimized for interview consideration. STRUCTURE: Strong opening hook → relevant experience highlights → cultural fit demonstration → enthusiastic closing. LENGTH: 250-400 words maximum for optimal readability. TONE: Mirror job description style while maintaining professional authenticity. REQUIREMENTS: Address matched requirements naturally through specific examples from profile sections only. NO ADDITIONS: Do not add skills, experiences, or achievements not present in the original profile sections. ORGANIC INTEGRATION: Requirements should be naturally woven into existing experience narratives, never forced. GOAL: Compelling narrative that positions candidate as ideal fit worthy of interview invitation."),
});

export const CoverLetterGenerationRequestSchema = z.object({
  profile_sections_with_requirements: z.array(ProfileSectionWithRequirementsSchema).describe("Array of profile sections with their content and matched requirements"),
  company_context: z.string().optional().describe("Brief description of company values and culture"),
  tone_guidance: z.string().describe("Snippet of job description to set appropriate tone and wording"),
});

export const ProfileSectionsWithRequirementsListSchema = z.object({
  profile_sections_with_requirements: z.array(ProfileSectionWithRequirementsSchema).describe("Array of profile sections with their content and matched requirements to generate resume sections from"),
});

export const ProfileParserRequestSchema = z.object({
  text: z.string().describe("Raw LinkedIn or resume text"),
  type: z.enum(["linkedin", "resume"]).describe("Type of profile for parsing heuristics"),
});

export const ProfileParserResponseSchema = z.object({
  profile_sections: z.array(ProfileSectionSchema).describe("List of extracted profile sections"),
});

export const ResumeStructureSchema = z.object({
  summary: z.string().describe("Professional summary section(s) combined and positioned at top. Consolidate multiple summary-type sections by concatenating content. Preserve exact formatting and content from input sections.").default(""),
  experience: z.string().describe("All experience sections combined in reverse chronological order (most recent first). Preserve exact content formatting from input sections including company names with 'via' references. Add ## Experience header and concatenate all experience section content.").default(""),
  skills: z.string().describe("All skills sections combined with consistent formatting. Group similar skill categories together, preserve original formatting. Add ## Skills header.").default(""),
  education: z.string().describe("All education sections combined with degree information. Preserve original formatting and details exactly as provided. Add ## Education header.").default(""),
  projects: z.string().describe("All project sections combined with project details. Preserve original formatting including technologies and achievements. Add ## Projects header.").default(""),
  certifications: z.string().describe("All certification sections combined with credential details. Preserve original formatting including issuing organizations and dates. Add ## Certifications header.").default(""),
  achievements: z.string().describe("All achievement/award sections combined. Preserve original formatting and recognition details. Add ## Achievements header.").default(""),
  volunteering: z.string().describe("All volunteering sections combined with service details. Preserve original formatting and organization information. Add ## Volunteering header.").default(""),
  languages: z.string().describe("All language sections combined with proficiency levels. Preserve original formatting and skill level indicators. Add ## Languages header.").default("")
});

export const ResumeOutputSchema = z.object({
  resume: ResumeStructureSchema.describe("Structured resume sections organized in professional format"),
  optimization_summary: z.string().describe("Summary of structural organization decisions made: which sections were combined, ordering applied, headers added, and any content consolidation performed. Focus on organizational changes, not content modifications."),
});

// Inferred types from Zod schemas (centralized here for reuse)
export type ProfileSection = z.infer<typeof ProfileSectionSchema>;
export type JobRequirement = z.infer<typeof JobRequirementSchema>;
export type BaseJobRequirementMatch = z.infer<typeof BaseJobRequirementMatchSchema>;
export type JobRequirementMatch = z.infer<typeof JobRequirementMatchSchema>;
export type MatchedProfileSection = z.infer<typeof MatchedProfileSectionSchema>;
export type ProfileSectionWithRequirements = z.infer<typeof ProfileSectionWithRequirementsSchema>;
export type ProfileSectionSuggestion = z.infer<typeof ProfileSectionSuggestionSchema>;
export type EnhancedMatchedProfileSection = z.infer<typeof EnhancedMatchedProfileSectionSchema>;
// ...add more as needed for other schemas
