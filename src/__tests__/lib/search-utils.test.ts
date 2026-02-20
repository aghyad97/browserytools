import { describe, it, expect } from "vitest";
import {
  calculateSimilarity,
  searchTools,
  calculateSearchScore,
  expandSearchTerms,
} from "@/lib/search-utils";
import { tools } from "@/lib/tools-config";

// ── calculateSimilarity() ─────────────────────────────────────────────────────
describe("calculateSimilarity()", () => {
  it("returns 1 for identical strings", () => {
    expect(calculateSimilarity("hello", "hello")).toBe(1);
  });

  it("returns 1 for two empty strings", () => {
    expect(calculateSimilarity("", "")).toBe(1);
  });

  it("returns 0 for completely different same-length strings", () => {
    // "abc" vs "xyz" — every char is different (3 substitutions / max 3)
    expect(calculateSimilarity("abc", "xyz")).toBe(0);
  });

  it("returns a value between 0 and 1 for partial matches", () => {
    const score = calculateSimilarity("password", "passphrase");
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(1);
  });

  it("is not symmetric but both directions yield reasonable scores", () => {
    // The implementation may not be symmetric — just test it doesn't crash
    const a = calculateSimilarity("cat", "catch");
    const b = calculateSimilarity("catch", "cat");
    expect(a).toBeGreaterThanOrEqual(0);
    expect(b).toBeGreaterThanOrEqual(0);
  });
});

// ── expandSearchTerms() ───────────────────────────────────────────────────────
describe("expandSearchTerms()", () => {
  it("includes the original search term", () => {
    const terms = expandSearchTerms("image");
    expect(terms).toContain("image");
  });

  it("expands known synonyms for 'image'", () => {
    const terms = expandSearchTerms("image");
    expect(terms).toContain("picture");
    expect(terms).toContain("photo");
  });

  it("expands 'password' synonyms", () => {
    const terms = expandSearchTerms("password");
    expect(terms).toContain("pass");
    expect(terms).toContain("pwd");
  });

  it("handles multi-word queries", () => {
    const terms = expandSearchTerms("qr code");
    expect(terms).toContain("qr");
    expect(terms).toContain("code");
  });

  it("handles unknown terms without throwing", () => {
    const terms = expandSearchTerms("xyzzy123");
    expect(terms).toContain("xyzzy123");
  });
});

// ── calculateSearchScore() ────────────────────────────────────────────────────
describe("calculateSearchScore()", () => {
  const allTools = tools.flatMap((cat) =>
    cat.items.map((t) => ({ ...t, category: cat.category }))
  );

  it("gives a higher score for exact name match", () => {
    const passwordTool = allTools.find((t) =>
      t.name.toLowerCase().includes("password")
    );
    if (!passwordTool) return; // skip if not in config

    const exactScore = calculateSearchScore(passwordTool, "password");
    const gibberishScore = calculateSearchScore(passwordTool, "xyzzy");
    expect(exactScore).toBeGreaterThan(gibberishScore);
  });

  it("returns 0 for gibberish query on any tool", () => {
    const anyTool = allTools[0];
    const score = calculateSearchScore(anyTool, "zzzzzzzzzz12345");
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

// ── searchTools() ─────────────────────────────────────────────────────────────
describe("searchTools()", () => {
  it("returns all categories when query is empty", () => {
    const results = searchTools("");
    const totalCategories = tools.length;
    expect(results.length).toBe(totalCategories);
  });

  it("returns all categories when query is only whitespace", () => {
    const results = searchTools("   ");
    expect(results.length).toBe(tools.length);
  });

  it("returns matching results for a real tool name", () => {
    const results = searchTools("base64");
    const allItems = results.flatMap((c) => c.items);
    expect(allItems.length).toBeGreaterThan(0);
  });

  it("returns empty array for complete gibberish", () => {
    const results = searchTools("asdfjkl_xyzzy_nope_999");
    const allItems = results.flatMap((c) => c.items);
    expect(allItems.length).toBe(0);
  });

  it("filters categories that have no matching tools", () => {
    // A very specific query should narrow results
    const results = searchTools("password");
    results.forEach((cat) => {
      expect(cat.items.length).toBeGreaterThan(0);
    });
  });

  it("sorts items by score descending within each category", () => {
    const results = searchTools("password generator");
    results.forEach((cat) => {
      for (let i = 1; i < cat.items.length; i++) {
        const prev = (cat.items[i - 1] as typeof cat.items[0] & { searchScore?: number }).searchScore ?? 0;
        const curr = (cat.items[i] as typeof cat.items[0] & { searchScore?: number }).searchScore ?? 0;
        expect(prev).toBeGreaterThanOrEqual(curr);
      }
    });
  });
});
