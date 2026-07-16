import { PDFDocument } from "pdf-lib";

/**
 * Reorder (and implicitly delete) pages of a PDF.
 *
 * @param bytes Source PDF bytes.
 * @param order 0-based source page indices in the desired output order. Any
 *              index not present is DELETED from the output.
 * @returns     A new PDF containing only the listed pages, in the listed order.
 * @throws      Error("invalid-order") if `order` is empty, or contains any
 *              out-of-range or duplicate index.
 */
export async function reorderPdf(
  bytes: Uint8Array,
  order: number[],
): Promise<Uint8Array> {
  const src = await PDFDocument.load(bytes);
  const pageCount = src.getPageCount();

  const seen = new Set<number>();
  const valid =
    order.length > 0 &&
    order.every((index) => {
      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= pageCount ||
        seen.has(index)
      ) {
        return false;
      }
      seen.add(index);
      return true;
    });

  if (!valid) {
    throw new Error("invalid-order");
  }

  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, order);
  for (const page of copied) {
    out.addPage(page);
  }
  return out.save();
}
