import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llmService } from "./llmService";
import { ProfileSection } from "@/store/slices/profileSectionsSlice";
import { HybridSelectionResult, LLMScoringResult, LLMScoringResultSchema, RequirementCluster } from "./zodModels";
import { hybridSelectionService } from "./matching/hybridSelection";


export class JobRequirementsMatchingService {

  /**
   * Find optimal profile section matches with emphasis on reuse and quality
   */
  constructor() {
    this.findOptimalMatches = this.findOptimalMatches.bind(this);
  }

  async findOptimalMatches(
    requirementClusters: RequirementCluster[],
    profileSections: ProfileSection[],
    companyContext: string = "",
    llmConfig?: any
  ): Promise<HybridSelectionResult> {

    const clusters_formatted = this.formatClustersForMatching(requirementClusters);
    const profile_sections_formatted = this.formatProfileSections(profileSections);
    const company_context_section = companyContext.trim() ? `\n**COMPANY CONTEXT**: ${companyContext}\nUse this context to understand cultural fit and align technical choices.` : "";

    const prompt = ChatPromptTemplate.fromTemplate(`
    You are a Senior Technical Recruiter focused on accurate technical skill assessment.

    ## Mission: Score Section-Cluster Alignment

    Evaluate which profile sections show potential for matching requirement clusters, then provide precise scoring.

    ## Smart Selection Instructions

    **Choose Pairs to Score** (30-60 total):
    - **Direct Technical Matches**: Clear technology/skill overlap
    - **Strong Transferable Experience**: Adjacent or related capabilities  
    - **Multi-Cluster Potential**: Sections that could satisfy multiple requirement clusters
    - **Leadership/Impact Sections**: Experience sections with measurable outcomes

    **Skip Obviously Poor Matches**:
    - Completely different domains (sales experience → backend engineering)
    - Outdated irrelevant experience (COBOL → modern web development)
    - Theoretical knowledge without application

    ## Scoring Criteria (0-100 Raw Score)

    **90-100 (Exceptional Evidence)**:
    - **Complete alignment**: Covers 80%+ of specific requirements mentioned
    - **Advanced indicators**: "Led", "architected", "built from scratch", "optimized"
    - **Quantified impact**: Specific metrics, scale, performance improvements
    - **Recent experience**: Within 2-3 years with substantial depth
    - **Technology specificity**: Exact tools/frameworks mentioned

    **70-89 (Strong Evidence)**:
    - **Good alignment**: Covers 60-80% of requirements
    - **Practical application**: Clear hands-on experience with examples
    - **Some quantification**: Basic metrics or concrete deliverables
    - **Relevant timeline**: Recent enough to be current (within 3-5 years)
    - **Direct experience**: Not just exposure, but actual implementation

    **50-69 (Moderate Evidence)**:
    - **Partial alignment**: Covers 40-60% of requirements
    - **Basic experience**: Evidence of usage but limited depth
    - **Transferable skills**: Related experience that could apply
    - **Learning indicators**: Recent courses, side projects, or training
    - **Foundation present**: Building blocks for full capability

    **30-49 (Weak Evidence)**:
    - **Minimal alignment**: Covers 20-40% of requirements
    - **Surface knowledge**: Mentions but no implementation details
    - **Outdated experience**: Old but potentially relevant
    - **Theoretical understanding**: Concepts without application

    **0-29 (No Useful Evidence)**:
    - **No alignment**: Different domain or irrelevant experience
    - **No evidence**: No mention of related technologies or concepts

    ## Input Data

    **REQUIREMENT CLUSTERS**:
    {clusters_formatted}

    **PROFILE SECTIONS**:
    {profile_sections_formatted}

    ## Output Instructions

    1. **Scan all sections** against all clusters for potential matches
    2. **Select 30-60 promising pairs** to score (use your judgment)
    3. **Score each selected pair** with detailed evidence analysis
    4. **Provide clear reasoning** for score and coverage assessment

    Focus on technical accuracy - the TypeScript code will handle optimization and selection logic.

    Return only pairs you're confident about scoring accurately.
    `);

    try {
      const llmResult = await llmService.invokeWithStructuredOutput(
        prompt,
        LLMScoringResultSchema,
        {
          clusters_formatted,
          profile_sections_formatted,
          company_context_section
        },
        llmConfig
      );


      // 2. TS: Apply hybrid selection algorithm (existing code)
      const optimalSelection = await hybridSelectionService.selectOptimalSections(
        llmResult.scored_pairs,
        requirementClusters,
        profileSections,
        { max_sections: 8, critical_threshold: 50 }
      );

      return optimalSelection;

    } catch (error) {
      console.error("[ERROR] Optimized matching failed:", error);
      return this.getEmptyResult();
    }
  }

  /**
   * Format requirement clusters for matching prompt
   */
  private formatClustersForMatching(clusters: RequirementCluster[]): string {
    return clusters.map(cluster =>
      `**${cluster.cluster_name.toUpperCase()}** (Priority: ${cluster.priority_tier.toUpperCase()})
        Type: ${cluster.cluster_type}
        Requirements: ${cluster.requirements.map(req => `\n  • ${req}`).join('')}
        Rationale: ${cluster.rationale}
      ---`
    ).join('\n\n');
  }

  /**
   * Format profile sections for matching prompt
   */
  private formatProfileSections(sections: ProfileSection[]): string {
    return sections.map(section =>
      `**SECTION ID: ${section.id}**
      Type: ${section.type}
      Content: "${section.content}"
      ---`
    ).join('\n\n');
  }


  /**
   * Get empty result for error cases
   */
  private getEmptyResult(): HybridSelectionResult {
    return {
      selected_sections: [],
      coverage_gaps: [],
      summary: {
        critical_clusters_covered: 0,
        critical_clusters_total: 0,
        important_clusters_covered: 0,
        important_clusters_total: 0,
        overall_coverage: "0%",
        profile_sections_used: 0,
        critical_gaps: 0
      }
    };
  }

}

export const jobRequirementsMatchingService = new JobRequirementsMatchingService();