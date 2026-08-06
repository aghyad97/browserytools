"use client";

/**
 * Landing closing block — the "direct" tier of the support ladder.
 *
 * The receipt (tool-receipt.tsx) is the earned ask, fired at the moment a tool
 * delivers. This is the rare, plainly-worded one: it sits at the very bottom of
 * the landing, states the funding reality without hedging, and asks for exactly
 * one thing.
 *
 * Star only, no coffee CTA, for two reasons: the top bar's coffee pill is
 * always on screen on the landing (see src/app/(home)/layout.tsx) and the
 * codebase holds coffee to one per screen (rail.tsx); and the free ask converts
 * far better than the paid one, so it is the right thing to spend the closing
 * slot on.
 *
 * Everything above this on the landing is tile grids at 21px or smaller, so the
 * scale jump here is the page's one deliberate rhythm break.
 */

import { StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGithubStars, formatStars, GITHUB_URL } from "@/lib/use-github-stars";
import s from "./landing-support.module.css";

export function LandingSupport({ count }: { count: number }) {
  const t = useTranslations("Landing");
  const stars = useGithubStars();

  return (
    <section className={s.block} data-testid="landing-support">
      <div className={s.rule} aria-hidden />
      <p className={s.lead}>{t("starLead", { count })}</p>
      <p className={s.body}>{t("starBody")}</p>
      <a
        className={s.cta}
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <StarIcon size={14} strokeWidth={2} className={s.starIcon} />
        {t("starCta")}
        {/* Live count, hidden entirely when the API call fails — never a
            placeholder or invented number. */}
        {stars !== null && <span className={s.count}>{formatStars(stars)}</span>}
      </a>
    </section>
  );
}
