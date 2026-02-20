import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExpenseStore } from "@/store/expense-store";

const defaultCategories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Subscriptions",
  "Other",
];

const initialState = {
  expenses: [],
  budgets: [],
  categories: defaultCategories,
  filters: {
    category: "",
    dateRange: { start: "", end: "" },
    minAmount: 0,
    maxAmount: 10000,
    tags: [],
  },
};

beforeEach(() => {
  useExpenseStore.setState(initialState);
});

// ── addExpense ────────────────────────────────────────────────────────────────
describe("useExpenseStore — addExpense", () => {
  it("adds an expense and auto-generates an id", () => {
    const { result } = renderHook(() => useExpenseStore());
    act(() => {
      result.current.addExpense({
        description: "Coffee",
        amount: 4.5,
        category: "Food & Dining",
        date: "2024-01-15",
        tags: [],
      });
    });
    expect(result.current.expenses).toHaveLength(1);
    expect(result.current.expenses[0].description).toBe("Coffee");
    expect(result.current.expenses[0].id).toBeTruthy();
  });

  it("accumulates multiple expenses", () => {
    const { result } = renderHook(() => useExpenseStore());
    act(() => {
      result.current.addExpense({
        description: "Coffee",
        amount: 4.5,
        category: "Food & Dining",
        date: "2024-01-15",
        tags: [],
      });
      result.current.addExpense({
        description: "Bus fare",
        amount: 2.0,
        category: "Transportation",
        date: "2024-01-15",
        tags: [],
      });
    });
    expect(result.current.expenses).toHaveLength(2);
  });
});

// ── deleteExpense ─────────────────────────────────────────────────────────────
describe("useExpenseStore — deleteExpense", () => {
  it("removes an expense by id", () => {
    const { result } = renderHook(() => useExpenseStore());
    act(() => {
      result.current.addExpense({
        description: "Keep",
        amount: 10,
        category: "Other",
        date: "2024-01-01",
        tags: [],
      });
      result.current.addExpense({
        description: "Delete",
        amount: 20,
        category: "Other",
        date: "2024-01-01",
        tags: [],
      });
    });
    const deleteId = result.current.expenses[1].id;
    act(() => { result.current.deleteExpense(deleteId); });
    expect(result.current.expenses).toHaveLength(1);
    expect(result.current.expenses[0].description).toBe("Keep");
  });
});

// ── getFilteredExpenses ───────────────────────────────────────────────────────
describe("useExpenseStore — getFilteredExpenses", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useExpenseStore());
    act(() => {
      result.current.addExpense({
        description: "Lunch",
        amount: 12,
        category: "Food & Dining",
        date: "2024-01-15",
        tags: ["lunch"],
      });
      result.current.addExpense({
        description: "Gas",
        amount: 45,
        category: "Transportation",
        date: "2024-01-16",
        tags: ["fuel"],
      });
    });
  });

  it("returns all expenses when no filters are applied", () => {
    const { result } = renderHook(() => useExpenseStore());
    const filtered = result.current.getFilteredExpenses();
    expect(filtered).toHaveLength(2);
  });

  it("filters by category", () => {
    const { result } = renderHook(() => useExpenseStore());
    act(() => {
      result.current.setFilters({ category: "Food & Dining" });
    });
    const filtered = result.current.getFilteredExpenses();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].description).toBe("Lunch");
  });

  it("filters by amount range", () => {
    const { result } = renderHook(() => useExpenseStore());
    act(() => {
      result.current.setFilters({ minAmount: 20, maxAmount: 100 });
    });
    const filtered = result.current.getFilteredExpenses();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].description).toBe("Gas");
  });

  it("filters by tags", () => {
    const { result } = renderHook(() => useExpenseStore());
    act(() => {
      result.current.setFilters({ tags: ["fuel"] });
    });
    const filtered = result.current.getFilteredExpenses();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].description).toBe("Gas");
  });
});

// ── getCategoryTotals ─────────────────────────────────────────────────────────
describe("useExpenseStore — getCategoryTotals", () => {
  it("sums expenses per category", () => {
    const { result } = renderHook(() => useExpenseStore());
    act(() => {
      result.current.addExpense({
        description: "A",
        amount: 10,
        category: "Food & Dining",
        date: "2024-01-01",
        tags: [],
      });
      result.current.addExpense({
        description: "B",
        amount: 20,
        category: "Food & Dining",
        date: "2024-01-01",
        tags: [],
      });
      result.current.addExpense({
        description: "C",
        amount: 5,
        category: "Transportation",
        date: "2024-01-01",
        tags: [],
      });
    });
    const totals = result.current.getCategoryTotals();
    expect(totals["Food & Dining"]).toBe(30);
    expect(totals["Transportation"]).toBe(5);
  });
});

// ── getBudgetStatus ───────────────────────────────────────────────────────────
describe("useExpenseStore — getBudgetStatus", () => {
  it("reports spent, limit and remaining correctly", () => {
    const { result } = renderHook(() => useExpenseStore());
    act(() => {
      result.current.addBudget({
        category: "Food & Dining",
        limit: 100,
        period: "monthly",
      });
      result.current.addExpense({
        description: "Dinner",
        amount: 35,
        category: "Food & Dining",
        date: "2024-01-01",
        tags: [],
      });
    });
    const status = result.current.getBudgetStatus();
    expect(status["Food & Dining"].spent).toBe(35);
    expect(status["Food & Dining"].limit).toBe(100);
    expect(status["Food & Dining"].remaining).toBe(65);
  });
});
