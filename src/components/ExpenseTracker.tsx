"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Tools.ExpenseTracker");
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
              {t("totalExpenses")}
            </CardTitle>
            <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" dir="ltr">
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
              {" "}{t("transactions")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("thisMonth")}</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" dir="ltr">
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
              {t("currentMonthSpending")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("averagePerTransaction")}
            </CardTitle>
            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" dir="ltr">
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
              {t("basedOnFilteredData")}
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
          <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
          <TabsTrigger value="expenses">{t("tabs.expenses")}</TabsTrigger>
          <TabsTrigger value="charts">{t("tabs.charts")}</TabsTrigger>
          <TabsTrigger value="budgets">{t("tabs.budgets")}</TabsTrigger>
          <TabsTrigger value="reports">{t("tabs.reports")}</TabsTrigger>
          <TabsTrigger value="import-export">{t("tabs.importExport")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("recentExpenses")}</CardTitle>
                <CardDescription>{t("latestTransactions")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseList limit={5} showActions={false} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("quickAddExpense")}</CardTitle>
                <CardDescription>{t("addExpenseQuickly")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseForm onSuccess={() => setActiveTab("expenses")} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("spendingOverview")}</CardTitle>
              <CardDescription>
                {t("visualRepresentation")}
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
                  <CardTitle>{t("allExpenses")}</CardTitle>
                  <CardDescription>
                    {t("manageExpenses")}
                  </CardDescription>
                </div>
                <Button onClick={() => setActiveTab("overview")}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  {t("addExpense")}
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
