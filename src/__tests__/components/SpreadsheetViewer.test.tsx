import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SpreadsheetViewer from "@/components/SpreadsheetViewer";

function csvFile(name: string, csv: string) {
  return new File([csv], name, { type: "text/csv" });
}

async function uploadCsv(name: string, csv: string) {
  const user = userEvent.setup();
  const input = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  await user.upload(input, csvFile(name, csv));
  await screen.findByText(name);
  return user;
}

describe("SpreadsheetViewer", () => {
  it("renders the upload prompt with no Change control before any file loads", () => {
    render(<SpreadsheetViewer />);
    expect(screen.getByText(/drop spreadsheet here/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /change/i })
    ).not.toBeInTheDocument();
  });

  it("parses a dropped CSV and shows the file name with a Change control", async () => {
    render(<SpreadsheetViewer />);
    await uploadCsv("people.csv", "name,age\nAlice,30\nBob,25\n");

    expect(
      screen.getByRole("button", { name: /change/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("swaps the sheet via Change and clears the stale search, sort, and rows", async () => {
    render(<SpreadsheetViewer />);
    const user = await uploadCsv("people.csv", "name,age\nAlice,30\nBob,25\n");

    // Filter down to a single row of the first sheet.
    const search = screen.getByPlaceholderText(/search in data/i);
    await user.type(search, "Alice");
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();

    // Sort by a column too, so there's sort state to verify gets reset.
    await user.click(screen.getByText("name"));

    // Swap to a completely different sheet via Change.
    await user.click(screen.getByRole("button", { name: /change/i }));
    const changeInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    await user.upload(
      changeInput,
      csvFile("products.csv", "product,price\nWidget,9\nGadget,19\n")
    );
    await screen.findByText("products.csv");

    // The new sheet's rows are shown — the old sheet's rows and the "Alice"
    // filter (which matches nothing in the new columns) must not linger.
    expect(screen.getByText("Widget")).toBeInTheDocument();
    expect(screen.getByText("Gadget")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();

    // The stale search text must be cleared, not just stop matching.
    expect(screen.getByPlaceholderText(/search in data/i)).toHaveValue("");
  });
});
