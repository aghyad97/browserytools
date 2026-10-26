import { test, expect, type Page } from "@playwright/test";

// The SEO block is a server component that each tool page renders with an
// explicit slug. These specs guard against it going stale after in-app
// (next/link) navigation, where only the changed page segment re-renders.

async function faqJsonLd(page: Page): Promise<string> {
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  return blocks.find((b) => b.includes('"FAQPage"')) ?? "";
}

test("SEO block follows an in-app navigation (unprefixed)", async ({ page }) => {
  await page.goto("/tools/json-formatter");
  const block = page.locator("[data-seo-content]");
  await expect(block.getByText(/About JSON Formatter/i)).toBeVisible();

  await block.locator('a[href="/tools/base64"]').first().click();
  await page.waitForURL("**/tools/base64");

  await expect(block.getByText(/About Base64/i)).toBeVisible();
  await expect(block.getByText(/About JSON Formatter/i)).toHaveCount(0);
  const faq = await faqJsonLd(page);
  expect(faq).toContain("Base64");
  expect(faq).not.toContain("JSON Formatter");
});

test("SEO block follows an in-app navigation (locale-prefixed)", async ({ page }) => {
  await page.goto("/ru/tools/compress-image-to-1mb");
  const block = page.locator("[data-seo-content]");
  await expect(block.getByText("Зачем сжимать до 1 МБ?")).toBeVisible();
  const before = await block.innerText();

  // The related-tool tiles in the tool shell are locale-prefixed, so this is a
  // real /ru -> /ru client-side navigation.
  const link = page.locator('a[href="/ru/tools/compress-image-to-50kb"]').first();
  await link.click();
  await page.waitForURL("**/ru/tools/compress-image-to-50kb");

  await expect(block.getByText("Зачем сжимать до 1 МБ?")).toHaveCount(0);
  await expect(block).toContainText("50");
  const after = await block.innerText();
  expect(after).not.toBe(before);
  const faq = await faqJsonLd(page);
  expect(faq).not.toContain("Зачем сжимать до 1 МБ?");
});
