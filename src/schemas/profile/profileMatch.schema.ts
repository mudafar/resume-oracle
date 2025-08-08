import { z } from "zod";
import { ProfileSectionSchema } from "./profileSection.schema";
import { BaseJobRequirementMatchSchema } from "@/schemas/job/jobRequirementMatch.schema";

export const MatchedProfileSectionSchema = z.object({
  profile_section: ProfileSectionSchema,
  base_job_requirement_matches: z.array(BaseJobRequirementMatchSchema),
});

export type MatchedProfileSection = z.infer<typeof MatchedProfileSectionSchema>;
