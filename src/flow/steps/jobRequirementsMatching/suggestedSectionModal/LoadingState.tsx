import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState = () => (
  <div className="flex flex-col lg:flex-row gap-6 h-full">
    <div className="lg:w-2/3 space-y-4">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
    <div className="lg:w-1/3 space-y-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  </div>
); 