import { test, expect } from "@playwright/test";

test.describe("Search", () => {
  test("search input is present on homepage", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.getByRole("searchbox").or(
      page.getByPlaceholder(/search/i)
    );
    await expect(searchInput.first()).toBeVisible();
  });

  test("searching 'password' filters results to show password-related tools", async ({
    page,
  }) => {
    await page.goto("/");
    const searchInput = page
      .getByRole("searchbox")
      .or(page.getByPlaceholder(/search/i))
      .first();

    await searchInput.fill("password");
    await page.waitForTimeout(300); // debounce

    // At least one result with "password" visible
    await expect(
      page.getByText(/password/i).first()
    ).toBeVisible();
  });

  test("clearing search shows all tools again", async ({ page }) => {
    await page.goto("/");
    const searchInput = page
      .getByRole("searchbox")
      .or(page.getByPlaceholder(/search/i))
      .first();

    await searchInput.fill("password");
    await page.waitForTimeout(300);

    const filteredCount = await page
      .locator("[data-testid='tool-card']")
      .count();

    await searchInput.clear();
    await page.waitForTimeout(300);

    const allCount = await page.locator("[data-testid='tool-card']").count();
    expect(allCount).toBeGreaterThanOrEqual(filteredCount);
  });

  test("gibberish search returns no tools", async ({ page }) => {
    await page.goto("/");
    const searchInput = page
      .getByRole("searchbox")
      .or(page.getByPlaceholder(/search/i))
      .first();

    await searchInput.fill("xyzzy_nonexistent_tool_999");
    await page.waitForTimeout(300);

    const toolCards = page.locator("[data-testid='tool-card']");
    const count = await toolCards.count();
    expect(count).toBe(0);
  });
});
