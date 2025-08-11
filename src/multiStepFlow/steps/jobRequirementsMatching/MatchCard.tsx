"use client";
import React, { useState } from "react";
import { generateTextPreview } from "@/utils/textPreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Sparkle, Sparkles } from 'lucide-react';
import { ProfileSection } from "@/types/store";

interface MatchCardProps {
  match: any;
  profileSections: ProfileSection[];
  onSeeSuggestions: (requirement: string, matchId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, profileSections, onSeeSuggestions }) => {
  const [expanded, setExpanded] = useState(false);

  const matched_profile_section = match.profile_section_id
    ? profileSections.find(s => s.id === match.profile_section_id)
    : null;

  const { preview, isExpandable } = matched_profile_section
    ? generateTextPreview(matched_profile_section.content)
    : { preview: "", isExpandable: false };

  const confidenceValue = parseInt(match.confidence, 10);

  return (
    <Card className={`border-l-4 ${matched_profile_section ? 'border-green-500' : 'border-red-500'}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          {matched_profile_section ? <CheckCircle className="mr-2 h-5 w-5 text-green-500" /> : <XCircle className="mr-2 h-5 w-5 text-red-500" />} Job Requirement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">"{match.requirement}"</p>
        {matched_profile_section ? (
          <div>
            <h4 className="font-semibold">Matched Profile Section: <Badge>{matched_profile_section.type}</Badge></h4>
            <pre className="bg-gray-100 rounded p-2 text-sm whitespace-pre-line my-2">
              {expanded ? matched_profile_section.content : preview}
            </pre>
            {isExpandable && (
              <Button variant="link" onClick={() => setExpanded(!expanded)} className="px-0">
                {expanded ? <><ChevronUp className="mr-2 h-4 w-4" />Show Less</> : <><ChevronDown className="mr-2 h-4 w-4" />Show More</>}
              </Button>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="font-semibold">Confidence:</span>
              <Progress value={confidenceValue} className="w-1/2" />
              <span>{confidenceValue}%</span>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-red-600 font-semibold">No matching profile section found</p>
            <p className="text-gray-600">Gap: {match.gap_description || "No profile section covers this requirement."}</p>
            <div className="mt-4">
              <Button onClick={() => onSeeSuggestions(match.requirement, match.id)}>
                <Sparkles className="mr-2 h-4 w-4" />
                See Suggestions
                </Button>
              <Button variant="ghost">Skip</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};