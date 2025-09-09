"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PlusIcon,
  DownloadIcon,
  BarChart3Icon,
  ReceiptIcon,
  SettingsIcon,
} from "lucide-react";
import NumberFlow from "@number-flow/react";
import ExpenseForm from "./expense-tracker/ExpenseForm";
import { useExpenseStore } from "@/store/expense-store";
import ExpenseList from "./expense-tracker/ExpenseList";
import ExpenseCharts from "./expense-tracker/ExpenseCharts";
import BudgetManager from "./expense-tracker/BudgetManager";
import ExpenseReports from "./expense-tracker/ExpenseReports";
import ImportExport from "./expense-tracker/ImportExport";

export default function ExpenseTracker() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isClient, setIsClient] = useState(false);
  const { getTotalExpenses, getFilteredExpenses } = useExpenseStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalExpenses = getTotalExpenses();
  const filteredExpenses = getFilteredExpenses();
  const expenseCount = filteredExpenses.length;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              <NumberFlow
                value={totalExpenses}
                format={{
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              <NumberFlow value={expenseCount} />
              transaction{expenseCount !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              <NumberFlow
                value={useExpenseStore
                  .getState()
                  .getExpensesByDateRange(
                    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                      .toISOString()
                      .split("T")[0],
                    new Date().toISOString().split("T")[0]
                  )
                  .reduce((total, expense) => total + expense.amount, 0)}
                format={{
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Current month spending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average per Transaction
            </CardTitle>
            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              <NumberFlow
                value={expenseCount > 0 ? totalExpenses / expenseCount : 0}
                format={{
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Based on filtered data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseList limit={5} showActions={false} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Add Expense</CardTitle>
                <CardDescription>Add a new expense quickly</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseForm onSuccess={() => setActiveTab("expenses")} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Spending Overview</CardTitle>
              <CardDescription>
                Visual representation of your expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseCharts type="overview" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Expenses</CardTitle>
                  <CardDescription>
                    Manage your expense transactions
                  </CardDescription>
                </div>
                <Button onClick={() => setActiveTab("overview")}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ExpenseList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <ExpenseCharts />
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <BudgetManager />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ExpenseReports />
        </TabsContent>

        <TabsContent value="import-export" className="space-y-6">
          <ImportExport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
