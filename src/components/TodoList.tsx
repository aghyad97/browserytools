"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTodoStore } from "@/store/todo-store";
import { ToolShell } from "@/components/template/tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  Plus,
  Circle,
  AlertCircle,
  Clock,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { SettingsCard } from "@/components/shared/SettingsCard";
import { StatStrip } from "@/components/shared/StatStrip";
import { ModePicker } from "@/components/shared/ModePicker";

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
  const t = useTranslations("Tools.TodoList");
  const tc = useTranslations("ToolsConfig");
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
      toast.success(t("toastAdded"));
    } else {
      toast.error(t("toastEmpty"));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
    toast.success(t("toastDeleted"));
  };

  const handleToggleTodo = (id: string) => {
    toggleTodo(id);
    toast.success(t("toastUpdated"));
  };

  const handleClearCompleted = () => {
    clearCompleted();
    toast.success(t("toastCleared"));
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

  const priorityLabels = {
    low: t("priorityLow"),
    medium: t("priorityMedium"),
    high: t("priorityHigh"),
  };

  return (
    <ToolShell
      slug="todo"
      title={tc("tools.todo.name")}
      sub={tc("tools.todo.description")}
    >
      {/* Add Todo Form */}
      <SettingsCard
        title={
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("addNewTodo")}
          </span>
        }
        className="mb-6"
      >
        <div className="flex gap-3">
          <Input
            placeholder={t("placeholder")}
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
              <SelectItem value="low">{t("priorityLow")}</SelectItem>
              <SelectItem value="medium">{t("priorityMedium")}</SelectItem>
              <SelectItem value="high">{t("priorityHigh")}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddTodo} disabled={!newTodoText.trim()}>
            <Plus className="h-4 w-4 me-2" />
            {t("addButton")}
          </Button>
        </div>
      </SettingsCard>

      {/* Stats */}
      <StatStrip
        className="mb-6"
        items={[
          { label: t("total"), value: todos.length },
          { label: t("tabActive"), value: activeCount },
          { label: t("tabCompleted"), value: completedCount },
        ]}
      />

      {/* Todo List */}
      <SettingsCard
        title={t("yourTodos")}
        action={
          completedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCompleted}
            >
              {t("clearCompleted")}
            </Button>
          )
        }
      >
        <ModePicker
          aria-label={t("yourTodos")}
          value={filter}
          onChange={(value) => setFilter(value as "all" | "active" | "completed")}
          options={[
            { value: "all", label: `${t("tabAll")} (${todos.length})` },
            { value: "active", label: `${t("tabActive")} (${activeCount})` },
            { value: "completed", label: `${t("tabCompleted")} (${completedCount})` },
          ]}
        />

        <div className="mt-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("noTodosFound")}</p>
              <p className="text-sm">
                {filter === "all"
                  ? t("addFirstTodo")
                  : filter === "active"
                  ? t("allCompleted")
                  : t("noCompletedYet")}
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
                      className={`flex items-center gap-3 p-4 rounded-lg border transition-shadow hover:shadow-sm ${
                        todo.completed ? "bg-muted/50" : "bg-background"
                      }`}
                    >
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => handleToggleTodo(todo.id)}
                        className="flex-shrink-0"
                        data-testid="todo-checkbox"
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
                          {t("created")}{" "}
                          {new Date(todo.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={priorityColors[todo.priority]}>
                          <PriorityIcon className="h-3 w-3 me-1" />
                          {priorityLabels[todo.priority]}
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
        </div>
      </SettingsCard>
    </ToolShell>
  );
}
