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
});
