import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads the homepage successfully", async ({ page }) => {
    await page.goto("/");

    // Check if the page loads
    await expect(page).toHaveTitle(/BrowseryTools/);

    // Check if the main heading is visible
    await expect(page.getByText("BrowseryTools")).toBeVisible();

    // Check if the description is visible
    await expect(
      page.getByText(/comprehensive collection of browser-based tools/)
    ).toBeVisible();
  });

  test("displays all tool categories", async ({ page }) => {
    await page.goto("/");

    // Check if all main categories are visible
    await expect(page.getByText("Image Tools")).toBeVisible();
    await expect(page.getByText("File Tools")).toBeVisible();
    await expect(page.getByText("Media Tools")).toBeVisible();
    await expect(page.getByText("Text & Language Tools")).toBeVisible();
    await expect(page.getByText("Data Tools")).toBeVisible();
    await expect(page.getByText("Math & Finance Tools")).toBeVisible();
  });

  test("navigates to tool pages from homepage", async ({ page }) => {
    await page.goto("/");

    // Click on a tool link
    await page.getByText("Text Counter").click();

    // Check if we're on the tool page
    await expect(page).toHaveURL("/tools/text-counter");
    await expect(page.getByText("Text Counter")).toBeVisible();
  });

  test("search functionality works on homepage", async ({ page }) => {
    await page.goto("/");

    // Find and use the search input
    const searchInput = page.getByPlaceholderText("Search tools...");
    await searchInput.fill("text");

    // Check if filtered results are shown
    await expect(page.getByText("Text Counter")).toBeVisible();
    await expect(page.getByText("Text Case Converter")).toBeVisible();

    // Clear search
    await searchInput.fill("");

    // Check if all tools are shown again
    await expect(page.getByText("Image Compression")).toBeVisible();
  });

  test("responsive design works on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check if mobile menu button is visible
    await expect(page.getByLabelText(/menu/i)).toBeVisible();

    // Check if sidebar is hidden by default
    await expect(page.getByText("Image Tools")).not.toBeVisible();
  });

  test("theme switcher works", async ({ page }) => {
    await page.goto("/");

    // Find and click theme switcher
    const themeButton = page.getByLabelText(/toggle theme/i);
    await themeButton.click();

    // Check if dark theme is applied
    await expect(page.locator("html")).toHaveAttribute("class", /dark/);

    // Click again to switch back
    await themeButton.click();

    // Check if light theme is applied
    await expect(page.locator("html")).not.toHaveAttribute("class", /dark/);
  });
});
