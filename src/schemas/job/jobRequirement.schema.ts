import { z } from "zod";

export const JobRequirementSchema = z.object({
  job_requirement: z.string().describe("The job requirement"),
});

export const JobRequirementListSchema = z.object({
  job_requirements: z.array(z.string()).describe(
    "Comprehensive list of all job requirements extracted from the job description. Each requirement should be: (1) specific enough for profile matching, (2) follow the granularity provided in the job description, (3) use clear and precise language, (4) cover every hiring criterion including both explicit and implied requirements, and (5) avoid redundancy by combining similar requirements when appropriate."
  ),
});

export type JobRequirement = z.infer<typeof JobRequirementSchema>;
