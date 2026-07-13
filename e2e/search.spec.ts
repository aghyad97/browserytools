import { test, expect } from "@playwright/test";

/**
 * Search contract (R2 redesign, spec §6.5):
 *
 * 1. The ⌘K command palette is THE search surface. It supersedes the old
 *    homepage search input and sidebar search (removed with their parents
 *    at chrome-switchover).
 * 2. The `?search=` server redirect on the homepage is preserved untouched
 *    (it backs the SearchAction JSON-LD — SEO contract).
 *
 * <CommandPalette> is mounted into the production shell (AppShell) as of the
 * chrome-switchover task, so these specs run against real prod chrome.
 */
const PALETTE_MOUNTED = true;

test.describe("Command palette", () => {
  test.skip(
    !PALETTE_MOUNTED,
    "CommandPalette not mounted yet — enabled at chrome-switchover",
  );

  test("⌘K opens the palette from the keyboard", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    await expect(page.getByTestId("command-palette")).toBeVisible();
    // Keyboard-initiated: input is focused and ready to type.
    await expect(page.getByRole("combobox")).toBeFocused();
  });

  test("typing filters the results", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    await page.getByRole("combobox").fill("password");

    const items = page.getByTestId("palette-item");
    await expect(items.first()).toBeVisible();
    const count = await items.count();
    expect(count).toBeLessThanOrEqual(9);
    for (let i = 0; i < count; i++) {
      await expect(items.nth(i)).toContainText(/password/i);
    }
  });

  test("Enter navigates to the selected tool", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    await page.getByRole("combobox").fill("json formatter");

    const firstHref = await page
      .getByTestId("palette-item")
      .first()
      .getAttribute("data-href");
    expect(firstHref).toBeTruthy();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${firstHref}$`));
    await expect(page.getByTestId("command-palette")).toHaveCount(0);
  });
});

test.describe("?search= redirect (preserved SEO contract)", () => {
  test("?search=json redirects to the first matching tool", async ({
    page,
  }) => {
    await page.goto("/?search=json");
    await expect(page).toHaveURL(/\/tools\/.+/);
  });
});
