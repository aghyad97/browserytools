import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { buildDict } from "@/lib/word/dictionary";
import { useDictionary } from "@/lib/word/useDictionary";
import WordUnscrambler from "@/components/WordUnscrambler";

vi.mock("@/lib/word/useDictionary", () => ({
  useDictionary: vi.fn(),
}));

const mockedUseDictionary = vi.mocked(useDictionary);

afterEach(() => {
  vi.resetAllMocks();
});

const TEST_DICT = buildDict(["cat", "act", "scar", "cars", "at", "a"]);

describe("WordUnscrambler", () => {
  it("solves letters and groups results by length, descending", async () => {
    mockedUseDictionary.mockReturnValue({ status: "ready", dict: TEST_DICT, retry: vi.fn() });
    const user = userEvent.setup();
    render(<WordUnscrambler />);

    await user.type(screen.getByTestId("unscramble-letters-input"), "scarcat");
    await user.click(screen.getByTestId("unscramble-solve-button"));

    const results = screen.getByTestId("unscramble-results");
    const groups = screen.getAllByTestId("unscramble-group");

    // 4-letter group comes before the 3-letter group (length descending)
    expect(groups[0]).toHaveTextContent("4");
    expect(groups[0]).toHaveTextContent("cars");
    expect(groups[0]).toHaveTextContent("scar");

    expect(groups[1]).toHaveTextContent("3");
    expect(groups[1]).toHaveTextContent("act");
    expect(groups[1]).toHaveTextContent("cat");

    expect(results).toHaveTextContent("at");
    expect(results).toHaveTextContent("a");
  });

  it("filters by minimum length", async () => {
    mockedUseDictionary.mockReturnValue({ status: "ready", dict: TEST_DICT, retry: vi.fn() });
    const user = userEvent.setup();
    render(<WordUnscrambler />);

    await user.type(screen.getByTestId("unscramble-letters-input"), "scarcat");
    await user.type(screen.getByTestId("unscramble-min-length-input"), "4");
    await user.click(screen.getByTestId("unscramble-solve-button"));

    const results = screen.getByTestId("unscramble-results");
    expect(results).toHaveTextContent("cars");
    expect(results).toHaveTextContent("scar");
    expect(results).not.toHaveTextContent("cat");
    expect(results).not.toHaveTextContent("act");
  });

  it("filters by a required letter", async () => {
    mockedUseDictionary.mockReturnValue({ status: "ready", dict: TEST_DICT, retry: vi.fn() });
    const user = userEvent.setup();
    render(<WordUnscrambler />);

    await user.type(screen.getByTestId("unscramble-letters-input"), "scarcat");
    await user.type(screen.getByTestId("unscramble-contains-input"), "r");
    await user.click(screen.getByTestId("unscramble-solve-button"));

    const results = screen.getByTestId("unscramble-results");
    expect(results).toHaveTextContent("cars");
    expect(results).toHaveTextContent("scar");
    expect(results).not.toHaveTextContent(/\bcat\b/);
    expect(results).not.toHaveTextContent(/\bact\b/);
  });

  it("shows a loading indicator while the dictionary is loading", () => {
    mockedUseDictionary.mockReturnValue({ status: "loading", dict: null, retry: vi.fn() });
    render(<WordUnscrambler />);

    expect(screen.getByTestId("unscramble-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("unscramble-letters-input")).not.toBeInTheDocument();
  });

  it("shows an honest error message with a working retry button", async () => {
    const retry = vi.fn();
    mockedUseDictionary.mockReturnValue({ status: "error", dict: null, retry });
    const user = userEvent.setup();
    render(<WordUnscrambler />);

    expect(screen.getByTestId("unscramble-error")).toBeInTheDocument();
    await user.click(screen.getByTestId("unscramble-retry"));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
