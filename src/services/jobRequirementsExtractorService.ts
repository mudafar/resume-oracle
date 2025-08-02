import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JobRequirementListSchema } from "./zodModels";
import { llmService } from "./llmService";

export class JobRequirementsExtractorService {
  /**
   * Service for extracting requirements from job descriptions
   */
  async extractJobRequirements(
    jobDescription: string,
    companyContext: string = "",
    llmConfig?: any
  ): Promise<string[]> {
    /**
     * Extract requirements from a job description
     * @param jobDescription - The job description text
     * @param companyContext - Optional context about the company
     * @param llmConfig - Optional LLM config dict
     * @returns List of extracted requirements
     */
    // Prepare optional sections for the prompt
    const company_context_section = companyContext.trim() ? `\n**COMPANY CONTEXT**: ${companyContext}` : "";
    let context_integration_section = "";
    if (companyContext.trim()) {
      context_integration_section = `\n### Company Context Integration\nUse the provided company context to:\n- Identify implied cultural and values requirements\n- Understand role context and expectations  \n- Extract company-specific criteria and preferences\n- Infer additional requirements based on company stage, size, or industry`;
    }
    const prompt = ChatPromptTemplate.fromTemplate(`
            You are a Senior Technical Architect and Career Development Expert with deep expertise in evaluating technical competencies and guiding professional growth in the technology sector.

            ## Mission
            Your mission is to help candidates understand exactly what a job requires by extracting comprehensive, actionable requirements that enable effective profile matching. You must identify ALL requirements—both explicit and implied—so candidates can assess their fit and identify areas for improvement.

            ## Input Data
            **JOB DESCRIPTION**: {job_desc}
            {company_context_section}

            ## Extraction Framework
            
            ### Comprehensive Requirement Categories
            Extract ALL requirements from these categories:
            
            **Technical Requirements**:
            - Years and types of experience (e.g., "5+ years in React development")
            - Specific technical skills and tools
            - Programming languages, frameworks, platforms
            - Software, systems, and development methodologies
            
            **Experience & Background**:
            - Industry or domain knowledge (e.g., fintech, healthcare)
            - Company size/stage experience (startup vs enterprise)
            - Project scale and complexity requirements
            - Team leadership or individual contributor expectations
            
            **Education & Certification**:
            - Degree requirements or preferences
            - Professional certifications
            - Specialized training or coursework
            
            **Soft Skills & Abilities**:
            - Communication and collaboration skills
            - Problem-solving and analytical thinking
            - Adaptability and learning agility
            - Mentorship and coaching abilities
            
            **Cultural & Values Fit**:
            - Company values alignment
            - Work style preferences (collaborative, independent, data-driven)
            - Cultural attributes and mindset requirements
            
            **Role-Specific Criteria**:
            - Leadership or team contribution expectations
            - Travel or location requirements
            - Remote work capabilities
            - Diversity and inclusion considerations
            - Any other hiring-relevant criteria
            
            {context_integration_section}
            `);
    try {
      const result = await llmService.invokeWithStructuredOutput(
        prompt,
        JobRequirementListSchema,
        {
          job_desc: jobDescription,
          company_context_section,
          context_integration_section,
        },
        llmConfig
      );
      return result.job_requirements;
    } catch (error) {
      console.error("[ERROR] extractJobRequirements failed:", error);
      return [];
    }
  }
}

export const jobRequirementsExtractorService = new JobRequirementsExtractorService();
