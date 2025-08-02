import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llmService } from "./llmService";
import { EnhancedMatchedProfileSection, MatchedProfileSection, EnhancedMatchedProfileSectionSchema } from "@/services/zodModels";

export class MatchedProfileSectionEnhancerService {
  /**
   * Service for enhancing profile sections to better align with requirements
   */
  async enhanceMatchedProfileSection(
    matchedProfileSection: MatchedProfileSection,
    llmConfig?: any
  ): Promise<EnhancedMatchedProfileSection | null> {
    /**
     * Enhance a matched profile section using LLM
     * @param matchedProfileSection - The matched profile section object
     * @param llmConfig - Optional LLM config
     * @returns EnhancedMatchedProfileSection
     */
    const requirements_context = matchedProfileSection.base_job_requirement_matches
      .map(
        (item) =>
          `- Requirement: ${item.requirement}\n  Gap: ${item.gap_description}\n  Recommendation: ${item.recommendation}`
      )
      .join("\n");
    const prompt = ChatPromptTemplate.fromTemplate(`
        You are a Senior Profile Enhancement Specialist with expertise in optimizing already-successful profile sections. You specialize in taking profile content that already demonstrates relevant experience and refining it to maximize alignment with specific job requirements through strategic language optimization and presentation enhancement.
        
        ## Mission
        Your mission is to transform profile sections that already demonstrate job requirement alignment into optimized versions that maximize their match strength. Using detailed gap analysis, you will strategically enhance language, presentation, and keyword integration to help candidates present their existing experience in the most compelling way possible. You must work exclusively within the bounds of authentic experience—enhancing what exists, never adding what doesn't.

        ## Input Data
        **ORIGINAL PROFILE SECTION**: {original_profile_section}
        *This profile section already demonstrates alignment with job requirements (50%+ confidence match) and serves as the foundation for enhancement.*

        **GAP ANALYSIS**: {requirements_context}
        *Detailed analysis for each matched requirement, including specific gap descriptions and targeted recommendations for strengthening the alignment.*

        ## Enhancement Framework
        
        ### Natural Enhancement Strategy
        Only make improvements that feel authentic and naturally strengthen existing content:
        
        **Authentic Enhancement Constraints**:
        - **No Requirement Parroting**: Never explicitly state "demonstrating X requirement" or reference job requirements directly
        - **Organic Integration**: Only enhance elements that naturally fit within the existing professional context
        - **Selective Improvement**: Skip gaps that cannot be authentically addressed within the current experience scope
        - **Subtle Optimization**: Focus on making existing content stronger without obvious artificial additions
        
        **Enhancement Techniques**:
        - **Language Enhancement**: Strengthen existing action verbs and professional terminology naturally
        - **Presentation Optimization**: Add authentic metrics or details that logically belong in the original context
        - **Structure Preservation**: Maintain exact original format and organizational framework
        
        **When NOT to Enhance**:
        - If gap requires adding new skills/technologies not present in original content
        - If recommendation would create artificial or forced language
        - If enhancement would make the content obviously modified or unnatural
        `);
    try {
      const result = await llmService.invokeWithStructuredOutput(
        prompt,
        EnhancedMatchedProfileSectionSchema,
        {
          original_profile_section: `type: ${matchedProfileSection.profile_section.type}, content: ${matchedProfileSection.profile_section.content}`,
          requirements_context,
        },
        llmConfig
      );
      return result;
    } catch (error) {
      console.error("[ERROR] enhanceMatchedProfileSection failed:", error);
      return null;
    }
  }
}

export const matchedProfileSectionEnhancerService = new MatchedProfileSectionEnhancerService();
