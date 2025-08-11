import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
  open: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  open,
  message,
  type,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  const icon = type === "success" ? (
    <CheckCircle className="w-5 h-5 text-green-600" />
  ) : (
    <XCircle className="w-5 h-5 text-red-600" />
  );

  const bgColor = type === "success" 
    ? "bg-green-50 border-green-200" 
    : "bg-red-50 border-red-200";

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 fade-in-0">
      <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${bgColor}`}>
        {icon}
        <span className="text-sm font-medium text-gray-900">
          {message}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-1 h-auto text-gray-500 hover:text-gray-700"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}; 