import { test, expect, type Page } from "@playwright/test";

// The SEO block is a server component keyed off the request pathname. These
// specs guard against it going stale after in-app (next/link) navigation, where
// shared layouts are reused and only changed segments re-render.

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

  const link = block.locator('a[href*="/tools/compress-image-to-500kb"]').first();
  const href = await link.getAttribute("href");
  await link.click();
  await page.waitForURL(`**${href}`);

  await expect(block.getByText("Зачем сжимать до 1 МБ?")).toHaveCount(0);
  await expect(block).toContainText("500");
  const after = await block.innerText();
  expect(after).not.toBe(before);
  const faq = await faqJsonLd(page);
  expect(faq).not.toContain("Зачем сжимать до 1 МБ?");
});
