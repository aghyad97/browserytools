import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTodoStore } from "@/store/todo-store";

const initialState = { todos: [] };

beforeEach(() => {
  useTodoStore.setState(initialState);
});

describe("useTodoStore — addTodo", () => {
  it("adds a todo with default priority medium", () => {
    const { result } = renderHook(() => useTodoStore());
    act(() => {
      result.current.addTodo("Buy groceries");
    });
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe("Buy groceries");
    expect(result.current.todos[0].priority).toBe("medium");
    expect(result.current.todos[0].completed).toBe(false);
  });

  it("adds a todo with a specified priority", () => {
    const { result } = renderHook(() => useTodoStore());
    act(() => {
      result.current.addTodo("Urgent task", "high");
    });
    expect(result.current.todos[0].priority).toBe("high");
  });

  it("trims whitespace from todo text", () => {
    const { result } = renderHook(() => useTodoStore());
    act(() => {
      result.current.addTodo("  trimmed  ");
    });
    expect(result.current.todos[0].text).toBe("trimmed");
  });

  it("assigns a unique id to each todo", () => {
    const { result } = renderHook(() => useTodoStore());
    act(() => {
      result.current.addTodo("First");
      result.current.addTodo("Second");
    });
    const [a, b] = result.current.todos;
    expect(a.id).not.toBe(b.id);
  });
});

describe("useTodoStore — toggleTodo", () => {
  it("marks an active todo as completed", () => {
    const { result } = renderHook(() => useTodoStore());
    act(() => { result.current.addTodo("Task"); });
    const id = result.current.todos[0].id;
    act(() => { result.current.toggleTodo(id); });
    expect(result.current.todos[0].completed).toBe(true);
  });

  it("toggles a completed todo back to active", () => {
    const { result } = renderHook(() => useTodoStore());
    act(() => { result.current.addTodo("Task"); });
    const id = result.current.todos[0].id;
    act(() => { result.current.toggleTodo(id); });
    act(() => { result.current.toggleTodo(id); });
    expect(result.current.todos[0].completed).toBe(false);
  });
});

describe("useTodoStore — deleteTodo", () => {
  it("removes the todo with the given id", () => {
    const { result } = renderHook(() => useTodoStore());
    act(() => {
      result.current.addTodo("Keep");
      result.current.addTodo("Delete me");
    });
    const deleteId = result.current.todos[1].id;
    act(() => { result.current.deleteTodo(deleteId); });
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe("Keep");
  });
});

describe("useTodoStore — updateTodo", () => {
  it("updates text and priority", () => {
    const { result } = renderHook(() => useTodoStore());
    act(() => { result.current.addTodo("Old text", "low"); });
    const id = result.current.todos[0].id;
    act(() => { result.current.updateTodo(id, "New text", "high"); });
    expect(result.current.todos[0].text).toBe("New text");
    expect(result.current.todos[0].priority).toBe("high");
  });
});

describe("useTodoStore — clearCompleted", () => {
  it("removes only completed todos", () => {
    const { result } = renderHook(() => useTodoStore());
    act(() => {
      result.current.addTodo("Active");
      result.current.addTodo("Done");
    });
    const doneId = result.current.todos[1].id;
    act(() => { result.current.toggleTodo(doneId); });
    act(() => { result.current.clearCompleted(); });
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe("Active");
  });
});

describe("useTodoStore — filter helpers", () => {
  it("getActiveTodos returns only uncompleted todos", () => {
    const { result } = renderHook(() => useTodoStore());
    act(() => {
      result.current.addTodo("A");
      result.current.addTodo("B");
    });
    act(() => { result.current.toggleTodo(result.current.todos[0].id); });
    const active = result.current.getActiveTodos();
    expect(active).toHaveLength(1);
    expect(active[0].text).toBe("B");
  });

  it("getCompletedTodos returns only completed todos", () => {
    const { result } = renderHook(() => useTodoStore());
    act(() => {
      result.current.addTodo("X");
      result.current.addTodo("Y");
    });
    act(() => { result.current.toggleTodo(result.current.todos[0].id); });
    const completed = result.current.getCompletedTodos();
    expect(completed).toHaveLength(1);
    expect(completed[0].text).toBe("X");
  });

  it("getTodosByPriority returns todos matching the given priority", () => {
    const { result } = renderHook(() => useTodoStore());
    act(() => {
      result.current.addTodo("Low priority", "low");
      result.current.addTodo("High priority", "high");
      result.current.addTodo("Another high", "high");
    });
    const highTodos = result.current.getTodosByPriority("high");
    expect(highTodos).toHaveLength(2);
    highTodos.forEach((t) => expect(t.priority).toBe("high"));
  });
});
