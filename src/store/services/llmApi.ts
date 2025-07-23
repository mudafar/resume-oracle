import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getLLMConfigHeadersOrParams } from './llmConfigUtil';
import { RootState } from '../store';
import { ProfileSection } from '../slices/profileSectionsSlice';

export interface ResumeSection {
  profile_section_id: string;
  type: string;
  content: string;
}

export interface GenerateResumeSectionsRequest {
  matched_profile_sections: Array<{
    profile_section: {
      id: string;
      type: string;
      content: string;
    };
    base_job_requirement_matches: Array<{
      requirement: string;
    }>;
  }>;
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
    base_job_requirement_matches: Array<{
      requirement: string;
    }>;
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

export const llmApi = createApi({
  reducerPath: 'llmApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/',
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
    // Resume endpoints
    generateResumeSections: builder.mutation<ResumeSection[], GenerateResumeSectionsRequest>({
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
    match: builder.mutation<any, { job_description: string; company_context: string|null; profile_sections: any[] }>({
      query: (body) => ({
        url: 'match-job-to-profile/',
        method: 'POST',
        body,
      }),
    }),
    suggestProfileSection: builder.query<ProfileSectionSuggestion, SuggestProfileSectionRequest>({
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
  useSuggestProfileSectionQuery,
  useParseProfileSectionsMutation,
} = llmApi; 