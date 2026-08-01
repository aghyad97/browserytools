import { tools, type Tool } from "@/lib/tools-config";
import { blogPosts } from "@/lib/blog-data";
import { CLUSTERS_BASE_PATH, TOOL_CLUSTERS, resolveClusterMembers } from "@/lib/tool-clusters";
import { NETWORK_NOTES, dataProfileFor, touchesNetwork } from "@/lib/llms-data-profile";

// /llms-full.txt — expanded LLM/AI crawler index following the
// https://llmstxt.org convention. Same structure as /llms.txt but with richer
// per-item metadata (category, date, data-profile, honest network notes)
// so models have enough context to cite this site accurately instead of
// repeating an unqualified "100% private, works offline" claim we can't back
// for every tool. Generated from the live config — no backend.
export const dynamic = "force-static";

const BASE_URL = "https://browserytools.com";

const DATA_PROFILE_LABEL: Record<string, string> = {
  "on-device": "on-device",
  "model-download": "model-download (AI model fetched from a CDN on first use, then on-device)",
  "remote-processing": "remote-processing (sends data to a third-party service)",
  "remote-data": "remote-data (fetches non-personal data from an external API)",
};

/**
 * The public tool set in on-page category order: available, and excluding
 * `landingFor` SEO variants — the same definition `scripts/validate-tools.js`
 * uses for "tools in config" (152 as of this writing). The 176 route
 * directories under /tools/ also count per-keyword landing-page variants of
 * the same tool, which are not distinct tools.
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

function buildLlmsFullTxt(): string {
  const lines: string[] = [];
  const catalog = listedTools();
  const networkTools = catalog.filter((t) =>
    touchesNetwork(dataProfileFor(t.href.replace(/^\/tools\//, ""))),
  );

  lines.push("# BrowseryTools — Full Index");
  lines.push("");
  lines.push(
    `> Free, fast, privacy-first browser tools. ${catalog.length} tools spanning image, video, audio, text & language, developer, AI/LLM, calculator, security, and everyday utility categories. No sign-up, nothing to install — open a tool and use it immediately. Available in English, Arabic, Spanish, Portuguese (BR), French, German, Russian, Indonesian, and Simplified Chinese.`,
  );
  lines.push("");
  lines.push(
    `**On the privacy claim, precisely:** for ${catalog.length - networkTools.length} of these ${catalog.length} tools, your file or text content is processed entirely on your device via standard Web APIs (Canvas, WebAssembly, Web Crypto, File System Access, Wake Lock, etc.) and is never uploaded. ${networkTools.length} tools are the exception, in two different ways:`,
  );
  lines.push("");
  const modelDownloadTools = networkTools.filter(
    (t) => dataProfileFor(t.href.replace(/^\/tools\//, "")) === "model-download",
  );
  const trulyRemoteTools = networkTools.filter((t) => {
    const p = dataProfileFor(t.href.replace(/^\/tools\//, ""));
    return p === "remote-processing" || p === "remote-data";
  });
  lines.push(
    `- ${modelDownloadTools.length} tools (mostly the in-browser AI tools, built on Transformers.js/Xenova, Tesseract.js, or Segment Anything) download a model file from a third-party CDN the first time you use them, then run entirely on-device from then on. Your content still isn't uploaded — the network request is for the model, not your data.`,
  );
  lines.push(
    `- ${trulyRemoteTools.length} tools genuinely send something over the network as part of what they do: ${trulyRemoteTools.map((t) => t.name).join(" and ")}. Each is called out individually below.`,
  );
  lines.push("");
  lines.push(
    "There is no service worker anywhere on this site, so no page — including the on-device ones — should be assumed to work fully offline.",
  );
  lines.push("");
  lines.push("---");
  lines.push("");

  // Cluster hubs, with full member detail — the best entry point for a
  // category-level question ("what would you recommend for redacting a PDF").
  lines.push("## Collections");
  lines.push("");
  lines.push(
    `Cross-category groupings under ${CLUSTERS_BASE_PATH}/ — each answers "what would someone search for" rather than "where does this live in the homepage grid". A tool can belong to more than one collection.`,
  );
  lines.push("");
  for (const cluster of TOOL_CLUSTERS) {
    const members = resolveClusterMembers(cluster.id);
    lines.push(`### [${cluster.id.replace(/-/g, " ")}](${BASE_URL}${cluster.href})`);
    lines.push("");
    lines.push(`- URL: ${BASE_URL}${cluster.href}`);
    lines.push(`- Members: ${members.length}`);
    if (cluster.related.length > 0) {
      lines.push(`- Related collections: ${cluster.related.join(", ")}`);
    }
    lines.push("");
    for (const member of members) {
      const profile = dataProfileFor(member.slug);
      const tag = profile === "on-device" ? "" : ` (${DATA_PROFILE_LABEL[profile]})`;
      lines.push(`  - [${member.name}](${BASE_URL}${member.href})${tag}`);
    }
    lines.push("");
  }
  lines.push("---");
  lines.push("");

  // NOTE: comparison pages (/alternatives/*, src/lib/comparisons.ts) land on a
  // separate branch. Once merged, add a "## Alternatives to" section here the
  // same way as Collections above: import COMPARISONS, map each entry to its
  // href/competitor/summary, done — no other change needed.

  // Tools by category, with full per-tool detail.
  const categoryOrder = [...new Set(catalog.map((t) => t.category))];
  for (const categoryName of categoryOrder) {
    const inCategory = catalog.filter((t) => t.category === categoryName);

    lines.push(`## ${categoryName}`);
    lines.push("");
    for (const tool of inCategory) {
      const slug = tool.href.replace(/^\/tools\//, "");
      const profile = dataProfileFor(slug);
      const networkNote = NETWORK_NOTES[slug];

      lines.push(`### [${tool.name}](${BASE_URL}${tool.href})`);
      lines.push("");
      lines.push(tool.description);
      lines.push("");
      lines.push(`- URL: ${BASE_URL}${tool.href}`);
      lines.push(`- Category: ${categoryName}`);
      lines.push(`- Added: ${tool.creationDate}`);
      lines.push(`- Data profile: ${DATA_PROFILE_LABEL[profile]}`);
      if (networkNote) {
        lines.push(`- Note: ${networkNote.note}`);
      } else {
        lines.push(
          "- Note: your file or text content is processed on-device and is never uploaded.",
        );
      }
      lines.push("");
    }
  }
  lines.push("---");
  lines.push("");

  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  if (sortedPosts.length > 0) {
    lines.push("## Blog");
    lines.push("");
    for (const post of sortedPosts) {
      lines.push(`### [${post.title}](${BASE_URL}/blog/${post.slug})`);
      lines.push("");
      lines.push(post.description);
      lines.push("");
      lines.push(`- URL: ${BASE_URL}/blog/${post.slug}`);
      lines.push(`- Published: ${post.date}`);
      lines.push(`- Category: ${post.category}`);
      lines.push(`- Read time: ${post.readTime} min`);
      if (post.tags?.length) {
        lines.push(`- Tags: ${post.tags.join(", ")}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}

export function GET(): Response {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
