import { tools } from "@/lib/tools-config";
import { blogPosts } from "@/lib/blog-data";

// /llms.txt — concise, machine-readable index of the site for LLM/AI crawlers,
// following the https://llmstxt.org convention. Generated from the same config
// that powers the UI so it never drifts out of sync.
//
// Statically rendered at build time (no request-time work, no backend).
export const dynamic = "force-static";

const BASE_URL = "https://browserytools.com";

function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push("# BrowseryTools");
  lines.push("");
  lines.push(
    "> Free, fast, privacy-first browser tools. Every tool runs 100% in your browser — no uploads, no accounts, no tracking. Image, video, audio, text, developer, AI, calculator, and utility tools that work offline once loaded.",
  );
  lines.push("");
  lines.push(
    "All tools are client-side: files never leave your device. The site is also available in English and Arabic.",
  );
  lines.push("");

  // Tools grouped by category, only available ones.
  const sortedCategories = [...tools].sort((a, b) => a.order - b.order);
  for (const category of sortedCategories) {
    const available = category.items
      .filter((t) => t.available)
      .sort((a, b) => a.order - b.order);
    if (available.length === 0) continue;

    lines.push(`## ${category.category}`);
    lines.push("");
    for (const tool of available) {
      lines.push(
        `- [${tool.name}](${BASE_URL}${tool.href}): ${tool.description}`,
      );
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
