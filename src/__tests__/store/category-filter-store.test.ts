import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCategoryFilterStore } from "@/store/category-filter-store";

beforeEach(() => {
  useCategoryFilterStore.setState({ category: null });
});

describe("useCategoryFilterStore", () => {
  it("starts with no category selected", () => {
    const { result } = renderHook(() => useCategoryFilterStore());
    expect(result.current.category).toBeNull();
  });

  it("sets the active category", () => {
    const { result } = renderHook(() => useCategoryFilterStore());
    act(() => result.current.setCategory("imageTools"));
    expect(result.current.category).toBe("imageTools");
  });

  it("clears the category back to null (Everything)", () => {
    const { result } = renderHook(() => useCategoryFilterStore());
    act(() => result.current.setCategory("imageTools"));
    act(() => result.current.setCategory(null));
    expect(result.current.category).toBeNull();
  });

  it("is shared across independent hook instances (no persist, session-only)", () => {
    const a = renderHook(() => useCategoryFilterStore());
    const b = renderHook(() => useCategoryFilterStore());
    act(() => a.result.current.setCategory("textTools"));
    expect(b.result.current.category).toBe("textTools");
  });
});
