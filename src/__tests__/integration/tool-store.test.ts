import { renderHook, act } from "@testing-library/react";
import { useToolStore } from "@/store/tool-store";

describe("Tool Store Integration", () => {
  beforeEach(() => {
    // Reset store state
    useToolStore.setState({ currentTool: null });
  });

  it("initializes with null current tool", () => {
    const { result } = renderHook(() => useToolStore());

    expect(result.current.currentTool).toBeNull();
  });

  it("sets current tool", () => {
    const { result } = renderHook(() => useToolStore());

    const tool = {
      name: "Text Counter",
      href: "/tools/text-counter",
      description: "Count words, characters, and more",
      category: "Text & Language Tools",
    };

    act(() => {
      result.current.setCurrentTool(tool);
    });

    expect(result.current.currentTool).toEqual(tool);
  });

  it("clears current tool", () => {
    const { result } = renderHook(() => useToolStore());

    const tool = {
      name: "Text Counter",
      href: "/tools/text-counter",
      description: "Count words, characters, and more",
      category: "Text & Language Tools",
    };

    act(() => {
      result.current.setCurrentTool(tool);
    });

    expect(result.current.currentTool).toEqual(tool);

    act(() => {
      result.current.setCurrentTool(null);
    });

    expect(result.current.currentTool).toBeNull();
  });

  it("updates current tool", () => {
    const { result } = renderHook(() => useToolStore());

    const tool1 = {
      name: "Text Counter",
      href: "/tools/text-counter",
      description: "Count words, characters, and more",
      category: "Text & Language Tools",
    };

    const tool2 = {
      name: "Password Generator",
      href: "/tools/password-generator",
      description: "Generate secure passwords",
      category: "Math & Finance Tools",
    };

    act(() => {
      result.current.setCurrentTool(tool1);
    });

    expect(result.current.currentTool).toEqual(tool1);

    act(() => {
      result.current.setCurrentTool(tool2);
    });

    expect(result.current.currentTool).toEqual(tool2);
  });
});
