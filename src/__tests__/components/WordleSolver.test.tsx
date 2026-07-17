import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { buildDict } from "@/lib/word/dictionary";
import { useDictionary } from "@/lib/word/useDictionary";
import WordleSolver from "@/components/WordleSolver";

vi.mock("@/lib/word/useDictionary", () => ({
  useDictionary: vi.fn(),
}));

const mockedUseDictionary = vi.mocked(useDictionary);

afterEach(() => {
  vi.resetAllMocks();
});

const TEST_DICT = buildDict(["crane", "trace", "crate", "brace", "grace"]);

async function typeLetter(user: ReturnType<typeof userEvent.setup>, index: number, letter: string) {
  await user.type(screen.getByTestId(`wordle-letter-input-${index}`), letter);
}

describe("WordleSolver", () => {
  it("solves based on tile colors: green, yellow, gray", async () => {
    mockedUseDictionary.mockReturnValue({ status: "ready", dict: TEST_DICT, retry: vi.fn() });
    const user = userEvent.setup();
    render(<WordleSolver />);

    // position 1: 'r' -> green
    await typeLetter(user, 1, "r");
    await user.click(screen.getByTestId("wordle-tile-1")); // gray -> yellow
    await user.click(screen.getByTestId("wordle-tile-1")); // yellow -> green

    // position 4: 'a' -> yellow (present elsewhere, not here)
    await typeLetter(user, 4, "a");
    await user.click(screen.getByTestId("wordle-tile-4")); // gray -> yellow

    // position 0: 'b' -> gray (excludes "brace")
    await typeLetter(user, 0, "b");

    await user.click(screen.getByTestId("wordle-solve-button"));

    const results = screen.getByTestId("wordle-results");
    expect(results).toHaveTextContent("crane");
    expect(results).toHaveTextContent("crate");
    expect(results).not.toHaveTextContent("brace");
  });

  it("is count-aware for double letters (green + gray same letter)", async () => {
    const dict = buildDict(["sadly", "spits", "today"]);
    mockedUseDictionary.mockReturnValue({ status: "ready", dict, retry: vi.fn() });
    const user = userEvent.setup();
    render(<WordleSolver />);

    // position 0: 's' -> green
    await typeLetter(user, 0, "s");
    await user.click(screen.getByTestId("wordle-tile-0"));
    await user.click(screen.getByTestId("wordle-tile-0"));

    // position 1: 's' -> gray (means exactly one 's' total)
    await typeLetter(user, 1, "s");

    await user.click(screen.getByTestId("wordle-solve-button"));

    const results = screen.getByTestId("wordle-results");
    expect(results).toHaveTextContent("sadly");
    expect(results).not.toHaveTextContent("spits");
  });

  it("shows a loading indicator while the dictionary is loading", () => {
    mockedUseDictionary.mockReturnValue({ status: "loading", dict: null, retry: vi.fn() });
    render(<WordleSolver />);

    expect(screen.getByTestId("wordle-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("wordle-tiles")).not.toBeInTheDocument();
  });

  it("shows an honest error message with a working retry button", async () => {
    const retry = vi.fn();
    mockedUseDictionary.mockReturnValue({ status: "error", dict: null, retry });
    const user = userEvent.setup();
    render(<WordleSolver />);

    expect(screen.getByTestId("wordle-error")).toBeInTheDocument();
    await user.click(screen.getByTestId("wordle-retry"));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("disables solve until a letter is entered", async () => {
    mockedUseDictionary.mockReturnValue({ status: "ready", dict: TEST_DICT, retry: vi.fn() });
    render(<WordleSolver />);

    expect(screen.getByTestId("wordle-solve-button")).toBeDisabled();
  });
});
