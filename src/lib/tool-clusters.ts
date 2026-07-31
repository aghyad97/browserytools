// ──────────────────────────────────────────────────────────────────────────────
// Tool clusters — the membership registry behind the /collections/* hub pages.
//
// A cluster is a hand-curated grouping that cuts ACROSS the homepage categories
// in `tools-config.ts`. "PDF tools" spans File Tools and Text & Language Tools;
// "privacy-first" spans Security, Image and File. Categories answer "where does
// this tile live in the grid"; clusters answer "what would someone search for".
//
// Membership is stored here — deliberately NOT in `tools-config.ts` — for two
// reasons: that file is parsed by `scripts/validate-tools.js` with a regex whose
// `items` capture stops at the first `]`, so an extra array field inside a tool
// entry silently truncates the parse; and clusters are an editorial concern that
// should not bloat the per-tool records every page in the site imports.
//
// Slugs are validated against the registry by `resolveClusterMembers`, which
// THROWS on an unknown or unavailable slug. Hub pages call it at render time, so
// a renamed tool slug breaks the build rather than shipping a dead link. The
// same invariant is asserted in `src/__tests__/lib/tool-clusters.test.ts`.
// ──────────────────────────────────────────────────────────────────────────────

import { getAllTools } from "./tools-config";

export const CLUSTER_IDS = [
  "ai-developer-tools",
  "privacy-first-tools",
  "pdf-tools",
  "image-tools",
  "on-device-ai",
] as const;

export type ClusterId = (typeof CLUSTER_IDS)[number];

export interface ToolCluster {
  id: ClusterId;
  /** Route path for the hub page. */
  href: string;
  /**
   * Member tool slugs — the path segment after `/tools/`. Order is editorial:
   * the list is read top-to-bottom on the hub page, so the tool most people
   * arrive looking for goes first.
   */
  slugs: readonly string[];
  /** Clusters with genuine overlap, surfaced as cross-links on the hub page. */
  related: readonly ClusterId[];
}

/** Base path for every hub route. */
export const CLUSTERS_BASE_PATH = "/collections";

export const TOOL_CLUSTERS: readonly ToolCluster[] = [
  {
    id: "ai-developer-tools",
    href: `${CLUSTERS_BASE_PATH}/ai-developer-tools`,
    slugs: [
      "token-counter",
      "context-window",
      "ai-cost-calculator",
      "model-comparison",
      "system-prompt-builder",
      "prompt-formatter",
      "prompt-library",
      "json-schema-builder",
      "mcp-config",
      "claude-md-generator",
      "ai-rules-generator",
      "skill-builder",
      "ai-instruction-diff",
    ],
    related: ["on-device-ai", "privacy-first-tools"],
  },
  {
    id: "privacy-first-tools",
    href: `${CLUSTERS_BASE_PATH}/privacy-first-tools`,
    slugs: [
      "exif-remover",
      "exif-viewer",
      "photo-censor",
      "pii-redactor",
      "text-encryption",
      "password-generator",
      "password-strength",
      "hash-generator",
      "totp-generator",
      "jwt-decoder",
      "sign-pdf",
      "signature-maker",
      "extract-text-from-pdf",
      "image-to-text",
      "qr-scanner",
      "notepad",
    ],
    related: ["pdf-tools", "image-tools", "on-device-ai"],
  },
  {
    id: "pdf-tools",
    href: `${CLUSTERS_BASE_PATH}/pdf-tools`,
    slugs: [
      "pdf",
      "merge-pdf",
      "split-pdf",
      "reorder-pdf-pages",
      "rotate-pdf",
      "compress-pdf",
      "watermark-pdf",
      "sign-pdf",
      "extract-text-from-pdf",
      "jpg-to-pdf",
      "pdf-to-word",
      "word-to-pdf",
      "image-to-text",
    ],
    related: ["image-tools", "privacy-first-tools"],
  },
  {
    id: "image-tools",
    href: `${CLUSTERS_BASE_PATH}/image-tools`,
    slugs: [
      "image-compression",
      "image-converter",
      "image-resizer",
      "crop-image",
      "watermark-image",
      "photo-censor",
      "exif-remover",
      "exif-viewer",
      "color-correction",
      "favicon-generator",
      "svg",
      "svg-png",
      "image-color-picker",
      "screenshot-beautifier",
      "phone-mockups",
      "photo-collage",
      "meme-generator",
      "ascii-art",
    ],
    related: ["pdf-tools", "on-device-ai", "privacy-first-tools"],
  },
  {
    id: "on-device-ai",
    href: `${CLUSTERS_BASE_PATH}/on-device-ai`,
    slugs: [
      "audio-transcriber",
      "image-to-text",
      "translator",
      "text-summarizer",
      "sentiment-analyzer",
      "zero-shot-classifier",
      "pii-redactor",
      "text-to-speech",
      "image-captioner",
      "bg-removal",
      "object-cutout",
      "image-upscaler",
      "depth-map",
    ],
    related: ["ai-developer-tools", "privacy-first-tools", "image-tools"],
  },
];

const byId = new Map<ClusterId, ToolCluster>(TOOL_CLUSTERS.map((c) => [c.id, c]));

export function isClusterId(value: unknown): value is ClusterId {
  return typeof value === "string" && byId.has(value as ClusterId);
}

export function getCluster(id: ClusterId): ToolCluster {
  const cluster = byId.get(id);
  if (!cluster) throw new Error(`Unknown tool cluster: ${id}`);
  return cluster;
}

/** A cluster member, resolved against the live tool registry. */
export interface ClusterMember {
  slug: string;
  href: string;
  name: string;
  description: string;
  category: string;
}

/**
 * Resolve a cluster's slugs to live registry entries.
 *
 * Throws if a slug no longer exists or is marked unavailable. This is the
 * build-time guard: the hub pages call it during render, so a slug rename in
 * `tools-config.ts` surfaces as a hard failure instead of a 404 link.
 */
export function resolveClusterMembers(id: ClusterId): ClusterMember[] {
  const cluster = getCluster(id);
  const registry = new Map(
    getAllTools().map((tool) => [tool.href.replace(/^\/tools\//, ""), tool]),
  );

  return cluster.slugs.map((slug) => {
    const tool = registry.get(slug);
    if (!tool) {
      throw new Error(
        `Cluster "${id}" references "${slug}", which is not in tools-config.ts. ` +
          `Update src/lib/tool-clusters.ts after renaming or removing a tool.`,
      );
    }
    if (!tool.available) {
      throw new Error(
        `Cluster "${id}" references "${slug}", which is marked unavailable in tools-config.ts.`,
      );
    }
    return {
      slug,
      href: tool.href,
      name: tool.name,
      description: tool.description,
      category: tool.category,
    };
  });
}

/**
 * Non-throwing counterpart used by tests and tooling: returns a human-readable
 * problem list, empty when every cluster is sound.
 */
export function findClusterProblems(): string[] {
  const problems: string[] = [];
  const seenIds = new Set<string>();
  const seenHrefs = new Set<string>();

  for (const cluster of TOOL_CLUSTERS) {
    if (seenIds.has(cluster.id)) problems.push(`Duplicate cluster id: ${cluster.id}`);
    seenIds.add(cluster.id);

    if (seenHrefs.has(cluster.href)) problems.push(`Duplicate cluster href: ${cluster.href}`);
    seenHrefs.add(cluster.href);

    if (cluster.href !== `${CLUSTERS_BASE_PATH}/${cluster.id}`) {
      problems.push(`Cluster "${cluster.id}" href does not match its id: ${cluster.href}`);
    }
    if (cluster.slugs.length === 0) {
      problems.push(`Cluster "${cluster.id}" has no members`);
    }

    const seenSlugs = new Set<string>();
    for (const slug of cluster.slugs) {
      if (seenSlugs.has(slug)) problems.push(`Cluster "${cluster.id}" lists "${slug}" twice`);
      seenSlugs.add(slug);
    }

    for (const related of cluster.related) {
      if (related === cluster.id) problems.push(`Cluster "${cluster.id}" lists itself as related`);
      if (!byId.has(related)) {
        problems.push(`Cluster "${cluster.id}" relates to unknown cluster "${related}"`);
      }
    }

    try {
      resolveClusterMembers(cluster.id);
    } catch (error) {
      problems.push(error instanceof Error ? error.message : String(error));
    }
  }

  return problems;
}
