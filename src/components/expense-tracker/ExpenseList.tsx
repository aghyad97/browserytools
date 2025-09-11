"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  EditIcon,
  TrashIcon,
  MoreHorizontalIcon,
  SearchIcon,
  FilterIcon,
  Trash2,
} from "lucide-react";
import { useExpenseStore } from "@/store/expense-store";
import { Expense } from "@/store/expense-store";
import ExpenseForm from "./ExpenseForm";
import { toast } from "sonner";
import NumberFlow from "@number-flow/react";

interface ExpenseListProps {
  limit?: number;
  showActions?: boolean;
}

export default function ExpenseList({
  limit,
  showActions = true,
}: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    expenses,
    categories,
    filters,
    setFilters,
    deleteExpense,
    getFilteredExpenses,
  } = useExpenseStore();

  // Reset delete dialog when expenses change
  useEffect(() => {
    setDeleteDialogOpen(null);
  }, [expenses]);

  // Cleanup dialog state on unmount
  useEffect(() => {
    return () => {
      setDeleteDialogOpen(null);
    };
  }, []);

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const filteredExpenses = getFilteredExpenses()
    .filter((expense) => {
      const matchesSearch =
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        categoryFilter === "all" || expense.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = (expenseId: string) => {
    deleteExpense(expenseId);
    setDeleteDialogOpen(null);
    toast.success("Expense deleted successfully");
  };

  const handleFormSuccess = () => {
    setEditingExpense(null);
    setShowForm(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-gray-100 text-gray-800",
    ];
    const index = categories.indexOf(category) % colors.length;
    return colors[index];
  };

  if (showForm && editingExpense) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Expense</CardTitle>
          <CardDescription>Update the expense details</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseForm
            editMode
            expenseId={editingExpense.id}
            initialData={editingExpense}
            onSuccess={handleFormSuccess}
          />
        </CardContent>
      </Card>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {expenses.length === 0
            ? "No expenses yet. Add your first expense to get started!"
            : "No expenses match your current filters."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by category" />
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

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tags</TableHead>
              {showActions && (
                <TableHead className="w-[50px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    {expense.notes && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {expense.notes}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(expense.category)}>
                    {expense.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {isClient ? (
                    <NumberFlow
                      value={expense.amount}
                      format={{
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }}
                    />
                  ) : (
                    formatCurrency(expense.amount)
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(expense.date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {expense.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                {showActions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleEdit(expense)}
                        >
                          <EditIcon className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 cursor-pointer"
                          onClick={() => handleDelete(expense.id)}
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredExpenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-medium">{expense.description}</h3>
                  {expense.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {expense.notes}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {isClient ? (
                      <NumberFlow
                        value={expense.amount}
                        format={{
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }}
                      />
                    ) : (
                      formatCurrency(expense.amount)
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(expense.date), "MMM dd, yyyy")}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={getCategoryColor(expense.category)}>
                  {expense.category}
                </Badge>

                {expense.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {expense.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {showActions && (
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(expense)}
                    className="flex-1"
                  >
                    <EditIcon className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <AlertDialog
                    key={`delete-mobile-${expense.id}-${
                      deleteDialogOpen === expense.id
                    }`}
                    open={deleteDialogOpen === expense.id}
                    onOpenChange={(open) =>
                      setDeleteDialogOpen(open ? expense.id : null)
                    }
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the expense.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(expense.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
