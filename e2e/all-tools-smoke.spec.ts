import { test, expect } from "@playwright/test";
import routes from "./tool-routes.json";

// Console errors that predate this suite and are not tool regressions.
const IGNORED = [
  /was preloaded using link preload/i, // font preload warnings surface as errors in some builds
  /hydration/i, // tracked separately; do not let it mask new breakage — remove once fixed
  // The rail renders on every route and fetches its live GitHub-star badge from
  // api.github.com. Unauthenticated calls rate-limit to HTTP 403 during the
  // rapid full-catalog smoke; the rail already hides the badge on failure
  // (spec §3, "hidden on failure"), so this external rate-limit is not a
  // regression. The browser logs the failed fetch as a resource error whose URL
  // lives in the message location, not the text — so match both. During this
  // passive load-only smoke (no tool interaction) the rail badge is the only
  // external auth/rate-limit-prone request, so an auth/limit status here is it.
  /api\.github\.com/i,
  /failed to load resource: the server responded with a status of (401|403|429)/i,
];

for (const { href, name } of routes) {
  test(`smoke: ${name} (${href})`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      // A failed resource load reports the URL in the message location, not the
      // text, so test both against the ignore list.
      const haystack = `${msg.text()} ${msg.location()?.url ?? ""}`;
      if (!IGNORED.some((re) => re.test(haystack))) {
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
