"use client";

import React, { useState, useMemo } from "react";
import { useTodoStore, type Todo } from "@/store/todo-store";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
  type DragEndEvent,
} from "@/components/ui/kanban";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Clock,
  Star,
  AlertCircle,
  Trash2,
  Edit2,
  Download,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "./ui/card";

// Define kanban columns
const columns = [
  { id: "todo", name: "To Do", color: "#6B7280" },
  { id: "in-progress", name: "In Progress", color: "#F59E0B" },
  { id: "done", name: "Done", color: "#10B981" },
];

// Extended Todo type for kanban
type KanbanTodo = Todo & {
  id: string;
  name: string;
  column: string;
} & Record<string, unknown>;

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const priorityIcons = {
  low: Clock,
  medium: Star,
  high: AlertCircle,
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

// CSV utility functions
// Expected CSV format:
// ID,Text,Priority,Completed,Created,Updated
// example123,"Task description",medium,false,2025-01-10T12:00:00.000Z,2025-01-10T12:00:00.000Z

const csvEscape = (str: string): string => {
  if (str.includes('"') || str.includes(",") || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const parseCsvLine = (line: string): string[] => {
  const result = [];
  let current = "";
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === '"' && !inQuotes) {
      inQuotes = true;
    } else if (char === '"' && inQuotes) {
      if (line[i + 1] === '"') {
        current += '"';
        i++; // Skip the next quote
      } else {
        inQuotes = false;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
    i++;
  }

  result.push(current);
  return result;
};

export default function TodoKanban() {
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );

  const { todos, addTodo, deleteTodo, updateTodo, toggleTodo } = useTodoStore();

  // Convert todos to kanban format
  const kanbanTodos: KanbanTodo[] = useMemo(() => {
    return todos.map((todo) => ({
      ...todo,
      name: todo.text,
      column: todo.completed ? "done" : "todo",
    }));
  }, [todos]);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText, newTodoPriority);
      setNewTodoText("");
      setNewTodoPriority("medium");
      setIsAddingNew(false);
      toast.success("Todo added successfully!");
    } else {
      toast.error("Please enter a todo text");
    }
  };

  const handleCancelAdd = () => {
    setNewTodoText("");
    setNewTodoPriority("medium");
    setIsAddingNew(false);
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
    toast.success("Todo deleted!");
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setEditText(todo.text);
    setEditPriority(todo.priority);
  };

  const handleSaveEdit = () => {
    if (editingTodo && editText.trim()) {
      updateTodo(editingTodo.id, editText, editPriority);
      setEditingTodo(null);
      setEditText("");
      setEditPriority("medium");
      toast.success("Todo updated successfully!");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const todoId = active.id as string;
    const newColumn = over.id as string;

    // Find the todo being moved
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) return;

    // Handle status changes based on column
    if (newColumn === "done" && !todo.completed) {
      toggleTodo(todoId);
      toast.success("Todo marked as complete!");
    } else if (newColumn !== "done" && todo.completed) {
      toggleTodo(todoId);
      toast.success("Todo marked as incomplete!");
    }
  };

  // Export todos to CSV
  const handleExportCSV = () => {
    try {
      const headers = [
        "ID",
        "Text",
        "Priority",
        "Completed",
        "Created",
        "Updated",
      ];
      const csvContent = [
        headers.join(","),
        ...todos.map((todo) =>
          [
            csvEscape(todo.id),
            csvEscape(todo.text),
            csvEscape(todo.priority),
            todo.completed.toString(),
            csvEscape(new Date(todo.createdAt).toISOString()),
            csvEscape(new Date(todo.updatedAt).toISOString()),
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `todos_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Todos exported successfully!");
    } catch (error) {
      toast.error("Failed to export todos");
      console.error("Export error:", error);
    }
  };

  // Import todos from CSV
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please select a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());

        if (lines.length < 2) {
          toast.error("CSV file appears to be empty or invalid");
          return;
        }

        // Skip header row
        const dataLines = lines.slice(1);
        let importedCount = 0;
        let errorCount = 0;

        dataLines.forEach((line, index) => {
          try {
            const values = parseCsvLine(line);

            if (values.length < 6) {
              console.warn(`Row ${index + 2}: Not enough columns`);
              errorCount++;
              return;
            }

            const [id, text, priority, completed, createdAt, updatedAt] =
              values;

            // Validate required fields
            if (!text?.trim()) {
              console.warn(`Row ${index + 2}: Empty text field`);
              errorCount++;
              return;
            }

            if (!["low", "medium", "high"].includes(priority)) {
              console.warn(`Row ${index + 2}: Invalid priority "${priority}"`);
              errorCount++;
              return;
            }

            // Check if todo with this ID already exists
            const existingTodo = todos.find((t) => t.id === id);
            if (existingTodo) {
              console.warn(
                `Row ${index + 2}: Todo with ID "${id}" already exists`
              );
              errorCount++;
              return;
            }

            // Create new todo with imported data
            const newTodo: Todo = {
              id:
                id ||
                `imported_${Date.now()}_${Math.random()
                  .toString(36)
                  .substr(2, 9)}`,
              text: text.trim(),
              priority: priority as "low" | "medium" | "high",
              completed: completed.toLowerCase() === "true",
              createdAt: createdAt ? new Date(createdAt) : new Date(),
              updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
            };

            // Add to store
            addTodo(newTodo.text, newTodo.priority);

            // If the todo should be completed, toggle it
            if (newTodo.completed) {
              // We need to find the newly added todo and toggle it
              setTimeout(() => {
                const addedTodo = todos.find(
                  (t) =>
                    t.text === newTodo.text && t.priority === newTodo.priority
                );
                if (addedTodo && !addedTodo.completed) {
                  toggleTodo(addedTodo.id);
                }
              }, 100);
            }

            importedCount++;
          } catch (error) {
            console.error(`Error processing row ${index + 2}:`, error);
            errorCount++;
          }
        });

        if (importedCount > 0) {
          toast.success(
            `Successfully imported ${importedCount} todos${
              errorCount > 0 ? ` (${errorCount} errors)` : ""
            }`
          );
        } else {
          toast.error("No todos were imported. Please check the CSV format.");
        }
      } catch (error) {
        toast.error("Failed to parse CSV file");
        console.error("Import error:", error);
      }
    };

    reader.readAsText(file);

    // Reset the input
    event.target.value = "";
  };

  return (
    <div className="w-full h-[600px] p-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Todo Kanban Board</h2>
          <p className="text-muted-foreground">
            Drag and drop todos between columns to update their status.
            Export/import your todos as CSV files.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export Button */}
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={todos.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>

          {/* Import Button */}
          <Button variant="outline" asChild>
            <label htmlFor="csv-import" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </label>
          </Button>
          <input
            id="csv-import"
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanProvider
        columns={columns}
        data={kanbanTodos}
        onDragEnd={handleDragEnd}
        className="h-full"
      >
        {(column) => (
          <KanbanBoard id={column.id} key={column.id}>
            <KanbanHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <span>{column.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {
                    kanbanTodos.filter((todo) => todo.column === column.id)
                      .length
                  }
                </Badge>
              </div>
            </KanbanHeader>
            <KanbanCards id={column.id}>
              {(todo: any) => (
                <KanbanCard
                  column={column.id}
                  id={todo.id}
                  key={todo.id}
                  name={todo.text}
                >
                  <div className="space-y-3">
                    {/* Todo Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="m-0 font-medium text-sm line-clamp-2">
                          {todo.text}
                        </p>
                      </div>
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarFallback className="text-xs">
                          {todo.priority.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Priority Badge */}
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`text-xs ${
                          priorityColors[
                            todo.priority as keyof typeof priorityColors
                          ]
                        }`}
                        variant="secondary"
                      >
                        {React.createElement(
                          priorityIcons[
                            todo.priority as keyof typeof priorityIcons
                          ],
                          {
                            className: "h-3 w-3 mr-1",
                          }
                        )}
                        {todo.priority}
                      </Badge>

                      {/* Action Buttons */}
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleEditTodo(todo);
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDeleteTodo(todo.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Date */}
                    <p className="m-0 text-muted-foreground text-xs">
                      Created {dateFormatter.format(new Date(todo.createdAt))}
                    </p>
                  </div>
                </KanbanCard>
              )}
            </KanbanCards>

            {/* Add Card for To Do column */}
            {column.id === "todo" && (
              <div className="p-2">
                {isAddingNew ? (
                  <Card className="p-3 space-y-3">
                    <Input
                      placeholder="What needs to be done?"
                      value={newTodoText}
                      onChange={(e) => setNewTodoText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddTodo();
                        } else if (e.key === "Escape") {
                          handleCancelAdd();
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex items-center justify-between">
                      <Select
                        value={newTodoPriority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          setNewTodoPriority(value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleAddTodo}
                          disabled={!newTodoText.trim()}
                        >
                          Add
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelAdd}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card
                    className="p-3 border-dashed border-2 hover:border-primary cursor-pointer transition-colors"
                    onClick={() => setIsAddingNew(true)}
                  >
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">Add new todo</span>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </KanbanBoard>
        )}
      </KanbanProvider>

      {/* Edit Dialog */}
      <Dialog
        open={editingTodo !== null}
        onOpenChange={() => setEditingTodo(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="What needs to be done?"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
            />
            <Select
              value={editPriority}
              onValueChange={(value: "low" | "medium" | "high") =>
                setEditPriority(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                onClick={handleSaveEdit}
                disabled={!editText.trim()}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditingTodo(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
