import type { ProfileSectionWithRequirements } from "./zodModels";

/**
 * Builds a context string for resume section generation, including cluster name and priority tier.
 */
export function buildSectionsContext(profileSectionsWithRequirements: Array<{
  requirement_clusters: Array<{
    cluster_name: string;
    priority_tier: string;
    requirements: string[];
  }>;
  profile_section: {
    id: string;
    type: string;
    content: string;
  };
}>): string {
  return profileSectionsWithRequirements
    .map(({ requirement_clusters, profile_section }) => {
      const requirements_context = requirement_clusters
        .map(cluster => `Requirement Cluster: ${cluster.cluster_name} (Priority Tier: ${cluster.priority_tier})\nRequirements:\n- ${cluster.requirements.join("\n- ")}`)
        .join("\n\n");
      return `Profile Section ID: ${profile_section.id}\nProfile Section Type: ${profile_section.type}\nProfile Section Content: ${profile_section.content}\nMatched Requirements:\n${requirements_context}`;
    })
    .join("\n\n");
}