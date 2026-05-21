import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PDFTools from "@/components/PDFTools";

// ── pdf-lib mock ────────────────────────────────────────────────────────────
// Mirrors only the surface PDFTools uses: load/create, page copy/embed/draw,
// and save() returning bytes. Loaded docs report 3 pages.
const drawImage = vi.fn();
const addPage = vi.fn();

function makeDoc(pageCount = 3) {
  return {
    getPageCount: () => pageCount,
    getPageIndices: () => Array.from({ length: pageCount }, (_, i) => i),
    copyPages: vi.fn(async (_doc: unknown, indices: number[]) =>
      indices.map(() => ({ id: "page" }))
    ),
    addPage,
    embedPng: vi.fn(async () => ({ width: 100, height: 200 })),
    embedJpg: vi.fn(async () => ({ width: 100, height: 200 })),
    save: vi.fn(async () => new Uint8Array([1, 2, 3, 4])),
  };
}

const createdDoc = {
  ...makeDoc(0),
  addPage: vi.fn(() => ({ drawImage })),
  embedPng: vi.fn(async () => ({ width: 100, height: 200 })),
  embedJpg: vi.fn(async () => ({ width: 100, height: 200 })),
  save: vi.fn(async () => new Uint8Array([1, 2, 3, 4])),
};

vi.mock("pdf-lib", () => ({
  PDFDocument: {
    load: vi.fn(async () => makeDoc(3)),
    create: vi.fn(async () => createdDoc),
  },
}));

// ── pdfjs-dist mock (thumbnail generation) ──────────────────────────────────
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

// ── jszip mock ───────────────────────────────────────────────────────────────
const zipFile = vi.fn();
const generateAsync = vi.fn(async () => new Blob(["zip"], { type: "application/zip" }));
vi.mock("jszip", () => ({
  default: class JSZip {
    file = zipFile;
    generateAsync = generateAsync;
  },
}));

// PDFPreview pulls in pdfjs canvas rendering; stub it out for these tests.
vi.mock("@/components/pdf-preview", () => ({
  PDFPreview: () => null,
}));

beforeEach(() => {
  drawImage.mockClear();
  addPage.mockClear();
  zipFile.mockClear();
  generateAsync.mockClear();
  createdDoc.save.mockClear();
});

async function uploadPdf(testid: string) {
  const user = userEvent.setup();
  const input = document.querySelector(
    `input[data-testid="${testid}"]`
  ) as HTMLInputElement;
  const file = new File(["%PDF-1.4"], "doc.pdf", { type: "application/pdf" });
  await user.upload(input, file);
  return user;
}

describe("PDFTools", () => {
  it("renders the three operation tabs", () => {
    render(<PDFTools />);
    expect(screen.getByRole("tab", { name: /images to pdf/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /merge/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /split/i })).toBeInTheDocument();
  });

  it("shows the images dropzone by default", () => {
    render(<PDFTools />);
    expect(screen.getByText(/drop images here/i)).toBeInTheDocument();
  });

  it("converts images to a downloadable PDF", async () => {
    render(<PDFTools />);
    const user = userEvent.setup();

    const input = document.querySelector(
      'input[data-testid="image-input"]'
    ) as HTMLInputElement;
    const img = new File(["img"], "pic.png", { type: "image/png" });
    await user.upload(input, img);

    // The image row + Create PDF button appear once an image is added.
    const createBtn = await screen.findByRole("button", { name: /create pdf/i });
    await user.click(createBtn);

    await waitFor(() => expect(createdDoc.save).toHaveBeenCalled());
    expect(createdDoc.addPage).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    const { toast } = await import("sonner");
    expect(toast.success).toHaveBeenCalled();
  });

  it("merges multiple PDFs into a single downloadable file", async () => {
    render(<PDFTools />);
    const user = userEvent.setup();

    // Switch to Merge tab.
    await user.click(screen.getByRole("tab", { name: /merge/i }));

    const input = document.querySelector(
      'input[data-testid="pdf-input"]'
    ) as HTMLInputElement;
    const fileA = new File(["%PDF-1.4 A"], "a.pdf", { type: "application/pdf" });
    const fileB = new File(["%PDF-1.4 B"], "b.pdf", { type: "application/pdf" });
    await user.upload(input, [fileA, fileB]);

    const mergeBtn = await screen.findByRole("button", { name: /merge pdfs/i });
    await waitFor(() => expect(mergeBtn).not.toBeDisabled());
    await user.click(mergeBtn);

    await waitFor(() => expect(createdDoc.save).toHaveBeenCalled());
    expect(URL.createObjectURL).toHaveBeenCalled();
    const { toast } = await import("sonner");
    expect(toast.success).toHaveBeenCalled();
  });

  it("extracts a page range and produces a single download", async () => {
    render(<PDFTools />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("tab", { name: /split/i }));

    const input = document.querySelector(
      'input[data-testid="pdf-split-input"]'
    ) as HTMLInputElement;
    const file = new File(["%PDF-1.4"], "doc.pdf", { type: "application/pdf" });
    await user.upload(input, file);

    const rangeInput = await screen.findByPlaceholderText(/1-3/i);
    await user.type(rangeInput, "1-2");

    const splitBtn = screen.getByRole("button", { name: /^split pdf$/i });
    await user.click(splitBtn);

    await waitFor(() => expect(createdDoc.save).toHaveBeenCalled());
    // Single range → no zip.
    expect(generateAsync).not.toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    const { toast } = await import("sonner");
    expect(toast.success).toHaveBeenCalled();
  });

  it("zips the output when a range yields multiple files", async () => {
    render(<PDFTools />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("tab", { name: /split/i }));

    const input = document.querySelector(
      'input[data-testid="pdf-split-input"]'
    ) as HTMLInputElement;
    const file = new File(["%PDF-1.4"], "doc.pdf", { type: "application/pdf" });
    await user.upload(input, file);

    // Three comma-separated single pages → three output PDFs → zip.
    const rangeInput = await screen.findByPlaceholderText(/1-3/i);
    await user.type(rangeInput, "1,2,3");

    const splitBtn = screen.getByRole("button", { name: /^split pdf$/i });
    await user.click(splitBtn);

    await waitFor(() => expect(generateAsync).toHaveBeenCalled());
    expect(zipFile).toHaveBeenCalledTimes(3);
    const { toast } = await import("sonner");
    expect(toast.success).toHaveBeenCalled();
  });
});
