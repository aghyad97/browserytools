import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/browsery|tools/i);
  });

  test("homepage displays tool cards", async ({ page }) => {
    await page.goto("/");
    const toolCards = page.locator("[data-testid='tool-card']");
    await expect(toolCards.first()).toBeVisible();
    const count = await toolCards.count();
    expect(count).toBeGreaterThan(5);
  });

  test("clicking a tool card navigates to the tool page", async ({ page }) => {
    await page.goto("/");
    const firstCard = page.locator("[data-testid='tool-card']").first();
    const link = firstCard.locator("xpath=ancestor-or-self::a").first();
    const href = await link.getAttribute("href");

    if (href && href !== "#") {
      await link.click();
      await expect(page).toHaveURL(new RegExp(href.replace(/\//g, "\\/")));
    }
  });

  test("text-case page loads", async ({ page }) => {
    await page.goto("/tools/text-case");
    await expect(page.getByText(/input text/i)).toBeVisible();
  });

  test("password-generator page loads", async ({ page }) => {
    await page.goto("/tools/password-generator");
    await expect(page.getByText(/generate password/i).first()).toBeVisible();
  });

  test("todo page loads", async ({ page }) => {
    await page.goto("/tools/todo");
    await expect(page.getByPlaceholder(/what needs to be done/i)).toBeVisible();
  });
});
