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

/** cos(45°) === sin(45°). */
const COS_45 = Math.SQRT1_2;
const SIN_45 = Math.SQRT1_2;

/**
 * Compute the pdf-lib draw-text origin (bottom-left, per pdf-lib's convention)
 * and rotation (degrees) for a given anchor, so that:
 *  - corner anchors sit inset by `PADDING_RATIO` of the page dimensions;
 *  - "center" sits with its (unrotated) visual center on the page center;
 *  - "diagonal" sits rotated 45° with its *visual* center on the page center.
 *
 * pdf-lib's `drawText` rotates the glyph run about its origin (the
 * bottom-left of the unrotated text box), not about the text's visual
 * center. For "diagonal" the origin is therefore offset by the rotated
 * half-extents of the text box so the rotated run's visual center still
 * lands on the page center.
 */
export function watermarkPosition(
  anchor: PdfWatermarkAnchor,
  pageWidth: number,
  pageHeight: number,
  textWidth: number,
  textHeight: number,
): { x: number; y: number; rotate: number } {
  const padX = pageWidth * PADDING_RATIO;
  const padY = pageHeight * PADDING_RATIO;
  const cx = pageWidth / 2;
  const cy = pageHeight / 2;

  switch (anchor) {
    case "top-left":
      return { x: padX, y: pageHeight - padY - textHeight, rotate: 0 };
    case "top-right":
      return {
        x: pageWidth - padX - textWidth,
        y: pageHeight - padY - textHeight,
        rotate: 0,
      };
    case "bottom-left":
      return { x: padX, y: padY, rotate: 0 };
    case "bottom-right":
      return { x: pageWidth - padX - textWidth, y: padY, rotate: 0 };
    case "diagonal":
      return {
        x: cx - (textWidth / 2) * COS_45 + (textHeight / 2) * SIN_45,
        y: cy - (textWidth / 2) * SIN_45 - (textHeight / 2) * COS_45,
        rotate: 45,
      };
    case "center":
    default:
      return { x: cx - textWidth / 2, y: cy - textHeight / 2, rotate: 0 };
  }
}

/**
 * Stamp a text watermark onto every page of a PDF.
 *
 * Uses pdf-lib's native BOTTOM-LEFT coordinate origin. Corner anchors are
 * inset by 4% of the page dimensions; "center" and "diagonal" are centered
 * on the page, with "diagonal" additionally rotated 45° about its visual
 * center (see `watermarkPosition`).
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
    const { x, y, rotate } = watermarkPosition(
      anchor,
      width,
      height,
      textWidth,
      textHeight,
    );

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: fill,
      opacity: alpha,
      rotate: degrees(rotate),
    });
  }

  return doc.save();
}
