import { ProfileSectionsStep } from "./profileSections/ProfileSectionsStep";
import { JobDescriptionStep } from "./JobDescriptionStep";
import { JobRequirementsMatchingStep } from "./jobRequirementsMatching";
import { MatchedProfileSectionsStep } from "./profileSectionAnalysis/MatchedProfileSectionsStep";
import { GenerateResumeSectionsStep } from "./generateResumeSections";
import { GenerateEditResumeStep } from "./generateEditResume/";
import { GenerateCoverLetterStep } from "./generateCoverLetter/";

export const stepComponents = [
  ProfileSectionsStep,
  JobDescriptionStep,
  JobRequirementsMatchingStep,
  MatchedProfileSectionsStep,
  GenerateResumeSectionsStep,
  GenerateEditResumeStep,
  GenerateCoverLetterStep,
];