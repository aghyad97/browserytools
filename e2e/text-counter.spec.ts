import { test, expect } from "@playwright/test";

test.describe("Text Counter Tool", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tools/text-counter");
  });

  test("loads the text counter tool", async ({ page }) => {
    await expect(page.getByText("Text Counter")).toBeVisible();
    await expect(
      page.getByText("Analyze and count text content")
    ).toBeVisible();
  });

  test("counts text statistics correctly", async ({ page }) => {
    const textarea = page.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    const testText = "Hello world! This is a test.";

    await textarea.fill(testText);

    // Check if statistics are displayed
    await expect(page.getByText("Characters:")).toBeVisible();
    await expect(page.getByText("Words:")).toBeVisible();
    await expect(page.getByText("Lines:")).toBeVisible();

    // Check specific counts
    await expect(page.getByText("6")).toBeVisible(); // 6 words
    await expect(page.getByText("1")).toBeVisible(); // 1 line
  });

  test("clears text when clear button is clicked", async ({ page }) => {
    const textarea = page.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    const clearButton = page.getByText("Clear");

    await textarea.fill("Some text");
    await clearButton.click();

    await expect(textarea).toHaveValue("");
  });

  test("copies text to clipboard", async ({ page }) => {
    const textarea = page.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    const copyButton = page.getByText("Copy Text");
    const testText = "Hello world!";

    await textarea.fill(testText);
    await copyButton.click();

    // Check if clipboard contains the text
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText()
    );
    expect(clipboardText).toBe(testText);
  });

  test("uploads and processes text file", async ({ page }) => {
    // Create a test file
    const fileContent = "This is a test file content.";
    const file = new File([fileContent], "test.txt", { type: "text/plain" });

    // Upload the file
    const fileInput = page.getByLabelText(/upload file/i);
    await fileInput.setInputFiles([file]);

    // Check if the text is loaded
    const textarea = page.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    await expect(textarea).toHaveValue(fileContent);
  });

  test("shows reading time estimation", async ({ page }) => {
    const textarea = page.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    const longText =
      "This is a long text that should take some time to read. ".repeat(20);

    await textarea.fill(longText);

    // Check if reading time is displayed
    await expect(page.getByText(/reading time/i)).toBeVisible();
  });

  test("shows character frequency analysis", async ({ page }) => {
    const textarea = page.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    const testText = "hello world";

    await textarea.fill(testText);

    // Check if character frequency is displayed
    await expect(page.getByText(/character frequency/i)).toBeVisible();
  });

  test("handles empty text gracefully", async ({ page }) => {
    const textarea = page.getByPlaceholderText(
      "Enter or paste your text here..."
    );

    await textarea.fill("");

    // Check if all counts are zero
    await expect(page.getByText("0")).toBeVisible();
  });

  test("responsive design works on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if the tool is still functional on mobile
    const textarea = page.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    await textarea.fill("Test text");

    await expect(page.getByText("Characters:")).toBeVisible();
  });
});
