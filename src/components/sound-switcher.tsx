"use client";

import { Volume2Icon, VolumeXIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useSoundStore } from "@/store/sound-store";
import { playCue } from "@/lib/ui-sound";
import { cn } from "@/lib/utils";

interface SoundSwitcherProps {
  variant?: "outline" | "ghost";
  className?: string;
}

/**
 * Opt-in interaction-sound toggle. Mirrors ThemeSwitcher's trigger markup (same
 * ghost 8×8 icon button) so it sits flush in the rail's switcher row.
 *
 * Turning sound ON plays the `toggle` cue immediately — this click is a user
 * gesture, so it doubles as the Web Audio autoplay unlock. The store update is
 * synchronous, so playCue()'s out-of-React getState() read already sees soundOn.
 */
export function SoundSwitcher({
  variant = "ghost",
  className,
}: SoundSwitcherProps) {
  const t = useTranslations("Rail");
  const soundOn = useSoundStore((s) => s.soundOn);
  const toggleSound = useSoundStore((s) => s.toggleSound);
  const label = soundOn ? t("soundOn") : t("soundOff");

  const onClick = () => {
    const turningOn = !soundOn;
    toggleSound();
    if (turningOn) playCue("toggle");
  };

  return (
    <Button
      variant={variant}
      size="sm"
      className={cn("h-8 w-8 p-0", className)}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {soundOn ? (
        <Volume2Icon className="h-4 w-4" />
      ) : (
        <VolumeXIcon className="h-4 w-4" />
      )}
      <span className="sr-only">{label}</span>
    </Button>
  );
}
