import { z } from "zod";
import { ProfileSectionSchema } from "./profileSection.schema";

export const ProfileParserRequestSchema = z.object({
  text: z.string().describe("Raw LinkedIn or resume text"),
  type: z.enum(["linkedin", "resume"]).describe("Type of profile for parsing heuristics"),
});

export const ProfileParserResponseSchema = z.object({
  profile_sections: z
    .array(ProfileSectionSchema)
    .describe("List of extracted profile sections"),
});

export type ProfileType = "linkedin" | "resume";