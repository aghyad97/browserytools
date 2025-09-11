"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DownloadIcon,
  FileTextIcon,
  CalendarIcon,
  BarChart3Icon,
} from "lucide-react";
import { useExpenseStore } from "@/store/expense-store";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
} from "date-fns";
import NumberFlow from "@number-flow/react";

export default function ExpenseReports() {
  const [reportType, setReportType] = useState("summary");
  const [timeRange, setTimeRange] = useState("6");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    expenses,
    categories,
    getFilteredExpenses,
    getCategoryTotals,
    getMonthlyExpenses,
    getBudgetStatus,
  } = useExpenseStore();

  const filteredExpenses = getFilteredExpenses();
  const categoryTotals = getCategoryTotals();
  const monthlyExpenses = getMonthlyExpenses();
  const budgetStatus = getBudgetStatus();

  // Generate data for the selected time range
  const generateTimeRangeData = (months: number) => {
    const endDate = new Date();
    const startDate = subMonths(endDate, months - 1);
    const monthsList = eachMonthOfInterval({ start: startDate, end: endDate });

    return monthsList.map((month) => {
      const monthKey = format(month, "yyyy-MM");
      const monthName = format(month, "MMM yyyy");
      return {
        month: monthName,
        amount: monthlyExpenses[monthKey] || 0,
        date: monthKey,
      };
    });
  };

  const timeRangeData = generateTimeRangeData(parseInt(timeRange));
  const totalExpenses = Object.values(categoryTotals).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const averageMonthly =
    timeRangeData.length > 0
      ? timeRangeData.reduce((sum, month) => sum + month.amount, 0) /
        timeRangeData.length
      : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const exportToCSV = () => {
    const csvData = filteredExpenses.map((expense) => ({
      Date: expense.date,
      Description: expense.description,
      Category: expense.category,
      Amount: expense.amount,
      Tags: expense.tags.join(", "),
      Notes: expense.notes || "",
    }));

    const headers = [
      "Date",
      "Description",
      "Category",
      "Amount",
      "Tags",
      "Notes",
    ];
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((header) => {
            const value = row[header as keyof typeof row];
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expense-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const jsonData = {
      reportDate: new Date().toISOString(),
      timeRange: `${timeRange} months`,
      summary: {
        totalExpenses,
        averageMonthly,
        totalTransactions: filteredExpenses.length,
        categoryBreakdown: categoryTotals,
        monthlyData: timeRangeData,
      },
      expenses: filteredExpenses,
      budgets: budgetStatus,
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expense-report-${format(new Date(), "yyyy-MM-dd")}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const generateTextReport = () => {
    const report = `
EXPENSE REPORT
Generated: ${format(new Date(), "MMMM dd, yyyy")}
Time Range: Last ${timeRange} months

SUMMARY
--------
Total Expenses: ${formatCurrency(totalExpenses)}
Average Monthly: ${formatCurrency(averageMonthly)}
Total Transactions: ${filteredExpenses.length}

CATEGORY BREAKDOWN
------------------
${Object.entries(categoryTotals)
  .sort(([, a], [, b]) => b - a)
  .map(
    ([category, amount]) =>
      `${category}: ${formatCurrency(amount)} (${(
        (amount / totalExpenses) *
        100
      ).toFixed(1)}%)`
  )
  .join("\n")}

MONTHLY BREAKDOWN
-----------------
${timeRangeData
  .map((month) => `${month.month}: ${formatCurrency(month.amount)}`)
  .join("\n")}

BUDGET STATUS
-------------
${Object.entries(budgetStatus)
  .map(
    ([category, status]) =>
      `${category}: ${formatCurrency(status.spent)} / ${formatCurrency(
        status.limit
      )} (${((status.spent / status.limit) * 100).toFixed(1)}%)`
  )
  .join("\n")}

RECENT EXPENSES
---------------
${filteredExpenses
  .slice(0, 10)
  .map(
    (expense) =>
      `${expense.date} - ${expense.description} - ${
        expense.category
      } - ${formatCurrency(expense.amount)}`
  )
  .join("\n")}
    `.trim();

    const blob = new Blob([report], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expense-report-${format(new Date(), "yyyy-MM-dd")}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Expense Reports</h2>
          <p className="text-muted-foreground">
            Generate comprehensive reports and export your expense data
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={exportToJSON} variant="outline">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={generateTextReport} variant="outline">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Export TXT
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Report Settings</CardTitle>
          <CardDescription>Configure your report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Last 3 months</SelectItem>
                  <SelectItem value="6">Last 6 months</SelectItem>
                  <SelectItem value="12">Last 12 months</SelectItem>
                  <SelectItem value="24">Last 2 years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category Filter</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="detailed">Detailed Report</SelectItem>
                  <SelectItem value="budget">Budget Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <Tabs
        value={reportType}
        onValueChange={setReportType}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
          <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Expenses
                </CardTitle>
                <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <NumberFlow
                    value={totalExpenses}
                    format={{
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Last {timeRange} months
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Monthly
                </CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <NumberFlow
                    value={averageMonthly}
                    format={{
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Per month average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Transactions
                </CardTitle>
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <NumberFlow value={filteredExpenses.length} />
                </div>
                <p className="text-xs text-muted-foreground">Expense entries</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>
                Spending distribution across categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(categoryTotals)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => {
                    const percentage =
                      totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                    return (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            <NumberFlow
                              value={amount}
                              format={{
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
              <CardDescription>Detailed monthly expense data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeRangeData.map((month) => (
                  <div
                    key={month.date}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{month.month}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        <NumberFlow
                          value={month.amount}
                          format={{
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Analysis</CardTitle>
              <CardDescription>Track your budget performance</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(budgetStatus).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No budgets set up. Create budgets to track your spending
                    limits.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(budgetStatus).map(([category, status]) => {
                    const percentage = (status.spent / status.limit) * 100;
                    return (
                      <div key={category} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{category}</div>
                          <div className="text-sm text-muted-foreground">
                            {percentage.toFixed(1)}% used
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <span>{formatCurrency(status.spent)} spent</span>
                          <span>{formatCurrency(status.limit)} limit</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              percentage >= 100
                                ? "bg-red-500"
                                : percentage >= 80
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {status.remaining >= 0 ? (
                            <>
                              <NumberFlow
                                value={status.remaining}
                                format={{
                                  style: "currency",
                                  currency: "USD",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }}
                              />{" "}
                              remaining
                            </>
                          ) : (
                            <>
                              <NumberFlow
                                value={Math.abs(status.remaining)}
                                format={{
                                  style: "currency",
                                  currency: "USD",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }}
                              />{" "}
                              over budget
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
