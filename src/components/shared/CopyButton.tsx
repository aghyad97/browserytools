"use client";

import { useEffect, useRef, useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/clipboard";

interface CopyButtonProps {
  text: string;
  label?: string;
  size?: "sm" | "icon";
  successMessage?: string;
  errorMessage?: string;
  /** Keep the affordance visible but inert (e.g. nothing to copy yet). */
  disabled?: boolean;
}

export function CopyButton({
  text,
  label = "Copy",
  size = "sm",
  successMessage = "Copied to clipboard",
  errorMessage = "Couldn't copy — check clipboard permissions",
  disabled = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(resetTimerRef.current), []);

  const onClick = async () => {
    if (await copyText(text)) {
      toast.success(successMessage);
      setCopied(true);
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setCopied(false), 1500);
    } else {
      toast.error(errorMessage);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
      {size !== "icon" && label}
    </Button>
  );
}
