"use client";

/**
 * Renders one "<competitor> alternative" comparison page from a typed entry in
 * src/lib/comparisons.ts.
 *
 * Client component only because this app's i18n is client-side (see
 * providers/language-provider.tsx) — exactly the arrangement ToolSeoContent
 * uses. It is still server-rendered by the App Router, so the full prose and
 * the entire comparison table are present in the raw HTML with JS disabled.
 * The locale is resolved from the `browsery-locale` cookie during SSR, so the
 * server output is already in the reader's language.
 *
 * Long-form comparison copy is authored in English and Arabic; every other
 * locale falls back to the English body while the surrounding chrome
 * (headings, column labels, disclaimers) is localized for all nine locales via
 * the `Comparisons` message namespace.
 *
 * Design rule (repo owner, non-negotiable): no single-edge stroke on any card.
 * Emphasis is nested surface + all-around hairline ring + text colour.
 */

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRightIcon } from "lucide-react";

import { getAllTools } from "@/lib/tools-config";
import type { Comparison, ComparisonLocale } from "@/lib/comparisons";
import { comparisons } from "@/lib/comparisons";
import s from "./comparison-page.module.css";

export function ComparisonPage({ comparison }: { comparison: Comparison }) {
  const locale = useLocale();
  const bodyLocale: "en" | "ar" = locale === "ar" ? "ar" : "en";
  const body: ComparisonLocale = comparison[bodyLocale] ?? comparison.en;
  const t = useTranslations("Comparisons");

  const name = comparison.competitor;

  const allTools = getAllTools();
  const tools = comparison.tools
    .map((slug) => allTools.find((tl) => tl.href === `/tools/${slug}`))
    .filter((tl): tl is NonNullable<typeof tl> => Boolean(tl && tl.available));

  const related = comparison.related
    .map((slug) => comparisons.find((c) => c.slug === slug))
    .filter((c): c is Comparison => Boolean(c));

  const introParagraphs = body.intro
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);
  const verdictParagraphs = body.verdict
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className={s.wrap} data-testid="comparison-page">
      <p className={s.eyebrow}>{t("sectionLabel")}</p>
      <h1 className={s.title}>{body.heading}</h1>

      <div className={s.intro}>
        {introParagraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <p className={s.notice}>{t("checkedOn", { date: comparison.checkedOn })}</p>

      {/* ── The comparison table ──────────────────────────────────────── */}
      <section className={s.section}>
        <div className={s.tableScroll}>
          <table className={s.table} data-testid="comparison-table">
            <caption>{t("tableCaption", { competitor: name })}</caption>
            <thead>
              <tr>
                <th scope="col">{t("colAspect")}</th>
                <th scope="col">{t("colUs")}</th>
                <th scope="col">{t("colThem", { competitor: name })}</th>
              </tr>
            </thead>
            <tbody>
              {body.rows.map((row) => (
                <tr key={row.key}>
                  <th scope="row" className={s.aspect}>
                    {row.aspect}
                  </th>
                  <td className={s.cellUs}>
                    {row.us}
                    {row.edge === "us" && (
                      <span className={s.edge}>{t("edgeUs")}</span>
                    )}
                  </td>
                  <td className={s.cellThem}>
                    {row.them}
                    {row.edge === "them" && (
                      <span className={s.edge}>
                        {t("edgeThem", { competitor: name })}
                      </span>
                    )}
                    {row.edge === "mixed" && (
                      <span className={`${s.edge} ${s.edgeMuted}`}>
                        {t("edgeMixed")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Where the competitor genuinely wins ───────────────────────── */}
      <section className={s.section} data-testid="comparison-their-edge">
        <h2 className={s.heading}>
          {t("theirEdgeTitle", { competitor: name })}
        </h2>
        <ul className={s.list}>
          {body.theirEdge.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* ── Where we genuinely lose ───────────────────────────────────── */}
      <section className={s.section} data-testid="comparison-our-limits">
        <h2 className={s.heading}>{t("ourLimitsTitle")}</h2>
        <div className={s.limitsPanel}>
          <ul className={s.list}>
            {body.ourLimits.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Verdict ───────────────────────────────────────────────────── */}
      <section className={s.section}>
        <h2 className={s.heading}>{t("verdictTitle")}</h2>
        <div className={s.verdict}>
          {verdictParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* ── The tools this page is actually about ─────────────────────── */}
      {tools.length > 0 && (
        <section className={s.section}>
          <h2 className={s.heading}>{t("toolsTitle")}</h2>
          <ul className={s.linkGrid}>
            {tools.map((tool) => (
              <li key={tool.href}>
                <Link
                  className={s.linkTile}
                  href={tool.href}
                  aria-label={t("openTool", { tool: tool.name })}
                >
                  <span>
                    {tool.name}
                    <span className={s.linkTileDesc}>{tool.category}</span>
                  </span>
                  <ArrowRightIcon className={s.arrow} size={16} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      {body.faq.length > 0 && (
        <section className={s.section}>
          <h2 className={s.heading}>{t("faqTitle")}</h2>
          <div>
            {body.faq.map((item, i) => (
              <div key={i} className={s.faqItem}>
                <h3 className={s.faqQ}>{item.q}</h3>
                <p className={s.faqA}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Cross-links to the other comparisons ──────────────────────── */}
      {related.length > 0 && (
        <section className={s.section}>
          <h2 className={s.heading}>{t("relatedTitle")}</h2>
          <ul className={s.linkGrid}>
            {related.map((rel) => (
              <li key={rel.slug}>
                <Link className={s.linkTile} href={`/alternatives/${rel.slug}`}>
                  <span>{rel.competitor}</span>
                  <ArrowRightIcon className={s.arrow} size={16} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Sources ───────────────────────────────────────────────────── */}
      <section className={s.section}>
        <h2 className={s.heading}>{t("sourcesTitle")}</h2>
        <ul className={s.sources}>
          {comparison.sources.map((src) => (
            <li key={src.url}>
              <a
                className={s.sourceLink}
                href={src.url}
                target="_blank"
                rel="nofollow noreferrer"
              >
                {src.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Nominative use of a third-party trademark, no affiliation implied. */}
      <p className={s.trademark}>{t("trademark", { competitor: name })}</p>
    </article>
  );
}
