import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RequirementsChecklistProps {}

export const RequirementsChecklist: React.FC<RequirementsChecklistProps> = () => {
  return (
    <Card className="max-w-md mx-auto mb-8">
      <CardContent className="p-6">
        <h3 className="font-semibold text-foreground mb-4 text-left">You can use this if you have:</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-muted-foreground">A resume in Word or PDF (just copy-paste)</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-muted-foreground">Your LinkedIn profile content</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
