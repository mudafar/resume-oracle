import React from 'react';
import { Key } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FreeModeBannerProps {
  onOpenSettings: () => void;
}

export const FreeModeBanner: React.FC<FreeModeBannerProps> = ({ onOpenSettings }) => {
  return (
    <div className="m-4 text-sm text-slate-600 bg-purple-50 border border-purple-200 px-4 py-2 rounded-md flex items-center justify-between">
      <span>
        FREE mode — 5 requests/hour.{" "}
        <Button
          variant="link"
          size="sm"
          className="text-purple-700"
          onClick={onOpenSettings}
        >
          <Key className="w-4 h-4 inline-block mr-1" />
          Use your own API key for premium AI
        </Button>
      </span>
    </div>
  );
};
