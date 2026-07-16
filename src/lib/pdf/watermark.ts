import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

export type PdfWatermarkAnchor =
  | "diagonal"
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface PdfWatermarkOptions {
  /** Watermark text. Must contain a non-whitespace character. */
  text: string;
  /** Font size in points. */
  fontSize: number;
  /** Opacity, 0..100. */
  opacity: number;
  /** Placement. "diagonal" = centered, rotated 45°. */
  anchor: PdfWatermarkAnchor;
  /** Fill color, 0..1 per channel (pdf-lib rgb()). */
  color: { r: number; g: number; b: number };
}

/** Fraction of page width/height used as padding for corner anchors. */
const PADDING_RATIO = 0.04;

/**
 * Stamp a text watermark onto every page of a PDF.
 *
 * Uses pdf-lib's native BOTTOM-LEFT coordinate origin. Corner anchors are
 * inset by 4% of the page dimensions; "center" and "diagonal" are centered,
 * with "diagonal" additionally rotated 45°.
 *
 * @throws Error("empty-text") if `text` is empty or whitespace-only.
 */
export async function watermarkPdf(
  bytes: Uint8Array,
  opts: PdfWatermarkOptions,
): Promise<Uint8Array> {
  if (opts.text.trim().length === 0) {
    throw new Error("empty-text");
  }

  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const { text, fontSize, opacity, anchor, color } = opts;
  const fill = rgb(color.r, color.g, color.b);
  const alpha = opacity / 100;
  // Helvetica has no direct cap-to-baseline API here; fontSize approximates
  // the drawn text height closely enough for placement.
  const textHeight = fontSize;

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const padX = width * PADDING_RATIO;
    const padY = height * PADDING_RATIO;

    let x: number;
    let y: number;
    let rotation = degrees(0);

    switch (anchor) {
      case "top-left":
        x = padX;
        y = height - padY - textHeight;
        break;
      case "top-right":
        x = width - padX - textWidth;
        y = height - padY - textHeight;
        break;
      case "bottom-left":
        x = padX;
        y = padY;
        break;
      case "bottom-right":
        x = width - padX - textWidth;
        y = padY;
        break;
      case "diagonal":
        rotation = degrees(45);
        x = (width - textWidth) / 2;
        y = (height - textHeight) / 2;
        break;
      case "center":
      default:
        x = (width - textWidth) / 2;
        y = (height - textHeight) / 2;
        break;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: fill,
      opacity: alpha,
      rotate: rotation,
    });
  }

  return doc.save();
}
