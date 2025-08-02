import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llmService } from "./llmService";
import {
  ResumeOutputSchema,
  ResumeOutput,
  ResumeSection,
} from "./zodModels";

export class ResumeGeneratorService {
  constructor() {
    this._buildSectionsContent = this._buildSectionsContent.bind(this);
    this.buildResume = this.buildResume.bind(this);
  }
  /**
   * Service for organizing pre-formatted resume sections into a structured resume document using LLM
   */
  async buildResume(
    resumeSections: ResumeSection[],
    llmConfig?: any
  ): Promise<ResumeOutput> {
    const prompt = ChatPromptTemplate.fromTemplate(`
      You are a Senior Resume Architect and Document Organizer specializing in structuring pre-formatted resume sections into cohesive, professionally organized resumes.
      
      ## Mission
      Your mission is to organize and structure already-formatted resume sections into a complete resume document. You must:
      - Group sections by type (combine multiple experience sections, multiple skills sections, etc.)
      - Apply standard resume ordering (Summary → Experience → Skills → Education → Projects → Certifications, etc.)
      - Add appropriate section headers in markdown format
      - Preserve all content exactly as provided - NO content editing or modification
      - Create logical document flow and professional structure
      
      ## Input Data
      **PRE-FORMATTED RESUME SECTIONS**: Each section is already optimized, formatted, and contains preserved requirement matches from previous processing steps.
      
      {sections_content}
      
      ## Organization Framework
      
      ### Section Consolidation Rules
      **CRITICAL: PRESERVE ALL CONTENT EXACTLY**
      - Combine sections of the same type by concatenating content
      - Maintain original formatting, bullet points, and structure
      - Preserve company names, dates, and all specific details exactly as provided
      - Do not modify, edit, or rephrase any content
      
      ### Standard Resume Structure
      **SECTION ORDERING (when sections are present):**
      1. Summary/Profile (if available)
      2. Experience (most important, always include if present)
      3. Skills (technical and soft skills)
      4. Education 
      5. Projects
      6. Certifications
      7. Achievements/Awards
      8. Volunteering
      9. Languages
      
      ### Header Application
      - Add markdown headers: ## Summary, ## Experience, ## Skills, etc.
      - Use exact section names that match content type
      - Maintain clean, professional markdown formatting
      
      ### Quality Standards
      - **Content Preservation**: Zero modification of section content
      - **Logical Organization**: Professional resume flow and structure
      - **Header Consistency**: Standard markdown formatting throughout
      - **Section Completeness**: Include all provided sections in appropriate locations
      
      Organize the sections into a complete, professionally structured resume document.
    `);

    const sections_content = this._buildSectionsContent(resumeSections);

    try {
      const result = await llmService.invokeWithStructuredOutput(
        prompt,
        ResumeOutputSchema,
        { sections_content },
        llmConfig
      );
      return result;
    } catch (e) {
      // Fallback: return a minimal ResumeOutput with error message
      console.error("[ERROR] buildResume failed:", e);
      return {
        resume: [],
        optimization_summary: `Error occurred during resume organization - no structural changes applied`
      };
    }
  };

  private _buildSectionsContent(resumeSections: ResumeSection[]): string {
    return resumeSections
      .map(
        (section) =>
          `Section Type: ${section.type}\nPre-Formatted Content: ${section.content}\n--- END SECTION ---\n`
      )
      .join("\n");
  }
}

export const resumeGeneratorService = new ResumeGeneratorService();
