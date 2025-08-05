import { ProfileSectionsStep } from "./profileSections/ProfileSectionsStep";
import { JobDescriptionStep } from "./JobDescriptionStep";
import { JobRequirementsMatchingStep } from "./jobRequirementsMatching";
import { GenerateResumeSectionsStep } from "./generateResumeSections";
import { GenerateEditResumeStep } from "./generateEditResume/";
import { GenerateCoverLetterStep } from "./generateCoverLetter/";
import { GetStartedStep } from "./getStarted/GetStartedStep";

export const stepComponents = [
  GetStartedStep,
  ProfileSectionsStep,
  JobDescriptionStep,
  JobRequirementsMatchingStep,
  GenerateResumeSectionsStep,
  GenerateEditResumeStep,
  GenerateCoverLetterStep,
];