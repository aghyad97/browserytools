import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExtractPanel } from "@/components/pdf-workbench/ExtractPanel";
import { SignPanel } from "@/components/pdf-workbench/SignPanel";
import type { PDFFile } from "@/components/pdf-workbench/ops";

// ── Engine mocks ─────────────────────────────────────────────────────────────
const extractPdfText = vi.fn(async () => ({
  pages: ["hello world"],
  full: "--- Page 1 ---\n\nhello world",
  isEmpty: false,
}));
vi.mock("@/lib/pdf/extract-text", () => ({
  extractPdfText: (...args: unknown[]) => extractPdfText(...(args as [])),
}));

const signPdf = vi.fn(async () => new Uint8Array([9, 9, 9, 9]));
vi.mock("@/lib/pdf/sign", () => ({
  signPdf: (...args: unknown[]) => signPdf(...(args as [])),
}));

// openPdf drives SignPanel's page-count + preview render.
const openPdf = vi.fn(async () => ({
  numPages: 3,
  getPage: vi.fn(async () => ({
    rotate: 0,
    getViewport: () => ({ width: 300, height: 400 }),
    render: () => ({ promise: Promise.resolve() }),
  })),
}));
vi.mock("@/lib/pdf/pdfjs-doc", () => ({
  openPdf: (...args: unknown[]) => openPdf(...(args as [])),
}));

function makeFile(overrides: Partial<PDFFile> = {}): PDFFile {
  return {
    name: "doc.pdf",
    size: 10000,
    data: new Uint8Array([1, 2, 3, 4]),
    pageCount: 3,
    ...overrides,
  };
}

const noop = vi.fn();

beforeEach(() => {
  extractPdfText.mockClear();
  signPdf.mockClear();
  openPdf.mockClear();
  noop.mockClear();
});

describe("ExtractPanel", () => {
  it("shows a dropzone when no file is loaded", () => {
    render(<ExtractPanel files={[]} onDropPdf={noop} />);
    expect(screen.getByTestId("file-dropzone")).toBeInTheDocument();
  });

  it("extracts text and shows it in the output panel", async () => {
    const user = userEvent.setup();
    const file = makeFile();
    render(<ExtractPanel files={[file]} onDropPdf={noop} />);

    await user.click(screen.getByRole("button", { name: /extract text/i }));

    await waitFor(() => expect(extractPdfText).toHaveBeenCalledWith(file.data));
    expect(screen.getByTestId("extract-output")).toHaveTextContent("hello world");
    // A download button is offered (filename → text).
    expect(screen.getByRole("button", { name: /download/i })).toBeInTheDocument();
  });

  it("shows the empty notice with an image-to-text link when the PDF has no text", async () => {
    extractPdfText.mockResolvedValueOnce({ pages: [""], full: "", isEmpty: true });
    const user = userEvent.setup();
    render(<ExtractPanel files={[makeFile()]} onDropPdf={noop} />);

    await user.click(screen.getByRole("button", { name: /extract text/i }));

    const link = await screen.findByRole("link", { name: /image to text/i });
    expect(link).toHaveAttribute("href", "/tools/image-to-text");
    // No output panel when there is nothing to show.
    expect(screen.queryByTestId("extract-output")).not.toBeInTheDocument();
  });
});

describe("SignPanel", () => {
  it("shows a dropzone when no file is loaded", () => {
    render(<SignPanel files={[]} onDropPdf={noop} />);
    expect(screen.getByTestId("file-dropzone")).toBeInTheDocument();
  });

  it("renders the draw pad by default and disables Apply with an empty signature", async () => {
    render(<SignPanel files={[makeFile()]} onDropPdf={noop} />);
    await waitFor(() => expect(openPdf).toHaveBeenCalled());
    expect(screen.getByTestId("signature-canvas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign pdf/i })).toBeDisabled();
  });

  it("clamps the page number input to the page count", async () => {
    const user = userEvent.setup();
    render(<SignPanel files={[makeFile()]} onDropPdf={noop} />);
    await waitFor(() => expect(openPdf).toHaveBeenCalled());

    const pageInput = screen.getByLabelText(/page/i) as HTMLInputElement;
    await user.clear(pageInput);
    await user.type(pageInput, "99");
    // Clamped to the 3-page document.
    await waitFor(() => expect(pageInput).toHaveValue(3));
  });

  it("signs the PDF from an uploaded PNG with the normalized placement", async () => {
    const user = userEvent.setup();
    const file = makeFile();
    render(<SignPanel files={[file]} onDropPdf={noop} />);
    await waitFor(() => expect(openPdf).toHaveBeenCalled());

    // Switch to the upload source.
    await user.click(screen.getByRole("button", { name: /upload png/i }));

    const png = new File([new Uint8Array([137, 80, 78, 71])], "sig.png", {
      type: "image/png",
    });
    const input = screen.getByTestId("sign-upload-input") as HTMLInputElement;
    await user.upload(input, png);

    const apply = screen.getByRole("button", { name: /sign pdf/i });
    await waitFor(() => expect(apply).toBeEnabled());
    await user.click(apply);

    await waitFor(() => expect(signPdf).toHaveBeenCalled());
    expect(signPdf).toHaveBeenCalledWith(
      file.data,
      expect.any(Uint8Array),
      { pageIndex: 0, x: 0.55, y: 0.75, w: 0.3, h: 0.12, pageRotation: 0 },
    );
    expect(URL.createObjectURL).toHaveBeenCalled();
  });
});
