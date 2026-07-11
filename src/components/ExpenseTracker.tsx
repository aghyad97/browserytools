"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { ToolShell } from "@/components/template/tool-shell";
import { StatStrip } from "@/components/shared/StatStrip";
import { SettingsCard } from "@/components/shared/SettingsCard";
import ExpenseForm from "./expense-tracker/ExpenseForm";
import { useExpenseStore } from "@/store/expense-store";
import ExpenseList from "./expense-tracker/ExpenseList";
import ExpenseCharts from "./expense-tracker/ExpenseCharts";
import BudgetManager from "./expense-tracker/BudgetManager";
import ExpenseReports from "./expense-tracker/ExpenseReports";
import ImportExport from "./expense-tracker/ImportExport";

export default function ExpenseTracker() {
  const t = useTranslations("Tools.ExpenseTracker");
  const tc = useTranslations("ToolsConfig");
  const [activeTab, setActiveTab] = useState("overview");
  const [isClient, setIsClient] = useState(false);
  const { getTotalExpenses, getFilteredExpenses } = useExpenseStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <ToolShell
        slug="expense-tracker"
        title={tc("tools.expense-tracker.name")}
        sub={tc("tools.expense-tracker.description")}
        width="wide"
      >
        <div className="mb-8">
          <StatStrip
            items={[1, 2, 3].map((i) => ({
              value: <Skeleton key={i} className="h-8 w-24" />,
              label: <Skeleton className="h-3 w-16" />,
            }))}
          />
        </div>
        <SettingsCard title={<Skeleton className="h-4 w-32" />}>
          <Skeleton className="h-96 w-full" />
        </SettingsCard>
      </ToolShell>
    );
  }

  const totalExpenses = getTotalExpenses();
  const filteredExpenses = getFilteredExpenses();
  const expenseCount = filteredExpenses.length;

  return (
    <ToolShell
      slug="expense-tracker"
      title={tc("tools.expense-tracker.name")}
      sub={tc("tools.expense-tracker.description")}
      width="wide"
    >
      {/* Summary stats */}
      <div className="mb-8">
        <StatStrip
          items={[
            {
              value: (
                <span dir="ltr">
                  $
                  <NumberFlow
                    value={totalExpenses}
                    format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                  />
                </span>
              ),
              label: (
                <span className="flex flex-col gap-1">
                  <span>{t("totalExpenses")}</span>
                  <span className="font-sans normal-case tracking-normal" dir="ltr">
                    <NumberFlow value={expenseCount} /> {t("transactions")}
                  </span>
                </span>
              ),
            },
            {
              value: (
                <span dir="ltr">
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
                    format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                  />
                </span>
              ),
              label: (
                <span className="flex flex-col gap-1">
                  <span>{t("thisMonth")}</span>
                  <span className="font-sans normal-case tracking-normal">
                    {t("currentMonthSpending")}
                  </span>
                </span>
              ),
            },
            {
              value: (
                <span dir="ltr">
                  $
                  <NumberFlow
                    value={expenseCount > 0 ? totalExpenses / expenseCount : 0}
                    format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                  />
                </span>
              ),
              label: (
                <span className="flex flex-col gap-1">
                  <span>{t("averagePerTransaction")}</span>
                  <span className="font-sans normal-case tracking-normal">
                    {t("basedOnFilteredData")}
                  </span>
                </span>
              ),
            },
          ]}
        />
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
            <SettingsCard
              title={t("recentExpenses")}
              description={t("latestTransactions")}
            >
              <ExpenseList limit={5} showActions={false} />
            </SettingsCard>

            {/* Quick-add form: SettingsCard shell; ExpenseForm internals stay. */}
            <SettingsCard
              title={t("quickAddExpense")}
              description={t("addExpenseQuickly")}
            >
              <ExpenseForm onSuccess={() => setActiveTab("expenses")} />
            </SettingsCard>
          </div>

          <SettingsCard
            title={t("spendingOverview")}
            description={t("visualRepresentation")}
          >
            <ExpenseCharts type="overview" />
          </SettingsCard>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          {/* Kept as a Card: this shell carries a header action (Add Expense),
              which SettingsCard's title/description head has no slot for. */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("allExpenses")}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t("manageExpenses")}
                  </p>
                </div>
                <Button onClick={() => setActiveTab("overview")}>
                  <PlusIcon className="h-4 w-4 me-2" />
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
    </ToolShell>
  );
}
