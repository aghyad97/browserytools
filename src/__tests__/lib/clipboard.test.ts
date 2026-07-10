import { describe, it, expect, vi, afterEach } from "vitest";
import { copyText } from "@/lib/clipboard";

describe("copyText", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns true when the clipboard write succeeds", async () => {
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    await expect(copyText("abc")).resolves.toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("abc");
  });

  it("returns false instead of throwing when the write fails", async () => {
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    await expect(copyText("abc")).resolves.toBe(false);
  });
});
