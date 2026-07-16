import * as pdfjsLib from "pdfjs-dist";

// Initialize the PDF.js worker exactly as PDFTools.tsx does: honor whatever
// workerSrc another module may have already set (CDN or self-hosted), and only
// fall back to the self-hosted "/pdf.worker.min.mjs" if none is configured.
// This is the ONLY file under src/lib/pdf/ that imports pdfjs-dist.
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

/**
 * Minimal structural view of a pdf.js document — only the surface the compress
 * and extract-text engines actually touch. Keeping it structural lets unit
 * tests inject a hand-rolled fake without depending on pdf.js internals.
 */
export interface PdfJsDocument {
  numPages: number;
  getPage(n: number): Promise<{
    /** The page's own /Rotate (degrees, normally 0/90/180/270). Optional so
     *  existing hand-rolled fakes that don't need it stay valid; real pdf.js
     *  pages always expose it. */
    rotate?: number;
    getViewport(o: { scale: number }): { width: number; height: number };
    render(o: {
      canvasContext: CanvasRenderingContext2D;
      viewport: unknown;
    }): { promise: Promise<void> };
    getTextContent(): Promise<{ items: Array<{ str: string }> }>;
  }>;
}

/**
 * Load a PDF with pdf.js and return the document. `data` is copied into a fresh
 * buffer because pdf.js transfers/detaches the array it is handed.
 */
export async function openPdf(bytes: Uint8Array): Promise<PdfJsDocument> {
  const task = pdfjsLib.getDocument({ data: new Uint8Array(bytes) });
  return (await task.promise) as unknown as PdfJsDocument;
}
