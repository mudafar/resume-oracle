import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llmService } from "./llmService";
import { z } from "zod";
import { LLMConfig } from "@/types/store";

// TODO: move this schema
// Schema for the new profile section result
export const NewProfileSectionSchema = z.object({
  content: z.string().describe("The complete new profile section content"),
  structure_rationale: z.string().describe("Brief explanation of the chosen structure and approach"),
  key_highlights: z.array(z.string()).describe("List of key achievements or capabilities highlighted in the section")
});

export type NewProfileSection = z.infer<typeof NewProfileSectionSchema>;

export class ProfileSectionGeneratorService {
  /**
   * Generate a new profile section from scratch based on user experience.
   * This service creates a complete new profile section using the provided experience
   * and section type, following professional standards and best practices.
   *
   * @param sectionType - The type of profile section to create (e.g., "experience", "projects", "skills")
   * @param userExperience - Detailed description of user's experience for this section
   * @param additionalContext - Optional additional context to guide the generation
   * @param llmConfig - Optional LLM config dict
   * @returns NewProfileSection containing the generated content and metadata
   */
  async generateProfileSection(
    sectionType: string,
    userExperience: string,
    additionalContext?: string,
    llmConfig?: LLMConfig
  ): Promise<NewProfileSection> {
    // Prepare optional context section for the prompt
    const additional_context_section = additionalContext 
      ? `\n**ADDITIONAL CONTEXT**: ${additionalContext}` 
      : "";

    const prompt = ChatPromptTemplate.fromTemplate(`
            You are a Senior Career Development Expert and Technical Writer with extensive experience in crafting compelling professional profiles across various industries and career levels.

            ## Mission
            Your mission is to create a professional, impactful profile section from raw experience descriptions. The section should be well-structured, engaging, and effectively showcase the user's capabilities and achievements.

            ## Input Data
            **SECTION TYPE**: {section_type}
            **USER EXPERIENCE**: {user_experience}
            {additional_context_section}

            ## Generation Strategy
            
            ### Structure Selection
            Choose the most appropriate structure based on section type:
            - **Experience/Work**: Role-based with company, duration, and achievements
            - **Projects**: Project-based with technologies, impact, and outcomes
            - **Skills**: Categorized by technology stack or skill domain
            - **Education**: Institution-based with relevant coursework or achievements
            - **Certifications**: Achievement-based with dates and issuing organizations
            
            ### Content Guidelines
            
            #### Professional Standards
            - **Clarity**: Use clear, concise language that's easy to scan
            - **Impact-Focused**: Emphasize achievements and measurable outcomes
            - **Action-Oriented**: Start bullet points with strong action verbs
            - **Specificity**: Include specific technologies, methodologies, and metrics
            - **Relevance**: Focus on information that demonstrates professional value
            
            #### Technical Excellence
            - **Industry Language**: Use appropriate technical terminology and industry standards
            - **Quantifiable Results**: Include numbers, percentages, timelines where relevant
            - **Technology Stack**: Mention specific tools, frameworks, and platforms
            - **Problem-Solution**: Frame experiences as problems solved or value delivered
            
            #### Formatting Best Practices
            - **Consistent Structure**: Maintain uniform formatting throughout
            - **Logical Flow**: Organize information in order of importance or chronology
            - **Scannable Layout**: Use bullet points, headers, and whitespace effectively
            - **Professional Tone**: Maintain a confident but humble professional voice
            
            ### Content Enhancement
            - **Fill Gaps**: Infer reasonable details that enhance credibility without fabricating
            - **Professional Polish**: Elevate language while maintaining authenticity
            - **Strategic Emphasis**: Highlight transferable skills and unique value propositions
            - **Future-Focused**: Frame experiences to show growth potential and adaptability
            
            ## Quality Standards
            The generated section should:
            1. **Read Professionally**: Sound like it was written by an experienced professional
            2. **Be Comprehensive**: Cover all important aspects of the experience
            3. **Show Growth**: Demonstrate skill development and increasing responsibility
            4. **Highlight Value**: Clearly communicate the impact and value delivered
            5. **Feel Authentic**: Sound genuine and believable within the given context
            
            Create a polished, professional profile section that effectively showcases the user's experience and capabilities while following industry best practices for the specified section type.
            `);

    try {
      const result = await llmService.invokeWithStructuredOutput(
        prompt,
        NewProfileSectionSchema,
        {
          section_type: sectionType,
          user_experience: userExperience,
          additional_context_section,
        },
        llmConfig
      );
      return result;
    } catch (error) {
      console.error("[ERROR] generateProfileSection failed:", error);
      throw error;
    }
  }
}

export const profileSectionGeneratorService = new ProfileSectionGeneratorService();
