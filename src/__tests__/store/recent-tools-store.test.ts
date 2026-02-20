import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecentToolsStore } from "@/store/recent-tools-store";
import type { Tool } from "@/lib/tools-config";

const initialState = { recentTools: [], maxRecentTools: 5 };

beforeEach(() => {
  useRecentToolsStore.setState(initialState);
});

const mockTools: (Tool & { category: string })[] = Array.from(
  { length: 7 },
  (_, i) => ({
    name: `Tool ${i + 1}`,
    href: `/tools/tool-${i + 1}`,
    description: `Tool ${i + 1} description`,
    category: "Test",
    icon: () => null,
    order: i + 1,
    available: true,
    creationDate: "2024-01-01",
  })
);

describe("useRecentToolsStore — addRecentTool", () => {
  it("adds a tool to the recent list", () => {
    const { result } = renderHook(() => useRecentToolsStore());
    act(() => { result.current.addRecentTool("/tools/tool-1"); });
    expect(result.current.recentTools).toHaveLength(1);
    expect(result.current.recentTools[0].href).toBe("/tools/tool-1");
  });

  it("moves a duplicate to the front instead of adding another entry", () => {
    const { result } = renderHook(() => useRecentToolsStore());
    act(() => {
      result.current.addRecentTool("/tools/tool-1");
      result.current.addRecentTool("/tools/tool-2");
      result.current.addRecentTool("/tools/tool-1"); // revisit
    });
    expect(result.current.recentTools).toHaveLength(2);
    expect(result.current.recentTools[0].href).toBe("/tools/tool-1");
  });

  it("enforces the max of 5 recent tools", () => {
    const { result } = renderHook(() => useRecentToolsStore());
    act(() => {
      for (let i = 1; i <= 7; i++) {
        result.current.addRecentTool(`/tools/tool-${i}`);
      }
    });
    expect(result.current.recentTools).toHaveLength(5);
  });

  it("keeps the most recently visited tools (newest first)", () => {
    const { result } = renderHook(() => useRecentToolsStore());
    act(() => {
      for (let i = 1; i <= 7; i++) {
        result.current.addRecentTool(`/tools/tool-${i}`);
      }
    });
    // Tool 7 was added last, so it's the most recent
    expect(result.current.recentTools[0].href).toBe("/tools/tool-7");
  });
});

describe("useRecentToolsStore — clearRecentTools", () => {
  it("empties the recent tools list", () => {
    const { result } = renderHook(() => useRecentToolsStore());
    act(() => {
      result.current.addRecentTool("/tools/tool-1");
      result.current.addRecentTool("/tools/tool-2");
    });
    act(() => { result.current.clearRecentTools(); });
    expect(result.current.recentTools).toHaveLength(0);
  });
});

describe("useRecentToolsStore — getRecentTools", () => {
  it("returns only tools that are in the recent list", () => {
    const { result } = renderHook(() => useRecentToolsStore());
    act(() => {
      result.current.addRecentTool("/tools/tool-2");
      result.current.addRecentTool("/tools/tool-4");
    });
    const recent = result.current.getRecentTools(mockTools);
    expect(recent).toHaveLength(2);
    const hrefs = recent.map((t) => t.href);
    expect(hrefs).toContain("/tools/tool-2");
    expect(hrefs).toContain("/tools/tool-4");
  });

  it("returns empty array when no recent tools exist", () => {
    const { result } = renderHook(() => useRecentToolsStore());
    const recent = result.current.getRecentTools(mockTools);
    expect(recent).toHaveLength(0);
  });
});
