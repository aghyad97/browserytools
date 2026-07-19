import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import PdfToWord from "@/components/PdfToWord";
import type { DocBlock } from "@/lib/pdf/layout";

// Mock the layout engine and docx builder — never run the real PDF/docx
// pipeline in unit tests (both are heavy, WASM/pdf.js-backed modules).
const extractDocument = vi.fn();
vi.mock("@/lib/pdf/layout", () => ({
  extractDocument: (...args: unknown[]) => extractDocument(...args),
}));

const buildDocx = vi.fn();
vi.mock("@/lib/docx/build", () => ({
  buildDocx: (...args: unknown[]) => buildDocx(...args),
}));

const downloadBlob = vi.fn();
vi.mock("@/lib/download", () => ({
  downloadBlob: (...args: unknown[]) => downloadBlob(...args),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

function makeFile(name = "report.pdf") {
  const file = new File(["fake-pdf-bytes"], name, { type: "application/pdf" });
  // happy-dom's File.arrayBuffer may be missing — provide a stub.
  Object.defineProperty(file, "arrayBuffer", {
    value: () => Promise.resolve(new ArrayBuffer(16)),
    configurable: true,
  });
  return file;
}

// 3 headings, 12 paragraphs, 1 list, 2 tables — matches the brief's example
// summary ("3 headings · 2 tables · 12 paragraphs · 1 list").
function sampleBlocks(): DocBlock[] {
  const blocks: DocBlock[] = [
    { type: "heading", level: 1, text: "Title" },
    { type: "heading", level: 2, text: "Section A" },
    { type: "heading", level: 2, text: "Section B" },
  ];
  for (let i = 0; i < 12; i++) {
    blocks.push({ type: "paragraph", text: `Paragraph ${i}` });
  }
  blocks.push({ type: "list", ordered: false, items: ["one", "two"] });
  blocks.push({ type: "table", rows: [["a", "b"]], ruled: true });
  blocks.push({ type: "table", rows: [["c", "d"]], ruled: false });
  return blocks;
}

const SAMPLE_RESULT = { blocks: sampleBlocks(), pageCount: 5, scannedPages: [] };

beforeEach(() => {
  extractDocument.mockReset();
  buildDocx.mockReset();
  downloadBlob.mockReset();
  vi.mocked(toast.error).mockReset();
  vi.mocked(toast.success).mockReset();
  extractDocument.mockResolvedValue(SAMPLE_RESULT);
  buildDocx.mockResolvedValue(new Blob(["fake-docx"]));
});

describe("PdfToWord", () => {
  it("renders the dropzone and a disabled Convert action", () => {
    render(<PdfToWord />);
    expect(screen.getByTestId("pdf-to-word-input")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /convert to word/i }),
    ).toBeDisabled();
  });

  it("calls extractDocument when a PDF is dropped", async () => {
    const user = userEvent.setup();
    render(<PdfToWord />);

    const input = screen.getByTestId("pdf-to-word-input") as HTMLInputElement;
    await user.upload(input, makeFile());

    await waitFor(() => expect(extractDocument).toHaveBeenCalledTimes(1));
    expect(extractDocument).toHaveBeenCalledWith(
      expect.any(Uint8Array),
      expect.objectContaining({ onProgress: expect.any(Function) }),
    );
  });

  it("renders the structure summary with the detected counts", async () => {
    const user = userEvent.setup();
    render(<PdfToWord />);

    const input = screen.getByTestId("pdf-to-word-input") as HTMLInputElement;
    await user.upload(input, makeFile());

    const summary = await screen.findByTestId("pdf-to-word-summary");
    expect(summary).toHaveTextContent("3"); // headings
    expect(summary).toHaveTextContent("2"); // tables
    expect(summary).toHaveTextContent("12"); // paragraphs
    expect(summary).toHaveTextContent("1"); // lists
    expect(summary).toHaveTextContent("5"); // pages
    expect(summary).toHaveTextContent(/tables/i);
    expect(summary).toHaveTextContent(/headings/i);
    expect(summary).toHaveTextContent(/paragraphs/i);
  });

  it("clicking Convert calls buildDocx then downloadBlob with a .docx filename", async () => {
    const user = userEvent.setup();
    render(<PdfToWord />);

    const input = screen.getByTestId("pdf-to-word-input") as HTMLInputElement;
    await user.upload(input, makeFile("my-report.pdf"));

    await waitFor(() =>
      expect(screen.getByTestId("pdf-to-word-summary")).toBeInTheDocument(),
    );

    const convertBtn = screen.getByRole("button", { name: /convert to word/i });
    await waitFor(() => expect(convertBtn).not.toBeDisabled());
    await user.click(convertBtn);

    await waitFor(() => expect(downloadBlob).toHaveBeenCalledTimes(1));
    expect(buildDocx).toHaveBeenCalledWith(
      SAMPLE_RESULT.blocks,
      expect.objectContaining({ title: "my-report" }),
    );
    const [blobArg, filenameArg] = downloadBlob.mock.calls[0];
    expect(blobArg).toBeInstanceOf(Blob);
    expect(filenameArg).toBe("my-report.docx");

    // buildDocx must resolve before downloadBlob is invoked.
    const buildOrder = buildDocx.mock.invocationCallOrder[0];
    const downloadOrder = downloadBlob.mock.invocationCallOrder[0];
    expect(buildOrder).toBeLessThan(downloadOrder);
  });

  it("shows a scanned-pages notice when scannedPages is non-empty", async () => {
    extractDocument.mockResolvedValue({
      blocks: sampleBlocks(),
      pageCount: 6,
      scannedPages: [2, 5], // 0-based -> pages 3 and 6
    });
    const user = userEvent.setup();
    render(<PdfToWord />);

    const input = screen.getByTestId("pdf-to-word-input") as HTMLInputElement;
    await user.upload(input, makeFile());

    const notice = await screen.findByTestId("pdf-to-word-scanned-notice");
    expect(notice).toHaveTextContent("3");
    expect(notice).toHaveTextContent("6");
    expect(
      screen.getByRole("link", { name: /ocr/i }),
    ).toHaveAttribute("href", "/tools/image-to-text");
  });

  it("resets prior results when the file is changed (no stale summary)", async () => {
    let resolveSecond: (value: typeof SAMPLE_RESULT) => void = () => {};
    extractDocument
      .mockResolvedValueOnce(SAMPLE_RESULT)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSecond = resolve;
          }),
      );

    const user = userEvent.setup();
    render(<PdfToWord />);

    const input = screen.getByTestId("pdf-to-word-input") as HTMLInputElement;
    await user.upload(input, makeFile("first.pdf"));

    await waitFor(() =>
      expect(screen.getByTestId("pdf-to-word-summary")).toBeInTheDocument(),
    );

    const changeInput = screen.getByTestId(
      "pdf-to-word-change-input",
    ) as HTMLInputElement;
    await user.upload(changeInput, makeFile("second.pdf"));

    // The old summary must disappear immediately, before the second
    // extraction resolves — it must not linger as stale state.
    await waitFor(() =>
      expect(screen.queryByTestId("pdf-to-word-summary")).not.toBeInTheDocument(),
    );

    resolveSecond({
      blocks: [{ type: "paragraph", text: "only one block" }],
      pageCount: 1,
      scannedPages: [],
    });

    const summary = await screen.findByTestId("pdf-to-word-summary");
    expect(summary).toHaveTextContent("1"); // paragraphs, this time just one
  });

  it("recovers to a usable state when extractDocument rejects (toast + can pick another file)", async () => {
    extractDocument.mockReset();
    extractDocument.mockRejectedValueOnce(new Error("boom"));

    const user = userEvent.setup();
    render(<PdfToWord />);

    const input = screen.getByTestId("pdf-to-word-input") as HTMLInputElement;
    await user.upload(input, makeFile("bad.pdf"));

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));

    // Not stuck in "extracting": the progress bar is gone and the file info
    // (with its "Change" control) is showing instead of being frozen mid-load.
    expect(screen.queryByTestId("pdf-to-word-progress")).not.toBeInTheDocument();
    const changeBtn = screen.getByRole("button", { name: /change/i });
    expect(changeBtn).not.toBeDisabled();

    // The user can pick another file and it goes through normally.
    extractDocument.mockResolvedValueOnce(SAMPLE_RESULT);
    const changeInput = screen.getByTestId(
      "pdf-to-word-change-input",
    ) as HTMLInputElement;
    await user.upload(changeInput, makeFile("good.pdf"));

    const summary = await screen.findByTestId("pdf-to-word-summary");
    expect(summary).toHaveTextContent("3"); // headings, from SAMPLE_RESULT
  });

  it("recovers to a usable state when buildDocx rejects (toast + Convert re-enabled)", async () => {
    buildDocx.mockReset();
    buildDocx.mockRejectedValueOnce(new Error("boom"));

    const user = userEvent.setup();
    render(<PdfToWord />);

    const input = screen.getByTestId("pdf-to-word-input") as HTMLInputElement;
    await user.upload(input, makeFile());

    await waitFor(() =>
      expect(screen.getByTestId("pdf-to-word-summary")).toBeInTheDocument(),
    );

    const convertBtn = screen.getByRole("button", { name: /convert to word/i });
    await waitFor(() => expect(convertBtn).not.toBeDisabled());
    await user.click(convertBtn);

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
    expect(downloadBlob).not.toHaveBeenCalled();

    // "converting" reset: Convert is clickable again, not stuck disabled.
    await waitFor(() => expect(convertBtn).not.toBeDisabled());
  });

  it("disables the Change button while converting, to prevent a file-swap race", async () => {
    let resolveConvert: (value: Blob) => void = () => {};
    buildDocx.mockReset();
    buildDocx.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveConvert = resolve;
        }),
    );

    const user = userEvent.setup();
    render(<PdfToWord />);

    const input = screen.getByTestId("pdf-to-word-input") as HTMLInputElement;
    await user.upload(input, makeFile());

    await waitFor(() =>
      expect(screen.getByTestId("pdf-to-word-summary")).toBeInTheDocument(),
    );

    const convertBtn = screen.getByRole("button", { name: /convert to word/i });
    await waitFor(() => expect(convertBtn).not.toBeDisabled());
    await user.click(convertBtn);

    // While buildDocx is still in flight, Change must be disabled — otherwise
    // the user can swap in a new file whose extraction clears `result` out
    // from under the in-flight convert() closure, and the stale conversion
    // silently downloads under the new file's UI.
    const changeBtn = await screen.findByRole("button", { name: /change/i });
    expect(changeBtn).toBeDisabled();

    resolveConvert(new Blob(["fake-docx"]));
    await waitFor(() => expect(downloadBlob).toHaveBeenCalledTimes(1));
  });
});
