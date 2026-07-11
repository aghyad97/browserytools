"use client";

/**
 * Production rail — the left (start-side) navigation shell.
 *
 * Ported from the /preview prototype (src/app/preview/ui.tsx) with the four
 * production upgrades required by the R2 spec:
 *   1. Logical properties only (RTL mirrors for free via dir="rtl").
 *   2. Every user-visible string through next-intl (Rail / ToolsConfig).
 *   3. All colours via var(--bt-*) design tokens (light + dark).
 *   4. LanguageSwitcher + ThemeSwitcher slots in the rail bottom.
 *
 * This component is NOT mounted into the production layout here — the
 * chrome-switchover task wires it in. It renders standalone.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SearchIcon, StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { tools } from "@/lib/tools-config";
import { SPONSORS, ROTATE_MS, type Sponsor } from "@/lib/sponsors";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SoundSwitcher } from "@/components/sound-switcher";
import { playCue } from "@/lib/ui-sound";
import { BrandGlyph } from "./brand-glyph";
import s from "./rail.module.css";

/* Categories carrying the hand-drawn "new" treatment. */
const NEW_CATEGORIES = new Set(["aiTools"]);

/* Category list (id + count), ordered — labels come from i18n at render time. */
const CATEGORIES = tools
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((c) => ({ id: c.id, count: c.items.length }));

const TOOL_COUNT = tools.reduce((n, c) => n + c.items.length, 0);

const GITHUB_REPO = "aghyad97/browserytools";
const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

/* Real star count from the GitHub API — cached per session, hidden on failure.
   Never render a made-up number (spec §3 hard rule). */
function useGithubStars(repo = GITHUB_REPO) {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("gh-stars");
      if (cached) {
        setStars(Number(cached));
        return;
      }
    } catch {
      /* sessionStorage unavailable — fall through to a live fetch */
    }
    fetch(`https://api.github.com/repos/${repo}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (typeof d?.stargazers_count === "number") {
          try {
            sessionStorage.setItem("gh-stars", String(d.stargazers_count));
          } catch {
            /* ignore */
          }
          setStars(d.stargazers_count);
        }
      })
      .catch(() => {});
  }, [repo]);
  return stars;
}

function formatStars(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);
}

function NewTag({ label }: { label: string }) {
  return (
    <span className={s.newTag}>
      {label}
      <svg className={s.newScribble} viewBox="0 0 33 7" aria-hidden>
        <path d="M1.6 5.7 C 1.2 5.8, 2.8 5.6, 7.2 4.8 C 11.3 4.2, 17.8 3.7, 21.9 3.3 C 28.4 2.3, 30.8 1.5, 31.5 1.2" />
      </svg>
    </span>
  );
}

export function Rail({
  activeCategory,
  onCategory,
  onSearch,
  variant = "fixed",
}: {
  activeCategory?: string | null;
  onCategory?: (id: string | null) => void;
  onSearch: () => void;
  /** "fixed" = the desktop side column; "sheet" = static content for the
      mobile drawer (no fixed positioning, not hidden under 900px). */
  variant?: "fixed" | "sheet";
}) {
  const t = useTranslations("Rail");
  const tc = useTranslations("ToolsConfig");
  const tCommon = useTranslations("Common");
  const stars = useGithubStars();

  const catButton = (id: string | null, label: string) => {
    const active = activeCategory === id;
    const cls = active ? s.railLinkActive : s.railLink;
    const inner = (
      <>
        {label}
        {!active && id && NEW_CATEGORIES.has(id) && <NewTag label={t("new")} />}
        {active && (
          <motion.span
            layoutId="rail-active-dot"
            data-testid="rail-active-dot"
            className={s.activeDot}
            transition={{ type: "spring", duration: 0.45, bounce: 0.25 }}
          />
        )}
      </>
    );
    if (onCategory) {
      return (
        <button
          key={id ?? "all"}
          className={cls}
          onClick={() => {
            playCue("tick");
            onCategory(id);
          }}
        >
          {inner}
        </button>
      );
    }
    return (
      <Link key={id ?? "all"} className={cls} href="/">
        {inner}
      </Link>
    );
  };

  return (
    <aside className={variant === "sheet" ? s.railSheet : s.rail}>
      <Link href="/" aria-label={tCommon("siteName")} className={s.railBrand}>
        <span className={s.railGlyphBare}>
          <BrandGlyph size={22} />
        </span>
        <span className={s.railWordmark}>{tCommon("siteName")}</span>
      </Link>

      <div className={s.railLive}>
        <span className={s.liveDot} />
        {t("toolsOnDevice", { count: TOOL_COUNT })}
      </div>

      <nav className={s.railNav}>
        {catButton(null, t("everything"))}
        {CATEGORIES.map((c) => catButton(c.id, tc(`categoriesShort.${c.id}` as never)))}
        <div className={s.railGroupGap} />
        <Link className={s.railLink} href="/blog">
          {t("blog")}
        </Link>
        <a className={s.railLink} href={GITHUB_URL} target="_blank" rel="noreferrer">
          <span className={s.githubRow}>
            {t("github")}
            {stars !== null && (
              <span className={s.starBadge}>
                <StarIcon size={10.5} strokeWidth={2} />
                {formatStars(stars)}
              </span>
            )}
          </span>
        </a>
      </nav>

      <div className={s.railBottom}>
        <SponsorRotator label={t("sponsorLabel")} />
        <div className={s.railSwitchers}>
          <span title={t("theme")}>
            <ThemeSwitcher />
          </span>
          <span title={t("language")}>
            <LanguageSwitcher />
          </span>
          <SoundSwitcher />
        </div>
        <button className={s.pillDark} onClick={onSearch}>
          <SearchIcon size={13} />
          {t("search")}
          <span className={s.kbd}>⌘K</span>
        </button>
      </div>
    </aside>
  );
}

/* Rotates sponsors every ROTATE_MS with a thin progress line.
   Pauses on hover (like a toast). Renders nothing when no sponsors. */
function SponsorRotator({ label }: { label: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const elapsed = useRef(0);

  useEffect(() => {
    if (SPONSORS.length < 2 || paused) return;
    const started = performance.now() - elapsed.current;
    const timer = setInterval(() => {
      elapsed.current = performance.now() - started;
      if (elapsed.current >= ROTATE_MS) {
        elapsed.current = 0;
        setIndex((i) => (i + 1) % SPONSORS.length);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [paused, index]);

  if (SPONSORS.length === 0) return null;
  const sp: Sponsor = SPONSORS[index];

  return (
    <div
      className={`${s.railSponsor} ${paused ? s.sponsorPaused : ""}`}
      data-testid="rail-sponsor"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={s.sponsorEyebrow}>{label}</div>
      <div className={s.sponsorInner} key={sp.name}>
        <div className={s.sponsorHead}>
          <div className={s.sponsorLogo}>{sp.initial}</div>
          <div>
            <div className={s.railSponsorName}>{sp.name}</div>
            <div className={s.sponsorTag}>{sp.tag}</div>
          </div>
        </div>
        <div className={s.railSponsorText}>{sp.desc}</div>
        {sp.href ? (
          <a className={s.sponsorCta} href={sp.href} target="_blank" rel="noreferrer">
            {sp.cta} <span aria-hidden>→</span>
          </a>
        ) : (
          <button className={s.sponsorCta}>
            {sp.cta} <span aria-hidden>→</span>
          </button>
        )}
      </div>
      {SPONSORS.length > 1 && (
        <div className={s.sponsorTrack}>
          <div
            className={s.sponsorFill}
            key={`${sp.name}-${paused ? "p" : "r"}`}
            style={{ animationDelay: `-${elapsed.current}ms` }}
          />
        </div>
      )}
    </div>
  );
}
