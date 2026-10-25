import "server-only";

import { findToolByHref, getAllTools, tools } from "@/lib/tools-config";
import type { Locale } from "@/lib/locales";
import {
  buildFallbackContent,
  getToolDataProfile,
  hasFallbackProse,
  toolContent,
  type ToolContentLocale,
} from "@/lib/tool-content";

const BASE_URL = "https://browserytools.com";

// Turn a slug like "svg-png" into a human label "Svg Png" as a last-resort name
// when a tool isn't present in tools-config.
export function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export interface ResolvedTool {
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
export const CATEGORY_ID_BY_HREF = new Map<string, string>(
  tools.flatMap((cat) =>
    cat.items.map((tool) => [tool.href, cat.id] as [string, string])
  )
);

export function resolveTool(pathname: string): ResolvedTool | null {
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
export function buildJsonLd(
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

/** The slice of a next-intl translator the catalogue lookups need. */
export interface CatalogueTranslator {
  (key: never): string;
  has(key: never): boolean;
}

export interface RelatedTool {
  href: string;
  name: string;
  icon: (typeof tools)[number]["items"][number]["icon"];
}

export interface SeoBlock {
  tool: ResolvedTool;
  content: ToolContentLocale;
  /** True only when `content` is hand-authored in this locale (gates FAQPage). */
  isBespoke: boolean;
  jsonLd: Record<string, unknown>[];
  related: RelatedTool[];
}

/**
 * Everything the SEO block renders, resolved from a public pathname and the
 * request locale. Returns null when there is nothing honest to render: not a
 * tool path, or a locale-prefixed URL in a language we have no prose for.
 */
export function resolveSeoBlock({
  pathname,
  locale,
  tc,
}: {
  pathname: string;
  locale: Locale;
  /** `ToolsConfig` translator; omit to use the English tools-config strings. */
  tc?: CatalogueTranslator;
}): SeoBlock | null {
  const resolved = resolveTool(pathname);
  if (!resolved) return null;

  // On a locale-prefixed URL, only render this block when we can write it in
  // that language. English copy under /es/ or /fr/ would be duplicate content
  // on a page that exists precisely to be a distinct localized URL — better to
  // render nothing than the wrong language. Every registered locale has prose
  // today, so this suppresses nothing; it stays as the guard for the next
  // language that ships before its copy does.
  const isLocalePrefixed = /^\/[a-z]{2}(-[A-Za-z]{2,4})?\//.test(pathname);
  if (isLocalePrefixed && !hasFallbackProse(locale)) return null;

  // tools-config is the English build-time source of truth (routes, metadata,
  // validation). The catalogue's display strings live in the message files, so
  // take the name / description / category label from there and fall back to
  // the config for anything not yet translated.
  const lookup = (key: string, fallback: string): string =>
    tc && tc.has(key as never) ? tc(key as never) : fallback;
  const tool: ResolvedTool = {
    ...resolved,
    name: lookup(`tools.${resolved.slug}.name`, resolved.name),
    description: lookup(
      `tools.${resolved.slug}.description`,
      resolved.description
    ),
    category: resolved.categoryId
      ? lookup(`categories.${resolved.categoryId}`, resolved.category)
      : resolved.category,
  };

  // Bespoke content only when it exists IN THIS LANGUAGE — en/ar are always
  // authored; other locales only where a tool carries an `extra` entry. Every
  // other case gets the templated fallback, which is accurate and correctly
  // localized, and beats English bespoke prose under a non-English URL.
  const bespoke = toolContent[tool.slug];
  const authored =
    locale === "en"
      ? bespoke?.en
      : locale === "ar"
        ? bespoke?.ar
        : bespoke?.extra?.[locale];
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
      locale
    );
  const isBespoke = Boolean(authored);

  // Related tools (only those that exist & are available).
  const allTools = getAllTools();
  const related: RelatedTool[] = (bespoke?.related ?? [])
    .map((slug) => allTools.find((tl) => tl.href === `/tools/${slug}`))
    .filter((tl): tl is NonNullable<typeof tl> => Boolean(tl && tl.available))
    .map((tl) => ({
      href: tl.href,
      icon: tl.icon,
      name: lookup(`tools.${tl.href.split("/").pop()}.name`, tl.name),
    }));

  return {
    tool,
    content,
    isBespoke,
    jsonLd: buildJsonLd(tool, content, isBespoke),
    related,
  };
}
