"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setJobDescription, setCompanyContext } from "@/store/slices/jobDescriptionSlice";
import { createStep } from "@/utils/createStep";
import { JobDescriptionField, CompanyContextField } from "./components";

const JobDescription: React.FC = () => {
  const dispatch = useDispatch();
  const job_description = useSelector((state: RootState) => state.jobContext.job_description);
  const company_context = useSelector((state: RootState) => state.jobContext.company_context);

  return (
    <div className="bg-card border rounded-lg p-6 space-y-8 shadow-sm">
      <JobDescriptionField
        value={job_description}
        onChange={(value) => dispatch(setJobDescription(value))}
      />
      
      <CompanyContextField
        value={company_context}
        onChange={(value) => dispatch(setCompanyContext(value))}
      />
    </div>
  );
};

export const JobDescriptionStep = createStep({
  id: "job-description",
  label: "Job Details",
  description: "Describe the job and company context."
})(JobDescription);