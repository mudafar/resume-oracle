import { z } from "zod";

export const ProfileSectionSchema = z.object({
  id: z.string().describe("The ID of the profile section"),
  type: z.string().describe("The type of the profile section"),
  content: z.string().describe("The content of the profile section"),
});

export const ProfileSectionListSchema = z.object({
  profile_sections: z.array(ProfileSectionSchema).describe("The list of profile sections"),
});

export type ProfileSection = z.infer<typeof ProfileSectionSchema>;
