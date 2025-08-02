import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ProfileSectionSuggestionSchema, ProfileSection, ProfileSectionSuggestion } from "./zodModels";
import { llmService } from "./llmService";
import { LLMConfig } from "@/store/slices/llmConfigSlice";

export class ProfileSectionSuggestionService {
  /**
   * Generate a suggested profile section for a requirement that had no sufficient match.
   * Enhances an existing profile section by building upon the most relevant experience.
   *
   * @param requirement - The requirement that needs to be addressed (had <50% confidence match)
   * @param profileSections - List of existing profile sections ordered by relevance/match count
   * @param gapDescription - Description of what's missing from the matching analysis
   * @param recommendation - Specific guidance on how to address the requirement from matching analysis
   * @param customHint - Optional user-provided context about their experience to guide enhancements
   * @param llmConfig - Optional LLM config dict
   * @returns ProfileSectionSuggestion containing base ID, enhanced section, and summary of changes
   */
  async suggestProfileSection(
    requirement: string,
    profileSections: ProfileSection[],
    gapDescription?: string,
    recommendation?: string,
    customHint?: string,
    llmConfig?: LLMConfig
  ): Promise<ProfileSectionSuggestion> {
    // Format profile sections for the prompt
    const profile_sections_str = profileSections
      .map(
        (section) => `ID: ${section.id}, Type: ${section.type}, Content: ${section.content}`
      )
      .join("\n");

    // Prepare optional sections for the prompt
    const gap_description_section = gapDescription ? `\n**GAP DESCRIPTION**: ${gapDescription}` : "";
    const recommendation_section = recommendation ? `\n**ENHANCEMENT RECOMMENDATION**: ${recommendation}` : "";
    const custom_hint_section = customHint ? `\n**CUSTOM HINT**: ${customHint}` : "";

    const prompt = ChatPromptTemplate.fromTemplate(`
            You are a Senior Technical Architect and Career Development Expert with deep expertise in evaluating technical competencies and guiding professional growth in the technology sector.

            ## Mission
            Your mission is to create a compelling profile section that demonstrates the missing requirement by building upon existing experience. This requirement had no sufficient match in the current profile, so you must creatively enhance an existing section to showcase relevant capabilities.

            ## Input Data
            **MISSING REQUIREMENT**: {requirement}
            {gap_description_section}
            {recommendation_section}

            **AVAILABLE PROFILE SECTIONS**: Listed in priority order based on their relevance to other requirements
            {profile_sections}
            {custom_hint_section}

            ## Enhancement Strategy
            
            ### Base Section Selection
            - **PRIORITIZE FIRST**: Start with the first profile section (highest overall matches to other requirements)
            - **LOGICAL FIT**: Evaluate if the requirement can be reasonably connected to this section's context
            - **TIMELINE COMPATIBILITY**: Ensure the enhancement fits within the section's timeframe and role scope
            - **STRUCTURAL INTEGRITY**: Maintain the original format and organization
            
            ### Enhancement Approach
            1. **Identify Connection Points**: Find existing experiences that could reasonably demonstrate the missing requirement
            2. **Build Believable Extensions**: Add specific, measurable details that show capability development
            3. **Maintain Authenticity**: Enhancements should feel natural within the existing role/project context
            4. **Use Available Context**: Leverage gap_description, recommendation, and custom_hint to guide realistic additions
            
            ### Content Guidelines
            - **Specific and Measurable**: Add concrete examples, technologies, metrics, or outcomes
            - **Context-Appropriate**: Additions must fit the company size, industry, and role level of the base section
            - **Progressive Enhancement**: Show skill development or application within existing experience
            - **Natural Integration**: New content should blend seamlessly with existing content
            
            ## Structure Preservation Requirements
            - **CRITICAL**: Maintain the exact original structure and framework of the selected profile section
            - Preserve formatting: bullet points, paragraphs, STAR method, etc.
            - Keep role titles, company names, and duration formats exactly as presented
            - Maintain section hierarchy and information flow
            - Match the writing style and tone of the original section
            
            Create a realistic, enhanced profile section that credibly demonstrates the missing requirement while preserving the authenticity and structure of the original experience.
            `);
    try {
      const result = await llmService.invokeWithStructuredOutput(
        prompt,
        ProfileSectionSuggestionSchema,
        {
          requirement,
          profile_sections: profile_sections_str,
          gap_description_section,
          recommendation_section,
          custom_hint_section,
        },
        llmConfig
      );
      return result;
    } catch (error) {
      console.error("[ERROR] suggestProfileSection failed:", error);
      throw error;
    }
  }
}

export const profileSectionSuggestionService = new ProfileSectionSuggestionService();

