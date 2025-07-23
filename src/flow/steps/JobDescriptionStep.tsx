"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setJobDescription, setCompanyContext } from "@/store/slices/jobDescriptionSlice";
import { createStep } from "@/utils/createStep";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormDescription } from "@/components/ui/form";
import { Building2, FileText } from "lucide-react";

const JobDescription: React.FC = () => {
  const dispatch = useDispatch();
  const job_description = useSelector((state: RootState) => state.jobContext.job_description);
  const company_context = useSelector((state: RootState) => state.jobContext.company_context) || "";

  const wordCount = job_description.trim().split(/\s+/).filter(Boolean).length;
  const charCount = job_description.length;

  return (
    <div className="bg-card border rounded-lg p-6 space-y-8 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="job-description" className="flex items-center gap-2 text-base font-semibold">
          <FileText className="w-5 h-5 text-primary" />
          Job Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="job-description"
          value={job_description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => dispatch(setJobDescription(e.target.value))}
          placeholder="We’re looking for a Senior Backend Engineer..."
          className="min-h-[180px]"
          autoFocus
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-muted-foreground text-sm">{charCount} chars / {wordCount} words</p>
          {job_description.trim() === "" && (
            <span className="text-red-500 text-xs">Job description is required.</span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="company-context" className="flex items-center gap-2 text-base font-semibold">
          <Building2 className="w-5 h-5 text-primary" />
          Company Culture / Values <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Textarea
          id="company-context"
          value={company_context}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => dispatch(setCompanyContext(e.target.value))}
          placeholder="We value transparency, customer obsession..."
          className="min-h-[60px]"
        />
        <p className="text-muted-foreground text-sm">{company_context.length} chars</p>
      </div>
    </div>
  );
};

export const JobDescriptionStep = createStep({
  id: "job-description",
  label: "Job Description & Company Details",
  description: "Describe the job and company context."
})(JobDescription); 