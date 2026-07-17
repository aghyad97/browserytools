import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActiveFileBar } from "@/components/pdf-workbench/ActiveFileBar";
import type { PDFFile } from "@/components/pdf-workbench/ops";

function makeFile(name: string, size: number): PDFFile {
  return { name, size, data: new Uint8Array([1, 2, 3]) };
}

describe("ActiveFileBar", () => {
  it("renders nothing when there is no active file", () => {
    const { container } = render(
      <ActiveFileBar files={[]} selectedIndex={0} onSelect={() => {}} onDropPdf={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the active file's name and size", () => {
    const files = [makeFile("report.pdf", 2048)];
    render(
      <ActiveFileBar files={files} selectedIndex={0} onSelect={() => {}} onDropPdf={() => {}} />
    );
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
    expect(screen.getByText("2.0 KB")).toBeInTheDocument();
  });

  it("does not render the file selector when only one file is loaded", () => {
    const files = [makeFile("a.pdf", 100)];
    render(
      <ActiveFileBar files={files} selectedIndex={0} onSelect={() => {}} onDropPdf={() => {}} />
    );
    expect(screen.queryByTestId("active-file-bar-select")).not.toBeInTheDocument();
  });

  it("clicking Change opens the hidden file input", async () => {
    const user = userEvent.setup();
    const files = [makeFile("a.pdf", 100)];
    render(
      <ActiveFileBar files={files} selectedIndex={0} onSelect={() => {}} onDropPdf={() => {}} />
    );
    const input = screen.getByTestId("active-file-bar-input") as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");
    await user.click(screen.getByRole("button", { name: "Change" }));
    expect(clickSpy).toHaveBeenCalled();
  });

  it("routes a chosen file through onDropPdf", async () => {
    // onDropPdf is the shell's ASYNC handler — it decodes the file and only
    // later appends it to the shared `files` array. The bar's job stops at
    // handing the file off; selecting it once it lands is the panel's job
    // (via useActiveFileIndex), so this only asserts the hand-off itself.
    const user = userEvent.setup();
    const onDropPdf = vi.fn();
    const onSelect = vi.fn();
    const files = [makeFile("a.pdf", 100)];
    render(
      <ActiveFileBar
        files={files}
        selectedIndex={0}
        onSelect={onSelect}
        onDropPdf={onDropPdf}
      />
    );
    const input = screen.getByTestId("active-file-bar-input") as HTMLInputElement;
    const newFile = new File(["x"], "b.pdf", { type: "application/pdf" });
    await user.upload(input, newFile);

    await waitFor(() => expect(onDropPdf).toHaveBeenCalledWith([newFile]));
  });

  it("shows a file selector and switches the active file when several PDFs are loaded", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const files = [makeFile("a.pdf", 100), makeFile("b.pdf", 200)];
    render(
      <ActiveFileBar files={files} selectedIndex={0} onSelect={onSelect} onDropPdf={() => {}} />
    );
    expect(screen.getByTestId("active-file-bar-select")).toBeInTheDocument();
    await user.click(screen.getByTestId("active-file-bar-select"));
    await user.click(await screen.findByText("b.pdf"));
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
