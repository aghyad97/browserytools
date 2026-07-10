import { test, expect } from "@playwright/test";
import routes from "./tool-routes.json";

// Console errors that predate this suite and are not tool regressions.
const IGNORED = [
  /was preloaded using link preload/i, // font preload warnings surface as errors in some builds
  /hydration/i, // tracked separately; do not let it mask new breakage — remove once fixed
];

for (const { href, name } of routes) {
  test(`smoke: ${name} (${href})`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !IGNORED.some((re) => re.test(msg.text()))) {
        errors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => errors.push(String(err)));

    const res = await page.goto(href, { waitUntil: "domcontentloaded" });
    expect(res?.status(), "HTTP status").toBeLessThan(400);
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    expect(errors, `console errors on ${href}`).toEqual([]);
  });
}
