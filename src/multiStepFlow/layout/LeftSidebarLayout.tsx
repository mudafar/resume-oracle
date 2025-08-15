import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StepDefinition } from "@/types/multiStepFlow/step.types";
import {
  Check,
  Settings,
  User,
  Key,
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
import Link from 'next/link';

import { useDispatch, useSelector } from "react-redux";
import { openConfigModal } from "@/store/slices/llmConfigSlice";
import { RootState } from "@/store/store";


export function LeftSidebarLayout({ steps, currentStep, onStepChange, appName, appIcon }: {
  steps: StepDefinition[];
  currentStep: number;
  onStepChange: (step: number) => void;
  appName: string;
  appIcon: React.ReactNode;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const dispatch = useDispatch();

  const config = useSelector((state: RootState) => state.llmConfig);
  const hasKey = Boolean(config.apiKey);
  const accessText = hasKey
    ? 'Premium AI Active'
    : 'Free • 5 calls/min';
  const accessStyle = hasKey
    ? 'bg-purple-50 text-purple-700 border-purple-200'
    : 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <Sidebar variant="inset"
      className="bg-slate-50 dark:bg-slate-900 border-r border-border"
    >
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2" aria-label="Homepage">
            <div className="flex items-center justify-center w-10 h-10 ">
              {appIcon}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{appName}</span>
              <span className="truncate text-xs text-muted-foreground">v0.1</span>
            </div>
          </Link>
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
            <div className="flex items-center w-full px-2 gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => dispatch(openConfigModal())}
                aria-label="Model Config"
              >
                <Settings className="w-8! h-8!" />
              </Button>

              {/* Access Badge */}
              {/* TODO: move to the left side bar? */}
              <Button
                onClick={() => dispatch(openConfigModal())}
                className={`top-4 right-4 flex items-center gap-1 text-xs font-medium px-2 py-0.5 border rounded-full hover:bg-opacity-80 transition ${accessStyle}`}
              >
                {hasKey ? <User className="w-4 h-4" /> : <Key className="w-4 h-4" />} {accessText}
              </Button>

            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}