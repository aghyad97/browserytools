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
}

export function CopyButton({ text, label = "Copy", size = "sm" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(resetTimerRef.current), []);

  const onClick = async () => {
    if (await copyText(text)) {
      toast.success("Copied to clipboard");
      setCopied(true);
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setCopied(false), 1500);
    } else {
      toast.error("Couldn't copy — check clipboard permissions");
    }
  };

  return (
    <Button variant="ghost" size={size} aria-label={label} onClick={onClick}>
      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
      {size !== "icon" && label}
    </Button>
  );
}
