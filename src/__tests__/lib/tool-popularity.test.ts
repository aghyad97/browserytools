import { describe, it, expect } from "vitest";
import { TOOL_POPULARITY, popularityRank } from "@/lib/tool-popularity";
import { tools } from "@/lib/tools-config";

describe("tool popularity ranking", () => {
  it("every ranked slug exists in the catalog", () => {
    const slugs = new Set(
      tools.flatMap((c) => c.items.map((t) => t.href.split("/").pop())),
    );
    for (const slug of TOOL_POPULARITY) {
      expect(slugs.has(slug), `unknown slug: ${slug}`).toBe(true);
    }
  });

  it("has no duplicate entries", () => {
    expect(new Set(TOOL_POPULARITY).size).toBe(TOOL_POPULARITY.length);
  });

  it("analytics tier leads: depth-map first, pdf second", () => {
    expect(popularityRank("depth-map")).toBe(0);
    expect(popularityRank("pdf")).toBe(1);
    expect(popularityRank("depth-map")).toBeLessThan(popularityRank("qr-generator"));
  });

  it("unranked tools sort after all ranked ones", () => {
    expect(popularityRank("chmod")).toBe(Number.POSITIVE_INFINITY);
  });
});
