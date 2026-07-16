import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReorderPanel } from "@/components/pdf-workbench/ReorderPanel";
import { WatermarkPanel } from "@/components/pdf-workbench/WatermarkPanel";
import type { PDFFile } from "@/components/pdf-workbench/ops";

// ── Engine mocks ─────────────────────────────────────────────────────────────
const reorderPdf = vi.fn(async () => new Uint8Array([1, 2, 3, 4]));
vi.mock("@/lib/pdf/reorder", () => ({
  reorderPdf: (...args: unknown[]) => reorderPdf(...(args as [])),
}));

const watermarkPdf = vi.fn(async () => new Uint8Array([5, 6, 7, 8]));
vi.mock("@/lib/pdf/watermark", () => ({
  watermarkPdf: (...args: unknown[]) => watermarkPdf(...(args as [])),
}));

// pdfjs-doc.openPdf drives the per-page thumbnail grid in ReorderPanel.
const openPdf = vi.fn(async () => ({
  numPages: 3,
  getPage: vi.fn(async () => ({
    rotate: 0,
    getViewport: () => ({ width: 40, height: 56 }),
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
  reorderPdf.mockClear();
  watermarkPdf.mockClear();
  openPdf.mockClear();
  noop.mockClear();
});

describe("ReorderPanel", () => {
  it("shows a dropzone when no file is loaded", () => {
    render(<ReorderPanel files={[]} onDropPdf={noop} />);
    expect(screen.getByTestId("file-dropzone")).toBeInTheDocument();
  });

  it("renders one thumbnail per page", async () => {
    render(<ReorderPanel files={[makeFile()]} onDropPdf={noop} />);
    await waitFor(() => expect(openPdf).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByTestId("reorder-thumb-0")).toBeInTheDocument()
    );
    expect(screen.getByTestId("reorder-thumb-1")).toBeInTheDocument();
    expect(screen.getByTestId("reorder-thumb-2")).toBeInTheDocument();
  });

  it("drags a page to a new slot and applies the reordered indices", async () => {
    const user = userEvent.setup();
    const file = makeFile();
    render(<ReorderPanel files={[file]} onDropPdf={noop} />);
    await waitFor(() => expect(screen.getByTestId("reorder-thumb-0")).toBeInTheDocument());

    // Drag the first page (source index 0) onto the last slot → order [1,2,0].
    fireEvent.dragStart(screen.getByTestId("reorder-thumb-0"));
    fireEvent.dragOver(screen.getByTestId("reorder-thumb-2"));
    fireEvent.drop(screen.getByTestId("reorder-thumb-2"));

    await user.click(screen.getByRole("button", { name: /apply order/i }));

    await waitFor(() => expect(reorderPdf).toHaveBeenCalled());
    expect(reorderPdf).toHaveBeenCalledWith(file.data, [1, 2, 0]);
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it("deletes a page and applies the remaining indices", async () => {
    const user = userEvent.setup();
    const file = makeFile();
    render(<ReorderPanel files={[file]} onDropPdf={noop} />);
    await waitFor(() => expect(screen.getByTestId("reorder-thumb-0")).toBeInTheDocument());

    // Delete the first page.
    const first = screen.getByTestId("reorder-thumb-0");
    await user.click(within(first).getByRole("button", { name: /delete page/i }));

    // Only two thumbnails remain.
    expect(screen.queryByTestId("reorder-thumb-2")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /apply order/i }));
    await waitFor(() => expect(reorderPdf).toHaveBeenCalled());
    expect(reorderPdf).toHaveBeenCalledWith(file.data, [1, 2]);
  });

  it("disables Apply when every page is deleted", async () => {
    const user = userEvent.setup();
    render(<ReorderPanel files={[makeFile()]} onDropPdf={noop} />);
    await waitFor(() => expect(screen.getByTestId("reorder-thumb-0")).toBeInTheDocument());

    // Delete all three pages (always target the current first slot).
    for (let i = 0; i < 3; i++) {
      const first = screen.getByTestId("reorder-thumb-0");
      await user.click(within(first).getByRole("button", { name: /delete page/i }));
    }

    expect(screen.getByRole("button", { name: /apply order/i })).toBeDisabled();
  });
});

describe("WatermarkPanel", () => {
  it("shows a dropzone when no file is loaded", () => {
    render(<WatermarkPanel files={[]} onDropPdf={noop} />);
    expect(screen.getByTestId("file-dropzone")).toBeInTheDocument();
  });

  it("defaults the text to DRAFT and renders the anchor picker", () => {
    render(<WatermarkPanel files={[makeFile()]} onDropPdf={noop} />);
    expect(screen.getByLabelText(/watermark text/i)).toHaveValue("DRAFT");
    expect(screen.getByRole("button", { name: /diagonal/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^center$/i })).toBeInTheDocument();
  });

  it("disables Apply when the text is empty", async () => {
    const user = userEvent.setup();
    render(<WatermarkPanel files={[makeFile()]} onDropPdf={noop} />);
    await user.clear(screen.getByLabelText(/watermark text/i));
    expect(screen.getByRole("button", { name: /add watermark/i })).toBeDisabled();
  });

  it("applies the watermark with the UI state and hex→rgb color", async () => {
    const user = userEvent.setup();
    const file = makeFile();
    render(<WatermarkPanel files={[file]} onDropPdf={noop} />);

    fireEvent.change(screen.getByLabelText(/color/i), {
      target: { value: "#3366cc" },
    });
    await user.click(screen.getByRole("button", { name: /^center$/i }));
    await user.click(screen.getByRole("button", { name: /add watermark/i }));

    await waitFor(() => expect(watermarkPdf).toHaveBeenCalled());
    expect(watermarkPdf).toHaveBeenCalledWith(file.data, {
      text: "DRAFT",
      fontSize: 48,
      opacity: 30,
      anchor: "center",
      color: { r: 0x33 / 255, g: 0x66 / 255, b: 0xcc / 255 },
    });
    expect(URL.createObjectURL).toHaveBeenCalled();
  });
});
