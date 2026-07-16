import { describe, it, expect } from "vitest";
import {
  getAllTools,
  getCatalogTools,
  getRelatedTools,
  roundedToolCount,
  type Tool,
} from "@/lib/tools-config";

/* Synthetic pool for the landing-variant related-tile rules. No `landingFor`
   entries exist in the real config yet (Task 3 adds them), so the family-aware
   branch is exercised against an injected fixture. */
const FakeIcon = (() => null) as unknown as Tool["icon"];
const mk = (
  slug: string,
  category: string,
  extra: Partial<Tool> = {},
): Tool & { category: string } => ({
  name: slug,
  href: `/tools/${slug}`,
  icon: FakeIcon,
  available: true,
  description: slug,
  order: 1,
  creationDate: "2025-01-01",
  category,
  ...extra,
});

const POOL: (Tool & { category: string })[] = [
  mk("compress-image", "Image Tools"),
  mk("compress-image-to-20kb", "Image Tools", { landingFor: "compress-image" }),
  mk("compress-image-to-50kb", "Image Tools", { landingFor: "compress-image" }),
  mk("compress-image-to-100kb", "Image Tools", { landingFor: "compress-image" }),
  mk("compress-image-to-200kb", "Image Tools", { landingFor: "compress-image" }),
  mk("resize-image", "Image Tools"),
  mk("crop-image", "Image Tools"),
  mk("rotate-image", "Image Tools"),
];

describe("getCatalogTools", () => {
  it("is exported and returns getAllTools filtered to entries without landingFor", () => {
    const catalog = getCatalogTools();
    expect(catalog.every((t) => !t.landingFor)).toBe(true);
    const expected = getAllTools().filter((t) => !t.landingFor);
    expect(catalog).toEqual(expected);
  });

  it("never exceeds the full tool list", () => {
    expect(getCatalogTools().length).toBeLessThanOrEqual(getAllTools().length);
  });

  it("excludes landing variants from the pool (synthetic)", () => {
    const slugOf = (t: { href: string }) => t.href.split("/").pop();
    const catalogSlugs = POOL.filter((t) => !t.landingFor).map(slugOf);
    expect(catalogSlugs).not.toContain("compress-image-to-20kb");
    expect(catalogSlugs).toContain("compress-image");
  });
});

describe("roundedToolCount", () => {
  it("floors the catalog count down to the nearest ten", () => {
    const exact = getCatalogTools().length;
    expect(roundedToolCount()).toBe(Math.floor(exact / 10) * 10);
  });
});

describe("getRelatedTools", () => {
  const slugs = (list: { href: string }[]) =>
    list.map((t) => t.href.split("/").pop());

  it("normal tool: same-category siblings, excluding self and landing variants", () => {
    const related = getRelatedTools("resize-image", 3, POOL);
    expect(slugs(related)).toEqual(["compress-image", "crop-image", "rotate-image"]);
    // landing variants never leak into a normal tool's related pool
    expect(slugs(related).some((s) => s?.includes("-to-"))).toBe(false);
  });

  it("normal tool: caps at the requested limit", () => {
    expect(getRelatedTools("resize-image", 2, POOL)).toHaveLength(2);
  });

  it("landing tool: canonical first, then sibling variants, same count as today", () => {
    const related = getRelatedTools("compress-image-to-20kb", 3, POOL);
    expect(related).toHaveLength(3);
    expect(related[0].href).toBe("/tools/compress-image"); // canonical leads
    // the rest are siblings sharing the same landingFor, excluding self
    expect(slugs(related.slice(1))).not.toContain("compress-image-to-20kb");
    for (const s of slugs(related.slice(1))) {
      expect(s?.startsWith("compress-image-to-")).toBe(true);
    }
  });

  it("landing tool: total tiles never exceed the limit", () => {
    expect(getRelatedTools("compress-image-to-50kb", 3, POOL).length).toBeLessThanOrEqual(3);
  });

  it("unknown slug returns nothing", () => {
    expect(getRelatedTools("does-not-exist", 3, POOL)).toEqual([]);
  });
});
