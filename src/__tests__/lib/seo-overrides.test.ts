import { describe, it, expect } from "vitest";
import { generateToolMetadata } from "@/lib/metadata";
import { seoOverrides, getSeoOverride } from "@/lib/seo-overrides";
import { findToolByHref } from "@/lib/tools-config";

describe("seo-overrides", () => {
  it("applies the override title and description to tool metadata", () => {
    const o = seoOverrides["ascii-art"];
    const m = generateToolMetadata("/tools/ascii-art");
    expect(m.title).toBe(o.title);
    expect(m.description).toBe(o.description);
    expect(m.openGraph?.title).toBe(o.title);
    expect(m.openGraph?.description).toBe(o.description);
    expect(m.twitter?.title).toBe(o.title);
    expect(m.twitter?.description).toBe(o.description);
  });

  it("keeps the templated title for a slug without an override", () => {
    const slug = "json-formatter";
    expect(getSeoOverride(slug)).toBeUndefined();
    const tool = findToolByHref(`/tools/${slug}`);
    expect(tool).not.toBeNull();
    expect(generateToolMetadata(`/tools/${slug}`).title).toBe(
      `${tool!.name} - Free Browser Tool`,
    );
  });

  it("does not resolve inherited object keys as overrides", () => {
    expect(getSeoOverride("constructor")).toBeUndefined();
  });

  it("keeps every override within length limits and on a real tool", () => {
    for (const [slug, o] of Object.entries(seoOverrides)) {
      expect(findToolByHref(`/tools/${slug}`), slug).not.toBeNull();
      if (o.title) expect(o.title.length, slug).toBeLessThanOrEqual(60);
      if (o.description)
        expect(o.description.length, slug).toBeLessThanOrEqual(155);
    }
  });
});
