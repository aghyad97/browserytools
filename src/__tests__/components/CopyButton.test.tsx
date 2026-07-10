import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { toast } = vi.hoisted(() => ({
  toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), info: vi.fn() }),
}));
vi.mock("sonner", () => ({ toast }));

import { CopyButton } from "@/components/shared/CopyButton";

describe("CopyButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("copies the text and toasts success", async () => {
    const user = userEvent.setup();
    render(<CopyButton text="payload" label="Copy result" />);
    const spy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    await user.click(screen.getByRole("button", { name: "Copy result" }));
    expect(spy).toHaveBeenCalledWith("payload");
    expect(toast.success).toHaveBeenCalled();
  });

  it("toasts error when the copy fails", async () => {
    const user = userEvent.setup();
    render(<CopyButton text="payload" />);
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("nope"));
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(toast.error).toHaveBeenCalled();
  });

  it("re-click resets the 1.5s check-icon timer instead of stacking timers", async () => {
    // userEvent's internal delays deadlock under fake timers in this setup,
    // so this test drives clicks with fireEvent (no internal timers).
    vi.useFakeTimers();
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    const { container } = render(<CopyButton text="payload" />);
    const button = screen.getByRole("button", { name: "Copy" });

    await act(async () => {
      fireEvent.click(button);
    });
    expect(container.querySelector(".lucide-check")).not.toBeNull();

    // 1s into the first timer, copy again — the reset window must restart.
    await act(async () => vi.advanceTimersByTime(1000));
    await act(async () => {
      fireEvent.click(button);
    });

    // 1s after the second click, the stale first timer (now 2s old) must
    // NOT have flipped the icon back.
    await act(async () => vi.advanceTimersByTime(1000));
    expect(container.querySelector(".lucide-check")).not.toBeNull();

    // ...but a full 1.5s after the second click, it resets.
    await act(async () => vi.advanceTimersByTime(600));
    expect(container.querySelector(".lucide-check")).toBeNull();
    expect(container.querySelector(".lucide-copy")).not.toBeNull();
  });
});
