"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UploadIcon,
  DownloadIcon,
  FileTextIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  TrashIcon,
  FileIcon,
} from "lucide-react";
import { useExpenseStore } from "@/store/expense-store";
import {
  exportExpensesToCSV,
  exportBudgetsToCSV,
  parseExpensesFromCSV,
  parseBudgetsFromCSV,
  convertCSVToExpenses,
  convertCSVToBudgets,
  downloadCSV,
  generateExampleExpensesCSV,
  generateExampleBudgetsCSV,
} from "@/lib/csv-utils";
import { toast } from "sonner";

export default function ImportExport() {
  const [isImporting, setIsImporting] = useState(false);
  const [importType, setImportType] = useState<"expenses" | "budgets">(
    "expenses"
  );
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    importExpenses,
    importBudgets,
    exportExpenses,
    exportBudgets,
    clearAllData,
    expenses,
    budgets,
  } = useExpenseStore();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setImportResult({
        success: false,
        message: "Please select a CSV file",
      });
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();

      if (importType === "expenses") {
        const csvExpenses = parseExpensesFromCSV(text);
        const expenses = convertCSVToExpenses(csvExpenses);

        // Validate expenses
        const validExpenses = expenses.filter(
          (expense) =>
            expense.date &&
            expense.description &&
            expense.amount > 0 &&
            expense.category
        );

        if (validExpenses.length === 0) {
          throw new Error("No valid expenses found in the CSV file");
        }

        importExpenses(validExpenses);

        setImportResult({
          success: true,
          message: `Successfully imported ${validExpenses.length} expenses`,
          count: validExpenses.length,
        });

        toast.success(`Imported ${validExpenses.length} expenses`);
      } else {
        const csvBudgets = parseBudgetsFromCSV(text);
        const budgets = convertCSVToBudgets(csvBudgets);

        // Validate budgets
        const validBudgets = budgets.filter(
          (budget) => budget.category && budget.limit > 0 && budget.period
        );

        if (validBudgets.length === 0) {
          throw new Error("No valid budgets found in the CSV file");
        }

        importBudgets(validBudgets);

        setImportResult({
          success: true,
          message: `Successfully imported ${validBudgets.length} budgets`,
          count: validBudgets.length,
        });

        toast.success(`Imported ${validBudgets.length} budgets`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to import file";
      setImportResult({
        success: false,
        message: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleExport = (type: "expenses" | "budgets") => {
    try {
      if (type === "expenses") {
        const data = exportExpenses();
        if (data.length === 0) {
          toast.error("No expenses to export");
          return;
        }
        const csv = exportExpensesToCSV(data);
        downloadCSV(
          csv,
          `expenses-${new Date().toISOString().split("T")[0]}.csv`
        );
        toast.success(`Exported ${data.length} expenses`);
      } else {
        const data = exportBudgets();
        if (data.length === 0) {
          toast.error("No budgets to export");
          return;
        }
        const csv = exportBudgetsToCSV(data);
        downloadCSV(
          csv,
          `budgets-${new Date().toISOString().split("T")[0]}.csv`
        );
        toast.success(`Exported ${data.length} budgets`);
      }
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  const handleDownloadTemplate = (type: "expenses" | "budgets") => {
    try {
      if (type === "expenses") {
        const csv = generateExampleExpensesCSV();
        downloadCSV(csv, "expenses-template.csv");
        toast.success("Downloaded expenses template");
      } else {
        const csv = generateExampleBudgetsCSV();
        downloadCSV(csv, "budgets-template.csv");
        toast.success("Downloaded budgets template");
      }
    } catch (error) {
      toast.error("Failed to download template");
    }
  };

  const handleClearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      clearAllData();
      toast.success("All data cleared");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Import & Export Data
          </CardTitle>
          <CardDescription>
            Import expenses and budgets from CSV files or export your data for
            backup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="import" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="import">Import</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="import" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select data type to import
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={
                        importType === "expenses" ? "default" : "outline"
                      }
                      onClick={() => setImportType("expenses")}
                      className="flex-1"
                    >
                      Expenses
                    </Button>
                    <Button
                      variant={importType === "budgets" ? "default" : "outline"}
                      onClick={() => setImportType("budgets")}
                      className="flex-1"
                    >
                      Budgets
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload CSV file</label>
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isImporting}
                      className="flex-1"
                    >
                      <UploadIcon className="h-4 w-4 mr-2" />
                      {isImporting ? "Importing..." : "Choose File"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadTemplate(importType)}
                    >
                      <FileIcon className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </div>

                {importResult && (
                  <Alert
                    className={
                      importResult.success
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }
                  >
                    {importResult.success ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircleIcon className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription
                      className={
                        importResult.success ? "text-green-800" : "text-red-800"
                      }
                    >
                      {importResult.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">CSV Format Requirements:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {importType === "expenses" ? (
                      <>
                        <li>
                          Headers: Date, Description, Amount, Category, Notes,
                          Tags
                        </li>
                        <li>Date format: YYYY-MM-DD</li>
                        <li>Amount: Decimal number (e.g., 25.50)</li>
                        <li>Tags: Comma-separated values</li>
                      </>
                    ) : (
                      <>
                        <li>Headers: Category, Limit, Period</li>
                        <li>Limit: Decimal number (e.g., 500.00)</li>
                        <li>Period: weekly, monthly, or yearly</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Export Expenses</CardTitle>
                    <CardDescription>
                      Download all expenses as CSV
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {expenses.length} expense
                        {expenses.length !== 1 ? "s" : ""} available
                      </p>
                      <Button
                        onClick={() => handleExport("expenses")}
                        disabled={expenses.length === 0}
                        className="w-full"
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Export Expenses
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Export Budgets</CardTitle>
                    <CardDescription>
                      Download all budgets as CSV
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {budgets.length} budget{budgets.length !== 1 ? "s" : ""}{" "}
                        available
                      </p>
                      <Button
                        onClick={() => handleExport("budgets")}
                        disabled={budgets.length === 0}
                        className="w-full"
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Export Budgets
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-4 border-t">
                <Card className="border-red-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-red-600 flex items-center gap-2">
                      <TrashIcon className="h-4 w-4" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription>
                      Permanently delete all data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      variant="destructive"
                      onClick={handleClearAllData}
                      className="w-full"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Clear All Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
