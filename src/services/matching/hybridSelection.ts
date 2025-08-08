import { RequirementCluster } from "@/schemas/job";
import { CoverageGap, HybridSelectionResult, ScoredPair, SelectedSection } from "@/schemas/matching";
import { SelectionConstraints } from "@/types/matching/selection.types";
import { ProfileSection } from "@/types/store";



export class HybridSelectionService {
  private readonly DEFAULT_CONSTRAINTS: SelectionConstraints = {
    critical_threshold: 50,      // Minimum score for critical clusters
    important_threshold: 40,     // Minimum score for important clusters  
    nice_to_have_threshold: 30,  // Minimum score for nice-to-have clusters
    max_sections: 6,             // Maximum profile sections to select
    force_critical_coverage: true // Must cover critical clusters if possible
  };

  /**
   * Main hybrid selection algorithm
   */
  async selectOptimalSections(
    scoredPairs: ScoredPair[],
    clusters: RequirementCluster[],
    profileSections: ProfileSection[],
    constraints?: Partial<SelectionConstraints>
  ): Promise<HybridSelectionResult> {
    const config = { ...this.DEFAULT_CONSTRAINTS, ...constraints };
    
    // Step 1: Coverage Phase - Ensure critical clusters are covered
    const coverageSelection = this.ensureCriticalCoverage(scoredPairs, clusters, config);
    
    // Step 2: Strength Phase - Optimize selection for maximum value
    const optimizedSelection = this.optimizeSelection(
      scoredPairs, 
      coverageSelection, 
      clusters, 
      config
    );
    
    // Step 3: Gap Analysis
    const gaps = this.analyzeGaps(scoredPairs, optimizedSelection, clusters, config);
    
    // Step 4: Build final result
    return this.buildSelectionResult(
      optimizedSelection, 
      gaps, 
      clusters, 
      scoredPairs,
      config
    );
  }

  /**
   * Phase 1: Ensure critical clusters are covered
   */
  private ensureCriticalCoverage(
    scoredPairs: ScoredPair[],
    clusters: RequirementCluster[],
    config: SelectionConstraints
  ): Set<string> {
    const selectedSections = new Set<string>();
    const criticalClusters = clusters.filter(c => c.priority_tier === "critical");
    
    if (!config.force_critical_coverage) {
      return selectedSections;
    }
    
    for (const cluster of criticalClusters) {
      // Find best match for this critical cluster
      const clusterMatches = scoredPairs
        .filter(pair => 
          pair.cluster_id === cluster.id &&
          pair.raw_score >= config.critical_threshold
        )
        .sort((a, b) => b.raw_score - a.raw_score);
      
      if (clusterMatches.length > 0) {
        // Select the best section for this critical cluster
        selectedSections.add(clusterMatches[0].section_id);
      }
    }
    
    return selectedSections;
  }

  /**
   * Phase 2: Optimize selection for maximum weighted value
   */
  private optimizeSelection(
    scoredPairs: ScoredPair[],
    initialSelection: Set<string>,
    clusters: RequirementCluster[],
    config: SelectionConstraints
  ): Set<string> {
    const selectedSections = new Set(initialSelection);
    
    // Group pairs by section for analysis
    const sectionGroups = this.groupPairsBySection(scoredPairs);
    
    // Calculate current coverage and scores
    let currentCoverage = this.calculateCoverage(selectedSections, scoredPairs, clusters, config);
    
    // Try to add more sections if under max limit and they provide value
    while (selectedSections.size < config.max_sections) {
      let bestCandidate: string | null = null;
      let bestValue = 0;
      
      // Evaluate each unselected section
      for (const [sectionId, pairs] of Object.entries(sectionGroups)) {
        if (selectedSections.has(sectionId)) continue;
        
        // Calculate value this section would add
        const sectionValue = this.calculateSectionValue(
          sectionId, 
          pairs, 
          selectedSections, 
          scoredPairs, 
          clusters, 
          config
        );
        
        if (sectionValue > bestValue) {
          bestValue = sectionValue;
          bestCandidate = sectionId;
        }
      }
      
      // Add best candidate if it provides significant value
      if (bestCandidate && bestValue > 50) { // Minimum value threshold
        selectedSections.add(bestCandidate);
      } else {
        break; // No more valuable sections to add
      }
    }
    
    return selectedSections;
  }

  /**
   * Calculate the value a section would add to current selection
   */
  private calculateSectionValue(
    sectionId: string,
    sectionPairs: ScoredPair[],
    currentSelection: Set<string>,
    allPairs: ScoredPair[],
    clusters: RequirementCluster[],
    config: SelectionConstraints
  ): number {
    let totalValue = 0;
    
    // Get currently covered clusters
    const coveredClusters = this.getCoveredClusters(currentSelection, allPairs, clusters, config);
    
    for (const pair of sectionPairs) {
      // Skip if below threshold
      if (!this.meetsThreshold(pair, clusters, config)) continue;
      
      // Get cluster info
      const cluster = clusters.find(c => c.id === pair.cluster_id);
      if (!cluster) continue;
      
      // Calculate value based on priority and whether cluster is already covered
      const priorityMultiplier = this.getPriorityMultiplier(cluster.priority_tier);
      let clusterValue = pair.raw_score * priorityMultiplier;
      
      // Reduce value if cluster already covered (but still give some credit for reinforcement)
      if (coveredClusters.has(cluster.cluster_name)) {
        clusterValue *= 0.3; // 30% value for reinforcing coverage
      }
      
      totalValue += clusterValue;
    }
    
    return totalValue;
  }

  /**
   * Phase 3: Analyze coverage gaps
   */
  private analyzeGaps(
    scoredPairs: ScoredPair[],
    selectedSections: Set<string>,
    clusters: RequirementCluster[],
    config: SelectionConstraints
  ): CoverageGap[] {
    const gaps: CoverageGap[] = [];
    const coveredClusters = this.getCoveredClusters(selectedSections, scoredPairs, clusters, config);

    for (const [index, cluster] of clusters.entries()) {
      if (coveredClusters.has(cluster.cluster_name)) {
        continue; // Cluster is covered
      }
      
      // Find best available match for uncovered cluster
      const clusterMatches = scoredPairs
        .filter(pair => pair.cluster_id === cluster.id)
        .sort((a, b) => b.raw_score - a.raw_score);
      
      const bestMatch = clusterMatches[0];
      const threshold = this.getThresholdForPriority(cluster.priority_tier, config);
      
      gaps.push({
        id: cluster.id, // Use cluster ID as gap ID for consistency
        requirement_cluster: cluster,
        gap_type: bestMatch ? 
          (bestMatch.raw_score >= threshold ? "covered" : "below_threshold") : 
          "no_match",
      });
    }
    
    return gaps.filter(gap => gap.gap_type !== "covered");
  }

  /**
   * Build final selection result
   */
  private buildSelectionResult(
    selectedSections: Set<string>,
    gaps: CoverageGap[],
    clusters: RequirementCluster[],
    scoredPairs: ScoredPair[],
    config: SelectionConstraints
  ): HybridSelectionResult {
    // Build selected sections with their matched clusters
    const selectedSectionsData: SelectedSection[] = [];
    
    for (const sectionId of selectedSections) {
      if(!sectionId) continue; // Skip if no section ID
      
      // Get all matches for this section that meet thresholds
      const sectionMatches = scoredPairs
        .filter(pair => 
          pair.section_id === sectionId && 
          this.meetsThreshold(pair, clusters, config)
        )
        .sort((a, b) => b.raw_score - a.raw_score);
      
      // Calculate total weighted score for this section
      const totalWeightedScore = sectionMatches.reduce((sum, match) => {
        const cluster = clusters.find(c => c.id === match.cluster_id);
        if (!cluster) return sum;
        const multiplier = this.getPriorityMultiplier(cluster.priority_tier);
        return sum + (match.raw_score * multiplier);
      }, 0);
      
      // Generate selection rationale
      const rationale = this.generateSelectionRationale(sectionMatches, clusters, totalWeightedScore);
      
      // Create section title from content (first 50 chars + "...")
      // const sectionTitle = this.generateSectionTitle(profileSection);
      
      selectedSectionsData.push({
        profile_section_id: sectionId,
        matched_scored_pairs: sectionMatches,
        total_weighted_score: totalWeightedScore,
        rationale: rationale
      });
    }
    
    // Sort selected sections by total weighted score (highest first)
    selectedSectionsData.sort((a, b) => b.total_weighted_score - a.total_weighted_score);
    
    return {
      selected_sections: selectedSectionsData,
      coverage_gaps: gaps,
    };
  }
  
  // Removed generateSectionTitle method since section_title is now populated by UI layer
  
  /**
   * Generate rationale for why this section was selected
   */
  private generateSelectionRationale(matches: ScoredPair[], clusters: RequirementCluster[], totalScore: number): string {
    if (matches.length === 0) {
      return "Selected for specialized expertise";
    }
    
    // Categorize matches by priority using cluster lookup
    const criticalMatches = matches.filter(m => {
      const cluster = clusters.find(c => c.id === m.cluster_id);
      return cluster?.priority_tier === "critical";
    });
    const importantMatches = matches.filter(m => {
      const cluster = clusters.find(c => c.id === m.cluster_id);
      return cluster?.priority_tier === "important";
    });
    const niceToHaveMatches = matches.filter(m => {
      const cluster = clusters.find(c => c.id === m.cluster_id);
      return cluster?.priority_tier === "nice_to_have";
    });
    
    const parts: string[] = [];
    
    // Critical coverage
    if (criticalMatches.length > 0) {
      if (criticalMatches.length === 1) {
        const cluster = clusters.find(c => c.id === criticalMatches[0].cluster_id);
        parts.push(`Covers critical ${cluster?.cluster_name?.toLowerCase() || 'requirement'} requirement`);
      } else {
        parts.push(`Covers ${criticalMatches.length} critical requirements`);
      }
    }
    
    // Multi-cluster coverage
    if (matches.length > 1) {
      parts.push(`spans ${matches.length} capability areas`);
    }
    
    // High-quality evidence
    const highScores = matches.filter(m => m.raw_score >= 80);
    if (highScores.length > 0) {
      parts.push("demonstrates strong expertise");
    }
    
    // Fallback
    if (parts.length === 0) {
      parts.push("provides relevant experience");
    }
    
    // Combine parts into readable sentence
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    } else if (parts.length === 2) {
      return `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} and ${parts[1]}`;
    } else {
      const lastPart = parts.pop();
      return `${parts.join(", ").charAt(0).toUpperCase() + parts.join(", ").slice(1)}, and ${lastPart}`;
    }
  }

  // Helper methods
  private groupPairsBySection(pairs: ScoredPair[]): Record<string, ScoredPair[]> {
    return pairs.reduce((grouped, pair) => {
      if (!grouped[pair.section_id]) grouped[pair.section_id] = [];
      grouped[pair.section_id].push(pair);
      return grouped;
    }, {} as Record<string, ScoredPair[]>);
  }

  private getCoveredClusters(
    selectedSections: Set<string>, 
    scoredPairs: ScoredPair[], 
    clusters: RequirementCluster[],
    config: SelectionConstraints
  ): Set<string> {
    const covered = new Set<string>();
    
    for (const pair of scoredPairs) {
      if (selectedSections.has(pair.section_id) && this.meetsThreshold(pair, clusters, config)) {
        const cluster = clusters.find(c => c.id === pair.cluster_id);
        if (cluster) {
          covered.add(cluster.cluster_name);
        }
      }
    }
    
    return covered;
  }

  private meetsThreshold(pair: ScoredPair, clusters: RequirementCluster[], config: SelectionConstraints): boolean {
    const cluster = clusters.find(c => c.id === pair.cluster_id);
    if (!cluster) return false;
    
    const threshold = this.getThresholdForPriority(cluster.priority_tier, config);
    return pair.raw_score >= threshold;
  }

  private getThresholdForPriority(priority: string, config: SelectionConstraints): number {
    switch (priority) {
      case "critical": return config.critical_threshold;
      case "important": return config.important_threshold; 
      case "nice_to_have": return config.nice_to_have_threshold;
      default: return config.nice_to_have_threshold;
    }
  }

  private getPriorityMultiplier(priority: string): number {
    switch (priority) {
      case "critical": return 3;
      case "important": return 2;
      case "nice_to_have": return 1;
      default: return 1;
    }
  }

  private calculateCoverage(
    selectedSections: Set<string>, 
    scoredPairs: ScoredPair[], 
    clusters: RequirementCluster[],
    config: SelectionConstraints
  ): number {
    const coveredClusters = this.getCoveredClusters(
      selectedSections, 
      scoredPairs, 
      clusters,
      config
    );
    return coveredClusters.size / clusters.length;
  }

  // Removed generateGapRecommendation method since recommendations field is commented out in schema
}

export const hybridSelectionService = new HybridSelectionService();