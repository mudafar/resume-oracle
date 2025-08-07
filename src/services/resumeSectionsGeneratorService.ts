import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llmService } from "./llmService";
import {
  ProfileSectionWithRequirements,
  GeneratedResumeSectionResultListSchema,
  GeneratedResumeSectionResult,
} from "./zodModels";
import { buildSectionsContext } from "./utils";

export class ResumeSectionsGeneratorService {
  /**
   * Service for summarizing profile sections into resume-formatted sections that highlight matched requirements
   */
  async generateResumeSection(
    profileSectionsWithRequirements: ProfileSectionWithRequirements[],
    llmConfig?: any
  ): Promise<GeneratedResumeSectionResult[]> {
    // Build context string for prompt
    const sections_context = buildSectionsContext(profileSectionsWithRequirements)
    const prompt = ChatPromptTemplate.fromTemplate(`
            You are a Senior Resume Editor and Content Strategist specializing in transforming detailed professional profiles into concise, impactful resume sections.

            ## Mission
            Your mission is to create resume-optimized summaries of profile sections that preserve all evidence of matched requirements while condensing content to fit standard resume formatting and space constraints. You must:
            - Summarize profile sections without adding new information
            - Highlight matched requirements through existing content
            - Prioritize requirements based on their cluster priority tier
            - Apply appropriate resume formatting for each section type
            - Maintain authenticity and evidence-based claims

            ## Input Data
            **PROFILE SECTIONS WITH MATCHED REQUIREMENTS**: Each section contains original detailed content and a list of prioritized clustered job requirements that this section already matches through existing evidence.

            {sections_with_requirements}

            ## Summarization Framework

            ### Content Extraction Strategy
            **PRIORITY 1: Requirement Evidence Preservation**
            - Identify specific phrases, achievements, and technologies that demonstrate each matched requirement
            - Ensure these key elements remain prominent and visible in the summary
            - Maintain quantifiable results, metrics, and specific technologies mentioned
            - Preserve action verbs and accomplishment indicators that support requirement matches

            **PRIORITY 2: Content Condensation**
            - Remove redundant details that don't directly support requirement matches
            - Consolidate similar achievements into impactful, concise statements
            - Focus on most relevant, recent, and impressive examples
            - Eliminate verbose descriptions while preserving core evidence

            **PRIORITY 3: Resume Optimization**
            - Apply section-appropriate formatting as specified in the model descriptions
            - Use strong action verbs and professional resume language
            - Optimize for ATS scanning with standard terminology and clean formatting
            - Ensure content fits within typical resume space constraints (2-page limit)

            ### Quality Standards
            - **Authenticity**: Only use information present in the original profile section
            - **Evidence-Based**: Every claim must be supported by original content
            - **Requirement Coverage**: All matched requirements must remain demonstrable in the summary
            - **Professional Format**: Follow standard resume conventions for maximum readability and impact
            - **Conciseness**: Summary should be significantly shorter than original while preserving key evidence

            Generate concise, professionally formatted resume sections that effectively communicate the candidate's qualifications for the matched requirements without adding any new information.
    `);
    try {
      const result = await llmService.invokeWithStructuredOutput(
        prompt,
        GeneratedResumeSectionResultListSchema,
        {
          sections_with_requirements: sections_context,
        },
        llmConfig
      );
      return result.generated_resume_section_result_list;
    } catch (error) {
      console.error("[ERROR] generateResumeSection failed:", error);
      // Fallback: return original sections as resume sections
      return profileSectionsWithRequirements.map(pswr => ({
        profile_section_id: pswr.profile_section.id,
        type: pswr.profile_section.type,
        content: pswr.profile_section.content,
      }));
    }
  }
}

export const resumeSectionsGeneratorService = new ResumeSectionsGeneratorService();
