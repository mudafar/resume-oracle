import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronUp, ChevronDown, Edit3, PlusCircle } from "lucide-react";
import { sectionTypes, SectionTypeEnum } from "@/store/slices/profileSectionsSlice";

interface SidebarProps {
  requirement: string;
  type: SectionTypeEnum;
  setType: React.Dispatch<React.SetStateAction<SectionTypeEnum>>;
  isEditing: boolean;
  summaryOfChanges: string;
  isSummaryOpen: boolean;
  setIsSummaryOpen: (open: boolean) => void;
  baseSection: any;
  isBaseSectionOpen: boolean;
  setIsBaseSectionOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  requirement,
  type,
  setType,
  isEditing,
  summaryOfChanges,
  isSummaryOpen,
  setIsSummaryOpen,
  baseSection,
  isBaseSectionOpen,
  setIsBaseSectionOpen,
}) => (
  <>
    <Alert className="border-blue-200 bg-blue-50">
      <AlertDescription>
        <span className="font-semibold text-blue-800">Target Requirement:</span>
        <div className="mt-1 text-blue-700 italic">"{requirement}"</div>
      </AlertDescription>
    </Alert>


    {summaryOfChanges && (
      <Collapsible open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-2 h-auto"
          >
            <span className="font-semibold">Summary of Changes</span>
            {isSummaryOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardContent className="p-3">
              <ScrollArea className="max-h-32">
                <div className="text-sm text-gray-700 leading-relaxed">
                  {summaryOfChanges}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    )}
    {baseSection && (
      <Collapsible open={isBaseSectionOpen} onOpenChange={setIsBaseSectionOpen} className="">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-2 h-auto"
          >
            <span className="font-semibold">Original Section</span>
            {isBaseSectionOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardContent className="p-3">
              {/* <ScrollArea className="max-h-40"> */}
                <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm whitespace-pre-wra font-sans">
                  {baseSection.content}
                </div>
              {/* </ScrollArea> */}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    )}
  </>
); 