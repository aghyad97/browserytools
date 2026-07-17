import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompressPanel } from "@/components/pdf-workbench/CompressPanel";
import { RotatePanel } from "@/components/pdf-workbench/RotatePanel";
import type { PDFFile } from "@/components/pdf-workbench/ops";

// ── Engine mocks ─────────────────────────────────────────────────────────────
const compressPdf = vi.fn(async () => ({
  bytes: new Uint8Array([9, 9, 9]),
  pageCount: 3,
  before: 10000,
  after: 4000,
}));

vi.mock("@/lib/pdf/compress", () => ({
  compressPdf: (...args: unknown[]) => compressPdf(...(args as [])),
  COMPRESS_PRESETS: {
    high: { quality: 0.8, scale: 1.5 },
    balanced: { quality: 0.6, scale: 1.2 },
    small: { quality: 0.4, scale: 1.0 },
  },
}));

const rotatePdf = vi.fn(async () => new Uint8Array([1, 2, 3, 4]));
vi.mock("@/lib/pdf/rotate", () => ({
  rotatePdf: (...args: unknown[]) => rotatePdf(...(args as [])),
}));

// pdfjs-doc.openPdf drives the per-page thumbnail grid in RotatePanel.
// `pageRotate` lets a test simulate a source PDF whose pages carry an existing
// /Rotate (pdf.js exposes it as `page.rotate`).
let pageRotate = 0;
const openPdf = vi.fn(async () => ({
  numPages: 3,
  getPage: vi.fn(async () => ({
    rotate: pageRotate,
    getViewport: () => ({ width: 40, height: 56 }),
    render: () => ({ promise: Promise.resolve() }),
    getTextContent: async () => ({ items: [] }),
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
  compressPdf.mockClear();
  rotatePdf.mockClear();
  openPdf.mockClear();
  noop.mockClear();
  pageRotate = 0;
});

describe("CompressPanel", () => {
  it("shows a dropzone when no file is loaded", () => {
    render(<CompressPanel files={[]} onDropPdf={noop} />);
    expect(screen.getByTestId("file-dropzone")).toBeInTheDocument();
  });

  it("renders the 3-preset picker", () => {
    render(<CompressPanel files={[makeFile()]} onDropPdf={noop} />);
    expect(screen.getByRole("button", { name: /high quality/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /balanced/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /small file/i })).toBeInTheDocument();
  });

  it("always shows the rasterization honesty note", () => {
    render(<CompressPanel files={[makeFile()]} onDropPdf={noop} />);
    expect(screen.getByText(/rasterizes each page/i)).toBeInTheDocument();
  });

  it("compresses with the chosen preset and the file bytes", async () => {
    const user = userEvent.setup();
    const file = makeFile();
    render(<CompressPanel files={[file]} onDropPdf={noop} />);

    // Pick the "Small file" preset, then run.
    await user.click(screen.getByRole("button", { name: /small file/i }));
    await user.click(screen.getByRole("button", { name: /^compress pdf$/i }));

    await waitFor(() => expect(compressPdf).toHaveBeenCalled());
    expect(compressPdf).toHaveBeenCalledWith(file.data, "small");
  });

  it("renders the before/after StatStrip from the result", async () => {
    const user = userEvent.setup();
    render(<CompressPanel files={[makeFile()]} onDropPdf={noop} />);

    await user.click(screen.getByRole("button", { name: /^compress pdf$/i }));

    // before 10000 → 9.8 KB, after 4000 → 3.9 KB, reduction 60%.
    await waitFor(() => expect(screen.getByTestId("compress-stats")).toBeInTheDocument());
    const stats = within(screen.getByTestId("compress-stats"));
    expect(stats.getByText(/9\.8 KB/)).toBeInTheDocument();
    expect(stats.getByText(/3\.9 KB/)).toBeInTheDocument();
    expect(stats.getByText(/60%/)).toBeInTheDocument();
    expect(URL.createObjectURL).toHaveBeenCalled();
  });
});

describe("RotatePanel", () => {
  it("shows a dropzone when no file is loaded", () => {
    render(<RotatePanel files={[]} onDropPdf={noop} />);
    expect(screen.getByTestId("file-dropzone")).toBeInTheDocument();
  });

  it("renders one thumbnail per page", async () => {
    render(<RotatePanel files={[makeFile()]} onDropPdf={noop} />);
    await waitFor(() => expect(openPdf).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByTestId("rotate-thumb-0")).toBeInTheDocument()
    );
    expect(screen.getByTestId("rotate-thumb-1")).toBeInTheDocument();
    expect(screen.getByTestId("rotate-thumb-2")).toBeInTheDocument();
  });

  it("accumulates 90° per click on a page", async () => {
    const user = userEvent.setup();
    render(<RotatePanel files={[makeFile()]} onDropPdf={noop} />);
    await waitFor(() => expect(screen.getByTestId("rotate-thumb-0")).toBeInTheDocument());

    await user.click(screen.getByTestId("rotate-thumb-0"));
    expect(screen.getByTestId("rotate-thumb-0")).toHaveTextContent("90°");
    await user.click(screen.getByTestId("rotate-thumb-0"));
    expect(screen.getByTestId("rotate-thumb-0")).toHaveTextContent("180°");
  });

  it("applies only changed pages as an absolute rotation map", async () => {
    const user = userEvent.setup();
    const file = makeFile();
    render(<RotatePanel files={[file]} onDropPdf={noop} />);
    await waitFor(() => expect(screen.getByTestId("rotate-thumb-0")).toBeInTheDocument());

    await user.click(screen.getByTestId("rotate-thumb-0"));
    await user.click(screen.getByRole("button", { name: /apply rotation/i }));

    await waitFor(() => expect(rotatePdf).toHaveBeenCalled());
    expect(rotatePdf).toHaveBeenCalledWith(file.data, { 0: 90 });
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it("adds the click delta on top of an existing page /Rotate", async () => {
    pageRotate = 90; // source page already rotated 90°
    const user = userEvent.setup();
    const file = makeFile();
    render(<RotatePanel files={[file]} onDropPdf={noop} />);
    await waitFor(() => expect(screen.getByTestId("rotate-thumb-0")).toBeInTheDocument());

    // One click = +90° delta shown in the badge (the baseline is already baked
    // into the thumbnail), but the saved absolute rotation is 90 + 90 = 180.
    await user.click(screen.getByTestId("rotate-thumb-0"));
    expect(screen.getByTestId("rotate-thumb-0")).toHaveTextContent("90°");
    await user.click(screen.getByRole("button", { name: /apply rotation/i }));

    await waitFor(() => expect(rotatePdf).toHaveBeenCalled());
    expect(rotatePdf).toHaveBeenCalledWith(file.data, { 0: 180 });
  });

  it("rotate-all turns every page 90°", async () => {
    const user = userEvent.setup();
    const file = makeFile();
    render(<RotatePanel files={[file]} onDropPdf={noop} />);
    await waitFor(() => expect(screen.getByTestId("rotate-thumb-0")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /rotate all right/i }));
    await user.click(screen.getByRole("button", { name: /apply rotation/i }));

    await waitFor(() => expect(rotatePdf).toHaveBeenCalled());
    expect(rotatePdf).toHaveBeenCalledWith(file.data, { 0: 90, 1: 90, 2: 90 });
  });
});
