import { test, expect } from "@playwright/test";

test.describe("Data Tools", () => {
  test.describe("Base64Converter", () => {
    test("encodes text to Base64 in real-time", async ({ page }) => {
      await page.goto("/tools/base64");

      const [inputArea] = await page.getByRole("textbox").all();
      await inputArea.fill("Hello World");

      const textareas = await page.getByRole("textbox").all();
      const outputValue = await textareas[1].inputValue();
      expect(outputValue).toBe("SGVsbG8gV29ybGQ=");
    });

    test("decodes Base64 back to original text", async ({ page }) => {
      await page.goto("/tools/base64");

      // Switch to decode mode
      await page.getByRole("combobox").click();
      await page.getByRole("option", { name: /decode/i }).click();

      const [inputArea] = await page.getByRole("textbox").all();
      await inputArea.fill("SGVsbG8gV29ybGQ=");

      const textareas = await page.getByRole("textbox").all();
      const outputValue = await textareas[1].inputValue();
      expect(outputValue).toBe("Hello World");
    });
  });

  test.describe("QRCodeGenerator", () => {
    test("generates a QR code from a URL input", async ({ page }) => {
      await page.goto("/tools/qr-generator");

      const input = page.getByRole("textbox").first();
      await input.fill("https://example.com");

      // Wait for QR code image to appear
      const qrImage = page.locator("img, canvas").first();
      await expect(qrImage).toBeVisible({ timeout: 5000 });
    });

    test("download button is available after QR generation", async ({
      page,
    }) => {
      await page.goto("/tools/qr-generator");

      const input = page.getByRole("textbox").first();
      await input.fill("https://example.com");

      await expect(
        page.getByRole("button", { name: /download/i }).first()
      ).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("NumberBaseConverter", () => {
    test("converts 255 decimal to binary 11111111 and hex FF", async ({
      page,
    }) => {
      await page.goto("/tools/number-base-converter");

      await page.getByLabel("Decimal").fill("255");

      await expect(page.getByLabel("Binary")).toHaveValue("11111111");
      await expect(page.getByLabel("Hexadecimal")).toHaveValue("FF");
    });
  });
});
