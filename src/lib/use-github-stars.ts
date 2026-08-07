"use client";

import { useEffect, useState } from "react";

/**
 * Live star count from the GitHub API, cached in sessionStorage under the same
 * `gh-stars` key the rail uses — so whichever surface mounts first pays for the
 * single request and the other reads the cache.
 *
 * Returns null on failure, and callers must render nothing in that case. A
 * fabricated or placeholder count is never acceptable (spec §3 hard rule).
 *
 * This intentionally duplicates the rail's private hook rather than refactoring
 * rail.tsx: a previous extraction pass on that file was reverted by the repo
 * owner (2026-07-16), so the rail stays untouched.
 */

export const GITHUB_REPO = "aghyad97/browserytools";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

export function useGithubStars(repo = GITHUB_REPO): number | null {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
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
        if (cancelled || typeof d?.stargazers_count !== "number") return;
        try {
          sessionStorage.setItem("gh-stars", String(d.stargazers_count));
        } catch {
          /* ignore */
        }
        setStars(d.stargazers_count);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [repo]);

  return stars;
}

export function formatStars(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);
}
