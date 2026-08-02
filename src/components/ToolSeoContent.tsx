"use client";

import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import {
  ArrowRightIcon,
  HelpCircleIcon,
  ListChecksIcon,
  ScaleIcon,
} from "lucide-react";

import { findToolByHref, getAllTools, tools } from "@/lib/tools-config";
import { isLocale, type Locale } from "@/lib/locales";
import {
  buildFallbackContent,
  getToolDataProfile,
  hasFallbackProse,
  toolContent,
  type ToolContentLocale,
} from "@/lib/tool-content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonLdScript } from "@/components/JsonLdScript";

const BASE_URL = "https://browserytools.com";

// Turn a slug like "svg-png" into a human label "Svg Png" as a last-resort name
// when a tool isn't present in tools-config.
function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

interface ResolvedTool {
  slug: string;
  href: string;
  name: string;
  description: string;
  category: string;
  /** Message-file key for the category label, when the tool is catalogued. */
  categoryId: string | null;
}

// tools-config stores the English category label on each flattened tool, but
// the translated labels are keyed by category id. Map href -> id once.
const CATEGORY_ID_BY_HREF = new Map<string, string>(
  tools.flatMap((cat) =>
    cat.items.map((tool) => [tool.href, cat.id] as [string, string])
  )
);

function resolveTool(pathname: string): ResolvedTool | null {
  // pathname looks like /tools/<slug>, or /<locale>/tools/<slug> on the
  // locale-prefixed routes (ignore trailing slash / nested).
  const match = pathname.match(/^(?:\/[a-z]{2}(?:-[A-Za-z]{2,4})?)?\/tools\/([^/]+)/);
  if (!match) return null;
  const slug = match[1];
  const href = `/tools/${slug}`;

  const tool = findToolByHref(href);
  if (tool) {
    return {
      slug,
      href,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      categoryId: CATEGORY_ID_BY_HREF.get(href) ?? null,
    };
  }

  // Not in tools-config (e.g. very new tools): degrade gracefully with a
  // humanized name and a neutral category. No fabricated specifics.
  return {
    slug,
    href,
    name: humanizeSlug(slug),
    description: "",
    category: "Browser Tools",
    categoryId: null,
  };
}

// NOTE: `content.limitations` is deliberately NOT represented in any JSON-LD
// graph below. It is honest on-page prose for readers, not a structured claim,
// and schema.org has no honest type for it. Keep it that way.
//
// `isBespoke` gates FAQPage. Templated fallback questions are not evidence that
// anyone frequently asks them about that specific tool, so asserting them as
// structured FAQ data would be a claim we can't support. The prose still renders.
function buildJsonLd(
  tool: ResolvedTool,
  content: ToolContentLocale,
  isBespoke: boolean
): Record<string, unknown>[] {
  const toolUrl = `${BASE_URL}${tool.href}`;
  const graphs: Record<string, unknown>[] = [];

  // 1) SoftwareApplication — no fake ratings/reviews.
  graphs.push({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description || content.intro.split("\n\n")[0],
    url: toolUrl,
    applicationCategory: tool.category,
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    publisher: {
      "@type": "Organization",
      name: "BrowseryTools",
      url: BASE_URL,
    },
  });

  // 2) BreadcrumbList — Home > Category > Tool.
  graphs.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.category,
        item: `${BASE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: toolUrl,
      },
    ],
  });

  // 3) FAQPage — hand-authored FAQ only.
  if (isBespoke && content.faq.length > 0) {
    graphs.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    });
  }

  // 4) HowTo — only when steps exist.
  if (content.steps && content.steps.length > 0) {
    graphs.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `How to use ${tool.name}`,
      step: content.steps.map((step, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        text: step,
      })),
    });
  }

  return graphs;
}

export default function ToolSeoContent() {
  const pathname = usePathname() || "";
  // The SEO locale is whatever the locale registry recognises — the templated
  // fallback has hand-written prose for every code in it. (The bespoke registry
  // `toolContent` is still en/ar; see the content selection below.)
  const locale = useLocale();
  const seoLocale: Locale = isLocale(locale) ? locale : "en";
  const t = useTranslations("ToolSeo");
  const tc = useTranslations("ToolsConfig");

  const resolved = resolveTool(pathname);
  if (!resolved) return null;

  // On a locale-prefixed URL, only render this block when we can write it in
  // that language. English copy under /es/ or /fr/ would be duplicate content
  // on a page that exists precisely to be a distinct localized URL — better to
  // render nothing than the wrong language. Every registered locale has prose
  // today, so this suppresses nothing; it stays as the guard for the next
  // language that ships before its copy does.
  const isLocalePrefixed = /^\/[a-z]{2}(-[A-Za-z]{2,4})?\//.test(pathname);
  if (isLocalePrefixed && !hasFallbackProse(seoLocale)) return null;

  // tools-config is the English build-time source of truth (routes, metadata,
  // validation). The catalogue's display strings live in the message files, so
  // take the name / description / category label from there and fall back to
  // the config for anything not yet translated.
  const nameKey = `tools.${resolved.slug}.name` as never;
  const descKey = `tools.${resolved.slug}.description` as never;
  const catKey = resolved.categoryId
    ? (`categories.${resolved.categoryId}` as never)
    : null;
  const tool: ResolvedTool = {
    ...resolved,
    name: tc.has(nameKey) ? (tc(nameKey) as string) : resolved.name,
    description: tc.has(descKey)
      ? (tc(descKey) as string)
      : resolved.description,
    category: catKey && tc.has(catKey) ? (tc(catKey) as string) : resolved.category,
  };

  // Bespoke content only when it exists IN THIS LANGUAGE — the hand-authored
  // registry is still en/ar. For every other locale the templated fallback is
  // both accurate and correctly localized, which beats English bespoke prose
  // under a non-English URL.
  const bespoke = toolContent[tool.slug];
  const authored =
    seoLocale === "en"
      ? bespoke?.en
      : seoLocale === "ar"
        ? bespoke?.ar
        : undefined;
  const content: ToolContentLocale =
    authored ??
    buildFallbackContent(
      {
        name: tool.name,
        description: tool.description,
        category: tool.category,
        // The fallback may only make the privacy claim the tool has earned.
        dataProfile: getToolDataProfile(tool.slug),
      },
      seoLocale
    );

  const jsonLd = buildJsonLd(tool, content, Boolean(authored));

  // Related tools (only those that exist & are available).
  const relatedSlugs = bespoke?.related ?? [];
  const allTools = getAllTools();
  const related = relatedSlugs
    .map((slug) => allTools.find((tl) => tl.href === `/tools/${slug}`))
    .filter((tl): tl is NonNullable<typeof tl> => Boolean(tl && tl.available))
    .map((tl) => {
      const key = `tools.${tl.href.split("/").pop()}.name` as never;
      return { ...tl, name: tc.has(key) ? (tc(key) as string) : tl.name };
    });

  const introParagraphs = content.intro
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section
      aria-label={t("sectionLabel")}
      className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10"
      data-testid="tool-seo-content"
    >
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
              <Accordion type="single" collapsible className="w-full">
                {content.faq.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="last:border-b-0"
                  >
                    <AccordionTrigger className="text-start">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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
