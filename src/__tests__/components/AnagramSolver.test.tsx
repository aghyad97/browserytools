import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { buildDict } from "@/lib/word/dictionary";
import { useDictionary } from "@/lib/word/useDictionary";
import AnagramSolver from "@/components/AnagramSolver";

vi.mock("@/lib/word/useDictionary", () => ({
  useDictionary: vi.fn(),
}));

const mockedUseDictionary = vi.mocked(useDictionary);

afterEach(() => {
  vi.resetAllMocks();
});

const TEST_DICT = buildDict(["cat", "act", "at", "a", "tac"]);

describe("AnagramSolver", () => {
  it("solves exact-length anagrams by default", async () => {
    mockedUseDictionary.mockReturnValue({ status: "ready", dict: TEST_DICT, retry: vi.fn() });
    const user = userEvent.setup();
    render(<AnagramSolver />);

    await user.type(screen.getByTestId("anagram-letters-input"), "cat");
    await user.click(screen.getByTestId("anagram-solve-button"));

    const results = screen.getByTestId("anagram-results");
    expect(results).toHaveTextContent("act");
    expect(results).toHaveTextContent("cat");
    expect(results).toHaveTextContent("tac");
    expect(results).not.toHaveTextContent(/\bat\b/);
    expect(results).not.toHaveTextContent(/\ba\b/);
  });

  it("includes shorter sub-anagrams, grouped by length, when the toggle is on", async () => {
    mockedUseDictionary.mockReturnValue({ status: "ready", dict: TEST_DICT, retry: vi.fn() });
    const user = userEvent.setup();
    render(<AnagramSolver />);

    await user.type(screen.getByTestId("anagram-letters-input"), "cat");
    await user.click(screen.getByTestId("anagram-allow-shorter"));
    await user.click(screen.getByTestId("anagram-solve-button"));

    const results = screen.getByTestId("anagram-results");
    expect(results).toHaveTextContent("act");
    expect(results).toHaveTextContent("cat");
    expect(results).toHaveTextContent("tac");
    expect(results).toHaveTextContent("at");
    expect(results).toHaveTextContent("a");

    const groups = screen.getAllByTestId("anagram-group");
    expect(groups.length).toBeGreaterThan(1);
    expect(groups[0]).toHaveTextContent("3");
  });

  it("clears stale results when the letters input changes", async () => {
    mockedUseDictionary.mockReturnValue({ status: "ready", dict: TEST_DICT, retry: vi.fn() });
    const user = userEvent.setup();
    render(<AnagramSolver />);

    await user.type(screen.getByTestId("anagram-letters-input"), "cat");
    await user.click(screen.getByTestId("anagram-solve-button"));
    expect(screen.getByTestId("anagram-results")).toBeInTheDocument();

    await user.type(screen.getByTestId("anagram-letters-input"), "s");
    expect(screen.queryByTestId("anagram-results")).not.toBeInTheDocument();
  });

  it("shows a loading indicator while the dictionary is loading", () => {
    mockedUseDictionary.mockReturnValue({ status: "loading", dict: null, retry: vi.fn() });
    render(<AnagramSolver />);

    expect(screen.getByTestId("anagram-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("anagram-letters-input")).not.toBeInTheDocument();
  });

  it("shows an honest error message with a working retry button", async () => {
    const retry = vi.fn();
    mockedUseDictionary.mockReturnValue({ status: "error", dict: null, retry });
    const user = userEvent.setup();
    render(<AnagramSolver />);

    expect(screen.getByTestId("anagram-error")).toBeInTheDocument();
    await user.click(screen.getByTestId("anagram-retry"));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
