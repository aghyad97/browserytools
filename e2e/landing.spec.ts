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

/**
 * Rail → landing filter wiring (fix: rail categories now write to the shared
 * category-filter store instead of being dead `<Link href="/">`s).
 */
test.describe("rail category filter", () => {
  test("clicking a rail category filters the Popular grid and shows the active dot", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const popularGrid = page.getByTestId("popular-grid");
    // Unfiltered Popular grid is capped at 47 tiles.
    await expect(popularGrid.getByRole("link")).toHaveCount(47);

    // The rail is the page's <aside> (complementary landmark) — scope to it
    // since the landing's own chip row repeats the same category labels.
    const rail = page.getByRole("complementary");

    // "Games" (testsGames) has exactly one tool — a distinctive singleton
    // category unrelated to image tools.
    const gamesBtn = rail.getByRole("button", { name: "Games", exact: true });
    await gamesBtn.click();

    await expect(gamesBtn.getByTestId("rail-active-dot")).toBeVisible();
    await expect(popularGrid.getByRole("link")).toHaveCount(1);
    await expect(popularGrid.getByText(en.ToolsConfig.tools["typing-test"].name)).toBeVisible();
    await expect(
      popularGrid.getByText(en.ToolsConfig.tools["bg-removal"].name),
    ).toHaveCount(0);

    // "Everything" clears the filter and restores the full grid.
    const everythingBtn = rail.getByRole("button", {
      name: "Everything",
      exact: true,
    });
    await everythingBtn.click();
    await expect(everythingBtn.getByTestId("rail-active-dot")).toBeVisible();
    await expect(popularGrid.getByRole("link")).toHaveCount(47);
  });
});
