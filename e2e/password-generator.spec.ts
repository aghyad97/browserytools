import { test, expect } from "@playwright/test";

test.describe("Password Generator Tool", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tools/password-generator");
  });

  test("loads the password generator tool", async ({ page }) => {
    await expect(page.getByText("Password Generator")).toBeVisible();
    await expect(page.getByText("Generate secure passwords")).toBeVisible();
  });

  test("generates password with default settings", async ({ page }) => {
    const generateButton = page.getByText("Generate Password");
    await generateButton.click();

    // Check if password is generated
    const passwordInput = page.getByDisplayValue(/./);
    await expect(passwordInput).toBeVisible();

    // Check if password has default length
    const password = await passwordInput.inputValue();
    expect(password.length).toBeGreaterThan(0);
  });

  test("adjusts password length with slider", async ({ page }) => {
    const lengthSlider = page.getByRole("slider", { name: /length/i });
    await lengthSlider.fill("20");

    const generateButton = page.getByText("Generate Password");
    await generateButton.click();

    // Check if password has correct length
    const passwordInput = page.getByDisplayValue(/./);
    const password = await passwordInput.inputValue();
    expect(password.length).toBe(20);
  });

  test("toggles character type options", async ({ page }) => {
    const uppercaseCheckbox = page.getByLabelText(/uppercase/i);
    const lowercaseCheckbox = page.getByLabelText(/lowercase/i);
    const numbersCheckbox = page.getByLabelText(/numbers/i);
    const symbolsCheckbox = page.getByLabelText(/symbols/i);

    // Test toggling options
    await uppercaseCheckbox.click();
    await expect(uppercaseCheckbox).not.toBeChecked();

    await lowercaseCheckbox.click();
    await expect(lowercaseCheckbox).not.toBeChecked();

    await numbersCheckbox.click();
    await expect(numbersCheckbox).not.toBeChecked();

    await symbolsCheckbox.click();
    await expect(symbolsCheckbox).not.toBeChecked();
  });

  test("prevents generation when no character types are selected", async ({
    page,
  }) => {
    // Uncheck all character type options
    const uppercaseCheckbox = page.getByLabelText(/uppercase/i);
    const lowercaseCheckbox = page.getByLabelText(/lowercase/i);
    const numbersCheckbox = page.getByLabelText(/numbers/i);
    const symbolsCheckbox = page.getByLabelText(/symbols/i);

    await uppercaseCheckbox.click();
    await lowercaseCheckbox.click();
    await numbersCheckbox.click();
    await symbolsCheckbox.click();

    const generateButton = page.getByText("Generate Password");
    await expect(generateButton).toBeDisabled();
  });

  test("copies generated password to clipboard", async ({ page }) => {
    const generateButton = page.getByText("Generate Password");
    await generateButton.click();

    const copyButton = page.getByText("Copy");
    await copyButton.click();

    // Check if password is copied to clipboard
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText()
    );
    expect(clipboardText.length).toBeGreaterThan(0);
  });

  test("shows password strength indicator", async ({ page }) => {
    const generateButton = page.getByText("Generate Password");
    await generateButton.click();

    // Check if strength indicator is shown
    await expect(page.getByText(/strength/i)).toBeVisible();
  });

  test("generates multiple passwords", async ({ page }) => {
    const generateButton = page.getByText("Generate Password");
    await generateButton.click();

    const generateMoreButton = page.getByText("Generate More");
    await generateMoreButton.click();

    // Check if multiple passwords are generated
    const passwordInputs = page.getByDisplayValue(/./);
    await expect(passwordInputs).toHaveCount(2);
  });

  test("excludes similar characters when option is enabled", async ({
    page,
  }) => {
    const excludeSimilarCheckbox = page.getByLabelText(/exclude similar/i);
    await excludeSimilarCheckbox.click();

    const generateButton = page.getByText("Generate Password");
    await generateButton.click();

    // Check if password doesn't contain similar characters
    const passwordInput = page.getByDisplayValue(/./);
    const password = await passwordInput.inputValue();
    expect(password).not.toMatch(/[0OlI]/);
  });

  test("excludes ambiguous characters when option is enabled", async ({
    page,
  }) => {
    const excludeAmbiguousCheckbox = page.getByLabelText(/exclude ambiguous/i);
    await excludeAmbiguousCheckbox.click();

    const generateButton = page.getByText("Generate Password");
    await generateButton.click();

    // Check if password doesn't contain ambiguous characters
    const passwordInput = page.getByDisplayValue(/./);
    const password = await passwordInput.inputValue();
    expect(password).not.toMatch(/[{}[\]()\/\\~,;.<>]/);
  });

  test("includes custom characters when specified", async ({ page }) => {
    const customCharsInput = page.getByPlaceholderText(/custom characters/i);
    await customCharsInput.fill("!@#$%");

    const generateButton = page.getByText("Generate Password");
    await generateButton.click();

    // Check if password contains custom characters
    const passwordInput = page.getByDisplayValue(/./);
    const password = await passwordInput.inputValue();
    expect(password).toMatch(/[!@#$%]/);
  });

  test("responsive design works on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if the tool is still functional on mobile
    const generateButton = page.getByText("Generate Password");
    await generateButton.click();

    await expect(page.getByDisplayValue(/./)).toBeVisible();
  });
});
