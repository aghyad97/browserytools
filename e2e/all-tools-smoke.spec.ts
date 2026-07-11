import { test, expect } from "@playwright/test";
import routes from "./tool-routes.json";

// Console errors that predate this suite and are not tool regressions.
const IGNORED = [
  /was preloaded using link preload/i, // font preload warnings surface as errors in some builds
  // The rail renders on every route and fetches its live GitHub-star badge from
  // api.github.com. Unauthenticated calls rate-limit to HTTP 403 during the
  // rapid full-catalog smoke; the rail already hides the badge on failure
  // (spec §3, "hidden on failure"), so this external rate-limit is not a
  // regression. The browser logs the failed fetch as a resource error whose URL
  // lives in the message location, not the text — the console handler below
  // matches against text + location URL, so this stays scoped to the GitHub
  // API only. No unscoped status-code ignores.
  /api\.github\.com/i,
  // Vercel Web Analytics (<Analytics/> in the global providers) injects
  // /_vercel/insights/script.js, which only exists on Vercel infra and 404s
  // under local `next start`. It is a pre-existing, every-route artifact (same
  // class as the GitHub badge above), not a tool regression. It surfaces only
  // on the slowest route (mind-map's React Flow canvas gives the deferred
  // injection time to fire before the assertions settle); ignore it globally so
  // it can't flake any route.
  /_vercel\/insights/i,
];

// Every route must render with exactly one h1 (the tool/page title), at least
// one visible heading, no console errors. The homepage is covered too — the
// retired Header carried its h1, so the landing must keep its own.
const PAGES = [{ href: "/", name: "Homepage" }, ...routes];

for (const { href, name } of PAGES) {
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
    // Exactly one h1 per page — guards both the ToolTitle/own-h1 split on tool
    // routes and heading regressions anywhere in the shell.
    await expect(page.locator("h1"), `h1 count on ${href}`).toHaveCount(1);
    expect(errors, `console errors on ${href}`).toEqual([]);
  });
}
