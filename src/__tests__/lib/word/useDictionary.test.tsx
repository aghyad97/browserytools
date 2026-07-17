import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, waitFor, fireEvent } from "@testing-library/react";
import { useDictionary } from "@/lib/word/useDictionary";
import { buildDict } from "@/lib/word/dictionary";
import { loadDictionary } from "@/lib/word/dictionary";

vi.mock("@/lib/word/dictionary", async (imp) => ({
  ...(await imp<typeof import("@/lib/word/dictionary")>()),
  loadDictionary: vi.fn(),
}));

const mockedLoadDictionary = vi.mocked(loadDictionary);

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

function Probe() {
  const { status, dict, retry } = useDictionary();
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="word-count">{dict ? dict.set.size : "none"}</span>
      <button onClick={retry}>retry</button>
    </div>
  );
}

describe("useDictionary", () => {
  it("goes loading -> ready and sets dict on successful load", async () => {
    const dict = buildDict(["cat", "car", "act"]);
    mockedLoadDictionary.mockResolvedValue(dict);

    render(<Probe />);

    expect(screen.getByTestId("status").textContent).toBe("loading");

    await waitFor(() => expect(screen.getByTestId("status").textContent).toBe("ready"));
    expect(screen.getByTestId("word-count").textContent).toBe("3");
    expect(mockedLoadDictionary).toHaveBeenCalledTimes(1);
  });

  it("goes to error on rejection, and retry re-invokes loadDictionary", async () => {
    mockedLoadDictionary.mockRejectedValueOnce(new Error("network fail"));

    render(<Probe />);

    await waitFor(() => expect(screen.getByTestId("status").textContent).toBe("error"));
    expect(mockedLoadDictionary).toHaveBeenCalledTimes(1);

    const dict = buildDict(["dog", "god"]);
    mockedLoadDictionary.mockResolvedValueOnce(dict);

    fireEvent.click(screen.getByText("retry"));

    expect(screen.getByTestId("status").textContent).toBe("loading");
    await waitFor(() => expect(screen.getByTestId("status").textContent).toBe("ready"));
    expect(screen.getByTestId("word-count").textContent).toBe("2");
    expect(mockedLoadDictionary).toHaveBeenCalledTimes(2);
  });

  it("does not update state after unmount when loadDictionary resolves late", async () => {
    let resolveLoad!: (d: ReturnType<typeof buildDict>) => void;
    const deferred = new Promise<ReturnType<typeof buildDict>>((resolve) => {
      resolveLoad = resolve;
    });
    mockedLoadDictionary.mockReturnValue(deferred);

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { unmount } = render(<Probe />);
    expect(screen.getByTestId("status").textContent).toBe("loading");

    unmount();

    // Resolve after unmount — if the hook doesn't guard this, React will
    // warn ("act"/"perform a React state update on an unmounted component").
    resolveLoad(buildDict(["dog", "god"]));
    await deferred;
    // flush microtasks so the .then() handler (if unguarded) has a chance to run
    await Promise.resolve();
    await Promise.resolve();

    const unmountWarning = consoleErrorSpy.mock.calls.some((call) =>
      call.some(
        (arg) =>
          typeof arg === "string" &&
          (arg.includes("unmounted component") || arg.includes("not wrapped in act")),
      ),
    );
    expect(unmountWarning).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});
