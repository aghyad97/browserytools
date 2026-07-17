import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import BingoCardGenerator from "@/components/BingoCardGenerator";

async function pasteInto(
  user: ReturnType<typeof userEvent.setup>,
  testId: string,
  text: string
) {
  const field = screen.getByTestId(testId);
  await user.click(field);
  await user.paste(text);
}

describe("BingoCardGenerator", () => {
  it("defaults to number mode and generates a 5x5 grid with a FREE center", async () => {
    const user = userEvent.setup();
    render(<BingoCardGenerator rng={() => 0} />);

    await user.click(screen.getByTestId("generate-bingo"));

    const cards = screen.getAllByTestId("bingo-card");
    expect(cards).toHaveLength(1);

    const cells = screen.getAllByTestId("bingo-cell");
    expect(cells).toHaveLength(25);

    const cellTexts = cells.map((c) => c.textContent);
    expect(cellTexts.filter((t) => t === "FREE")).toHaveLength(1);
  });

  it("generates multiple number cards when card count is increased", async () => {
    const user = userEvent.setup();
    render(<BingoCardGenerator rng={() => 0} />);

    const countInput = screen.getByTestId("bingo-card-count");
    await user.clear(countInput);
    await user.type(countInput, "3");

    await user.click(screen.getByTestId("generate-bingo"));

    expect(screen.getAllByTestId("bingo-card")).toHaveLength(3);
    expect(screen.getAllByTestId("bingo-cell")).toHaveLength(75);
  });

  it("word mode with a pasted pool renders those words", async () => {
    const user = userEvent.setup();
    render(<BingoCardGenerator rng={() => 0} />);

    await user.click(screen.getByRole("button", { name: /word pool/i }));

    const pool = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape", "Honeydew", "Kiwi"];
    await pasteInto(user, "bingo-word-pool", pool.join("\n"));

    const sizeInput = screen.getByTestId("bingo-card-size");
    await user.clear(sizeInput);
    await user.type(sizeInput, "3");

    await user.click(screen.getByTestId("generate-bingo"));

    const cells = screen.getAllByTestId("bingo-cell");
    expect(cells).toHaveLength(9);

    const rendered = cells.map((c) => c.textContent).sort();
    expect(rendered).toEqual([...pool].sort());
  });

  it("disables generate in word mode until the pool is large enough for the card size", async () => {
    const user = userEvent.setup();
    render(<BingoCardGenerator />);

    await user.click(screen.getByRole("button", { name: /word pool/i }));
    await pasteInto(user, "bingo-word-pool", ["Only", "Two"].join("\n"));

    expect(screen.getByTestId("generate-bingo")).toBeDisabled();
  });

  it("clears the word pool and results when Clear is clicked", async () => {
    const user = userEvent.setup();
    render(<BingoCardGenerator rng={() => 0} />);

    await user.click(screen.getByRole("button", { name: /word pool/i }));

    const pool = Array.from({ length: 25 }, (_, i) => `word-${i}`);
    await pasteInto(user, "bingo-word-pool", pool.join("\n"));

    await user.click(screen.getByTestId("generate-bingo"));
    expect(screen.getAllByTestId("bingo-card").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /clear/i }));

    expect(screen.getByTestId("bingo-word-pool")).toHaveValue("");
    expect(screen.queryByTestId("bingo-card")).not.toBeInTheDocument();
  });
});
