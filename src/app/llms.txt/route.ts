import { tools, type Tool } from "@/lib/tools-config";
import { blogPosts } from "@/lib/blog-data";
import { CLUSTERS_BASE_PATH, TOOL_CLUSTERS, resolveClusterMembers } from "@/lib/tool-clusters";
import { touchesNetwork, dataProfileFor } from "@/lib/llms-data-profile";

// /llms.txt — concise, machine-readable index of the site for LLM/AI crawlers,
// following the https://llmstxt.org convention. Generated from the same config
// that powers the UI (tools-config, tool-clusters, blog-data) so it never
// drifts out of sync with what actually ships.
//
// Statically rendered at build time (no request-time work, no backend).
export const dynamic = "force-static";

const BASE_URL = "https://browserytools.com";

/**
 * The public tool set in on-page category order: available, and excluding
 * `landingFor` SEO variants (the same definition `scripts/validate-tools.js`
 * uses for "tools in config" — 152 as of this writing, not the 176 route
 * directories, which also count per-variant landing pages).
 */
function listedTools(): (Tool & { category: string })[] {
  const sortedCategories = [...tools].sort((a, b) => a.order - b.order);
  return sortedCategories.flatMap((category) =>
    category.items
      .filter((t) => t.available && !t.landingFor)
      .sort((a, b) => a.order - b.order)
      .map((t) => ({ ...t, category: category.category })),
  );
}

function buildLlmsTxt(): string {
  const lines: string[] = [];
  const catalog = listedTools();
  const networkToolCount = catalog.filter((t) =>
    touchesNetwork(dataProfileFor(t.href.replace(/^\/tools\//, ""))),
  ).length;

  lines.push("# BrowseryTools");
  lines.push("");
  lines.push(
    `> Free, fast, privacy-first browser tools. ${catalog.length} tools for image, video, audio, text, developer, AI, calculator, and everyday-utility tasks — no sign-up, nothing to install.`,
  );
  lines.push("");
  lines.push(
    `For the great majority of these tools your file or text content is processed on your device with standard Web APIs (Canvas, WebAssembly, Web Crypto, File System Access) and is never uploaded. A subset of tools (mostly ones built on in-browser AI models) download model weights from a third-party CDN the first time you use them, then run on-device after that — your content still isn't uploaded, but that first download is a network request. A small, named set of tools (currently ${networkToolCount}) genuinely send something over the network as part of what they do: Live Dictation uses the browser's own Speech Recognition API, which sends your audio to the browser vendor (Chrome/Edge) to produce a transcript, and Currency Converter fetches live exchange rates from an external API. See /llms-full.txt for the exact classification of every tool. There is no service worker, so no page here works fully offline.`,
  );
  lines.push("");
  lines.push("The site is also available in Arabic, Spanish, Portuguese (BR), French, German, Russian, Indonesian, and Simplified Chinese.");
  lines.push("");

  // Cluster hubs — cross-category collections, the best entry point for a
  // category-level question ("what PDF tools do you have").
  lines.push("## Collections");
  lines.push("");
  for (const cluster of TOOL_CLUSTERS) {
    const members = resolveClusterMembers(cluster.id);
    lines.push(
      `- [${cluster.id.replace(/-/g, " ")}](${BASE_URL}${cluster.href}): ${members.length} tools — ${members.map((m) => m.name).join(", ")}`,
    );
  }
  lines.push("");
  lines.push(
    `Collections live under ${CLUSTERS_BASE_PATH}/ and group tools by what someone would search for rather than by homepage category.`,
  );
  lines.push("");

  // NOTE: comparison pages (/alternatives/*, src/lib/comparisons.ts) land on a
  // separate branch. Once merged, add an "## Alternatives to" section here the
  // same way as Collections above — import COMPARISONS, one bullet per entry.

  // Tools grouped by category, in on-page order.
  const categoryOrder = [...new Set(catalog.map((t) => t.category))];
  for (const categoryName of categoryOrder) {
    const inCategory = catalog.filter((t) => t.category === categoryName);

    lines.push(`## ${categoryName}`);
    lines.push("");
    for (const tool of inCategory) {
      const slug = tool.href.replace(/^\/tools\//, "");
      const profile = dataProfileFor(slug);
      const suffix =
        profile === "model-download"
          ? " [downloads an AI model from a CDN on first use, then runs on-device]"
          : profile === "remote-processing"
            ? " [sends data to a third-party service — not fully on-device]"
            : profile === "remote-data"
              ? " [fetches data from an external API]"
              : "";
      lines.push(`- [${tool.name}](${BASE_URL}${tool.href}): ${tool.description}${suffix}`);
    }
    lines.push("");
  }

  // Blog posts, newest first.
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  if (sortedPosts.length > 0) {
    lines.push("## Blog");
    lines.push("");
    for (const post of sortedPosts) {
      lines.push(
        `- [${post.title}](${BASE_URL}/blog/${post.slug}): ${post.description}`,
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
