import { test, expect } from "@playwright/test";
import path from "path";

test.describe("PDF Tools", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tools/pdf");
  });

  test("loads the PDF tools page", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "PDF Tools" })
    ).toBeVisible();
    await expect(
      page.getByText("Merge, split, compress, and manipulate PDF files")
    ).toBeVisible();
  });

  test("uploads PDF file", async ({ page }) => {
    // Create a mock PDF file
    const pdfPath = path.join(__dirname, "fixtures", "sample.pdf");

    // Upload the file
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([pdfPath]);

    // Check if file is uploaded
    await expect(page.getByText("sample.pdf")).toBeVisible();
  });

  test("uploads multiple PDF files", async ({ page }) => {
    const pdfPath1 = path.join(__dirname, "fixtures", "sample1.pdf");
    const pdfPath2 = path.join(__dirname, "fixtures", "sample2.pdf");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([pdfPath1, pdfPath2]);

    // Check if both files are uploaded
    await expect(page.getByText("sample1.pdf")).toBeVisible();
    await expect(page.getByText("sample2.pdf")).toBeVisible();
  });

  test("enables merge tool when multiple files are uploaded", async ({
    page,
  }) => {
    const pdfPath1 = path.join(__dirname, "fixtures", "sample1.pdf");
    const pdfPath2 = path.join(__dirname, "fixtures", "sample2.pdf");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([pdfPath1, pdfPath2]);

    // Check if merge button is enabled
    const mergeButton = page.getByText("Merge PDFs");
    await expect(mergeButton).not.toBeDisabled();
  });

  test("disables merge tool when less than 2 files are uploaded", async ({
    page,
  }) => {
    const pdfPath = path.join(__dirname, "fixtures", "sample.pdf");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([pdfPath]);

    // Check if merge button is disabled
    const mergeButton = page.getByText("Merge PDFs");
    await expect(mergeButton).toBeDisabled();
  });

  test("enables split tool when file is uploaded", async ({ page }) => {
    const pdfPath = path.join(__dirname, "fixtures", "sample.pdf");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([pdfPath]);

    // Check if split button is enabled
    const splitButton = page.getByText("Split PDF");
    await expect(splitButton).not.toBeDisabled();
  });

  test("shows split dialog when split button is clicked", async ({ page }) => {
    const pdfPath = path.join(__dirname, "fixtures", "sample.pdf");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([pdfPath]);

    const splitButton = page.getByText("Split PDF");
    await splitButton.click();

    // Check if split dialog is shown
    await expect(page.getByText(/split pdf/i)).toBeVisible();
    await expect(page.getByPlaceholder(/page ranges/i)).toBeVisible();
  });

  test("validates page ranges in split dialog", async ({ page }) => {
    const pdfPath = path.join(__dirname, "fixtures", "sample.pdf");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([pdfPath]);

    const splitButton = page.getByText("Split PDF");
    await splitButton.click();

    const pageRangeInput = page.getByPlaceholder(/page ranges/i);
    await pageRangeInput.fill("1-3,5,7-10");

    const confirmSplitButton = page.getByText("Split PDF");
    await confirmSplitButton.click();

    // Check if split operation starts
    await expect(page.getByText(/splitting/i)).toBeVisible();
  });

  test("enables compress tool when file is uploaded", async ({ page }) => {
    const pdfPath = path.join(__dirname, "fixtures", "sample.pdf");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([pdfPath]);

    // Check if compress button is enabled
    const compressButton = page.getByText("Compress PDF");
    await expect(compressButton).not.toBeDisabled();
  });

  test("enables rotate tools when file is uploaded", async ({ page }) => {
    const pdfPath = path.join(__dirname, "fixtures", "sample.pdf");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([pdfPath]);

    // Check if rotate buttons are enabled
    const rotateCwButton = page.getByText("Rotate PDF");
    const rotateCcwButton = page.getByText("Rotate PDF (CCW)");
    await expect(rotateCwButton).not.toBeDisabled();
    await expect(rotateCcwButton).not.toBeDisabled();
  });

  test("shows file information after upload", async ({ page }) => {
    const pdfPath = path.join(__dirname, "fixtures", "sample.pdf");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([pdfPath]);

    // Check if file information is shown
    await expect(page.getByText(/file size/i)).toBeVisible();
    await expect(page.getByText(/pages/i)).toBeVisible();
  });

  test("removes file when remove button is clicked", async ({ page }) => {
    const pdfPath = path.join(__dirname, "fixtures", "sample.pdf");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([pdfPath]);

    // Check if file is uploaded
    await expect(page.getByText("sample.pdf")).toBeVisible();

    // Remove the file
    const removeButton = page.getByRole("button", { name: /remove file/i });
    await removeButton.click();

    // Check if file is removed
    await expect(page.getByText("sample.pdf")).not.toBeVisible();
  });

  test("handles drag and drop file upload", async ({ page }) => {
    const pdfPath = path.join(__dirname, "fixtures", "sample.pdf");

    // Get the drop area
    const dropArea = page.getByText(/drag and drop/i);

    // Simulate drag and drop
    await dropArea.setInputFiles([pdfPath]);

    // Check if file is uploaded
    await expect(page.getByText("sample.pdf")).toBeVisible();
  });

  test("shows progress during operations", async ({ page }) => {
    const pdfPath = path.join(__dirname, "fixtures", "sample.pdf");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([pdfPath]);

    const compressButton = page.getByText("Compress PDF");
    await compressButton.click();

    // Check if progress is shown
    await expect(page.getByText(/processing/i)).toBeVisible();
  });

  test("responsive design works on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if the tool is still functional on mobile
    await expect(page.getByText("PDF Tools")).toBeVisible();
    await expect(page.getByText(/drag and drop/i)).toBeVisible();
  });
});
