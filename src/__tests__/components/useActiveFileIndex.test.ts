import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useActiveFileIndex } from "@/components/pdf-workbench/useActiveFileIndex";
import type { PDFFile } from "@/components/pdf-workbench/ops";

function makeFile(name: string): PDFFile {
  return { name, size: 100, data: new Uint8Array([1]) };
}

describe("useActiveFileIndex", () => {
  it("starts at index 0", () => {
    const { result } = renderHook(({ files }) => useActiveFileIndex(files), {
      initialProps: { files: [makeFile("a.pdf")] },
    });
    expect(result.current[0]).toBe(0);
  });

  it("selects the newly appended file once `files` grows (Change button flow)", () => {
    // Regression for the race an earlier ActiveFileBar implementation hit:
    // Change's onDropPdf is ASYNC, so the file only lands in `files` on a
    // LATER render. This hook must select the new file once it actually
    // arrives, not clobber an optimistic guess back to 0 in the meantime.
    const { result, rerender } = renderHook(({ files }) => useActiveFileIndex(files), {
      initialProps: { files: [makeFile("a.pdf")] },
    });
    expect(result.current[0]).toBe(0);

    // The shared `files` array grows from 1 to 2 (the shell's async onDropPdf
    // resolved and appended the new file) — no manual selection call needed.
    rerender({ files: [makeFile("a.pdf"), makeFile("b.pdf")] });
    expect(result.current[0]).toBe(1);
  });

  it("keeps a manual selection made via the selector", () => {
    const { result, rerender } = renderHook(({ files }) => useActiveFileIndex(files), {
      initialProps: { files: [makeFile("a.pdf"), makeFile("b.pdf")] },
    });
    act(() => result.current[1](0));
    rerender({ files: [makeFile("a.pdf"), makeFile("b.pdf")] });
    expect(result.current[0]).toBe(0);
  });

  it("clamps back to 0 if the selection falls out of range (files shrink)", () => {
    const { result, rerender } = renderHook(({ files }) => useActiveFileIndex(files), {
      initialProps: { files: [makeFile("a.pdf"), makeFile("b.pdf")] },
    });
    act(() => result.current[1](1));
    rerender({ files: [makeFile("a.pdf")] });
    expect(result.current[0]).toBe(0);
  });
});
