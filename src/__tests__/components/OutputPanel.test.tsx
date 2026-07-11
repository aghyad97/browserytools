import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OutputPanel } from "@/components/shared/OutputPanel";

describe("OutputPanel", () => {
  it("renders the text in a mono block and a title", () => {
    render(<OutputPanel title="Result" text="hello world" />);
    expect(screen.getByText("Result")).toBeInTheDocument();
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it("renders children as the body instead of the default mono block", () => {
    render(
      <OutputPanel text="raw payload">
        <span data-testid="structured">structured body</span>
      </OutputPanel>
    );
    expect(screen.getByTestId("structured")).toBeInTheDocument();
    expect(screen.queryByText("raw payload")).not.toBeInTheDocument();
  });

  it("disables the copy button when text is empty", () => {
    render(<OutputPanel text="" />);
    expect(screen.getByRole("button", { name: "Copy" })).toBeDisabled();
  });

  it("shows no download button unless filename is given", () => {
    render(<OutputPanel text="x" />);
    expect(screen.queryByRole("button", { name: "Download" })).not.toBeInTheDocument();
  });

  describe("with a filename", () => {
    let clicked: HTMLAnchorElement[] = [];
    beforeEach(() => {
      clicked = [];
      vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
        this: HTMLAnchorElement
      ) {
        clicked.push(this);
      });
      vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock");
      vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    });
    afterEach(() => vi.restoreAllMocks());

    it("downloads text to the given filename on click", () => {
      render(<OutputPanel text="content" filename="out.txt" />);
      fireEvent.click(screen.getByRole("button", { name: "Download" }));
      expect(clicked).toHaveLength(1);
      expect(clicked[0].download).toBe("out.txt");
    });

    it("disables download when text is empty", () => {
      render(<OutputPanel text="" filename="out.txt" />);
      expect(screen.getByRole("button", { name: "Download" })).toBeDisabled();
    });
  });
});
