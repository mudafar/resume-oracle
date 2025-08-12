import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ProfileSection } from "@/schemas/profile";
import { llmService } from "./llmService";
import { LLMConfig } from "@/types/store";
import { z } from "zod";

// Schema for the enhanced profile section result
export const EnhancedProfileSectionSchema = z.object({
  enhanced_content: z.string().describe("The enhanced profile section content with new experience integrated"),
  integration_summary: z.string().describe("A brief summary of how the new experience was integrated"),
  key_additions: z.array(z.string()).describe("List of key additions or improvements made to the original section")
});

export type EnhancedProfileSection = z.infer<typeof EnhancedProfileSectionSchema>;

export class ProfileSectionEnhancerService {
  /**
   * Enhance an existing profile section by integrating new experience.
   * This service integrates brief experience descriptions into existing profile sections
   * while maintaining the original structure and authenticity.
   *
   * @param profileSection - The existing profile section to enhance
   * @param briefExperience - Brief description of new experience to integrate
   * @param additionalContext - Optional additional context to guide the enhancement
   * @param llmConfig - Optional LLM config dict
   * @returns EnhancedProfileSection containing the enhanced content and summary of changes
   */
  async enhanceProfileSection(
    profileSection: ProfileSection,
    briefExperience: string,
    additionalContext?: string,
    llmConfig?: LLMConfig
  ): Promise<EnhancedProfileSection> {
    // Prepare optional context section for the prompt
    const additional_context_section = additionalContext 
      ? `\n**ADDITIONAL CONTEXT**: ${additionalContext}` 
      : "";

    const prompt = ChatPromptTemplate.fromTemplate(`
            You are a Senior Career Development Expert and Technical Writer with extensive experience in crafting compelling professional profiles that showcase technical competencies and career progression.

            ## Mission
            Your mission is to seamlessly integrate new experience into an existing profile section while maintaining authenticity, structure, and professional credibility. The enhanced section should feel natural and cohesive, as if the new experience was always part of the original narrative.

            ## Input Data
            **EXISTING PROFILE SECTION**:
            Type: {section_type}
            Current Content: {section_content}

            **NEW EXPERIENCE TO INTEGRATE**: {brief_experience}
            {additional_context_section}

            ## Enhancement Strategy
            
            ### Integration Approach
            1. **Structural Preservation**: Maintain the exact format, style, and organization of the original section
            2. **Natural Flow**: Integrate new experience in a way that feels organic and chronologically appropriate
            3. **Consistency**: Match the writing style, tone, and level of detail of the existing content
            4. **Authenticity**: Ensure additions feel realistic within the context of the role and company
            
            ### Content Guidelines
            - **Seamless Integration**: Weave new experience into existing content without disrupting flow
            - **Appropriate Placement**: Insert new experience in the most logical location within the section
            - **Detail Consistency**: Match the level of specificity and depth of the original content
            - **Professional Language**: Use terminology and phrasing consistent with the existing section
            - **Measurable Impact**: Where appropriate, include specific outcomes or achievements
            
            ### Structure Preservation Requirements
            - **CRITICAL**: Maintain the exact original structure and framework
            - Preserve all formatting: bullet points, paragraphs, numbering, etc.
            - Keep role titles, company names, dates, and hierarchy exactly as presented
            - Maintain section organization and information flow
            - Match writing style, tone, and vocabulary level
            
            ### Enhancement Quality Standards
            - **Believable**: New experience should fit naturally within the role and timeframe
            - **Relevant**: Added content should strengthen the overall impact of the section
            - **Specific**: Include concrete details, technologies, or methodologies where appropriate
            - **Cohesive**: Enhanced section should read as a unified narrative
            
            ## Output Requirements
            Create an enhanced profile section that:
            1. Integrates the new experience seamlessly into the existing content
            2. Maintains perfect structural and stylistic consistency
            3. Feels authentic and credible within the professional context
            4. Strengthens the overall impact and relevance of the section
            
            The result should be indistinguishable from content that was originally written as a single, cohesive piece.
            `);

    const result = await llmService.invokeWithStructuredOutput(
      prompt,
      EnhancedProfileSectionSchema,
      {
        section_type: profileSection.type,
        section_content: profileSection.content,
        brief_experience: briefExperience,
        additional_context_section,
      },
      llmConfig
    );
    return result;
  }
}

export const profileSectionEnhancerService = new ProfileSectionEnhancerService();
