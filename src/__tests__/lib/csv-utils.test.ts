import { describe, it, expect } from "vitest";
import {
  exportExpensesToCSV,
  parseExpensesFromCSV,
  exportBudgetsToCSV,
  parseBudgetsFromCSV,
  convertCSVToExpenses,
} from "@/lib/csv-utils";
import type { Expense, Budget } from "@/store/expense-store";

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: "1",
    description: "Coffee",
    amount: 4.5,
    category: "Food & Dining",
    date: "2024-01-15",
    tags: ["coffee"],
    notes: "Morning coffee",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeBudget(overrides: Partial<Budget> = {}): Budget {
  return {
    id: "b1",
    category: "Food & Dining",
    limit: 500,
    period: "monthly",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// ── exportExpensesToCSV() ─────────────────────────────────────────────────────
describe("exportExpensesToCSV()", () => {
  it("produces a CSV string with a header row", () => {
    const csv = exportExpensesToCSV([makeExpense()]);
    const [header] = csv.split("\n");
    expect(header).toContain("Date");
    expect(header).toContain("Description");
    expect(header).toContain("Amount");
    expect(header).toContain("Category");
  });

  it("includes expense data in the CSV", () => {
    const expense = makeExpense({ amount: 12.99, description: "Lunch" });
    const csv = exportExpensesToCSV([expense]);
    expect(csv).toContain("12.99");
    expect(csv).toContain("Lunch");
  });

  it("returns only a header for an empty array", () => {
    const csv = exportExpensesToCSV([]);
    const lines = csv.split("\n").filter(Boolean);
    expect(lines.length).toBe(1);
  });

  it("escapes double quotes in description", () => {
    const expense = makeExpense({ description: 'Say "hello"' });
    const csv = exportExpensesToCSV([expense]);
    // Escaped as ""hello""
    expect(csv).toContain('""hello""');
  });
});

// ── parseExpensesFromCSV() / round-trip ───────────────────────────────────────
describe("parseExpensesFromCSV() round-trip", () => {
  it("parses back the same records that were exported", () => {
    const original = [
      makeExpense({ description: "Grocery run", amount: 85.5, tags: ["food"] }),
      makeExpense({ description: "Gas", amount: 45.2, category: "Transportation", tags: ["fuel"] }),
    ];
    const csv = exportExpensesToCSV(original);
    const parsed = parseExpensesFromCSV(csv);

    expect(parsed.length).toBe(2);
    expect(parsed[0].description).toBe("Grocery run");
    expect(parsed[0].amount).toBe("85.50");
    expect(parsed[1].category).toBe("Transportation");
  });

  it("handles descriptions with embedded commas after quoting", () => {
    const expense = makeExpense({ description: "Milk, eggs, and butter" });
    const csv = exportExpensesToCSV([expense]);
    const parsed = parseExpensesFromCSV(csv);
    expect(parsed[0].description).toBe("Milk, eggs, and butter");
  });

  it("handles missing optional notes and tags", () => {
    const expense = makeExpense({ notes: undefined, tags: [] });
    const csv = exportExpensesToCSV([expense]);
    const parsed = parseExpensesFromCSV(csv);
    expect(parsed[0].notes).toBe("");
    expect(parsed[0].tags).toBe("");
  });
});

// ── exportBudgetsToCSV() / parseBudgetsFromCSV() ──────────────────────────────
describe("exportBudgetsToCSV() + parseBudgetsFromCSV()", () => {
  it("round-trips budget data correctly", () => {
    const budgets = [
      makeBudget({ category: "Food & Dining", limit: 500, period: "monthly" }),
      makeBudget({ category: "Transportation", limit: 200, period: "weekly" }),
    ];
    const csv = exportBudgetsToCSV(budgets);
    const parsed = parseBudgetsFromCSV(csv);

    expect(parsed.length).toBe(2);
    expect(parsed[0].category).toBe("Food & Dining");
    expect(parsed[0].limit).toBe("500.00");
    expect(parsed[0].period).toBe("monthly");
    expect(parsed[1].period).toBe("weekly");
  });
});

// ── convertCSVToExpenses() ────────────────────────────────────────────────────
describe("convertCSVToExpenses()", () => {
  it("converts CSV rows to Expense-like objects", () => {
    const csvExpenses = [
      {
        date: "2024-01-15",
        description: "Groceries",
        amount: "85.50",
        category: "Food & Dining",
        notes: "Weekly shop",
        tags: "food,weekly",
      },
    ];
    const expenses = convertCSVToExpenses(csvExpenses);
    expect(expenses[0].amount).toBe(85.5);
    expect(expenses[0].tags).toEqual(["food", "weekly"]);
    expect(expenses[0].description).toBe("Groceries");
  });

  it("defaults amount to 0 for invalid number strings", () => {
    const csvExpenses = [
      {
        date: "2024-01-15",
        description: "Test",
        amount: "not-a-number",
        category: "Other",
      },
    ];
    const expenses = convertCSVToExpenses(csvExpenses);
    expect(expenses[0].amount).toBe(0);
  });
});
