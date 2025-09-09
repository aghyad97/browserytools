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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  MoreHorizontalIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from "lucide-react";
import { useExpenseStore } from "@/store/expense-store";
import { Budget } from "@/store/expense-store";
import { toast } from "sonner";
import NumberFlow from "@number-flow/react";

interface BudgetFormData {
  category: string | undefined;
  limit: number;
  period: "monthly" | "weekly" | "yearly";
}

export default function BudgetManager() {
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    budgets,
    categories,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetStatus,
  } = useExpenseStore();

  const budgetStatus = getBudgetStatus();

  const [formData, setFormData] = useState<BudgetFormData>({
    category: editingBudget?.category || undefined,
    limit: editingBudget?.limit || 0,
    period: editingBudget?.period || "monthly",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.category || formData.category.trim() === "") {
      newErrors.category = "Category is required";
    }
    if (formData.limit <= 0) {
      newErrors.limit = "Limit must be greater than 0";
    }
    if (!formData.period) {
      newErrors.period = "Period is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Ensure category is not undefined before submitting
      if (!formData.category) {
        toast.error("Please select a category");
        return;
      }

      const budgetData = {
        ...formData,
        category: formData.category,
      };

      if (editingBudget) {
        updateBudget(editingBudget.id, budgetData);
        toast.success("Budget updated successfully");
      } else {
        addBudget(budgetData);
        toast.success("Budget created successfully");
      }

      setFormData({
        category: undefined,
        limit: 0,
        period: "monthly",
      });
      setEditingBudget(null);
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to save budget");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      limit: budget.limit,
      period: budget.period,
    });
    setShowForm(true);
  };

  const handleDelete = (budgetId: string) => {
    deleteBudget(budgetId);
    toast.success("Budget deleted successfully");
  };

  const handleCancel = () => {
    setEditingBudget(null);
    setShowForm(false);
    setFormData({
      category: undefined,
      limit: 0,
      period: "monthly",
    });
  };

  const handleInputChange = (field: keyof BudgetFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getBudgetStatusColor = (status: {
    spent: number;
    limit: number;
    remaining: number;
  }) => {
    const percentage = (status.spent / status.limit) * 100;
    if (percentage >= 100) return "text-red-600";
    if (percentage >= 80) return "text-yellow-600";
    return "text-green-600";
  };

  const getBudgetStatusIcon = (status: {
    spent: number;
    limit: number;
    remaining: number;
  }) => {
    const percentage = (status.spent / status.limit) * 100;
    if (percentage >= 100)
      return <AlertTriangleIcon className="h-4 w-4 text-red-600" />;
    if (percentage >= 80)
      return <AlertTriangleIcon className="h-4 w-4 text-yellow-600" />;
    return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
  };

  if (showForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {editingBudget ? "Edit Budget" : "Create New Budget"}
          </CardTitle>
          <CardDescription>
            {editingBudget
              ? "Update your budget settings"
              : "Set spending limits for different categories"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category || undefined}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period *</Label>
                <Select
                  value={formData.period}
                  onValueChange={(value) => handleInputChange("period", value)}
                >
                  <SelectTrigger
                    className={errors.period ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                {errors.period && (
                  <p className="text-sm text-red-500">{errors.period}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limit">Budget Limit *</Label>
              <Input
                id="limit"
                type="number"
                step="0.01"
                min="0"
                value={formData.limit || ""}
                onChange={(e) =>
                  handleInputChange("limit", parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
                className={errors.limit ? "border-red-500" : ""}
              />
              {errors.limit && (
                <p className="text-sm text-red-500">{errors.limit}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting
                  ? "Saving..."
                  : editingBudget
                  ? "Update Budget"
                  : "Create Budget"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Budget Manager</h2>
          <p className="text-muted-foreground">
            Set and track spending limits for different categories
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {budgets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No budgets created yet. Create your first budget to start tracking
              your spending limits.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const status = budgetStatus[budget.category] || {
              spent: 0,
              limit: budget.limit,
              remaining: budget.limit,
            };
            const percentage = Math.min(
              (status.spent / status.limit) * 100,
              100
            );

            return (
              <Card key={budget.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{budget.category}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(budget)}>
                          <EditIcon className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the budget for{" "}
                                {budget.category}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(budget.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>
                    {budget.period.charAt(0).toUpperCase() +
                      budget.period.slice(1)}{" "}
                    budget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Spent</span>
                      <span className={getBudgetStatusColor(status)}>
                        <NumberFlow
                          value={status.spent}
                          format={{
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }}
                        />
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Limit</span>
                      <span>
                        <NumberFlow
                          value={status.limit}
                          format={{
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }}
                        />
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Remaining</span>
                      <span className={getBudgetStatusColor(status)}>
                        <NumberFlow
                          value={status.remaining}
                          format={{
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {percentage.toFixed(1)}% used
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getBudgetStatusIcon(status)}
                      <span className="text-xs text-muted-foreground">
                        {percentage >= 100
                          ? "Over budget"
                          : percentage >= 80
                          ? "Near limit"
                          : "On track"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
