import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: "monthly" | "weekly" | "yearly";
  createdAt: string;
}

export interface ExpenseFilters {
  category: string;
  dateRange: {
    start: string;
    end: string;
  };
  minAmount: number;
  maxAmount: number;
  tags: string[];
}

export interface ExpenseStore {
  expenses: Expense[];
  budgets: Budget[];
  categories: string[];
  filters: ExpenseFilters;

  // Expense actions
  addExpense: (
    expense: Omit<Expense, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Budget actions
  addBudget: (budget: Omit<Budget, "id" | "createdAt">) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  // Category actions
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;

  // Filter actions
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  clearFilters: () => void;

  // Utility functions
  getFilteredExpenses: () => Expense[];
  getExpensesByCategory: (category: string) => Expense[];
  getTotalExpenses: () => number;
  getExpensesByDateRange: (start: string, end: string) => Expense[];
  getCategoryTotals: () => Record<string, number>;
  getMonthlyExpenses: () => Record<string, number>;
  getBudgetStatus: () => Record<
    string,
    { spent: number; limit: number; remaining: number }
  >;
}

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

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      budgets: [],
      categories: defaultCategories,
      filters: {
        category: "",
        dateRange: {
          start: "",
          end: "",
        },
        minAmount: 0,
        maxAmount: 10000,
        tags: [],
      },

      addExpense: (expense) => {
        const newExpense: Expense = {
          ...expense,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          expenses: [...state.expenses, newExpense],
        }));
      },

      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id
              ? { ...expense, ...updates, updatedAt: new Date().toISOString() }
              : expense
          ),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      },

      addBudget: (budget) => {
        const newBudget: Budget = {
          ...budget,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          budgets: [...state.budgets, newBudget],
        }));
      },

      updateBudget: (id, updates) => {
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.id === id ? { ...budget, ...updates } : budget
          ),
        }));
      },

      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((budget) => budget.id !== id),
        }));
      },

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category],
        }));
      },

      removeCategory: (category) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat !== category),
        }));
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      clearFilters: () => {
        set({
          filters: {
            category: "",
            dateRange: { start: "", end: "" },
            minAmount: 0,
            maxAmount: 10000,
            tags: [],
          },
        });
      },

      getFilteredExpenses: () => {
        const { expenses, filters } = get();
        return expenses.filter((expense) => {
          if (filters.category && expense.category !== filters.category) {
            return false;
          }
          if (
            filters.dateRange.start &&
            expense.date < filters.dateRange.start
          ) {
            return false;
          }
          if (filters.dateRange.end && expense.date > filters.dateRange.end) {
            return false;
          }
          if (expense.amount < filters.minAmount) {
            return false;
          }
          if (expense.amount > filters.maxAmount) {
            return false;
          }
          if (filters.tags.length > 0) {
            const hasMatchingTag = filters.tags.some((tag) =>
              expense.tags.includes(tag)
            );
            if (!hasMatchingTag) {
              return false;
            }
          }
          return true;
        });
      },

      getExpensesByCategory: (category) => {
        const { expenses } = get();
        return expenses.filter((expense) => expense.category === category);
      },

      getTotalExpenses: () => {
        const { getFilteredExpenses } = get();
        return getFilteredExpenses().reduce(
          (total, expense) => total + expense.amount,
          0
        );
      },

      getExpensesByDateRange: (start, end) => {
        const { expenses } = get();
        return expenses.filter(
          (expense) => expense.date >= start && expense.date <= end
        );
      },

      getCategoryTotals: () => {
        const { getFilteredExpenses } = get();
        const filteredExpenses = getFilteredExpenses();
        return filteredExpenses.reduce((totals, expense) => {
          totals[expense.category] =
            (totals[expense.category] || 0) + expense.amount;
          return totals;
        }, {} as Record<string, number>);
      },

      getMonthlyExpenses: () => {
        const { getFilteredExpenses } = get();
        const filteredExpenses = getFilteredExpenses();
        return filteredExpenses.reduce((totals, expense) => {
          const month = expense.date.substring(0, 7); // YYYY-MM
          totals[month] = (totals[month] || 0) + expense.amount;
          return totals;
        }, {} as Record<string, number>);
      },

      getBudgetStatus: () => {
        const { budgets, getFilteredExpenses } = get();
        const filteredExpenses = getFilteredExpenses();
        const status: Record<
          string,
          { spent: number; limit: number; remaining: number }
        > = {};

        budgets.forEach((budget) => {
          const spent = filteredExpenses
            .filter((expense) => expense.category === budget.category)
            .reduce((total, expense) => total + expense.amount, 0);

          status[budget.category] = {
            spent,
            limit: budget.limit,
            remaining: budget.limit - spent,
          };
        });

        return status;
      },

      // Import/Export actions
      importExpenses: (expenses: Omit<Expense, "id">[]) => {
        set((state) => {
          const newExpenses = expenses.map((expense) => ({
            ...expense,
            id: crypto.randomUUID(),
          }));

          // Add new categories from imported expenses
          const newCategories = expenses
            .map((expense) => expense.category)
            .filter((category) => !state.categories.includes(category));

          return {
            expenses: [...state.expenses, ...newExpenses],
            categories: [...state.categories, ...newCategories],
          };
        });
      },

      importBudgets: (budgets: Omit<Budget, "id">[]) => {
        set((state) => {
          const newBudgets = budgets.map((budget) => ({
            ...budget,
            id: crypto.randomUUID(),
          }));

          // Add new categories from imported budgets
          const newCategories = budgets
            .map((budget) => budget.category)
            .filter((category) => !state.categories.includes(category));

          return {
            budgets: [...state.budgets, ...newBudgets],
            categories: [...state.categories, ...newCategories],
          };
        });
      },

      exportExpenses: () => {
        const state = get();
        return state.expenses;
      },

      exportBudgets: () => {
        const state = get();
        return state.budgets;
      },

      clearAllData: () => {
        set({
          expenses: [],
          budgets: [],
          categories: [
            "Food & Dining",
            "Transportation",
            "Entertainment",
            "Work & Business",
            "Healthcare",
            "Shopping",
            "Utilities",
            "Other",
          ],
        });
      },
    }),
    {
      name: "expense-store",
      partialize: (state) => ({
        expenses: state.expenses,
        budgets: state.budgets,
        categories: state.categories,
      }),
    }
  )
);
