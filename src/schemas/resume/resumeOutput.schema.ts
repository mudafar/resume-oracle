import { z } from "zod";

export const ResumeStructureSchema = z.object({
  summary: z
    .string()
    .describe(
      "Professional summary section(s) combined and positioned at top. Consolidate multiple summary-type sections by concatenating content. Preserve exact formatting and content from input sections."
    )
    .default(""),
  experience: z
    .string()
    .describe(
      "All experience sections combined in reverse chronological order (most recent first). Preserve exact content formatting from input sections including company names with 'via' references. Add ## Experience header and concatenate all experience section content."
    )
    .default(""),
  skills: z
    .string()
    .describe(
      "All skills sections combined with consistent formatting. Group similar skill categories together, preserve original formatting. Add ## Skills header."
    )
    .default(""),
  education: z
    .string()
    .describe(
      "All education sections combined with degree information. Preserve exact formatting and details exactly as provided. Add ## Education header."
    )
    .default(""),
  projects: z
    .string()
    .describe(
      "All project sections combined with project details. Preserve original formatting including technologies and achievements. Add ## Projects header."
    )
    .default(""),
  certifications: z
    .string()
    .describe(
      "All certification sections combined with credential details. Preserve original formatting including issuing organizations and dates. Add ## Certifications header."
    )
    .default(""),
  achievements: z
    .string()
    .describe(
      "All achievement/award sections combined. Preserve original formatting and recognition details. Add ## Achievements header."
    )
    .default(""),
  volunteering: z
    .string()
    .describe(
      "All volunteering sections combined with service details. Preserve original formatting and organization information. Add ## Volunteering header."
    )
    .default(""),
  languages: z
    .string()
    .describe(
      "All language sections combined with proficiency levels. Preserve original formatting and skill level indicators. Add ## Languages header."
    )
    .default("")
});

export const ResumeOutputSchema = z.object({
  resume: ResumeStructureSchema.describe(
    "Structured resume sections organized in professional format"
  ),
  optimization_summary: z.string().describe(
    "Summary of structural organization decisions made: which sections were combined, ordering applied, headers added, and any content consolidation performed. Focus on organizational changes, not content modifications."
  ),
});

export type ResumeOutput = z.infer<typeof ResumeOutputSchema>;