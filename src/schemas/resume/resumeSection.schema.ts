import { z } from "zod";

export const ResumeSectionSchema = z.object({
  type: z
    .string()
    .describe(
      "The type of the resume section (Experience, Education, Projects, Summary, Skills, etc.)"
    ),
  content: z
    .string()
    .describe(
      "Resume-optimized summary that preserves requirement evidence from the original profile section. SUMMARIZATION RULES: Extract only the most relevant content that demonstrates the matched requirements. REQUIREMENT HIGHLIGHTING: Ensure all matched requirement keywords/concepts remain visible in the condensed format. NO ADDITIONS: Do not add skills, experiences, or achievements not present in the original profile section. ORGANIC INTEGRATION: Requirements should be naturally highlighted through existing content, not forced. FORMATTING BY TYPE: • Experience: **Job Title** | Company Name | Location | Date Range, followed by 2-4 bullet points with strong action verbs and quantifiable results. • Education: **Degree** | Institution Name | Graduation Year, with relevant coursework, GPA (if 3.5+), or honors if applicable. • Projects: **Project Name** | Technologies Used | Date Range, followed by 2-3 bullet points describing achievements and technologies. • Summary: 2-3 sentences in paragraph format highlighting key qualifications and value proposition, no header needed. • Skills: **Category**: Skill1, Skill2, Skill3 format, grouped by logical categories (Technical, Languages, Tools, etc.). • Certifications: **Certification Name** | Issuing Organization | Date, with expiration dates if relevant. Use standard resume terminology, strong action verbs, and optimize for ATS scanning with clean formatting."
    ),
});

export const GeneratedResumeSectionResultSchema = ResumeSectionSchema.extend({
  profile_section_id: z
    .string()
    .describe(
      "ID of the original profile section that was summarized into this resume section"
    ),
});

export const GeneratedResumeSectionResultListSchema = z.object({
  generated_resume_section_result_list: z
    .array(GeneratedResumeSectionResultSchema)
    .describe("List of generated resume section result"),
});

export type ResumeSection = z.infer<typeof ResumeSectionSchema>;
export type GeneratedResumeSectionResult = z.infer<
  typeof GeneratedResumeSectionResultSchema
>;
