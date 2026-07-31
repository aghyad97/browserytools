import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";

import { JsonLdScript } from "@/components/JsonLdScript";
import { RichParagraph } from "@/components/clusters/rich-text";
import {
  formatToolCount,
  getClusterChrome,
  getRequestLocale,
  type ClusterChrome,
} from "@/lib/cluster-chrome";
import { getClusterProse, hasNativeProse } from "@/lib/cluster-content";
import { getDir } from "@/lib/locales";
import {
  getCluster,
  resolveClusterMembers,
  type ClusterId,
  type ClusterMember,
} from "@/lib/tool-clusters";

const BASE_URL = "https://browserytools.com";

function buildJsonLd({
  id,
  url,
  chrome,
  members,
  locale,
}: {
  id: ClusterId;
  url: string;
  chrome: ClusterChrome;
  members: ClusterMember[];
  locale: string;
}): Record<string, unknown> {
  const name = chrome.names[id];
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url,
    url,
    name: name.title,
    description: name.tagline,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "BrowseryTools",
      url: BASE_URL,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: chrome.allToolsLink, item: BASE_URL },
        { "@type": "ListItem", position: 2, name: name.title, item: url },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      name: name.title,
      numberOfItems: members.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: members.map((member, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${BASE_URL}${member.href}`,
        item: {
          "@type": "SoftwareApplication",
          name: member.name,
          url: `${BASE_URL}${member.href}`,
          description: member.description,
          applicationCategory: "WebApplication",
          operatingSystem: "Any (web browser)",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
      })),
    },
  };
}

/**
 * A cluster hub page.
 *
 * Rendered entirely on the server so the prose is present in the raw HTML —
 * that is the whole point of these pages, and it is why nothing here is a
 * client component and nothing here is interactive.
 */
export async function ClusterHub({ id }: { id: ClusterId }) {
  const locale = await getRequestLocale();
  const chrome = await getClusterChrome(locale);
  const cluster = getCluster(id);
  // Throws — and so fails the build — if a slug no longer resolves.
  const members = resolveClusterMembers(id);
  const prose = getClusterProse(id, locale);
  const name = chrome.names[id];
  const url = `${BASE_URL}${cluster.href}`;
  const isRtl = getDir(locale) === "rtl";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      <JsonLdScript data={buildJsonLd({ id, url, chrome, members, locale })} />

      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          {chrome.allToolsLink}
        </Link>
        <span className="px-2 text-muted-foreground/50" aria-hidden="true">
          {isRtl ? "‹" : "›"}
        </span>
        <span className="text-foreground">{name.title}</span>
      </nav>

      <header className="mb-12">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {chrome.collectionLabel}
          <span className="px-2 text-muted-foreground/50" aria-hidden="true">
            ·
          </span>
          {formatToolCount(chrome.toolCount, members.length)}
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {name.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{name.tagline}</p>
      </header>

      {!hasNativeProse(locale) && (
        <p className="mb-10 rounded-[11px] border bg-muted/40 px-5 py-3 text-sm text-muted-foreground">
          {chrome.englishFallbackNote}
        </p>
      )}

      <div className="space-y-5 text-[15px] leading-[1.75] text-foreground/90">
        {prose.lead.map((paragraph, index) => (
          <RichParagraph key={`lead-${index}`} text={paragraph} />
        ))}
      </div>

      {prose.sections.map((section, sectionIndex) => (
        <section key={`section-${sectionIndex}`} className="mt-12">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">{section.heading}</h2>
          <div className="space-y-5 text-[15px] leading-[1.75] text-foreground/90">
            {section.body.map((paragraph, index) => (
              <RichParagraph key={`p-${index}`} text={paragraph} />
            ))}
          </div>
        </section>
      ))}

      <section className="mt-14">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">{prose.picksHeading}</h2>
        <p className="mb-6 text-[15px] leading-[1.75] text-muted-foreground">{prose.picksLead}</p>

        <ul className="space-y-2">
          {members.map((member) => (
            <li key={member.slug}>
              <Link
                href={member.href}
                className="group flex items-start gap-4 rounded-[11px] border bg-card px-5 py-4 transition-colors hover:bg-muted/50"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-medium text-foreground">{member.name}</span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {member.category}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                    {prose.picks[member.slug] ?? member.description}
                  </span>
                </span>
                <ArrowRightIcon
                  aria-hidden="true"
                  className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:text-foreground ${
                    isRtl ? "rotate-180 group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"
                  }`}
                />
                <span className="sr-only">{chrome.openTool}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded-[11px] border bg-muted/40 px-6 py-6">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">{prose.limits.heading}</h2>
        <div className="space-y-4 text-[15px] leading-[1.75] text-foreground/85">
          {prose.limits.body.map((paragraph, index) => (
            <RichParagraph key={`limit-${index}`} text={paragraph} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">{chrome.relatedHeading}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {cluster.related.map((relatedId) => (
            <li key={relatedId}>
              <Link
                href={getCluster(relatedId).href}
                className="group flex h-full flex-col rounded-[11px] border bg-card px-5 py-4 transition-colors hover:bg-muted/50"
              >
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  {chrome.names[relatedId].title}
                  <ArrowUpRightIcon
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-muted-foreground/60 transition-colors group-hover:text-foreground"
                  />
                </span>
                <span className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {chrome.names[relatedId].tagline}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
