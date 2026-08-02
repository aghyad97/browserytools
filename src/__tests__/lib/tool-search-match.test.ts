import { describe, it, expect } from "vitest";
import { matchesToolQuery } from "@/lib/tool-search-match";

const bgRemoval = {
  name: "Background Removal",
  category: "Image Tools",
  slug: "bg-removal",
  keywords: ["remove background from image", "transparent png", "cut out background"],
};

describe("matchesToolQuery()", () => {
  it("matches on an empty query (no filtering)", () => {
    expect(matchesToolQuery(bgRemoval, "")).toBe(true);
    expect(matchesToolQuery(bgRemoval, "   ")).toBe(true);
  });

  it("matches on the tool's own name (case-insensitive, substring)", () => {
    expect(matchesToolQuery(bgRemoval, "background")).toBe(true);
    expect(matchesToolQuery(bgRemoval, "BACKGROUND REMOVAL")).toBe(true);
  });

  it("matches on category", () => {
    expect(matchesToolQuery(bgRemoval, "image tools")).toBe(true);
  });

  it("matches on slug", () => {
    expect(matchesToolQuery(bgRemoval, "bg-removal")).toBe(true);
  });

  it("matches a curated keyword phrase the tool's name doesn't contain", () => {
    // A user typing what they want to DO, not the tool's name.
    expect(matchesToolQuery(bgRemoval, "transparent png")).toBe(true);
    expect(matchesToolQuery(bgRemoval, "cut out")).toBe(true);
    expect(matchesToolQuery(bgRemoval, "remove background")).toBe(true);
  });

  it("matches a keyword phrase via partial substring", () => {
    expect(matchesToolQuery(bgRemoval, "transparent")).toBe(true);
  });

  it("does not match an unrelated query", () => {
    expect(matchesToolQuery(bgRemoval, "xyzzy_nonexistent_999")).toBe(false);
  });

  it("falls back to name/category/slug matching when keywords is absent", () => {
    const noKeywords = { name: "Todo List", category: "Productivity Tools", slug: "todo" };
    expect(matchesToolQuery(noKeywords, "todo")).toBe(true);
    expect(matchesToolQuery(noKeywords, "task manager")).toBe(false);
  });

  it("falls back to name/category/slug matching when keywords is empty", () => {
    const emptyKeywords = { ...bgRemoval, keywords: [] };
    expect(matchesToolQuery(emptyKeywords, "transparent png")).toBe(false);
    expect(matchesToolQuery(emptyKeywords, "background")).toBe(true);
  });
  // Regression: `"İmza".toLowerCase()` yields "i" + U+0307 COMBINING DOT ABOVE,
  // so a Turkish user typing "imza" matched nothing and the tool was
  // unreachable from search entirely.
  describe("diacritic- and case-insensitive folding", () => {
    it("finds a Turkish dotted-capital name from an ASCII query", () => {
      const tr = { name: "İmza", category: "PDF Araçları", slug: "sign-pdf" };
      expect(matchesToolQuery(tr, "imza")).toBe(true);
    });

    it("finds a Turkish dotless-i name from an ASCII query", () => {
      const tr = { name: "Işık Ayarı", category: "Görsel", slug: "brightness" };
      expect(matchesToolQuery(tr, "isik")).toBe(true);
    });

    it("finds a Vietnamese diacritic name from an unaccented query", () => {
      const vi = { name: "Nén tệp", category: "Công cụ", slug: "zip" };
      expect(matchesToolQuery(vi, "nen tep")).toBe(true);
    });

    it("finds a German umlaut/eszett name from an ASCII query", () => {
      const de = { name: "Bildgröße", category: "Bilder", slug: "image-resizer" };
      expect(matchesToolQuery(de, "bildgrosse")).toBe(true);
    });

    it("still rejects an unrelated query after folding", () => {
      const tr = { name: "İmza", category: "PDF Araçları", slug: "sign-pdf" };
      expect(matchesToolQuery(tr, "kahve")).toBe(false);
    });
  });
});
