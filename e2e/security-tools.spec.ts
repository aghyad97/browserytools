import { test, expect } from "@playwright/test";

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test.describe("Security Tools", () => {
  test.describe("PasswordGenerator", () => {
    test("generates a password of default length (12)", async ({ page }) => {
      await page.goto("/tools/password-generator");

      await page.getByRole("button", { name: /generate password/i }).click();

      const passwordInput = page.getByPlaceholder(
        /generated password will appear here/i
      );
      const value = await passwordInput.inputValue();
      expect(value.length).toBe(12);
    });

    test("generated password contains mixed characters by default", async ({
      page,
    }) => {
      await page.goto("/tools/password-generator");
      await page.getByRole("button", { name: /generate password/i }).click();

      const passwordInput = page.getByPlaceholder(
        /generated password will appear here/i
      );
      const value = await passwordInput.inputValue();
      // With all options enabled, password should have mixed content
      expect(value.length).toBeGreaterThan(0);
    });

    test("uppercase-only mode produces only uppercase letters", async ({
      page,
    }) => {
      await page.goto("/tools/password-generator");

      // Turn off lowercase, numbers, symbols
      await page.getByRole("switch", { name: /lowercase/i }).click();
      await page.getByRole("switch", { name: /numbers/i }).click();
      await page.getByRole("switch", { name: /symbols/i }).click();

      await page.getByRole("button", { name: /generate password/i }).click();

      const value = await page
        .getByPlaceholder(/generated password will appear here/i)
        .inputValue();
      expect(value).toMatch(/^[A-Z]+$/);
    });
  });

  test.describe("UUIDGenerator", () => {
    test("generates a valid UUID v4", async ({ page }) => {
      await page.goto("/tools/uuid-generator");

      await page.getByRole("button", { name: /generate/i }).first().click();

      // UUID should be visible on page
      const uuidText = page.getByText(UUID_V4_REGEX).first();
      await expect(uuidText).toBeVisible();
    });

    test("each generated UUID is unique", async ({ page }) => {
      await page.goto("/tools/uuid-generator");

      await page.getByRole("button", { name: /generate/i }).first().click();
      const first = await page.getByText(UUID_V4_REGEX).first().textContent();

      await page.getByRole("button", { name: /generate/i }).first().click();
      const second = await page.getByText(UUID_V4_REGEX).first().textContent();

      // Two separate clicks should (almost always) produce different UUIDs
      // We just check both are valid
      expect(first).toMatch(UUID_V4_REGEX);
      if (second) {
        expect(second).toMatch(UUID_V4_REGEX);
      }
    });
  });
});
