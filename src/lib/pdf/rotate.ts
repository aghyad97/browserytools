import { PDFDocument, degrees } from "pdf-lib";

/**
 * Apply ABSOLUTE page rotations to a PDF.
 *
 * @param bytes     Source PDF bytes.
 * @param rotations Map of 0-based page index → absolute target rotation in
 *                  degrees (typically 0/90/180/270). The value replaces any
 *                  existing rotation — it is NOT additive.
 * @returns         The re-saved PDF bytes.
 *
 * Out-of-range indices are ignored.
 */
export async function rotatePdf(
  bytes: Uint8Array,
  rotations: Record<number, number>,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes);
  const pageCount = doc.getPageCount();
  for (const [key, value] of Object.entries(rotations)) {
    const index = Number(key);
    if (!Number.isInteger(index) || index < 0 || index >= pageCount) continue;
    doc.getPage(index).setRotation(degrees(value));
  }
  return doc.save();
}
