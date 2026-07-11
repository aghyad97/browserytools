/**
 * Formatting utilities shared across tool interiors (R3 §F3).
 *
 * `formatBytes` is the single home for the 6 hand-rolled copies that lived in
 * ExifViewer / CompressVideo / ExifRemover / ImageResizer / ZipTools / PDFTools.
 * The output format matches the DOMINANT variant (4 of the 6 copies —
 * ExifViewer/CompressVideo/ExifRemover/ImageResizer): `"512 B"`, `"1.5 KB"`,
 * `"2.34 MB"` — bytes as a bare integer + " B", KB to 1 decimal, MB to 2
 * decimals. Those four call-site swaps are therefore byte-identical. The two
 * `Math.log`-based copies (ZipTools/PDFTools) used `"Bytes"` and 2 decimals
 * everywhere; swapping those changes their strings ("Bytes" → "B") and their
 * tests will need updating in the batch phase — flagged in the F3 report.
 *
 * GB (and a negative guard + non-finite guard) are added beyond the dominant
 * variant, which capped at MB. GB uses 2 decimals, consistent with MB.
 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Format a RATIO (0..1) as a percentage string. Absorbs the ~35 inline
 * `(x * 100).toFixed(d) + "%"` sites (recon §4). Pass the ratio, not the
 * already-scaled percentage: `formatPercent(0.583, 1)` → `"58.3%"`.
 */
export function formatPercent(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return "0%";
  return `${(n * 100).toFixed(digits)}%`;
}
