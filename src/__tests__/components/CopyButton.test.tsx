import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { toast } = vi.hoisted(() => ({
  toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), info: vi.fn() }),
}));
vi.mock("sonner", () => ({ toast }));

import { CopyButton } from "@/components/shared/CopyButton";

describe("CopyButton", () => {
  afterEach(() => vi.restoreAllMocks());

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
});
