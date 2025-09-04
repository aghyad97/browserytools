"use client";

import { useState } from "react";
import { useTodoStore } from "@/store/todo-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trash2,
  Plus,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  Star,
} from "lucide-react";
import { toast } from "sonner";

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

export default function TodoList() {
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    getCompletedTodos,
    getActiveTodos,
  } = useTodoStore();

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText, newTodoPriority);
      setNewTodoText("");
      setNewTodoPriority("medium");
      toast.success("Todo added successfully!");
    } else {
      toast.error("Please enter a todo text");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
    toast.success("Todo deleted!");
  };

  const handleToggleTodo = (id: string) => {
    toggleTodo(id);
    toast.success("Todo status updated!");
  };

  const handleClearCompleted = () => {
    clearCompleted();
    toast.success("Completed todos cleared!");
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case "active":
        return getActiveTodos();
      case "completed":
        return getCompletedTodos();
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const completedCount = getCompletedTodos().length;
  const activeCount = getActiveTodos().length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add Todo Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Todo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="What needs to be done?"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
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
            <Button onClick={handleAddTodo} disabled={!newTodoText.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Circle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{todos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Todo List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Todos</CardTitle>
            {completedCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCompleted}
              >
                Clear Completed
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={filter}
            onValueChange={(value) =>
              setFilter(value as "all" | "active" | "completed")
            }
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({todos.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="mt-4">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No todos found</p>
                  <p className="text-sm">
                    {filter === "all"
                      ? "Add your first todo above to get started!"
                      : filter === "active"
                      ? "All todos are completed! 🎉"
                      : "No completed todos yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTodos
                    .sort((a, b) => {
                      // Sort by priority (high -> medium -> low) then by creation date
                      const priorityOrder = { high: 3, medium: 2, low: 1 };
                      if (
                        priorityOrder[a.priority] !== priorityOrder[b.priority]
                      ) {
                        return (
                          priorityOrder[b.priority] - priorityOrder[a.priority]
                        );
                      }
                      return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                      );
                    })
                    .map((todo) => {
                      const PriorityIcon = priorityIcons[todo.priority];
                      return (
                        <div
                          key={todo.id}
                          className={`flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-sm ${
                            todo.completed ? "bg-muted/50" : "bg-background"
                          }`}
                        >
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => handleToggleTodo(todo.id)}
                            className="flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`${
                                todo.completed
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {todo.text}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Created{" "}
                              {new Date(todo.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={priorityColors[todo.priority]}>
                              <PriorityIcon className="h-3 w-3 mr-1" />
                              {todo.priority}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTodo(todo.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
