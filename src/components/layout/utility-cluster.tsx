"use client";

/**
 * Top-right utility cluster — desktop-only (>900px) chrome rendered by AppShell
 * on every route: [coffee pill][ThemeSwitcher][LanguageSwitcher][SoundSwitcher].
 *
 * The coffee pill moved here from the landing's hero so it appears on every
 * page while staying at exactly one coffee CTA per screen (spec §3). The
 * switchers moved out of the desktop rail bottom; the mobile drawer (Rail
 * variant="sheet") still carries them for small screens.
 *
 * The toggle sound cue is owned by ThemeSwitcher/LanguageSwitcher/SoundSwitcher
 * themselves (each calls playCue("toggle") on selection), so relocating them
 * here neither loses nor double-fires the cue.
 */

import { CoffeeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SoundSwitcher } from "@/components/sound-switcher";
import s from "./utility-cluster.module.css";

export function UtilityCluster() {
  const t = useTranslations("Landing");
  const tRail = useTranslations("Rail");

  return (
    <div className={s.cluster}>
      <a className={s.pill} href="/coffee">
        <CoffeeIcon size={13} className={s.coffeeIcon} />
        {t("coffee")}
      </a>
      <span title={tRail("theme")}>
        <ThemeSwitcher />
      </span>
      <span title={tRail("language")}>
        <LanguageSwitcher />
      </span>
      <SoundSwitcher />
    </div>
  );
}
