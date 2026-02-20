import { test, expect } from "@playwright/test";

test.describe("Productivity Tools — TodoList", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tools/todo");
    // Clear any persisted todos from previous tests
    await page.evaluate(() => localStorage.removeItem("todo-storage"));
    await page.reload();
  });

  test("displays empty state on first visit", async ({ page }) => {
    await expect(page.getByText(/add your first todo/i)).toBeVisible();
  });

  test("adds a new todo", async ({ page }) => {
    await page.getByPlaceholder(/what needs to be done/i).fill("Buy milk");
    await page.getByRole("button", { name: /^add$/i }).click();

    await expect(page.getByText("Buy milk")).toBeVisible();
  });

  test("toggles a todo to completed", async ({ page }) => {
    await page.getByPlaceholder(/what needs to be done/i).fill("Complete me");
    await page.getByRole("button", { name: /^add$/i }).click();

    const checkbox = page.getByRole("checkbox").first();
    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });

  test("deletes a todo", async ({ page }) => {
    await page.getByPlaceholder(/what needs to be done/i).fill("Delete me");
    await page.getByRole("button", { name: /^add$/i }).click();

    // Click the delete/trash button
    const deleteBtn = page.locator("button").filter({ has: page.locator("svg") }).last();
    await deleteBtn.click();

    await expect(page.getByText("Delete me")).not.toBeVisible();
  });

  test("todos persist across page reload", async ({ page }) => {
    await page.getByPlaceholder(/what needs to be done/i).fill("Persisted task");
    await page.getByRole("button", { name: /^add$/i }).click();

    await expect(page.getByText("Persisted task")).toBeVisible();

    await page.reload();
    await expect(page.getByText("Persisted task")).toBeVisible();
  });

  test("filter tabs show correct todos", async ({ page }) => {
    // Add two todos
    await page.getByPlaceholder(/what needs to be done/i).fill("Active task");
    await page.getByRole("button", { name: /^add$/i }).click();

    await page.getByPlaceholder(/what needs to be done/i).fill("Done task");
    await page.getByRole("button", { name: /^add$/i }).click();

    // Complete second todo
    const checkboxes = page.getByRole("checkbox");
    await checkboxes.nth(1).click();

    // Check Active tab
    await page.getByRole("tab", { name: /active/i }).click();
    await expect(page.getByText("Active task")).toBeVisible();
    await expect(page.getByText("Done task")).not.toBeVisible();

    // Check Completed tab
    await page.getByRole("tab", { name: /completed/i }).click();
    await expect(page.getByText("Done task")).toBeVisible();
    await expect(page.getByText("Active task")).not.toBeVisible();
  });
});
