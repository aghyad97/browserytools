"use client";

/**
 * Shared body for /privacy and /terms (R2 Task 7). Renders an ordered list of
 * heading+body sections from the `Legal.<kind>.*` i18n namespace, plus a
 * small cross-nav to the sibling legal page and the GitHub-hosted license —
 * mirroring the rail's existing GitHub-link conventions (rail.tsx / footer.tsx).
 *
 * Content is intentionally short and true (spec brief): no accounts, no file
 * uploads (processing happens on-device), Vercel Analytics aggregate usage
 * only, AGPL-3.0 source on GitHub, no warranty, free for everyone.
 */

import Link from "next/link";
import { useTranslations } from "next-intl";
import s from "./legal-document.module.css";

const GITHUB_URL = "https://github.com/aghyad97/browserytools";
export const LEGAL_ISSUES_URL = `${GITHUB_URL}/issues`;
export const LEGAL_LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`;

type Kind = "privacy" | "terms";

/* Section order per page — keys resolve to `${key}Heading` / `${key}Body`
   under Legal.<kind>.* */
const SECTIONS: Record<Kind, string[]> = {
  privacy: [
    "noAccounts",
    "onDevice",
    "analytics",
    "localStorage",
    "openSource",
    "contact",
    "changes",
  ],
  terms: ["license", "free", "warranty", "acceptableUse", "changes", "contact"],
};

export function LegalDocument({ kind }: { kind: Kind }) {
  const t = useTranslations("Legal");
  const sections = SECTIONS[kind];

  return (
    <article className={s.wrap}>
      <nav className={s.crumbs}>
        <Link
          href="/privacy"
          className={kind === "privacy" ? s.crumbActive : s.crumb}
        >
          {t("nav.privacy")}
        </Link>
        <Link href="/terms" className={kind === "terms" ? s.crumbActive : s.crumb}>
          {t("nav.terms")}
        </Link>
        <a className={s.crumb} href={LEGAL_LICENSE_URL} target="_blank" rel="noreferrer">
          {t("nav.license")}
        </a>
      </nav>

      <h1 className={s.title}>{t(`${kind}.title` as never)}</h1>
      <p className={s.intro}>{t(`${kind}.intro` as never)}</p>

      {sections.map((key) => (
        <section key={key} className={s.section}>
          <h2 className={s.heading}>{t(`${kind}.${key}Heading` as never)}</h2>
          <p className={s.body}>{t(`${kind}.${key}Body` as never)}</p>
          {key === "contact" && (
            <a className={s.link} href={LEGAL_ISSUES_URL} target="_blank" rel="noreferrer">
              {t("common.contactLinkText")} <span aria-hidden>→</span>
            </a>
          )}
          {key === "license" && (
            <a className={s.link} href={LEGAL_LICENSE_URL} target="_blank" rel="noreferrer">
              {t("common.licenseLinkText")} <span aria-hidden>→</span>
            </a>
          )}
        </section>
      ))}
    </article>
  );
}
