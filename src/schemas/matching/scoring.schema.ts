import { z } from "zod";
import { RequirementClusterSchema } from "@/schemas/job/requirementCluster.schema";

export const ScoredPairSchema = z.object({
  section_id: z.string().describe("ID of the profile section"),
  cluster_id: z.string().describe("ID of the requirement cluster"),
  cluster_name: z.string().describe("Name of the requirement cluster"),
  priority_tier: z
    .enum(["critical", "important", "nice_to_have"]) 
    .describe("Priority level of the cluster"),
  raw_score: z.number().min(0).max(100).describe("Raw matching score 0-100"),
  coverage: z.array(z.string()).describe("Specific requirements from cluster that this section covers"),
  missing: z.array(z.string()).describe("Requirements from cluster that this section does NOT cover"),
  strength_indicators: z.array(z.string()).describe("Specific evidence that makes this a strong match"),
  evidence: z.string().describe("Key evidence supporting the score"),
  enhancement_suggestions: z.array(z.string()).describe("How to improve this match"),
});

export const LLMScoringResultSchema = z.object({
  scored_pairs: z.array(ScoredPairSchema),
  selection_reasoning: z
    .string()
    .describe("Why these specific pairs were chosen for scoring"),
  estimated_coverage: z
    .string()
    .describe("Overall assessment of profile vs requirements"),
});

export const SelectedSectionSchema = z.object({
  profile_section_id: z.string(),
  matched_scored_pairs: z.array(ScoredPairSchema),
  total_weighted_score: z.number(),
  rationale: z.string(),
});

export const CoverageGapSchema = z.object({
  id: z.string(),
  requirement_cluster: RequirementClusterSchema,
  gap_type: z.enum(["no_match", "below_threshold", "covered"]),
});

export const HybridSelectionResultSchema = z.object({
  selected_sections: z.array(SelectedSectionSchema),
  coverage_gaps: z.array(CoverageGapSchema),
});

export type ScoredPair = z.infer<typeof ScoredPairSchema>;
export type LLMScoringResult = z.infer<typeof LLMScoringResultSchema>;
export type SelectedSection = z.infer<typeof SelectedSectionSchema>;
export type CoverageGap = z.infer<typeof CoverageGapSchema>;
export type HybridSelectionResult = z.infer<
  typeof HybridSelectionResultSchema
>;
