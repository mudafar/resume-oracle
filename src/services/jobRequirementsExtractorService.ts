import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JobRequirementClustersSchema, JobRequirementListSchema, RequirementCluster } from "./zodModels";
import { llmService } from "./llmService";

export class JobRequirementsExtractorService {
  /**
   * Service for extracting requirements from job descriptions
   */
  async extractJobRequirements(
    jobDescription: string,
    companyContext: string = "",
    llmConfig?: any
  ): Promise<RequirementCluster[]> {
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
      Extract, prioritize, and cluster job requirements to enable strategic profile matching. Group related requirements together and assign appropriate priority levels based on their importance to the role.

      ## Input Data
      **JOB DESCRIPTION**: {job_desc}
      {company_context_section}

      ## Extraction & Clustering Framework

      ### Priority Levels
      **CRITICAL (must-have)**: Deal-breaker requirements
      - Explicitly stated as "required", "must have", "essential"
      - Core technical skills mentioned in job title or primary responsibilities
      - Minimum experience levels, critical certifications
      - Non-negotiable qualifications

      **IMPORTANT (preferred)**: Strong preference requirements  
      - Listed in "preferred qualifications" or "nice to have"
      - Skills mentioned multiple times throughout the description
      - Industry-standard expectations for the role level
      - Differentiating capabilities

      **NICE_TO_HAVE (bonus)**: Additional value requirements
      - Mentioned once or briefly
      - "Bonus", "plus", or tertiary skills
      - Future growth areas or stretch capabilities

      ### Clustering Strategy
      Group related requirements that:
      - Belong to the same technical domain (e.g., frontend: React + JavaScript + CSS)
      - Support the same job function (e.g., data analysis: SQL + Python + visualization)
      - Represent the same competency area (e.g., leadership: team management + mentoring + communication)

      ### Requirement Categories
      Extract from ALL these areas:

      **Technical Requirements**:
      - Programming languages, frameworks, tools
      - Years of experience with specific technologies
      - Development methodologies, architectures
      - Platform and infrastructure knowledge

      **Experience & Background**:
      - Industry/domain expertise requirements
      - Company size/stage experience preferences  
      - Project complexity and scale expectations
      - Leadership vs IC role requirements

      **Education & Certification**:
      - Degree requirements and preferences
      - Professional certifications
      - Specialized training or coursework

      **Soft Skills & Abilities**:
      - Communication and collaboration
      - Problem-solving and analytical thinking
      - Learning agility and adaptability
      - Mentorship and coaching capabilities

      **Cultural & Values Fit**:
      - Company values alignment
      - Work style preferences  
      - Cultural mindset requirements
      - Team dynamics expectations

      **Role-Specific Criteria**:
      - Location, travel, remote work requirements
      - Specific role responsibilities and expectations
      - Any other hiring-relevant criteria

      {context_integration_section}

      ## Output Instructions
      1. **Group related requirements** into logical clusters (3-7 requirements per cluster typically)
      2. **Assign priority tier** based on language cues and job context
      3. **Classify cluster type** to guide matching strategy
      4. **Provide rationale** explaining the clustering and priority decisions

      Focus on creating clusters that would benefit from being matched to the same profile evidence source.

            `);
    try {
      const result = await llmService.invokeWithStructuredOutput(
        prompt,
        JobRequirementClustersSchema,
        {
          job_desc: jobDescription,
          company_context_section,
          context_integration_section,
        },
        llmConfig
      );
      return result.requirement_clusters;
    } catch (error) {
      console.error("[ERROR] extractJobRequirements failed:", error);
      return [];
    }
  }
}

export const jobRequirementsExtractorService = new JobRequirementsExtractorService();
