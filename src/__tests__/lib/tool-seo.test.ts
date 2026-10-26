import { describe, it, expect } from "vitest";
import {
  resolveTool,
  buildJsonLd,
  humanizeSlug,
  resolveSeoBlock,
} from "@/lib/tool-seo";
import { toolContent } from "@/lib/tool-content";

describe("humanizeSlug", () => {
  it("title-cases hyphenated slugs", () => {
    expect(humanizeSlug("svg-png")).toBe("Svg Png");
  });
});

describe("resolveTool", () => {
  it("resolves a catalogued slug", () => {
    expect(resolveTool("json-formatter")?.href).toBe("/tools/json-formatter");
    expect(resolveTool("json-formatter")?.slug).toBe("json-formatter");
  });

  it("returns null for an empty slug", () => {
    expect(resolveTool("")).toBeNull();
  });

  it("degrades to a humanized name for an uncatalogued slug", () => {
    const t = resolveTool("not-a-real-tool");
    expect(t?.name).toBe("Not A Real Tool");
    expect(t?.categoryId).toBeNull();
    expect(t?.category).toBe("Browser Tools");
  });

  it("carries the category id for catalogued tools", () => {
    expect(resolveTool("json-formatter")?.categoryId).toBeTruthy();
  });
});

describe("buildJsonLd", () => {
  const tool = resolveTool("json-formatter")!;
  const en = toolContent["json-formatter"].en;
  const types = (g: Record<string, unknown>[]) => g.map((x) => x["@type"]);

  it("emits FAQPage only when bespoke", () => {
    expect(types(buildJsonLd(tool, en, true))).toContain("FAQPage");
    expect(types(buildJsonLd(tool, en, false))).not.toContain("FAQPage");
  });

  it("always emits SoftwareApplication and BreadcrumbList, never ratings", () => {
    const g = buildJsonLd(tool, en, false);
    expect(types(g).slice(0, 2)).toEqual(["SoftwareApplication", "BreadcrumbList"]);
    expect(JSON.stringify(g)).not.toMatch(/aggregateRating|review/);
  });

  it("emits HowTo only when steps exist", () => {
    expect(types(buildJsonLd(tool, en, true))).toContain("HowTo");
    expect(types(buildJsonLd(tool, { ...en, steps: [] }, true))).not.toContain(
      "HowTo"
    );
  });

  it("never serialises limitations", () => {
    const lim = en.limitations?.[0] ?? "";
    expect(lim.length).toBeGreaterThan(0);
    expect(JSON.stringify(buildJsonLd(tool, en, true))).not.toContain(lim);
  });
});

describe("resolveSeoBlock", () => {
  it("is null for non-tool paths", () => {
    expect(resolveSeoBlock({ slug: "", locale: "en" })).toBeNull();
  });

  it("uses bespoke en/ar content and flags it", () => {
    const en = resolveSeoBlock({ slug: "depth-map", locale: "en" });
    expect(en?.isBespoke).toBe(true);
    expect(en?.content).toBe(toolContent["depth-map"].en);
    const ar = resolveSeoBlock({ slug: "token-counter", locale: "ar" });
    expect(ar?.content).toBe(toolContent["token-counter"].ar);
    expect(ar?.isBespoke).toBe(true);
  });

  it("uses extra[locale] when present", () => {
    const ru = resolveSeoBlock({
      slug: "compress-image-to-1mb",
      locale: "ru",
    });
    expect(ru?.isBespoke).toBe(true);
    expect(ru?.content).toBe(toolContent["compress-image-to-1mb"].extra?.ru);
    expect(ru?.jsonLd.map((g) => g["@type"])).toContain("FAQPage");
  });

  it("falls back, not bespoke and without FAQPage, when no prose in the locale", () => {
    const de = resolveSeoBlock({ slug: "compress-pdf", locale: "de" });
    expect(de?.isBespoke).toBe(false);
    expect(de?.jsonLd.map((g) => g["@type"])).not.toContain("FAQPage");
    expect(de?.content).not.toBe(toolContent["compress-pdf"].en);
  });

  it("lists only available related tools", () => {
    const b = resolveSeoBlock({ slug: "json-formatter", locale: "en" });
    expect(b?.related.map((r) => r.href)).toContain("/tools/base64");
  });

  it("applies translated names from the translator", () => {
    const tc = Object.assign((k: string) => `T:${k}`, {
      has: (k: string) => k.endsWith(".name"),
    });
    const b = resolveSeoBlock({
      slug: "json-formatter",
      locale: "en",
      tc: tc as never,
    });
    expect(b?.tool.name).toBe("T:tools.json-formatter.name");
    // description key reports missing -> keeps the English config string
    expect(b?.tool.description).not.toMatch(/^T:/);
  });
});
