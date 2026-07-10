import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import {
  CommandPalette,
  useCommandPalette,
} from "@/components/layout/command-palette";
import { tools } from "@/lib/tools-config";

const TOOL_COUNT = tools.reduce((n, c) => n + c.items.length, 0);

/* Tiny harness so the ⌘K hook can be exercised through real DOM events. */
function Harness() {
  const { open, setOpen } = useCommandPalette();
  return <CommandPalette open={open} onClose={() => setOpen(false)} />;
}

describe("CommandPalette", () => {
  it("renders nothing while closed", () => {
    render(<CommandPalette open={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders the translated placeholder and translated tool names when open", () => {
    render(<CommandPalette open onClose={() => {}} />);

    // Landing.searchPlaceholder with the real tool count interpolated.
    expect(
      screen.getByPlaceholderText(`Search ${TOOL_COUNT}+ tools…`),
    ).toBeInTheDocument();

    // Names resolve through ToolsConfig.tools.<slug>.name — not raw keys.
    const items = screen.getAllByTestId("palette-item");
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(9);
    expect(screen.queryByText(/^tools\./)).toBeNull();
  });

  it("filters results as the user types", async () => {
    const user = userEvent.setup();
    render(<CommandPalette open onClose={() => {}} />);

    await user.type(screen.getByRole("combobox"), "json format");
    expect(screen.getByText("JSON Formatter")).toBeInTheDocument();
    expect(screen.queryByText("Background Removal")).toBeNull();
  });

  it("shows the translated empty state for a gibberish query", async () => {
    const user = userEvent.setup();
    render(<CommandPalette open onClose={() => {}} />);

    await user.type(screen.getByRole("combobox"), "xyzzy_nonexistent_999");
    expect(screen.queryAllByTestId("palette-item")).toHaveLength(0);
    // Sidebar.noToolsFound resolves from en.json via the global intl mock.
    expect(screen.getByText("No tools found")).toBeInTheDocument();
  });

  it("navigates with Enter and closes; arrows move the selection", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);

    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<CommandPalette open onClose={onClose} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "json");
    const names = screen
      .getAllByTestId("palette-item")
      .map((el) => el.getAttribute("data-href"));
    expect(names.length).toBeGreaterThan(1);

    // ArrowDown selects the second result, Enter opens it.
    await user.keyboard("{ArrowDown}{Enter}");
    expect(push).toHaveBeenCalledWith(names[1]);
    expect(onClose).toHaveBeenCalled();
  });

  it("navigates to the clicked result", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);

    const user = userEvent.setup();
    render(<CommandPalette open onClose={() => {}} />);

    const first = screen.getAllByTestId("palette-item")[0];
    await user.click(first);
    expect(push).toHaveBeenCalledWith(first.getAttribute("data-href"));
  });

  it("closes when the overlay backdrop is pressed", () => {
    const onClose = vi.fn();
    render(<CommandPalette open onClose={onClose} />);
    fireEvent.mouseDown(screen.getByTestId("command-palette-overlay"));
    expect(onClose).toHaveBeenCalled();
  });
});

describe("useCommandPalette", () => {
  it("toggles open with Cmd/Ctrl+K and closes with Escape", () => {
    render(<Harness />);
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens with / only when the user is not typing in a field", () => {
    render(
      <div>
        <input aria-label="outside" />
        <Harness />
      </div>,
    );

    const field = screen.getByLabelText("outside");
    fireEvent.keyDown(field, { key: "/" });
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.keyDown(window, { key: "/" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
