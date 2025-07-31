import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getLLMConfigHeadersOrParams } from './llmConfigUtil';
import { RootState } from '../store';
import { ProfileSection } from '../slices/profileSectionsSlice';

// Copied from EnhanceProfileSectionModal
export interface EnhancementResponse {
  original_profile_section: ProfileSection;
  enhanced_profile_section: ProfileSection;
  enhancements_made: string[];
  reasoning: string[];
}

export interface BaseJobRequirementMatch {
  id: string;
  requirement_id: string;
  requirement: string;
  profile_section_id: string;
  confidence: string;
  gap_description: string;
  recommendation: string;
}

export interface ResumeSection {
  profile_section_id: string;
  type: string;
  content: string;
}

export interface GenerateResumeSectionsRequest {
  profile_sections_with_requirements: Array<{
    profile_section: ProfileSection;
    requirements: string[];
  }>;
}

export interface GenerateResumeSectionsResponse {
  data: ResumeSection[];
  success: boolean;
  message?: string;
}

export interface GenerateResumeRequest {
  sections: Array<{
    type: string;
    content: string;
  }>;
}

export interface GenerateResumeResponse {
  data: {
    resume: {
      summary?: string;
      experience?: string;
      skills?: string;
      education?: string;
      certifications?: string;
      projects?: string;
      achievements?: string;
      volunteering?: string;
      language?: string;
    };
    optimization_summary?: string;
  };
}

export interface GenerateCoverLetterRequest {
  matched_profile_sections: Array<{
    profile_section: {
      id: string;
      type: string;
      content: string;
    };
    requirements: string[];
  }>;
  company_context?: string;
  tone_guidance?: string;
}

export interface GenerateCoverLetterResponse {
  data: {
    cover_letter_markdown: string;
    optimization_summary?: string;
  };
}

export interface SuggestProfileSectionRequest {
  requirement: string;
  profile_sections: Array<{
    id: string;
    type: string;
    content: string;
  }>;
}

export interface ProfileSectionSuggestion {
  base_profile_section_id: string;
  suggested_profile_section: ResumeSection;
  summary_of_changes: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const llmApi = createApi({
  reducerPath: 'llmApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const llmHeaders = getLLMConfigHeadersOrParams(getState() as RootState);
      if (llmHeaders) {
        Object.entries(llmHeaders).forEach(([key, value]) => {
          if (value) headers.set(key, value as string);
        });
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    enhanceMatchedProfileSection: builder.mutation<
      EnhancementResponse,
      { profile_section: ProfileSection; base_job_requirement_matches: BaseJobRequirementMatch[] }
    >({
      query: (body) => ({
        url: 'enhance-matched-profile-section/',
        method: 'POST',
        body,
      }),
    }),
    // Resume endpoints
    generateResumeSections: builder.mutation<GenerateResumeSectionsResponse, GenerateResumeSectionsRequest>({
      query: (body) => ({
        url: 'generate-resume-sections/',
        method: 'POST',
        body,
      }),
    }),
    generateResume: builder.mutation<GenerateResumeResponse, GenerateResumeRequest>({
      query: (body) => ({
        url: 'generate-resume/',
        method: 'POST',
        body,
      }),
    }),
    generateCoverLetter: builder.mutation<GenerateCoverLetterResponse, GenerateCoverLetterRequest>({
      query: (body) => ({
        url: 'generate-cover-letter/',
        method: 'POST',
        body,
      }),
    }),
    // Match endpoint
    match: builder.mutation<any, { job_description: string; company_context: string; profile_sections: any[] }>({
      query: (body) => ({
        url: 'match-job-to-profile/',
        method: 'POST',
        body,
      }),
    }),
    suggestProfileSection: builder.mutation<ProfileSectionSuggestion, SuggestProfileSectionRequest>({
      query: (body) => ({
        url: 'suggest-profile-section/',
        method: 'POST',
        body,
      }),
    }),
    // Add parseProfileSections endpoint
    parseProfileSections: builder.mutation<
      { profile_sections: ProfileSection[] },
      { text: string; type: "linkedin" | "resume" }
    >({
      query: (body) => ({
        url: "parse-profile-sections",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGenerateResumeSectionsMutation,
  useGenerateResumeMutation,
  useGenerateCoverLetterMutation,
  useMatchMutation,
  useSuggestProfileSectionMutation,
  useParseProfileSectionsMutation,
  useEnhanceMatchedProfileSectionMutation,
} = llmApi;