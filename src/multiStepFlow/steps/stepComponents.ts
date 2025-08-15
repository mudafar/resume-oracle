import { ProfileSectionsStep } from "./profileSections/ProfileSectionsStep";
import { JobDescriptionStep } from "./jobDescription/JobDescriptionStep";
import { JobRequirementsMatchingStep } from "./jobRequirementsMatching";
import { GenerateResumeSectionsStep } from "./generateResumeSections";
import { GenerateEditResumeStep } from "./generateEditResume/";
import { GenerateCoverLetterStep } from "./generateCoverLetter/";

export const stepComponents = [
  ProfileSectionsStep,
  JobDescriptionStep,
  JobRequirementsMatchingStep,
  GenerateResumeSectionsStep,
  GenerateEditResumeStep,
  GenerateCoverLetterStep,
];