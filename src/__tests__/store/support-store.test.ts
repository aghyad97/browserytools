import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSupportStore } from "@/store/support-store";

beforeEach(() => {
  useSupportStore.setState({ wins: 0, dismissed: false });
});

describe("useSupportStore", () => {
  it("starts with no wins and no dismissal", () => {
    const { result } = renderHook(() => useSupportStore());
    expect(result.current.wins).toBe(0);
    expect(result.current.dismissed).toBe(false);
  });

  it("counts each successful output", () => {
    const { result } = renderHook(() => useSupportStore());
    act(() => result.current.recordWin());
    act(() => result.current.recordWin());
    expect(result.current.wins).toBe(2);
  });

  it("dismissal is permanent and does not reset when more wins arrive", () => {
    const { result } = renderHook(() => useSupportStore());
    act(() => result.current.dismiss());
    expect(result.current.dismissed).toBe(true);

    act(() => result.current.recordWin());
    expect(result.current.dismissed).toBe(true);
    expect(result.current.wins).toBe(1);
  });
});
