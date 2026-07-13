"use client";

/**
 * Slim production footer — the crawlable full-catalog link surface (spec §6.5).
 *
 * Renders the complete 137-tool matrix as category columns (every tool link,
 * so search engines see the whole catalog from the landing) plus GitHub,
 * license, privacy, terms and copyright links in the bottom bar. All strings
 * via next-intl (Tools.Footer / Rail / Legal.nav); all colours via var(--bt-*)
 * tokens; logical properties throughout for RTL.
 *
 * The "alternatives-to" column (spec §6.5, brief) is W1's — intentionally not
 * rendered here.
 */

import Link from "next/link";
import { useTranslations } from "next-intl";
import { tools } from "@/lib/tools-config";
import { LEGAL_LICENSE_URL } from "@/components/legal/legal-document";
import s from "./footer.module.css";

const GITHUB_URL = "https://github.com/aghyad97/browserytools";

/* Locale-independent matrix — category id + tool slugs; labels via i18n. */
const MATRIX = tools
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((c) => ({
    id: c.id,
    // Copy before sorting — never mutate the shared `tools` config (an in-place
    // sort would desync SSR vs client order and break hydration).
    links: [...c.items]
      .sort((a, b) => a.order - b.order)
      .map((t) => ({
        href: t.href,
        slug: t.href.split("/").pop() as string,
      })),
  }));

export default function Footer() {
  const tc = useTranslations("ToolsConfig");
  const tRail = useTranslations("Rail");
  const tFooter = useTranslations("Tools.Footer");
  const tLegal = useTranslations("Legal.nav");
  const year = new Date().getFullYear();

  return (
    <footer className={s.footer}>
      <div className={s.rule} aria-hidden />

      <nav className={s.matrix}>
        {MATRIX.map((cat) => (
          <div key={cat.id} className={s.column}>
            <div className={s.columnHead}>
              {tc(`categories.${cat.id}` as never)}
            </div>
            {cat.links.map((link) => (
              <Link key={link.href} href={link.href} className={s.link}>
                {tc(`tools.${link.slug}.name` as never)}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className={s.bar}>
        <span className={s.copyright}>{tFooter("copyright", { year })}</span>
        <a
          className={s.metaLink}
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {tRail("github")}
        </a>
        <a
          className={s.metaLink}
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {tFooter("source")}
        </a>
        <a
          className={s.metaLink}
          href={LEGAL_LICENSE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {tLegal("license")}
        </a>
        <Link className={s.metaLink} href="/privacy">
          {tLegal("privacy")}
        </Link>
        <Link className={s.metaLink} href="/terms">
          {tLegal("terms")}
        </Link>
      </div>
    </footer>
  );
}
