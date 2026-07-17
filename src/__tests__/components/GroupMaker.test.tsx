import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import GroupMaker from "@/components/GroupMaker";

async function typeNames(user: ReturnType<typeof userEvent.setup>, names: string[]) {
  const textarea = screen.getByTestId("group-names-input");
  await user.click(textarea);
  await user.paste(names.join("\n"));
}

describe("GroupMaker", () => {
  it("parses one name per line, stripping blank lines", async () => {
    const user = userEvent.setup();
    render(<GroupMaker />);

    await typeNames(user, ["Alice", "", "Bob", "  ", "Charlie"]);

    expect(screen.getByTestId("group-names-count")).toHaveTextContent("3");
  });

  it("splits 6 names into 2 groups covering all names", async () => {
    const user = userEvent.setup();
    render(<GroupMaker rng={() => 0} />);

    await typeNames(user, ["Alice", "Bob", "Charlie", "Dave", "Erin", "Frank"]);

    const countInput = screen.getByTestId("group-count-input");
    await user.clear(countInput);
    await user.type(countInput, "2");

    await user.click(screen.getByTestId("generate-groups"));

    const groupCards = screen.getAllByTestId("group-card");
    expect(groupCards).toHaveLength(2);

    const allNames = groupCards.flatMap((card) =>
      Array.from(card.querySelectorAll("li")).map((li) => li.textContent),
    );
    expect(allNames.sort()).toEqual(
      ["Alice", "Bob", "Charlie", "Dave", "Erin", "Frank"].sort(),
    );
  });

  it("caps group size when splitting by group size", async () => {
    const user = userEvent.setup();
    render(<GroupMaker rng={() => 0} />);

    await typeNames(user, ["Alice", "Bob", "Charlie", "Dave", "Erin"]);

    await user.click(screen.getByRole("button", { name: /group size/i }));

    const sizeInput = screen.getByTestId("group-size-input");
    await user.clear(sizeInput);
    await user.type(sizeInput, "2");

    await user.click(screen.getByTestId("generate-groups"));

    const groupCards = screen.getAllByTestId("group-card");
    for (const card of groupCards) {
      expect(card.querySelectorAll("li").length).toBeLessThanOrEqual(2);
    }
  });

  it("disables generate until names are entered", () => {
    render(<GroupMaker />);
    expect(screen.getByTestId("generate-groups")).toBeDisabled();
  });

  it("renders duplicate names without a duplicate-key warning", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<GroupMaker rng={() => 0} />);

    await typeNames(user, ["Alice", "Alice"]);

    const countInput = screen.getByTestId("group-count-input");
    await user.clear(countInput);
    await user.type(countInput, "1");

    await user.click(screen.getByTestId("generate-groups"));

    const groupCards = screen.getAllByTestId("group-card");
    expect(groupCards).toHaveLength(1);
    expect(groupCards[0].querySelectorAll("li")).toHaveLength(2);

    const keyWarnings = errorSpy.mock.calls.filter((args) =>
      String(args[0]).includes("same key"),
    );
    expect(keyWarnings).toHaveLength(0);

    errorSpy.mockRestore();
  });

  it("clears names and generated groups when Clear is clicked", async () => {
    const user = userEvent.setup();
    render(<GroupMaker rng={() => 0} />);

    await typeNames(user, ["Alice", "Bob"]);
    await user.click(screen.getByTestId("generate-groups"));
    expect(screen.getAllByTestId("group-card").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /clear/i }));

    expect(screen.getByTestId("group-names-input")).toHaveValue("");
    expect(screen.queryByTestId("group-card")).not.toBeInTheDocument();
  });
});
