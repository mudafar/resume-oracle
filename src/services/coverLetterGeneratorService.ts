import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llmService } from "./llmService";
import {
  GeneratedCoverLetterResultSchema,
  ProfileSectionWithRequirements,
  GeneratedCoverLetterResult
} from "./zodModels";
import { buildSectionsContext } from "./utils";

export class CoverLetterGeneratorService {
  /**
   * Service for generating interview-landing cover letters that organically integrate profile sections with job requirements
   */
  async generateCoverLetter(
    profileSectionsWithRequirements: ProfileSectionWithRequirements[],
    companyContext: string = "",
    toneGuidance: string = "",
    llmConfig?: any
  ): Promise<GeneratedCoverLetterResult> {
    /**
     * Generate a strategically optimized cover letter designed to secure interview invitations
     * @param profileSectionsWithRequirements - List of profile sections with their already-matched requirements
     * @param companyContext - Optional brief description of company values and culture
     * @param toneGuidance - Job description snippet to set appropriate tone and wording
     * @param llmConfig - Optional LLM config dict
     * @returns GeneratedCoverLetterResult object containing interview optimization summary and cover letter markdown
     */
    const prompt = ChatPromptTemplate.fromTemplate(`
            You are a Senior Career Strategist and Interview Landing Specialist with expertise in creating compelling cover letters that secure interview invitations.

            ## Mission
            Your mission is to craft a strategically optimized cover letter that transforms profile sections and prioritized clustered job requirements into a compelling narrative that positions the candidate as the ideal fit worthy of an interview invitation. You must:
            - Create a compelling professional story that connects candidate background to role requirements
            - Demonstrate clear value proposition and cultural alignment through existing experience only
            - Mirror the company's communication style and job description tone
            - Address matched requirements organically through natural experience narratives
            - Priorize requirements based on their cluster priority tier
            - Generate genuine enthusiasm that motivates hiring managers to schedule interviews

            ## Input Data
            **PROFILE SECTIONS WITH MATCHED REQUIREMENTS**: Each section contains professional experience/skills and the specific job requirements it already matches through demonstrated evidence.

            {sections_with_requirements}

            **COMPANY CONTEXT**: {company_context}

            **TONE GUIDANCE**: {tone_guidance}

            ## Interview-Landing Framework

            ### Strategic Narrative Construction
            **PRIORITY 1: Value Proposition Development**
            - Identify the top 3-5 strengths that directly address role's core needs from existing profile content
            - Craft opening hook that immediately connects candidate to specific role/company
            - Build compelling case for why this candidate solves their specific challenges
            - Position unique qualifications that differentiate from other applicants using only existing achievements

            **PRIORITY 2: Organic Requirement Integration Strategy**
            - Address matched requirements naturally through existing experience narratives from profile sections
            - Use specific examples and quantifiable achievements already present in profile content
            - Connect requirements to demonstrated business impact without adding new claims
            - Never force requirements that don't naturally fit within existing experience context
            - Highlight requirements based on their priority tier, ensuring the most critical ones are emphasized
            - Only highlight requirements that have genuine, substantial evidence in the profile sections

            **PRIORITY 3: Cultural and Tonal Alignment**
            - Mirror language style and terminology from job description
            - Integrate company values and culture when provided, connecting to existing experience
            - Match communication formality level (technical vs. general, formal vs. conversational)
            - Show genuine understanding of company mission through relevant existing experience

            ### Interview Motivation Tactics
            - Create curiosity about candidate's specific documented experiences and achievements
            - Address potential concerns proactively using existing strengths and experience
            - Demonstrate clear enthusiasm for this specific role based on genuine experience alignment
            - Include compelling "conversation starters" from real achievements that invite follow-up questions
            - End with confident, professional call-to-action for next steps

            ### Authenticity and Organic Integration Standards
            - **Evidence-Based**: Every claim supported by specific examples from existing profile sections
            - **No Fabrication**: Do not add skills, experiences, or achievements not present in profile sections
            - **Natural Flow**: Requirements integrated seamlessly into experience narratives, never forced
            - **Genuine Alignment**: Only highlight requirements with substantial evidence in existing content
            - **Professional Authenticity**: Personal yet professional tone reflecting genuine qualifications

            Generate a strategically crafted cover letter that maximizes the candidate's interview potential while maintaining complete authenticity to their documented experience.
    `);

    // Build comprehensive context with all sections and their requirements (match Python formatting)
    const sectionsContext = buildSectionsContext(profileSectionsWithRequirements)

    const companyContextText = companyContext || "No specific company context provided";
    const toneGuidanceText = toneGuidance || "Standard professional tone";

    try {
      const result = await llmService.invokeWithStructuredOutput(
        prompt,
        GeneratedCoverLetterResultSchema,
        {
          sections_with_requirements: sectionsContext,
          company_context: companyContextText,
          tone_guidance: toneGuidanceText,
        },
        llmConfig
      );
      return result;
    } catch (error) {
      console.error("[ERROR] generateCoverLetter failed:", error);
      // Fallback: return a basic cover letter using only existing profile content
      const fallbackSummary =
        "Unable to generate interview optimization analysis due to processing error. Fallback cover letter created using existing profile content only.";
      const fallbackContent = this._generateFallbackCoverLetter(profileSectionsWithRequirements, companyContext, toneGuidance);
      return {
        optimization_summary: fallbackSummary,
        cover_letter_markdown: fallbackContent,
      };
    }
  }

  private _generateFallbackCoverLetter(
    profileSectionsWithRequirements: ProfileSectionWithRequirements[],
    companyContext?: string,
    toneGuidance?: string
  ): string {
    // Extract key information from profile sections
    const experienceSections = profileSectionsWithRequirements.filter(s =>
      ["experience", "work", "employment"].includes(s.profile_section.type.toLowerCase())
    );
    const skillsSections = profileSectionsWithRequirements.filter(s =>
      ["skills", "technical", "competencies"].includes(s.profile_section.type.toLowerCase())
    );
    let fallbackLetter = `# Cover Letter\n\nDear Hiring Manager,\n\nI am writing to express my strong interest in this position. Based on my background and experience, I believe I would be a valuable addition to your team.\n\n`;
    if (experienceSections.length) {
      fallbackLetter += "My professional experience includes:\n\n";
      for (const section of experienceSections.slice(0, 2)) {
        const contentPreview = section.profile_section.content.length > 200
          ? section.profile_section.content.slice(0, 200) + "..."
          : section.profile_section.content;
        fallbackLetter += `- ${contentPreview}\n`;
      }
      fallbackLetter += "\n";
    }
    if (skillsSections.length) {
      fallbackLetter += "My key competencies align well with your requirements:\n\n";
      for (const section of skillsSections.slice(0, 1)) {
        const contentPreview = section.profile_section.content.length > 150
          ? section.profile_section.content.slice(0, 150) + "..."
          : section.profile_section.content;
        fallbackLetter += `- ${contentPreview}\n`;
      }
      fallbackLetter += "\n";
    }
    if (companyContext) {
      fallbackLetter += `I am particularly drawn to your organization because ${companyContext.toLowerCase()}\n\n`;
    }
    fallbackLetter +=
      "I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team's success. Thank you for your consideration.\n\nSincerely,\n[Your Name]";
    return fallbackLetter;
  }
}

export const coverLetterGeneratorService = new CoverLetterGeneratorService();
