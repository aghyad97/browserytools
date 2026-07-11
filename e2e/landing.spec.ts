import { test, expect } from "@playwright/test";
import en from "../messages/en.json";
import routes from "./tool-routes.json";

/**
 * Landing SEO-parity contract (spec §6.5, task-8 brief).
 *
 * The rail landing replaces the old HomePage body but must keep every SEO
 * surface the old home page had: the statement h1, a full-catalog crawlable
 * link surface (≥137 `/tools/` links), the `ItemList` JSON-LD, the FAQ, and
 * exactly one coffee CTA (the one-per-screen rule, spec §3).
 */

test.describe("landing SEO parity", () => {
  test("statement lead is the single page h1", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText(en.Landing.statementLead);
  });

  test("renders the full crawlable /tools/ link surface (>=137)", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Unique tool routes present as anchors anywhere on the page (landing
    // all-tools section + footer matrix). Must cover the whole catalog.
    const hrefs = await page
      .locator('a[href^="/tools/"]')
      .evaluateAll((els) =>
        Array.from(new Set(els.map((e) => e.getAttribute("href")))),
      );
    expect(hrefs.length).toBeGreaterThanOrEqual(137);
    // Every catalogued route must be reachable from the landing.
    const routeHrefs = new Set(routes.map((r: { href: string }) => r.href));
    for (const href of routeHrefs) {
      expect(hrefs, `missing crawlable link for ${href}`).toContain(href);
    }
  });

  test("emits ItemList JSON-LD (StructuredData type=website)", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const hasItemList = blocks.some((b) => {
      try {
        const json = JSON.parse(b);
        return JSON.stringify(json).includes('"ItemList"');
      } catch {
        return false;
      }
    });
    expect(hasItemList, "an ItemList JSON-LD block is present").toBe(true);
  });

  test("keeps the FAQ visible", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: en.Home.faq.title }),
    ).toBeVisible();
  });

  test("exactly one coffee CTA", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('a[href="/coffee"]')).toHaveCount(1);
  });
});
