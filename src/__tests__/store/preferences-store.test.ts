import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePreferencesStore } from "@/store/preferences-store";

const initialState = { viewMode: "grid" as const };

beforeEach(() => {
  usePreferencesStore.setState(initialState);
});

describe("usePreferencesStore", () => {
  it("defaults to grid view mode", () => {
    const { result } = renderHook(() => usePreferencesStore());
    expect(result.current.viewMode).toBe("grid");
  });

  it("switches to list view mode", () => {
    const { result } = renderHook(() => usePreferencesStore());
    act(() => { result.current.setViewMode("list"); });
    expect(result.current.viewMode).toBe("list");
  });

  it("switches back to grid view mode", () => {
    const { result } = renderHook(() => usePreferencesStore());
    act(() => { result.current.setViewMode("list"); });
    act(() => { result.current.setViewMode("grid"); });
    expect(result.current.viewMode).toBe("grid");
  });
});
