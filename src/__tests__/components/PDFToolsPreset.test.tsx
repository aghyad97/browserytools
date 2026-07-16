import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PDFTools from "@/components/PDFTools";

// Same engine/worker mocks as PDFTools.test.tsx so the shell renders in jsdom.
function makeDoc(pageCount = 3) {
  return {
    getPageCount: () => pageCount,
    getPageIndices: () => Array.from({ length: pageCount }, (_, i) => i),
    copyPages: vi.fn(async (_doc: unknown, indices: number[]) =>
      indices.map(() => ({ id: "page" }))
    ),
    addPage: vi.fn(),
    embedPng: vi.fn(async () => ({ width: 100, height: 200 })),
    embedJpg: vi.fn(async () => ({ width: 100, height: 200 })),
    save: vi.fn(async () => new Uint8Array([1, 2, 3, 4])),
  };
}

vi.mock("pdf-lib", () => ({
  PDFDocument: {
    load: vi.fn(async () => makeDoc(3)),
    create: vi.fn(async () => makeDoc(0)),
  },
}));

vi.mock("pdfjs-dist", () => ({
  version: "0.0.0",
  GlobalWorkerOptions: { workerSrc: "mock-worker" },
  getDocument: vi.fn(() => ({
    promise: Promise.resolve({
      numPages: 3,
      getPage: vi.fn(async () => ({
        getViewport: () => ({ width: 50, height: 70 }),
        render: () => ({ promise: Promise.resolve() }),
      })),
    }),
  })),
}));

vi.mock("jszip", () => ({
  default: class JSZip {
    file = vi.fn();
    generateAsync = vi.fn(async () => new Blob(["zip"]));
  },
}));

vi.mock("@/components/pdf-preview", () => ({
  PDFPreview: () => null,
}));

describe("PDFTools preset", () => {
  it("opens the preset op's tab with its real panel, not the images dropzone", () => {
    // `extract` is now a real panel (Task 7 replaced the last placeholders).
    render(<PDFTools preset={{ op: "extract" }} />);
    // The real ExtractPanel is the active content (its own dropzone input).
    expect(screen.getByTestId("pdf-extract-input")).toBeInTheDocument();
    // Images dropzone (its TabsContent) is not mounted when extract is active.
    expect(screen.queryByText(/drop images here/i)).not.toBeInTheDocument();
  });

  it("defaults to the images tab with no preset", () => {
    render(<PDFTools />);
    expect(screen.getByText(/drop images here/i)).toBeInTheDocument();
    expect(screen.queryByTestId("pdf-extract-input")).not.toBeInTheDocument();
  });
});
