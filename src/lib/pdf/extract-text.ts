import { openPdf, type PdfJsDocument } from "@/lib/pdf/pdfjs-doc";

export interface ExtractedText {
  /** Normalized text of each page, 0-based. */
  pages: string[];
  /** All pages joined with `--- Page N ---` (1-based) headers. */
  full: string;
  /** True when every page trims to an empty string. */
  isEmpty: boolean;
}

/**
 * Extract the text layer of a PDF with pdf.js. Each page's items are joined
 * with single spaces and whitespace runs are collapsed. `full` prefixes every
 * page with a `--- Page N ---` header; `isEmpty` reflects a PDF with no
 * extractable text (e.g. a scanned/image-only document).
 */
export async function extractPdfText(
  bytes: Uint8Array,
  deps?: { open?: (b: Uint8Array) => Promise<PdfJsDocument> },
): Promise<ExtractedText> {
  const open = deps?.open ?? openPdf;
  const doc = await open(bytes);

  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => item.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    pages.push(text);
  }

  const full = pages
    .map((text, i) => `--- Page ${i + 1} ---\n\n${text}`)
    .join("\n\n");
  const isEmpty = pages.every((text) => text.trim().length === 0);

  return { pages, full, isEmpty };
}
