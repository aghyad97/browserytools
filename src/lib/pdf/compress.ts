import { PDFDocument } from "pdf-lib";
import { canvasToBlob } from "@/lib/image/canvas";
import { openPdf, type PdfJsDocument } from "@/lib/pdf/pdfjs-doc";

export type CompressPreset = "high" | "balanced" | "small";

/**
 * Rasterize-and-re-encode presets. `scale` controls the render resolution
 * (higher = sharper, larger); `quality` is the JPEG quality of each embedded
 * page image. Pages are always laid out at their ORIGINAL point size — scale
 * only affects the raster resolution, not the PDF geometry.
 */
export const COMPRESS_PRESETS: Record<
  CompressPreset,
  { quality: number; scale: number }
> = {
  high: { quality: 0.8, scale: 1.5 },
  balanced: { quality: 0.6, scale: 1.2 },
  small: { quality: 0.4, scale: 1.0 },
};

export interface CompressResult {
  bytes: Uint8Array;
  pageCount: number;
  before: number;
  after: number;
}

interface CompressDeps {
  open?: (b: Uint8Array) => Promise<PdfJsDocument>;
  encode?: (canvas: HTMLCanvasElement, quality: number) => Promise<Blob | null>;
}

/**
 * Compress a PDF by rasterizing each page to a JPEG at the preset's render
 * scale/quality and re-embedding it into a fresh document. Each output page is
 * sized to the ORIGINAL page's point dimensions (its viewport at scale 1), so
 * the visible page geometry is preserved regardless of render scale.
 *
 * @throws Error("encode-failed") if the encoder yields null for any page.
 */
export async function compressPdf(
  bytes: Uint8Array,
  preset: CompressPreset,
  deps?: CompressDeps,
): Promise<CompressResult> {
  const open = deps?.open ?? openPdf;
  const encode =
    deps?.encode ??
    ((canvas: HTMLCanvasElement, quality: number) =>
      canvasToBlob(canvas, "image/jpeg", quality));

  const { quality, scale } = COMPRESS_PRESETS[preset];
  const src = await open(bytes);
  const out = await PDFDocument.create();

  for (let i = 1; i <= src.numPages; i++) {
    const page = await src.getPage(i);

    // Original point dimensions (scale 1) drive the output page geometry.
    const pointView = page.getViewport({ scale: 1 });
    // Render at the preset scale for raster resolution.
    const renderView = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(renderView.width));
    canvas.height = Math.max(1, Math.round(renderView.height));
    const ctx = canvas.getContext("2d");
    await page.render({
      canvasContext: ctx as CanvasRenderingContext2D,
      viewport: renderView,
    }).promise;

    const blob = await encode(canvas, quality);
    if (!blob) throw new Error("encode-failed");

    const jpg = new Uint8Array(await blob.arrayBuffer());
    const image = await out.embedJpg(jpg);
    const outPage = out.addPage([pointView.width, pointView.height]);
    outPage.drawImage(image, {
      x: 0,
      y: 0,
      width: pointView.width,
      height: pointView.height,
    });
  }

  const result = await out.save();
  return {
    bytes: result,
    pageCount: src.numPages,
    before: bytes.length,
    after: result.length,
  };
}
