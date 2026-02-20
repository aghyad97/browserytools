import { test, expect, chromium } from "@playwright/test";

test.describe("Text Tools", () => {
  test("TextCaseConverter converts input to uppercase", async ({ page }) => {
    await page.goto("/tools/text-case");

    const input = page.getByPlaceholder("Enter your text here...");
    await input.fill("hello world");

    await page.getByRole("tab", { name: "UPPER" }).click();

    const output = page.getByPlaceholder("Converted text will appear here...");
    await expect(output).toHaveValue("HELLO WORLD");
  });

  test("TextCaseConverter converts to snake_case", async ({ page }) => {
    await page.goto("/tools/text-case");

    await page.getByPlaceholder("Enter your text here...").fill("hello world");
    await page.getByRole("tab", { name: "snake_case" }).click();

    await expect(
      page.getByPlaceholder("Converted text will appear here...")
    ).toHaveValue("hello_world");
  });

  test("Copy button copies text to clipboard", async ({ browser }) => {
    const context = await browser.newContext();
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const page = await context.newPage();

    await page.goto("/tools/text-case");
    await page.getByPlaceholder("Enter your text here...").fill("copy this");
    await page.getByRole("tab", { name: "UPPER" }).click();
    await page.getByRole("button", { name: /copy/i }).click();

    const clipboardContent = await page.evaluate(() =>
      navigator.clipboard.readText()
    );
    expect(clipboardContent).toBe("COPY THIS");

    await context.close();
  });

  test("Clear button resets both text areas", async ({ page }) => {
    await page.goto("/tools/text-case");

    await page.getByPlaceholder("Enter your text here...").fill("some text");
    await page.getByRole("tab", { name: "UPPER" }).click();
    await page.getByRole("button", { name: /clear/i }).click();

    await expect(page.getByPlaceholder("Enter your text here...")).toHaveValue(
      ""
    );
    await expect(
      page.getByPlaceholder("Converted text will appear here...")
    ).toHaveValue("");
  });
});
