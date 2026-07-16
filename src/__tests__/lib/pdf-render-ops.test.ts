import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import {
  compressPdf,
  COMPRESS_PRESETS,
  type CompressPreset,
} from "@/lib/pdf/compress";
import { extractPdfText } from "@/lib/pdf/extract-text";
import type { PdfJsDocument } from "@/lib/pdf/pdfjs-doc";

/**
 * A deterministic fake pdf.js document. Viewport is 612x792 at scale 1,
 * multiplied by the requested scale. render() is a no-op. getTextContent()
 * returns the per-page item strings supplied by the caller (default "Hello"
 * / "World"). No real pdf.js is loaded in these unit tests.
 */
function makeFakeDoc(opts?: {
  numPages?: number;
  items?: string[][];
}): PdfJsDocument {
  const numPages = opts?.numPages ?? 2;
  const items = opts?.items;
  return {
    numPages,
    async getPage(n: number) {
      return {
        getViewport({ scale }: { scale: number }) {
          return { width: 612 * scale, height: 792 * scale };
        },
        render() {
          return { promise: Promise.resolve() };
        },
        async getTextContent() {
          const strs = items ? items[n - 1] : ["Hello", "World"];
          return { items: strs.map((str) => ({ str })) };
        },
      };
    },
  };
}

// A valid minimal 1x1 baseline JPEG (631 bytes) that pdf-lib's embedJpg accepts.
const JPEG_B64 =
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==";

function jpegBuffer(): ArrayBuffer {
  const bytes = Uint8Array.from(atob(JPEG_B64), (c) => c.charCodeAt(0));
  return bytes.buffer;
}

const fakeEncode = async (): Promise<Blob> =>
  new Blob([jpegBuffer()], { type: "image/jpeg" });
const nullEncode = async (): Promise<Blob | null> => null;

async function makeSourcePdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.addPage([612, 792]);
  doc.addPage([612, 792]);
  return doc.save();
}

describe("COMPRESS_PRESETS", () => {
  it("declares the three preset quality/scale pairs", () => {
    expect(COMPRESS_PRESETS.high).toEqual({ quality: 0.8, scale: 1.5 });
    expect(COMPRESS_PRESETS.balanced).toEqual({ quality: 0.6, scale: 1.2 });
    expect(COMPRESS_PRESETS.small).toEqual({ quality: 0.4, scale: 1.0 });
  });
});

describe("compressPdf", () => {
  it("sizes each output page to the ORIGINAL point dimensions even at scale 1.5", async () => {
    const src = await makeSourcePdf();
    const res = await compressPdf(src, "high", {
      open: async () => makeFakeDoc(),
      encode: fakeEncode,
    });
    // high preset renders at scale 1.5, but pages must be laid out at the
    // original 612x792 point dimensions (viewport at scale 1).
    expect(res.pageCount).toBe(2);
    const doc = await PDFDocument.load(res.bytes);
    expect(doc.getPageCount()).toBe(2);
    expect(doc.getPage(0).getWidth()).toBeCloseTo(612);
    expect(doc.getPage(0).getHeight()).toBeCloseTo(792);
    expect(doc.getPage(1).getWidth()).toBeCloseTo(612);
    expect(doc.getPage(1).getHeight()).toBeCloseTo(792);
  });

  it("reports before (source length) and after (output length) byte counts", async () => {
    const src = await makeSourcePdf();
    const res = await compressPdf(src, "balanced", {
      open: async () => makeFakeDoc(),
      encode: fakeEncode,
    });
    expect(res.before).toBe(src.length);
    expect(res.after).toBe(res.bytes.length);
  });

  it('throws Error("encode-failed") when the encoder returns null', async () => {
    const src = await makeSourcePdf();
    await expect(
      compressPdf(src, "high", {
        open: async () => makeFakeDoc(),
        encode: nullEncode,
      }),
    ).rejects.toThrow("encode-failed");
  });

  it("processes each preset without throwing", async () => {
    const src = await makeSourcePdf();
    for (const preset of ["high", "balanced", "small"] as CompressPreset[]) {
      const res = await compressPdf(src, preset, {
        open: async () => makeFakeDoc(),
        encode: fakeEncode,
      });
      expect(res.pageCount).toBe(2);
    }
  });
});

describe("extractPdfText", () => {
  it("joins page items with spaces and normalizes runs of whitespace", async () => {
    const res = await extractPdfText(new Uint8Array(), {
      open: async () =>
        makeFakeDoc({
          items: [["Hello ", "  world\n", "foo"], ["Page", "two"]],
        }),
    });
    expect(res.pages[0]).toBe("Hello world foo");
    expect(res.pages[1]).toBe("Page two");
    expect(res.isEmpty).toBe(false);
  });

  it("builds `full` with exact `--- Page N ---` (1-based) headers", async () => {
    const res = await extractPdfText(new Uint8Array(), {
      open: async () =>
        makeFakeDoc({ items: [["alpha", "beta"], ["gamma"]] }),
    });
    expect(res.full).toBe(
      "--- Page 1 ---\n\nalpha beta\n\n--- Page 2 ---\n\ngamma",
    );
  });

  it("marks isEmpty when every page trims to empty", async () => {
    const res = await extractPdfText(new Uint8Array(), {
      open: async () => makeFakeDoc({ items: [["", "   "], ["\n\t"]] }),
    });
    expect(res.isEmpty).toBe(true);
    expect(res.pages).toEqual(["", ""]);
  });
});
