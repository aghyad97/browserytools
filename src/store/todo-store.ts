import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: "low" | "medium" | "high";
}

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string, priority?: "low" | "medium" | "high") => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (
    id: string,
    text: string,
    priority?: "low" | "medium" | "high"
  ) => void;
  clearCompleted: () => void;
  getCompletedTodos: () => Todo[];
  getActiveTodos: () => Todo[];
  getTodosByPriority: (priority: "low" | "medium" | "high") => Todo[];
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],

      addTodo: (
        text: string,
        priority: "low" | "medium" | "high" = "medium"
      ) => {
        const newTodo: Todo = {
          id: generateId(),
          text: text.trim(),
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          priority,
        };

        set((state) => ({
          todos: [...state.todos, newTodo],
        }));
      },

      toggleTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
              : todo
          ),
        }));
      },

      deleteTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },

      updateTodo: (
        id: string,
        text: string,
        priority?: "low" | "medium" | "high"
      ) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  text: text.trim(),
                  priority: priority || todo.priority,
                  updatedAt: new Date(),
                }
              : todo
          ),
        }));
      },

      clearCompleted: () => {
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        }));
      },

      getCompletedTodos: () => {
        const { todos } = get();
        return todos.filter((todo) => todo.completed);
      },

      getActiveTodos: () => {
        const { todos } = get();
        return todos.filter((todo) => !todo.completed);
      },

      getTodosByPriority: (priority: "low" | "medium" | "high") => {
        const { todos } = get();
        return todos.filter((todo) => todo.priority === priority);
      },
    }),
    {
      name: "todo-storage",
    }
  )
);
