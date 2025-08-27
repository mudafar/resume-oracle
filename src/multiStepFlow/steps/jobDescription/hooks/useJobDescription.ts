import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setJobDescription, setCompanyContext } from "@/store/slices/jobDescriptionSlice";

export const useJobDescription = () => {
  const dispatch = useDispatch();

  const jobDescription = useSelector((state: RootState) => state.jobContext.job_description);
  const companyContext = useSelector((state: RootState) => state.jobContext.company_context);

  const updateJobDescription = (value: string) => {
    dispatch(setJobDescription(value));
  };

  const updateCompanyContext = (value: string) => {
    dispatch(setCompanyContext(value));
  };

  return {
    jobDescription,
    companyContext,
    updateJobDescription,
    updateCompanyContext,
  };
};
