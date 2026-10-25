import { describe, expect, it } from "vitest";

import { isLocale } from "@/lib/locales";
import { toolContent } from "@/lib/tool-content";

const entries = Object.entries(toolContent).flatMap(([slug, content]) =>
  Object.entries(content.extra ?? {}).map(([locale, prose]) => ({
    slug,
    locale,
    prose,
  }))
);

describe("toolContent extra locales", () => {
  it("has at least one extra entry", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it.each(entries)("$slug/$locale uses a registered locale", ({ locale }) => {
    expect(isLocale(locale)).toBe(true);
    expect(["en", "ar"]).not.toContain(locale);
  });

  it.each(entries)("$slug/$locale has intro and at least 3 FAQ items", ({ prose }) => {
    expect(prose.intro.trim().length).toBeGreaterThan(0);
    expect(prose.faq.length).toBeGreaterThanOrEqual(3);
  });

  it.each(entries)("$slug/$locale has at most 4 limitations", ({ prose }) => {
    expect((prose.limitations ?? []).length).toBeLessThanOrEqual(4);
  });
});
