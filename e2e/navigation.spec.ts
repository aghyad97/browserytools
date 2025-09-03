import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigates between different tools", async ({ page }) => {
    await page.goto("/");

    // Navigate to Text Counter
    await page.getByText("Text Counter").click();
    await expect(page).toHaveURL("/tools/text-counter");
    await expect(page.getByText("Text Counter")).toBeVisible();

    // Navigate to Password Generator
    await page.getByText("Password Generator").click();
    await expect(page).toHaveURL("/tools/password-generator");
    await expect(page.getByText("Password Generator")).toBeVisible();

    // Navigate to QR Code Generator
    await page.getByText("QR Code Generator").click();
    await expect(page).toHaveURL("/tools/qr-generator");
    await expect(page.getByText("QR Code Generator")).toBeVisible();
  });

  test("search functionality works across the app", async ({ page }) => {
    await page.goto("/");

    // Search for text tools
    const searchInput = page.getByPlaceholderText("Search tools...");
    await searchInput.fill("text");

    // Check if filtered results are shown
    await expect(page.getByText("Text Counter")).toBeVisible();
    await expect(page.getByText("Text Case Converter")).toBeVisible();

    // Navigate to a filtered result
    await page.getByText("Text Counter").click();
    await expect(page).toHaveURL("/tools/text-counter");

    // Go back and clear search
    await page.goBack();
    await searchInput.fill("");

    // Check if all tools are shown again
    await expect(page.getByText("Image Compression")).toBeVisible();
  });

  test("sidebar navigation works on desktop", async ({ page }) => {
    await page.goto("/");

    // Check if sidebar is visible on desktop
    await expect(page.getByText("Image Tools")).toBeVisible();
    await expect(page.getByText("File Tools")).toBeVisible();

    // Navigate using sidebar
    await page.getByText("Password Generator").click();
    await expect(page).toHaveURL("/tools/password-generator");
  });

  test("mobile menu navigation works", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check if mobile menu button is visible
    const menuButton = page.getByLabelText(/menu/i);
    await expect(menuButton).toBeVisible();

    // Open mobile menu
    await menuButton.click();

    // Check if sidebar is now visible
    await expect(page.getByText("Image Tools")).toBeVisible();

    // Navigate using mobile menu
    await page.getByText("Text Counter").click();
    await expect(page).toHaveURL("/tools/text-counter");
  });

  test("breadcrumb navigation works", async ({ page }) => {
    await page.goto("/tools/text-counter");

    // Check if breadcrumb is visible
    await expect(page.getByText("Home")).toBeVisible();
    await expect(page.getByText("Text Counter")).toBeVisible();

    // Navigate back to home
    await page.getByText("Home").click();
    await expect(page).toHaveURL("/");
  });

  test("tool categories are properly organized", async ({ page }) => {
    await page.goto("/");

    // Check if categories are in correct order
    const categories = page.locator('[data-testid="tool-category"]');
    const categoryTexts = await categories.allTextContents();

    expect(categoryTexts[0]).toContain("Image Tools");
    expect(categoryTexts[1]).toContain("File Tools");
    expect(categoryTexts[2]).toContain("Media Tools");
    expect(categoryTexts[3]).toContain("Text & Language Tools");
    expect(categoryTexts[4]).toContain("Data Tools");
    expect(categoryTexts[5]).toContain("Math & Finance Tools");
  });

  test("tool descriptions are shown on hover", async ({ page }) => {
    await page.goto("/");

    // Hover over a tool
    const toolLink = page.getByText("Text Counter");
    await toolLink.hover();

    // Check if tooltip is shown
    await expect(page.getByText(/count words, characters/i)).toBeVisible();
  });

  test("unavailable tools are marked as coming soon", async ({ page }) => {
    await page.goto("/");

    // Check if unavailable tools are marked
    const unavailableTool = page.getByText("SVG Tools");
    await expect(unavailableTool).toBeVisible();

    // Check if it's marked as coming soon
    await expect(page.getByText("Coming Soon")).toBeVisible();
  });

  test("header navigation elements work", async ({ page }) => {
    await page.goto("/");

    // Check if logo is clickable
    const logo = page.getByText("BrowseryTools");
    await logo.click();
    await expect(page).toHaveURL("/");

    // Check if social links work
    const githubLink = page.getByLabelText(/github/i);
    await expect(githubLink).toHaveAttribute("href", /github.com/);

    const twitterLink = page.getByLabelText(/twitter/i);
    await expect(twitterLink).toHaveAttribute("href", /twitter.com/);
  });

  test("request tool button opens GitHub issue", async ({ page }) => {
    await page.goto("/");

    // Click request tool button
    const requestButton = page.getByText(/request tool/i);
    await requestButton.click();

    // Check if GitHub issue page opens
    await expect(page).toHaveURL(/github.com.*issues/);
  });

  test("theme switcher works across pages", async ({ page }) => {
    await page.goto("/");

    // Switch to dark theme
    const themeButton = page.getByLabelText(/toggle theme/i);
    await themeButton.click();

    // Check if dark theme is applied
    await expect(page.locator("html")).toHaveAttribute("class", /dark/);

    // Navigate to another page
    await page.getByText("Text Counter").click();

    // Check if dark theme persists
    await expect(page.locator("html")).toHaveAttribute("class", /dark/);

    // Switch back to light theme
    await themeButton.click();
    await expect(page.locator("html")).not.toHaveAttribute("class", /dark/);
  });

  test("navigation state is preserved during page refresh", async ({
    page,
  }) => {
    await page.goto("/tools/text-counter");

    // Refresh the page
    await page.reload();

    // Check if we're still on the same page
    await expect(page).toHaveURL("/tools/text-counter");
    await expect(page.getByText("Text Counter")).toBeVisible();
  });
});
