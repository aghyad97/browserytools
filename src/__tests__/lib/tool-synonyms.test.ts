import { describe, it, expect } from "vitest";
import { TOOL_SYNONYMS, synonymsFor } from "@/lib/tool-synonyms";
import { getCatalogTools, isHiddenVariant, getAllTools } from "@/lib/tools-config";

describe("TOOL_SYNONYMS registry", () => {
  // Every real tool, keyed by slug, so a renamed/removed tool can't leave a
  // dangling, silently-dead synonyms entry behind.
  const allBySlug = new Map(
    getAllTools().map((tool) => [tool.href.split("/").pop(), tool]),
  );

  it("every key resolves to a real, available tool in the registry", () => {
    for (const slug of Object.keys(TOOL_SYNONYMS)) {
      const tool = allBySlug.get(slug);
      expect(tool, `"${slug}" should exist in tools-config.ts`).toBeDefined();
      expect(tool?.available, `"${slug}" should be available`).toBe(true);
    }
  });

  it("never keys a hidden landingFor variant (unreachable from the command palette)", () => {
    for (const slug of Object.keys(TOOL_SYNONYMS)) {
      const tool = allBySlug.get(slug);
      if (!tool) continue;
      expect(
        isHiddenVariant(tool),
        `"${slug}" is a hidden SEO variant — its keywords can never be searched`,
      ).toBe(false);
    }
  });

  it("gives every tool 3-8 genuine phrases (no stuffing, no empties)", () => {
    for (const [slug, keywords] of Object.entries(TOOL_SYNONYMS)) {
      expect(keywords.length, `${slug} keyword count`).toBeGreaterThanOrEqual(3);
      expect(keywords.length, `${slug} keyword count`).toBeLessThanOrEqual(8);
      for (const kw of keywords) {
        expect(kw.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("covers a meaningful subset of the catalog (not a thin pass over all 176)", () => {
    expect(Object.keys(TOOL_SYNONYMS).length).toBeGreaterThanOrEqual(50);
  });

  it("covers the highest-value on-device AI and cluster tools with real user phrasings", () => {
    expect(synonymsFor("bg-removal")).toEqual(
      expect.arrayContaining([expect.stringContaining("transparent")]),
    );
    expect(synonymsFor("image-to-text")).toEqual(expect.arrayContaining(["ocr"]));
    expect(synonymsFor("token-counter")).toEqual(
      expect.arrayContaining([expect.stringContaining("tokens")]),
    );
  });

  it("synonymsFor() returns undefined for a tool with no curated keywords", () => {
    expect(synonymsFor("todo")).toBeUndefined();
  });

  it("resolves against the public catalog (getCatalogTools) without throwing", () => {
    const catalogSlugs = new Set(
      getCatalogTools().map((tool) => tool.href.split("/").pop()),
    );
    for (const slug of Object.keys(TOOL_SYNONYMS)) {
      expect(catalogSlugs.has(slug), `"${slug}" should be in the public catalog`).toBe(
        true,
      );
    }
  });
});
