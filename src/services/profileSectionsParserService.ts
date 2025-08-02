import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { llmService } from "./llmService";
import { ProfileSectionSchema, ProfileSectionListSchema } from "./zodModels";
import { LLMConfig } from "@/store/slices/llmConfigSlice";

// Removed local LLMConfig interface, now using imported LLMConfig type

type ProfileSection = z.infer<typeof ProfileSectionSchema>;
type ProfileType = "linkedin" | "resume";

export class ProfileSectionsParserService {
  constructor() {
    this.parseProfileSections = this.parseProfileSections.bind(this);
    this._getFormatHints = this._getFormatHints.bind(this);
  }
  /**
   * Service for parsing profile sections from LinkedIn or resume text
   */

  async parseProfileSections(
    text: string,
    profileType: ProfileType,
    llmConfig?: LLMConfig
  ): Promise<ProfileSection[]> {
    /**
     * Parse profile sections from raw LinkedIn profile or resume text
     *
     * @param text - Raw LinkedIn profile or resume text
     * @param profileType - Type of profile for parsing heuristics ("linkedin" or "resume")
     * @param llmConfig - Optional LLM config dict from request.state.llm_config
     *
     * @returns List of parsed profile sections
     */

    const prompt = ChatPromptTemplate.fromTemplate(`
            Extract structured sections from the following {profile_type} text.

            {format_hints}

            Instructions:
            - **Extract exact content**: Do not modify, summarize, or clean any text
            - **Generate IDs**: Use format \`{{section_type}}_{{number}}\` (e.g., "experience_1", "education_1")  
            - **Section types**: summary, experience, education, skills, projects, certifications, achievements, volunteering, languages, publications, patents, contact
            - **Multi-entries**: Create separate sections for each job, school, project, etc.
            - **Exclude headers**: Don't include section type like "Education" in content
            - **Preserve formatting**: Keep all original structure, punctuation, and text exactly as written

                                                  
            Profile Text:
            {profile_text}
            `);

    try {
      const result = await llmService.invokeWithStructuredOutput(
        prompt,
        ProfileSectionListSchema,
        {
          profile_text: text,
          profile_type: profileType,
          format_hints: this._getFormatHints(profileType),
        },
        llmConfig
      );

      return result.profile_sections;
    } catch (error) {
      console.error(`[ERROR] parseProfileSections failed:`, error);
      return [];
    }
  }

  private _getFormatHints(profileType: ProfileType): string {
    /**
     * Get format-specific hints for boundary detection
     */
    if (profileType === "linkedin") {
      return `LinkedIn Format Hints for Section Detection:
                - Look for headers like "About", "Experience", "Education"
                - Experience entries have company names, job titles, dates
                - Content blocks are typically longer and more descriptive
                - May contain endorsements or recommendation text
                `;
    } else {
      // resume
      return `Resume Format Hints for Section Detection:
                - Look for headers like "SUMMARY", "WORK EXPERIENCE", "EDUCATION"  
                - Content often uses bullet points and structured formatting
                - Experience entries are typically more concise
                - Sections are more standardized and clearly separated
                `;
    }
  }
}

// Create a singleton instance
export const profileParserService = new ProfileSectionsParserService();