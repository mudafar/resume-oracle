/**
 * Mock responses for Gemini API testing
 * These responses simulate the structured output from LangChain + Gemini
 * for the JobRequirementsMatching component phases (extraction and matching only)
 */

export const mockGeminiResponses = {
  // Phase 1: Job Requirements Extraction
  extraction: {
    candidates: [{
      content: {
        parts: [{
          text: JSON.stringify({
            requirement_clusters: [
              {
                id: "cluster-1",
                cluster_name: "Frontend Development",
                priority_tier: "critical",
                requirements: ["React", "TypeScript", "Next.js"],
                cluster_type: "technical",
                rationale: "Core technologies explicitly mentioned in job description"
              },
              {
                id: "cluster-2",
                cluster_name: "Backend Development",
                priority_tier: "critical",
                requirements: ["Node.js", "API design", "Database"],
                cluster_type: "technical",
                rationale: "Full-stack requirements stated"
              },
              {
                id: "cluster-3",
                cluster_name: "Leadership & Communication",
                priority_tier: "important",
                requirements: ["Team leadership", "Mentoring", "Code reviews"],
                cluster_type: "soft_skills",
                rationale: "Senior role expectations and responsibilities"
              },
              {
                id: "cluster-4",
                cluster_name: "DevOps & Deployment",
                priority_tier: "important",
                requirements: ["Docker", "CI/CD", "Performance optimization"],
                cluster_type: "technical",
                rationale: "Modern development practices mentioned"
              }
            ]
          })
        }]
      }
    }]
  },

  // Phase 2: Profile Matching
  matching: {
    candidates: [{
      content: {
        parts: [{
          text: JSON.stringify({
            scored_pairs: [
              {
                section_id: "experience",
                cluster_id: "cluster-1",
                cluster_name: "Frontend Development",
                priority_tier: "critical",
                raw_score: 95,
                coverage: ["React", "TypeScript"],
                missing: ["Next.js"],
                strength_indicators: ["Strong React experience", "TypeScript expertise"],
                evidence: "Experience section shows 5+ years of React development and extensive TypeScript usage",
                enhancement_suggestions: ["Add Next.js project examples"]
              },
              {
                section_id: "experience",
                cluster_id: "cluster-2",
                cluster_name: "Backend Development",
                priority_tier: "critical",
                raw_score: 88,
                coverage: ["Node.js", "API design"],
                missing: ["Database"],
                strength_indicators: ["Node.js backend experience", "API development"],
                evidence: "Led backend API development with Node.js",
                enhancement_suggestions: ["Add database design experience"]
              }
            ],
            selection_reasoning: "Selected pairs that show strongest alignment with critical requirements",
            estimated_coverage: "85% overall coverage with gaps in database and cloud technologies"
          })
        }]
      }
    }]
  },

  // Error scenarios
  errors: {
    rateLimit: {
      error: {
        code: 429,
        message: "Resource has been exhausted (e.g. check quota).",
        status: "RESOURCE_EXHAUSTED"
      }
    },
    serverError: {
      error: {
        code: 500,
        message: "Internal server error",
        status: "INTERNAL"
      }
    },
    invalidRequest: {
      error: {
        code: 400,
        message: "Invalid request",
        status: "INVALID_ARGUMENT"
      }
    }
  }
};

/**
 * Helper function to determine response type based on prompt content
 */
export function getMockResponseType(prompt: string): keyof typeof mockGeminiResponses {
  if (prompt.includes('Extract, prioritize, and cluster job requirements')) {
    return 'extraction';
  }
  if (prompt.includes('match user profile sections') || prompt.includes('matching')) {
    return 'matching';
  }
  // Note: optimization phase uses hybridSelection.ts, so we don't mock it
  return 'extraction'; // default fallback
}
