"use client";

import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRightIcon, HelpCircleIcon, ListChecksIcon } from "lucide-react";

import { findToolByHref, getAllTools } from "@/lib/tools-config";
import {
  buildFallbackContent,
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
}

function resolveTool(pathname: string): ResolvedTool | null {
  // pathname looks like /tools/<slug> (ignore trailing slash / nested)
  const match = pathname.match(/^\/tools\/([^/]+)/);
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
  };
}

function buildJsonLd(
  tool: ResolvedTool,
  content: ToolContentLocale
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

  // 3) FAQPage — from the FAQ content.
  if (content.faq.length > 0) {
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
  const locale = (useLocale() as "en" | "ar") || "en";
  const t = useTranslations("ToolSeo");

  const tool = resolveTool(pathname);
  if (!tool) return null;

  // Bespoke content if present, otherwise templated (non-fabricated) fallback.
  const bespoke = toolContent[tool.slug];
  const content: ToolContentLocale = bespoke
    ? bespoke[locale]
    : buildFallbackContent(
        {
          name: tool.name,
          description: tool.description,
          category: tool.category,
        },
        locale
      );

  const jsonLd = buildJsonLd(tool, content);

  // Related tools (only those that exist & are available).
  const relatedSlugs = bespoke?.related ?? [];
  const allTools = getAllTools();
  const related = relatedSlugs
    .map((slug) => allTools.find((tl) => tl.href === `/tools/${slug}`))
    .filter((tl): tl is NonNullable<typeof tl> => Boolean(tl && tl.available));

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
