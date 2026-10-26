import { headers, cookies } from "next/headers";
import Link from "next/link";
import { createTranslator } from "next-intl";
import {
  ArrowRightIcon,
  HelpCircleIcon,
  ListChecksIcon,
  ScaleIcon,
} from "lucide-react";

import {
  LOCALE_COOKIE,
  LOCALE_HEADER,
  PATHNAME_HEADER,
  defaultLocale,
  isLocale,
  type Locale,
} from "@/lib/locales";
import { loadMessages } from "@/lib/messages";
import { resolveSeoBlock, type CatalogueTranslator } from "@/lib/tool-seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonLdScript } from "@/components/JsonLdScript";
import { SeoFaq } from "@/components/tool-seo/seo-faq";
import { SeoPathnameSync } from "@/components/tool-seo/seo-pathname-sync";

/**
 * Same resolution order as the root layout, which feeds the client
 * `NextIntlClientProvider`: the middleware's locale header (URL prefix first,
 * then cookie), then the cookie, then the default. `getRequestLocale()` in
 * cluster-chrome is cookie-only and would pick the wrong language on a
 * `/ru/...` URL whose cookie says otherwise.
 */
async function getSeoLocale(): Promise<Locale> {
  const fromHeader = (await headers()).get(LOCALE_HEADER);
  if (isLocale(fromHeader)) return fromHeader;
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(fromCookie) ? fromCookie : defaultLocale;
}

/**
 * Known limit: on unprefixed URLs the locale can change client-side (first-visit
 * `navigator.language` detection / the language switcher updating the store and
 * cookie) without a server round trip, so this block keeps the language it was
 * server-rendered in until the next navigation or reload. That is acceptable:
 * crawlers and full loads are always right, the tool UI itself switches, and
 * locale-prefixed URLs, the ones that are indexed per language, pin the locale.
 *
 * Zone 5 of the tool template: About / How to / Limitations / FAQ / Related,
 * plus the JSON-LD graphs. A server component, so the per-tool prose map
 * (`tool-content.ts`) is never sent to the browser; only the FAQ accordion
 * hydrates. It is rendered from `template.tsx`, but Next still reuses the
 * template's server output on a soft navigation, so `SeoPathnameSync` calls
 * `router.refresh()` when the client pathname differs from the one rendered. The page is identified by the `x-pathname` header the middleware
 * forwards, because layouts cannot see the URL.
 */
export default async function ToolSeoContent() {
  const pathname = (await headers()).get(PATHNAME_HEADER) ?? "";
  if (!pathname) return null;

  const locale = await getSeoLocale();
  const messages = await loadMessages(locale);
  const t = createTranslator({ locale, messages, namespace: "ToolSeo" });
  const tcRaw = createTranslator({ locale, messages, namespace: "ToolsConfig" });
  // next-intl types keys as the literal message paths; the catalogue keys are
  // built from slugs at runtime, so adapt to a string-keyed translator.
  const tc: CatalogueTranslator = Object.assign(
    (key: string) => tcRaw(key as never) as string,
    { has: (key: string) => tcRaw.has(key as never) }
  );

  const block = resolveSeoBlock({ pathname, locale, tc });
  if (!block) return null;
  const { tool, content, jsonLd, related } = block;

  const introParagraphs = content.intro
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section
      aria-label={t("sectionLabel")}
      className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10"
      data-testid="tool-seo-content"
      data-seo-content
    >
      {/* Soft navigations reuse this server output; this triggers a re-render
          when the live URL no longer matches the one rendered here. */}
      <SeoPathnameSync serverPathname={pathname} />

      {/* JSON-LD structured data */}
      {jsonLd.map((graph, i) => (
        <JsonLdScript key={i} data={graph} />
      ))}

      <div className="flex flex-col gap-6">
        {/* About / how it works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {t("aboutTitle", { tool: tool.name })}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
            {introParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            {/* Why this one runs on your device. Nested surface for emphasis —
                no single-edge accent rules. */}
            {content.whyClientSide && (
              <div
                className="rounded-lg bg-muted/50 p-4"
                data-testid="tool-seo-why-client-side"
              >
                <h3 className="mb-1.5 text-sm font-medium text-foreground">
                  {t("whyClientSideTitle")}
                </h3>
                <p>{content.whyClientSide}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How to use (steps) */}
        {content.steps && content.steps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ListChecksIcon className="size-5 shrink-0 text-muted-foreground" />
                {t("howToTitle", { tool: tool.name })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="flex list-decimal flex-col gap-2 ps-5 text-sm text-muted-foreground marker:text-muted-foreground/70">
                {content.steps.map((step, i) => (
                  <li key={i} className="ps-1">
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Limitations — prose only, never structured data. */}
        {content.limitations && content.limitations.length > 0 && (
          <Card data-testid="tool-seo-limitations">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ScaleIcon className="size-5 shrink-0 text-muted-foreground" />
                {t("limitationsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex list-disc flex-col gap-2 ps-5 text-sm leading-relaxed text-muted-foreground marker:text-muted-foreground/70">
                {content.limitations.map((item, i) => (
                  <li key={i} className="ps-1">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* FAQ */}
        {content.faq.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <HelpCircleIcon className="size-5 shrink-0 text-muted-foreground" />
                {t("faqTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SeoFaq faq={content.faq} />
            </CardContent>
          </Card>
        )}

        {/* Related tools — internal links */}
        {related.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t("relatedTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {related.map((rel) => {
                  const Icon = rel.icon;
                  return (
                    <li key={rel.href}>
                      <Link
                        href={rel.href}
                        className="group flex items-center gap-3 rounded-lg border bg-card p-3 text-sm transition-colors hover:bg-accent"
                      >
                        <Icon className="size-4 shrink-0 text-muted-foreground" />
                        <span className="flex-1 font-medium">{rel.name}</span>
                        <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 rtl:rotate-180" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
