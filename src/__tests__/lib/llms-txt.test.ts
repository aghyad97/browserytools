import { describe, it, expect } from "vitest";

import { GET as getLlmsTxt } from "@/app/llms.txt/route";
import { GET as getLlmsFullTxt } from "@/app/llms-full.txt/route";
import { tools } from "@/lib/tools-config";
import { blogPosts } from "@/lib/blog-data";
import { TOOL_CLUSTERS, CLUSTER_IDS, resolveClusterMembers } from "@/lib/tool-clusters";
import { NETWORK_NOTES, dataProfileFor, touchesNetwork } from "@/lib/llms-data-profile";

// Same "listed tools" definition as the two route handlers: available, and
// excluding `landingFor` SEO variants — matches scripts/validate-tools.js's
// count (152 as of this writing), not the larger set of route directories.
const listedTools = tools
  .flatMap((category) => category.items.filter((t) => t.available && !t.landingFor));

async function textOf(response: Response): Promise<string> {
  return response.text();
}

describe("/llms.txt", () => {
  it("is force-static", async () => {
    const mod = await import("@/app/llms.txt/route");
    expect(mod.dynamic).toBe("force-static");
  });

  it("lists every available, non-landing tool with its URL", async () => {
    const body = await textOf(getLlmsTxt());
    for (const tool of listedTools) {
      expect(body, `missing ${tool.href}`).toContain(`https://browserytools.com${tool.href}`);
      expect(body, `missing name for ${tool.href}`).toContain(tool.name);
    }
  });

  it("lists every blog post", async () => {
    const body = await textOf(getLlmsTxt());
    for (const post of blogPosts) {
      expect(body, `missing ${post.slug}`).toContain(`/blog/${post.slug}`);
    }
  });

  it("lists all five cluster hubs", async () => {
    const body = await textOf(getLlmsTxt());
    expect(body).toContain("## Collections");
    for (const cluster of TOOL_CLUSTERS) {
      expect(body, `missing hub ${cluster.id}`).toContain(
        `https://browserytools.com${cluster.href}`,
      );
    }
  });

  it("does not open with an unqualified 'every tool runs 100% in your browser' claim", async () => {
    const body = await textOf(getLlmsTxt());
    // The old header asserted this for the whole catalogue; it wasn't true
    // for model-download / remote tools. Guard against regressing to it.
    expect(body).not.toMatch(/every tool runs 100%/i);
    expect(body).not.toMatch(/works offline once loaded/i);
  });

  it("does not claim the site as a whole works offline (no service worker exists)", async () => {
    // Scope to our own generated intro — a per-tool blog post description
    // (e.g. the QR generator's) may legitimately say a specific tool works
    // offline; this guards the site-wide framing text we control.
    const body = await textOf(getLlmsTxt());
    const intro = body.slice(0, body.indexOf("## Collections"));
    expect(intro).not.toMatch(/\bworks offline\b/i);
  });

  it("flags every network-touching tool inline, next to its own listing", async () => {
    const body = await textOf(getLlmsTxt());
    for (const slug of Object.keys(NETWORK_NOTES)) {
      const tool = listedTools.find((t) => t.href === `/tools/${slug}`);
      if (!tool) continue; // not in the public listing (shouldn't happen, but don't fail on it)
      const lineStart = body.indexOf(`https://browserytools.com${tool.href})`);
      expect(lineStart, `${slug} not found in body`).toBeGreaterThan(-1);
      const lineEnd = body.indexOf("\n", lineStart);
      const line = body.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
      expect(line, `${slug} listing has no network qualifier`).toMatch(
        /\[downloads an AI model|\[sends data to a third-party|\[fetches data from an external API/,
      );
    }
  });
});

describe("/llms-full.txt", () => {
  it("is force-static", async () => {
    const mod = await import("@/app/llms-full.txt/route");
    expect(mod.dynamic).toBe("force-static");
  });

  it("lists every available, non-landing tool with its URL and data profile", async () => {
    const body = await textOf(getLlmsFullTxt());
    for (const tool of listedTools) {
      expect(body, `missing ${tool.href}`).toContain(`https://browserytools.com${tool.href})`);
    }
    expect(body).toContain("Data profile:");
  });

  it("lists every blog post with metadata", async () => {
    const body = await textOf(getLlmsFullTxt());
    for (const post of blogPosts) {
      expect(body, `missing ${post.slug}`).toContain(`/blog/${post.slug}`);
    }
  });

  it("expands every cluster hub with its full member list", async () => {
    const body = await textOf(getLlmsFullTxt());
    for (const id of CLUSTER_IDS) {
      const members = resolveClusterMembers(id);
      for (const member of members) {
        expect(
          body,
          `cluster ${id} member ${member.slug} missing from llms-full.txt`,
        ).toContain(`https://browserytools.com${member.href}`);
      }
    }
  });

  it("gives every network-touching tool its honest, hand-authored note", async () => {
    const body = await textOf(getLlmsFullTxt());
    for (const [slug, entry] of Object.entries(NETWORK_NOTES)) {
      const tool = listedTools.find((t) => t.href === `/tools/${slug}`);
      if (!tool) continue;
      expect(body, `${slug} note missing`).toContain(entry.note);
    }
  });

  it("never pairs a network-touching data profile with an unqualified 'nothing leaves your device' style claim", async () => {
    const body = await textOf(getLlmsFullTxt());
    const blocks = body.split(/(?=^### \[)/m);
    for (const block of blocks) {
      const hrefMatch = block.match(/^### \[.*?\]\(https:\/\/browserytools\.com(\/tools\/[a-z0-9-]+)\)/);
      if (!hrefMatch) continue;
      const slug = hrefMatch[1].replace(/^\/tools\//, "");
      const profile = dataProfileFor(slug);
      if (!touchesNetwork(profile)) continue;
      // A network-touching tool's block must not carry the on-device fallback
      // sentence, and must be tagged with a non-"on-device" data profile.
      expect(block, `${slug} wrongly uses the on-device fallback note`).not.toContain(
        "your file or text content is processed on-device and is never uploaded.",
      );
      expect(block, `${slug} missing its data profile tag`).toMatch(
        /Data profile: (model-download|remote-processing|remote-data)/,
      );
    }
  });

  it("explicitly names Live Dictation's Web Speech API behavior and Currency Converter's live-rate fetch", async () => {
    const body = await textOf(getLlmsFullTxt());
    expect(body).toMatch(/Web Speech API/);
    expect(body).toMatch(/browser vendor/i);
    expect(body).toMatch(/exchange rates/i);
  });
});

describe("llms-data-profile registry", () => {
  it("every network-noted slug resolves to a real, available tool", () => {
    const all = tools.flatMap((c) => c.items);
    for (const slug of Object.keys(NETWORK_NOTES)) {
      const tool = all.find((t) => t.href === `/tools/${slug}`);
      expect(tool, `${slug} not found in tools-config`).toBeTruthy();
      expect(tool?.available, `${slug} is not available`).toBe(true);
    }
  });

  it("defaults an unknown slug to on-device", () => {
    expect(dataProfileFor("definitely-not-a-real-tool")).toBe("on-device");
    expect(touchesNetwork(dataProfileFor("definitely-not-a-real-tool"))).toBe(false);
  });

  it("classifies the verified network-touching tools correctly", () => {
    expect(dataProfileFor("speech-to-text")).toBe("remote-processing");
    expect(dataProfileFor("currency-converter")).toBe("remote-data");
    expect(dataProfileFor("image-to-text")).toBe("model-download");
    expect(dataProfileFor("audio-transcriber")).toBe("model-download");
  });
});
