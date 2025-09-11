import { Expense, Budget } from "@/store/expense-store";

export interface CSVExpense {
  date: string;
  description: string;
  amount: string;
  category: string;
  notes?: string;
  tags?: string;
}

export interface CSVBudget {
  category: string;
  limit: string;
  period: string;
}

// Example CSV data for templates
export const exampleExpenses: CSVExpense[] = [
  {
    date: "2024-01-15",
    description: "Grocery Shopping",
    amount: "85.50",
    category: "Food & Dining",
    notes: "Weekly groceries at Whole Foods",
    tags: "groceries,weekly",
  },
  {
    date: "2024-01-16",
    description: "Gas Station",
    amount: "45.20",
    category: "Transportation",
    notes: "Fuel for car",
    tags: "gas,fuel",
  },
  {
    date: "2024-01-17",
    description: "Netflix Subscription",
    amount: "15.99",
    category: "Entertainment",
    notes: "Monthly streaming service",
    tags: "streaming,subscription",
  },
  {
    date: "2024-01-18",
    description: "Coffee Shop",
    amount: "4.75",
    category: "Food & Dining",
    notes: "Morning coffee",
    tags: "coffee,breakfast",
  },
  {
    date: "2024-01-19",
    description: "Office Supplies",
    amount: "32.40",
    category: "Work & Business",
    notes: "Notebooks and pens",
    tags: "office,supplies",
  },
];

export const exampleBudgets: CSVBudget[] = [
  {
    category: "Food & Dining",
    limit: "500.00",
    period: "monthly",
  },
  {
    category: "Transportation",
    limit: "200.00",
    period: "monthly",
  },
  {
    category: "Entertainment",
    limit: "100.00",
    period: "monthly",
  },
  {
    category: "Work & Business",
    limit: "150.00",
    period: "monthly",
  },
];

// Convert expenses to CSV format
export function exportExpensesToCSV(expenses: Expense[]): string {
  const headers = [
    "Date",
    "Description",
    "Amount",
    "Category",
    "Notes",
    "Tags",
  ];
  const csvContent = [
    headers.join(","),
    ...expenses.map((expense) =>
      [
        expense.date,
        `"${expense.description.replace(/"/g, '""')}"`,
        expense.amount.toFixed(2),
        `"${expense.category}"`,
        `"${expense.notes?.replace(/"/g, '""') || ""}"`,
        `"${expense.tags.join(",")}"`,
      ].join(",")
    ),
  ].join("\n");

  return csvContent;
}

// Convert budgets to CSV format
export function exportBudgetsToCSV(budgets: Budget[]): string {
  const headers = ["Category", "Limit", "Period"];
  const csvContent = [
    headers.join(","),
    ...budgets.map((budget) =>
      [
        `"${budget.category}"`,
        budget.limit.toFixed(2),
        `"${budget.period}"`,
      ].join(",")
    ),
  ].join("\n");

  return csvContent;
}

// Parse CSV content to expenses
export function parseExpensesFromCSV(csvContent: string): CSVExpense[] {
  const lines = csvContent.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    return {
      date: values[0] || "",
      description: values[1] || "",
      amount: values[2] || "0",
      category: values[3] || "",
      notes: values[4] || "",
      tags: values[5] || "",
    };
  });
}

// Parse CSV content to budgets
export function parseBudgetsFromCSV(csvContent: string): CSVBudget[] {
  const lines = csvContent.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    return {
      category: values[0] || "",
      limit: values[1] || "0",
      period: values[2] || "monthly",
    };
  });
}

// Helper function to parse CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

// Convert CSV data to Expense objects
export function convertCSVToExpenses(
  csvExpenses: CSVExpense[]
): Omit<Expense, "id">[] {
  return csvExpenses.map((expense) => ({
    date: expense.date,
    description: expense.description,
    amount: parseFloat(expense.amount) || 0,
    category: expense.category,
    notes: expense.notes || "",
    tags: expense.tags ? expense.tags.split(",").map((tag) => tag.trim()) : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

// Convert CSV data to Budget objects
export function convertCSVToBudgets(
  csvBudgets: CSVBudget[]
): Omit<Budget, "id">[] {
  return csvBudgets.map((budget) => ({
    category: budget.category,
    limit: parseFloat(budget.limit) || 0,
    period: budget.period as "weekly" | "monthly" | "yearly",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

// Download CSV file
export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate example CSV content
export function generateExampleExpensesCSV(): string {
  return exportExpensesToCSV(
    convertCSVToExpenses(exampleExpenses) as Expense[]
  );
}

export function generateExampleBudgetsCSV(): string {
  return exportBudgetsToCSV(convertCSVToBudgets(exampleBudgets) as Budget[]);
}
