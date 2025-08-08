import { z } from "zod";

export const ProfileSectionSchema = z.object({
  id: z.string().describe("The ID of the profile section"),
  type: z.string().describe("The type of the profile section"),
  content: z.string().describe("The content of the profile section"),
});

export const ProfileSectionListSchema = z.object({
  profile_sections: z.array(ProfileSectionSchema).describe("The list of profile sections"),
});

// Schema for the new profile section result
export const NewProfileSectionSchema = z.object({
  content: z.string().describe("The complete new profile section content"),
  structure_rationale: z.string().describe("Brief explanation of the chosen structure and approach"),
  key_highlights: z.array(z.string()).describe("List of key achievements or capabilities highlighted in the section")
});

export type NewProfileSection = z.infer<typeof NewProfileSectionSchema>;

export type ProfileSection = z.infer<typeof ProfileSectionSchema>;
