import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StepDefinition } from "@/types/stepTypes";
import {
  Check,
  Settings,
  Bell,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useDispatch } from "react-redux";
import { openConfigModal } from "@/store/slices/llmConfigSlice";


export function LeftSidebar({ steps, currentStep, onStepChange, appName, appIcon }: {
  steps: StepDefinition[];
  currentStep: number;
  onStepChange: (step: number) => void;
  appName: string;
  appIcon: React.ReactNode;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const dispatch = useDispatch();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
            {appIcon}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{appName}</span>
            <span className="truncate text-xs text-muted-foreground">v0.1</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Steps</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {steps.map((step, idx) => {
                const completed = idx < currentStep;
                const active = idx === currentStep;
                // TODO diable steps if no profile sections only?
                const disabled = false //idx > currentStep;

                return (
                  <SidebarMenuItem key={step.id} className="">
                    <SidebarMenuButton
                      onClick={() => !disabled && onStepChange(idx)}
                      disabled={disabled}
                      isActive={active}
                      className={cn(
                        "gap-3 h-auto py-3 items-start",
                        disabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center justify-center">
                        {completed ? (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        ) : active ? (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {idx + 1}
                          </div>
                        ) : (
                          <div className="w-5 h-5 border-2 border-muted-foreground/30 rounded-full flex items-center justify-center text-xs">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="font-medium whitespace-normal break-words leading-tight">{step.label}</span>
                        {/* {step.description && !isCollapsed && (
<span className="text-xs text-muted-foreground whitespace-normal break-words leading-tight mt-1">
{step.description}
</span>
)} */}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
 <SidebarMenu>
   <SidebarMenuItem>
     <div className="flex items-center justify-between w-full px-2 gap-2">
       <Button
         variant="ghost"
         size="icon"
         className="h-10 w-10"
         onClick={() => dispatch(openConfigModal())}
         aria-label="Model Config"
       >
         <Settings className="w-8! h-8!" />
       </Button>
     </div>
   </SidebarMenuItem>
 </SidebarMenu>
</SidebarFooter>
    </Sidebar>
  );
}