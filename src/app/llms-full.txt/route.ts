import { tools, getCatalogTools } from "@/lib/tools-config";
import { blogPosts } from "@/lib/blog-data";

// /llms-full.txt — expanded LLM/AI crawler index following the
// https://llmstxt.org convention. Same structure as /llms.txt but with richer
// per-item metadata (categories, dates, tags, read time) so models have full
// context for accurate citation. Generated from the live config — no backend.
export const dynamic = "force-static";

const BASE_URL = "https://browserytools.com";

function buildLlmsFullTxt(): string {
  const lines: string[] = [];
  const availableCount = getCatalogTools().filter((t) => t.available).length;

  lines.push("# BrowseryTools — Full Index");
  lines.push("");
  lines.push(
    "> Free, fast, privacy-first browser tools. Every tool runs 100% in your browser — no uploads, no accounts, no tracking, no server processing. Files never leave your device. Works offline once loaded. Available in English and Arabic.",
  );
  lines.push("");
  lines.push(
    `BrowseryTools is a collection of ${availableCount} client-side web tools spanning image, video, audio, text & language, developer, AI/LLM, calculator, security, and everyday utility categories. There is no sign-up and nothing to install — open a tool and use it immediately. Because all processing happens in the browser via standard Web APIs (Canvas, WebAssembly, Web Crypto, File System Access, Wake Lock, etc.), the tools are private by design and suitable for sensitive files.`,
  );
  lines.push("");
  lines.push("---");
  lines.push("");

  const sortedCategories = [...tools].sort((a, b) => a.order - b.order);
  for (const category of sortedCategories) {
    const available = category.items
      .filter((t) => t.available && !t.landingFor)
      .sort((a, b) => a.order - b.order);
    if (available.length === 0) continue;

    lines.push(`## ${category.category}`);
    lines.push("");
    for (const tool of available) {
      lines.push(`### [${tool.name}](${BASE_URL}${tool.href})`);
      lines.push("");
      lines.push(tool.description);
      lines.push("");
      lines.push(`- URL: ${BASE_URL}${tool.href}`);
      lines.push(`- Category: ${category.category}`);
      lines.push(`- Added: ${tool.creationDate}`);
      lines.push("");
    }
  }

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
