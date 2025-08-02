import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llmService } from "./llmService";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { JobRequirementMatch, JobRequirementMatchList, JobRequirementMatchListSchema } from "./zodModels";

export class JobRequirementsMatchingService {
  /**
   * Service for matching job requirements to experiences using LLM
   */
  async matchJobRequirementsToProfileSections(
    jobRequirements: string[],
    profileSections: ProfileSection[],
    companyContext: string = "",
    llmConfig?: any
  ): Promise<JobRequirementMatch[]> {
    /**
     * Match job requirements to profile sections
     * @param jobRequirements - List of job requirements
     * @param profileSections - List of profile sections
     * @param companyContext - Optional company context
     * @param llmConfig - Optional LLM config
     * @returns List of JobRequirementMatch
     */
    const requirements_list = jobRequirements.map(r => `- ${r}`).join("\n");
    const profile_sections_list = profileSections.map(e => `- id: ${e.id}, text: ${e.type} ${e.content}`).join("\n");
    const company_context_section = companyContext.trim() ? `**COMPANY CONTEXT**: ${companyContext}` : "";
    const context_alignment_section = "";
    const prompt = ChatPromptTemplate.fromTemplate(`
            You are a Senior Technical Architect and Career Development Expert with deep expertise in evaluating technical competencies and guiding professional growth in the technology sector.

            ## Mission
            Your mission is to conduct precise, evidence-based matching between job requirements and candidate profile sections, providing actionable insights for career advancement. You must:
            - Accurately assess technical skill alignment with surgical precision
            - Identify genuine competency gaps vs. enhancement opportunities  
            - Provide strategic recommendations for profile strengthening
            - Maintain the highest standards of evaluation integrity
    
            ## Input Data
            **JOB REQUIREMENTS**: Specific technical and professional requirements for a target role
            **PROFILE SECTIONS**: Candidate's professional experiences, projects, and achievements, each with a unique identifier
            ${company_context_section}
    
            ## Assessment Framework
            
            ### Matching Approach
            For each requirement, determine if there is a profile section that demonstrates relevant experience:
            
            **MATCH FOUND**:
            - Profile section shows clear evidence of the required skill/experience
            - May not be perfect but demonstrates capability
            - Confidence score reflects strength of evidence (50-100%)
            - Provide gap_description for areas that could be stronger
            - Provide actionable recommendation for improvement
            
            **NO MATCH**:
            - No profile section demonstrates the required skill/experience  
            - Leave profile_section_id empty ("")
            - Confidence score 0-49%
            - Provide gap_description explaining what's missing
            - Provide recommendation for how to develop this capability
            
            ### Confidence Scoring Guidelines
            - **90-100%**: Strong, recent, direct experience with clear evidence
            - **70-89%**: Good experience with some gaps or older timeline
            - **50-69%**: Basic experience or transferable skills, needs strengthening
            - **0-49%**: Insufficient evidence, no match found
            
            ### Evidence Evaluation
            Look for:
            - **Specific technologies/skills mentioned** in profile sections
            - **Depth indicators**: "led", "built", "architected", "implemented" vs "worked with", "used"
            - **Recent experience**: within 2-5 years is preferred
            - **Context relevance**: similar company size, industry, or project scope
            
            ${context_alignment_section}
            
            REQUIREMENTS:
            ${requirements_list}
    
            PROFILE SECTIONS:
            ${profile_sections_list}
    
            Analyze each requirement against the profile sections and return matches with confidence scores, gap analysis, and recommendations.
    `);
    try {
      const result = await llmService.invokeWithStructuredOutput(
        prompt,
        JobRequirementMatchListSchema,
        {},
        llmConfig
      );
      return result.job_requirement_matches;
    } catch (error) {
      console.error("[ERROR] matchJobRequirementsToProfileSections failed:", error);
      return [];
    }
  }
}

export const jobRequirementsMatchingService = new JobRequirementsMatchingService();
