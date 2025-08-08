import { z } from "zod";

export const RequirementClusterSchema = z.object({
  id: z.string().describe("Unique identifier for the requirement cluster, e.g., 'cluster-1', 'cluster-2', etc."),
  cluster_name: z.string().describe("Descriptive name for this requirement cluster"),
  priority_tier: z.enum(["critical", "important", "nice_to_have"]).describe("Priority level: critical (must-have), important (preferred), nice_to_have (bonus)"),
  requirements: z.array(z.string()).describe("List of related requirements in this cluster"),
  cluster_type: z.enum(["technical", "experience", "education", "soft_skills", "cultural", "role_specific"]).describe("Type of requirements in this cluster"),
  rationale: z.string().describe("Brief explanation of why these requirements are clustered together and their priority level"),
});

export const JobRequirementClustersSchema = z.object({
  requirement_clusters: z.array(RequirementClusterSchema).describe("Grouped and prioritized job requirements"),
});

export type RequirementCluster = z.infer<typeof RequirementClusterSchema>;
