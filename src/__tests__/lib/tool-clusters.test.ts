import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";

import {
  CLUSTERS_BASE_PATH,
  CLUSTER_IDS,
  TOOL_CLUSTERS,
  findClusterProblems,
  getCluster,
  isClusterId,
  resolveClusterMembers,
  type ClusterId,
} from "@/lib/tool-clusters";
import { getAllTools } from "@/lib/tools-config";
import { clusterContent, getClusterProse, hasNativeProse } from "@/lib/cluster-content";
import { localeCodes } from "@/lib/locales";

const availableSlugs = new Set(
  getAllTools()
    .filter((tool) => tool.available)
    .map((tool) => tool.href.replace(/^\/tools\//, "")),
);

describe("tool clusters — registry integrity", () => {
  it("reports no structural problems", () => {
    expect(findClusterProblems()).toEqual([]);
  });

  it("defines exactly one cluster per id", () => {
    expect(TOOL_CLUSTERS.map((c) => c.id).sort()).toEqual([...CLUSTER_IDS].sort());
  });

  it.each(CLUSTER_IDS)("every slug in %s resolves to an available tool", (id) => {
    const cluster = getCluster(id);
    expect(cluster.slugs.length).toBeGreaterThan(0);
    for (const slug of cluster.slugs) {
      expect(availableSlugs, `${id} → /tools/${slug}`).toContain(slug);
    }
  });

  it.each(CLUSTER_IDS)("resolveClusterMembers(%s) returns live registry entries", (id) => {
    const members = resolveClusterMembers(id);
    expect(members).toHaveLength(getCluster(id).slugs.length);
    for (const member of members) {
      expect(member.href).toBe(`/tools/${member.slug}`);
      expect(member.name.length).toBeGreaterThan(0);
      expect(member.description.length).toBeGreaterThan(0);
    }
  });

  it("throws — rather than emitting a dead link — for an unknown slug", () => {
    const original = [...TOOL_CLUSTERS[0].slugs];
    const cluster = TOOL_CLUSTERS[0] as unknown as { slugs: readonly string[] };
    cluster.slugs = [...original, "definitely-not-a-real-tool"];
    try {
      expect(() => resolveClusterMembers(TOOL_CLUSTERS[0].id)).toThrow(
        /definitely-not-a-real-tool/,
      );
    } finally {
      cluster.slugs = original;
    }
  });

  it("isClusterId only accepts declared ids", () => {
    expect(isClusterId("pdf-tools")).toBe(true);
    expect(isClusterId("pdf")).toBe(false);
    expect(isClusterId(undefined)).toBe(false);
  });
});

describe("tool clusters — routes", () => {
  it.each(CLUSTER_IDS)("%s has a page.tsx at its href", (id) => {
    const cluster = getCluster(id);
    expect(cluster.href.startsWith(`${CLUSTERS_BASE_PATH}/`)).toBe(true);
    expect(existsSync(`src/app${cluster.href}/page.tsx`)).toBe(true);
  });

  it("is registered in the sitemap", () => {
    const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
    expect(sitemap).toContain("TOOL_CLUSTERS");
    expect(sitemap).toContain("clusterRoutes");
  });

  it("uses JsonLdScript rather than metadata.other for structured data", () => {
    const hub = readFileSync("src/components/clusters/cluster-hub.tsx", "utf8");
    expect(hub).toContain("JsonLdScript");
    expect(hub).toContain("CollectionPage");
    const metadata = readFileSync("src/lib/cluster-metadata.ts", "utf8");
    expect(metadata).not.toContain("application/ld+json");
  });
});

describe("tool clusters — prose", () => {
  it.each(CLUSTER_IDS)("%s has English and Arabic long-form copy", (id) => {
    for (const locale of ["en", "ar"] as const) {
      const prose = clusterContent[id][locale];
      expect(prose.lead.length).toBeGreaterThanOrEqual(2);
      expect(prose.sections.length).toBeGreaterThanOrEqual(3);
      expect(prose.limits.body.length).toBeGreaterThanOrEqual(2);
      for (const section of prose.sections) {
        expect(section.heading.length).toBeGreaterThan(0);
        expect(section.body.length).toBeGreaterThan(0);
      }
    }
  });

  it.each(CLUSTER_IDS)("%s has a 'when to reach for it' line for every member", (id) => {
    const slugs = getCluster(id).slugs;
    for (const locale of ["en", "ar"] as const) {
      const picks = clusterContent[id][locale].picks;
      for (const slug of slugs) {
        expect(picks[slug], `${id}/${locale} missing pick for ${slug}`).toBeTruthy();
      }
      // No orphan picks for tools that left the cluster.
      expect(Object.keys(picks).sort()).toEqual([...slugs].sort());
    }
  });

  it.each(CLUSTER_IDS)("%s prose links only to routes that exist", (id) => {
    const clusterHrefs = new Set(TOOL_CLUSTERS.map((c) => c.href));
    for (const locale of ["en", "ar"] as const) {
      const prose = clusterContent[id][locale];
      const text = [
        ...prose.lead,
        ...prose.sections.flatMap((s) => s.body),
        ...prose.limits.body,
      ].join("\n");
      for (const match of text.matchAll(/\[[^\]]+\]\((\/[^)\s]+)\)/g)) {
        const href = match[1];
        if (href.startsWith("/tools/")) {
          expect(availableSlugs, `${id}/${locale} links to ${href}`).toContain(
            href.replace("/tools/", ""),
          );
        } else {
          expect(clusterHrefs, `${id}/${locale} links to ${href}`).toContain(href);
        }
      }
    }
  });

  it("falls back to English for locales without hand-authored prose", () => {
    const id: ClusterId = "pdf-tools";
    expect(getClusterProse(id, "ar")).toBe(clusterContent[id].ar);
    expect(getClusterProse(id, "de")).toBe(clusterContent[id].en);
    expect(hasNativeProse("en")).toBe(true);
    expect(hasNativeProse("ar")).toBe(true);
    expect(hasNativeProse("de")).toBe(false);
  });

  it("does not reuse a lead paragraph between hubs", () => {
    const leads = CLUSTER_IDS.map((id) => clusterContent[id].en.lead[0]);
    expect(new Set(leads).size).toBe(leads.length);
  });
});

describe("tool clusters — i18n parity", () => {
  const flatten = (value: unknown, prefix = ""): string[] =>
    typeof value === "object" && value !== null
      ? Object.entries(value).flatMap(([key, child]) => flatten(child, `${prefix}${key}.`))
      : [prefix.slice(0, -1)];

  const namespaceFor = (locale: string) => {
    const messages = JSON.parse(readFileSync(`messages/${locale}.json`, "utf8"));
    return messages.Clusters;
  };

  const referenceKeys = flatten(namespaceFor("en")).sort();

  it("English defines the expected shape", () => {
    expect(referenceKeys.length).toBeGreaterThan(0);
    for (const id of CLUSTER_IDS) {
      for (const field of ["title", "tagline", "metaTitle", "metaDescription"]) {
        expect(referenceKeys).toContain(`names.${id}.${field}`);
      }
    }
  });

  it.each(localeCodes)("%s has the full Clusters namespace", (locale) => {
    const namespace = namespaceFor(locale);
    expect(namespace, `messages/${locale}.json has no Clusters namespace`).toBeTruthy();
    expect(flatten(namespace).sort()).toEqual(referenceKeys);
    for (const key of flatten(namespace)) {
      const value = key
        .split(".")
        .reduce<Record<string, unknown> | string>(
          (node, part) => (node as Record<string, never>)[part],
          namespace,
        );
      expect(typeof value, `${locale}.Clusters.${key}`).toBe("string");
      expect((value as string).trim().length, `${locale}.Clusters.${key}`).toBeGreaterThan(0);
    }
  });

  it("gives every hub a unique meta title and description per locale", () => {
    for (const locale of localeCodes) {
      const names = namespaceFor(locale).names as Record<string, Record<string, string>>;
      const titles = CLUSTER_IDS.map((id) => names[id].metaTitle);
      const descriptions = CLUSTER_IDS.map((id) => names[id].metaDescription);
      expect(new Set(titles).size, `${locale} meta titles`).toBe(titles.length);
      expect(new Set(descriptions).size, `${locale} meta descriptions`).toBe(descriptions.length);
    }
  });
});
