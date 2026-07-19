import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageToText from "@/components/ImageToText";

// Mock tesseract.js — never run real OCR (it would download WASM + traineddata).
// createWorker returns a worker whose recognize() resolves to a fixed string and
// whose terminate() is a no-op.
const recognize = vi.fn().mockResolvedValue({
  data: { text: "Hello from the image" },
});
const terminate = vi.fn().mockResolvedValue(undefined);
const createWorker = vi.fn().mockResolvedValue({ recognize, terminate });

vi.mock("tesseract.js", () => ({
  createWorker: (...args: unknown[]) => createWorker(...args),
}));

// Mock pdf.js's page-render surface — never load a real PDF or render a real
// page in a unit test. Two pages by default so the per-page loop is exercised.
// Named `pageRender` (not `render`) to avoid shadowing RTL's `render` import.
const getViewport = vi.fn(() => ({ width: 100, height: 100 }));
const pageRender = vi.fn(() => ({ promise: Promise.resolve() }));
const getPage = vi.fn(async (_n: number) => ({
  rotate: 0,
  getViewport,
  render: pageRender,
}));
const openPdf = vi.fn(async () => ({ numPages: 2, getPage }));
vi.mock("@/lib/pdf/pdfjs-doc", () => ({
  openPdf: (...args: unknown[]) => openPdf(...(args as [])),
}));

// Mock the preprocessing pipeline (Task 9) — its own pixel math is covered by
// src/__tests__/lib/ocr/preprocess.test.ts. Here we only need to prove the
// component wires it in when the toggle is on, and skips it when off.
const FAKE_GRAY = { data: new Uint8ClampedArray(4), width: 1, height: 1 };
const FAKE_DESKEWED = "deskewed-canvas" as unknown as HTMLCanvasElement;
const FAKE_BINARIZED = "binarized-canvas" as unknown as HTMLCanvasElement;
const toGrayscale = vi.fn(() => FAKE_GRAY);
const estimateSkew = vi.fn(() => 2);
const deskew = vi.fn(() => FAKE_DESKEWED);
const binarize = vi.fn(() => FAKE_BINARIZED);
vi.mock("@/lib/ocr/preprocess", () => ({
  toGrayscale: (...args: unknown[]) => toGrayscale(...(args as [])),
  estimateSkew: (...args: unknown[]) => estimateSkew(...(args as [])),
  deskew: (...args: unknown[]) => deskew(...(args as [])),
  binarize: (...args: unknown[]) => binarize(...(args as [])),
}));

// Mock the shared image-loading helpers used only on the preprocess-on image
// path — happy-dom doesn't fire real <img> load events (see AsciiArt.test.tsx).
const loadImage = vi.fn(async () => ({ naturalWidth: 10, naturalHeight: 10 }));
const drawToCanvas = vi.fn(() => document.createElement("canvas"));
vi.mock("@/lib/image/canvas", () => ({
  loadImage: (...args: unknown[]) => loadImage(...(args as [])),
  drawToCanvas: (...args: unknown[]) => drawToCanvas(...(args as [])),
}));

beforeEach(() => {
  createWorker.mockClear();
  recognize.mockClear();
  recognize.mockResolvedValue({ data: { text: "Hello from the image" } });
  terminate.mockClear();
  openPdf.mockClear();
  getPage.mockClear();
  getViewport.mockClear();
  pageRender.mockClear();
  toGrayscale.mockClear();
  estimateSkew.mockClear();
  deskew.mockClear();
  binarize.mockClear();
  loadImage.mockClear();
  drawToCanvas.mockClear();
});

async function uploadImage() {
  const user = userEvent.setup();
  const input = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const file = new File(["imgdata"], "scan.png", { type: "image/png" });
  await user.upload(input, file);
  return user;
}

async function uploadPdf() {
  const user = userEvent.setup();
  const input = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const file = new File(["pdfdata"], "scan.pdf", { type: "application/pdf" });
  await user.upload(input, file);
  return user;
}

describe("ImageToText", () => {
  it("renders the upload prompt, language selector, and privacy note", () => {
    render(<ImageToText />);
    expect(screen.getByText(/drop your image here/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByText(/runs entirely on your device/i)
    ).toBeInTheDocument();
  });

  it("uploads an image, runs OCR, and shows the recognized text", async () => {
    render(<ImageToText />);
    const user = await uploadImage();

    await user.click(screen.getByRole("button", { name: /extract text/i }));

    await waitFor(() => expect(createWorker).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(recognize).toHaveBeenCalledTimes(1));

    // The recognized text lands in the editable output textarea.
    const output = (await screen.findByLabelText(
      /recognized text/i
    )) as HTMLTextAreaElement;
    await waitFor(() =>
      expect(output.value).toBe("Hello from the image")
    );

    const { toast } = await import("sonner");
    expect(toast.success).toHaveBeenCalled();
    expect(terminate).toHaveBeenCalled();
  });

  it("copies the recognized text to the clipboard", async () => {
    render(<ImageToText />);
    const user = await uploadImage();

    await user.click(screen.getByRole("button", { name: /extract text/i }));
    await waitFor(() => expect(recognize).toHaveBeenCalled());
    await screen.findByDisplayValue("Hello from the image");

    const spy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    await user.click(screen.getByRole("button", { name: /^copy$/i }));

    expect(spy).toHaveBeenCalledWith("Hello from the image");
  });

  it("uses the selected language when creating the worker", async () => {
    render(<ImageToText />);
    const user = await uploadImage();

    await user.click(screen.getByRole("button", { name: /extract text/i }));

    await waitFor(() => expect(createWorker).toHaveBeenCalled());
    // First positional arg to createWorker is the language code.
    expect(createWorker.mock.calls[0][0]).toBe("eng");
  });
});

describe("ImageToText — PDF input (Task 9)", () => {
  it("renders each page and OCRs them in sequence, concatenating the results", async () => {
    recognize
      .mockResolvedValueOnce({ data: { text: "first page" } })
      .mockResolvedValueOnce({ data: { text: "second page" } });

    render(<ImageToText />);
    const user = await uploadPdf();

    await user.click(screen.getByRole("button", { name: /extract text/i }));

    await waitFor(() => expect(openPdf).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(getPage).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(pageRender).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(recognize).toHaveBeenCalledTimes(2));

    const output = (await screen.findByLabelText(
      /recognized text/i
    )) as HTMLTextAreaElement;
    await waitFor(() => {
      expect(output.value).toContain("first page");
      expect(output.value).toContain("second page");
    });

    // A single worker is created and reused across all pages, then terminated once.
    expect(createWorker).toHaveBeenCalledTimes(1);
    expect(terminate).toHaveBeenCalledTimes(1);

    // Preprocessing stays off by default even for PDF input — the recognize
    // calls should have received real page canvases, not the mocked stubs.
    expect(deskew).not.toHaveBeenCalled();
    expect(binarize).not.toHaveBeenCalled();
    expect(recognize.mock.calls[0][0]).not.toBe(FAKE_BINARIZED);
  });

  it("shows per-page progress while a PDF is being recognized", async () => {
    // Both pages are paused on a controlled promise so the "Page X of Y"
    // state is observable rather than racing recognize()'s resolution.
    let resolvePage1: (v: { data: { text: string } }) => void = () => {};
    let resolvePage2: (v: { data: { text: string } }) => void = () => {};
    recognize.mockImplementationOnce(
      () => new Promise((resolve) => { resolvePage1 = resolve; })
    );
    recognize.mockImplementationOnce(
      () => new Promise((resolve) => { resolvePage2 = resolve; })
    );

    render(<ImageToText />);
    const user = await uploadPdf();
    await user.click(screen.getByRole("button", { name: /extract text/i }));

    await screen.findByText(/page 1 of 2/i);
    resolvePage1({ data: { text: "first page" } });

    await screen.findByText(/page 2 of 2/i);
    resolvePage2({ data: { text: "second page" } });

    await waitFor(() => expect(recognize).toHaveBeenCalledTimes(2));
  });
});

describe("ImageToText — preprocessing toggle (Task 9)", () => {
  it("does not run deskew/binarize when the toggle is off (default)", async () => {
    render(<ImageToText />);
    const user = await uploadImage();

    await user.click(screen.getByRole("button", { name: /extract text/i }));
    await waitFor(() => expect(recognize).toHaveBeenCalledTimes(1));

    expect(toGrayscale).not.toHaveBeenCalled();
    expect(estimateSkew).not.toHaveBeenCalled();
    expect(deskew).not.toHaveBeenCalled();
    expect(binarize).not.toHaveBeenCalled();
    // Unchanged behavior: recognize still receives the raw object URL.
    expect(recognize.mock.calls[0][0]).toBe("blob:mock-url");
  });

  it("runs deskew + binarize before OCR when the toggle is on, for an image", async () => {
    render(<ImageToText />);
    const user = await uploadImage();

    await user.click(screen.getByTestId("ocr-preprocess"));
    await user.click(screen.getByRole("button", { name: /extract text/i }));

    await waitFor(() => expect(recognize).toHaveBeenCalledTimes(1));

    expect(toGrayscale).toHaveBeenCalledTimes(1);
    expect(estimateSkew).toHaveBeenCalledTimes(1);
    expect(deskew).toHaveBeenCalledTimes(1);
    expect(binarize).toHaveBeenCalledTimes(1);
    // recognize() should receive the fully-processed canvas, not the raw URL.
    expect(recognize.mock.calls[0][0]).toBe(FAKE_BINARIZED);
  });

  it("runs deskew + binarize per page when the toggle is on, for a PDF", async () => {
    render(<ImageToText />);
    const user = await uploadPdf();

    await user.click(screen.getByTestId("ocr-preprocess"));
    await user.click(screen.getByRole("button", { name: /extract text/i }));

    await waitFor(() => expect(recognize).toHaveBeenCalledTimes(2));

    expect(deskew).toHaveBeenCalledTimes(2);
    expect(binarize).toHaveBeenCalledTimes(2);
    // loadImage/drawToCanvas are the image-only path — not used for PDFs,
    // which already render to a canvas via pdf.js.
    expect(loadImage).not.toHaveBeenCalled();
  });
});
