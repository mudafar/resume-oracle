"use client";
import React, { memo } from "react";
import { createStep } from "@/utils/createStep";
import { JobDescriptionField, CompanyContextField } from "./components";
import { useJobDescription } from "./hooks/useJobDescription";

const JobDescription: React.FC = memo(() => {
  const {
    jobDescription,
    companyContext,
    updateJobDescription,
    updateCompanyContext,
  } = useJobDescription();

  return (
    <section
      className="bg-card border rounded-lg p-6 space-y-8 shadow-sm"
      aria-labelledby="job-description-heading"
    >
      <header className="space-y-2">
        <h2
          id="job-description-heading"
          className="text-2xl font-bold text-foreground"
        >
          Job Details
        </h2>
        <p className="text-muted-foreground">
          Describe the job and company context to help us match your profile effectively.
        </p>
      </header>

      <div className="space-y-6">
        <JobDescriptionField
          value={jobDescription}
          onChange={updateJobDescription}
        />

        <CompanyContextField
          value={companyContext}
          onChange={updateCompanyContext}
        />
      </div>
    </section>
  );
});

JobDescription.displayName = "JobDescription";

export const JobDescriptionStep = createStep({
  id: "job-description",
  label: "Job Details",
  description: "Describe the job and company context.",
})(JobDescription);