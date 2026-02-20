import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTodoStore } from "@/store/todo-store";

// Reset the real Zustand store before each test
beforeEach(() => {
  useTodoStore.setState({ todos: [] });
});

// Use dynamic import to avoid module-load-time store initialization issues
let TodoList: React.ComponentType;
beforeEach(async () => {
  const mod = await import("@/components/TodoList");
  TodoList = mod.default;
});

describe("TodoList — empty state", () => {
  it("shows an empty state message when no todos exist", async () => {
    render(<TodoList />);
    expect(screen.getByText(/add your first todo/i)).toBeInTheDocument();
  });

  it("shows zero counts in stats cards", async () => {
    render(<TodoList />);
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(3);
  });
});

describe("TodoList — adding todos", () => {
  it("adds a todo when the Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    await user.type(input, "Buy milk");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
  });

  it("adds a todo when Enter is pressed", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    await user.type(input, "Read a book{Enter}");

    expect(screen.getByText("Read a book")).toBeInTheDocument();
  });

  it("clears the input field after adding a todo", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    await user.type(input, "Task A");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(input).toHaveValue("");
  });

  it("Add button is disabled when input is empty", async () => {
    render(<TodoList />);
    expect(screen.getByRole("button", { name: /add/i })).toBeDisabled();
  });
});

describe("TodoList — toggling todos", () => {
  it("toggles a todo checkbox to completed", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), "Task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    // Wait for the todo to render (async re-render after store update)
    const todoText = await screen.findByText("Task");
    expect(todoText).toBeInTheDocument();

    // Find the checkbox via testid (Radix UI Checkbox role varies by env)
    const checkbox = await screen.findByTestId("todo-checkbox");
    await user.click(checkbox);

    // Radix UI doesn't update data-state in happy-dom; verify the store instead
    const todo = useTodoStore.getState().todos[0];
    expect(todo.completed).toBe(true);
  });
});

describe("TodoList — store integration", () => {
  it("store has the correct initial state", async () => {
    // Verify store is reset properly
    const state = useTodoStore.getState();
    expect(state.todos).toHaveLength(0);
    expect(typeof state.addTodo).toBe("function");
    expect(typeof state.getCompletedTodos).toBe("function");
  });

  it("adding via store updates the rendered component", async () => {
    render(<TodoList />);

    // Directly use the store to add a todo
    const { addTodo } = useTodoStore.getState();
    const { act } = await import("@testing-library/react");
    act(() => { addTodo("Store-added task"); });

    expect(screen.getByText("Store-added task")).toBeInTheDocument();
  });

  it("the stats update when todos are added", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), "Task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    // Total count should now show 1 (may appear multiple times across stat cards)
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
  });
});
