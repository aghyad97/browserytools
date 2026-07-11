"use client";

import { useEffect, useRef, useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/clipboard";
import { playCue } from "@/lib/ui-sound";

interface CopyButtonProps {
  text: string;
  label?: string;
  size?: "sm" | "icon";
  successMessage?: string;
  errorMessage?: string;
  /** Keep the affordance visible but inert (e.g. nothing to copy yet). */
  disabled?: boolean;
  "data-testid"?: string;
}

export function CopyButton({
  text,
  label,
  size = "sm",
  successMessage,
  errorMessage,
  disabled = false,
  "data-testid": dataTestId,
}: CopyButtonProps) {
  const t = useTranslations("Common");
  const resolvedLabel = label ?? t("copy");
  const resolvedSuccessMessage = successMessage ?? t("copied");
  const resolvedErrorMessage = errorMessage ?? t("copyFailed");
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(resetTimerRef.current), []);

  const onClick = async () => {
    if (await copyText(text)) {
      toast.success(resolvedSuccessMessage);
      playCue("success");
      setCopied(true);
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setCopied(false), 1500);
    } else {
      toast.error(resolvedErrorMessage);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      aria-label={resolvedLabel}
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
    >
      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
      {size !== "icon" && resolvedLabel}
    </Button>
  );
}
