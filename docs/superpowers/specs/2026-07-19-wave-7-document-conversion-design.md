# Wave 7 — Document Conversion (spec)

**Date:** 2026-07-19 · **Branch:** `wave-7-document-conversion` (off main @32dd29b) · **Roadmap:** §5 Wave 7 · **Design contract:** R3 interior contract (binding) · **Spike findings:** `2026-07-19-wave-7-spike-findings.md` (binding — every architectural choice below is justified there by measurement)

**Goal:** convert documents both ways, fully client-side — **PDF → Word (.docx)** that preserves reading order, headings, lists and tables; **Word → PDF**; and an **OCR upgrade** that accepts PDFs and deskews/binarizes scans. No upload, no account.

## 1. Architecture — decided by measurement, not assumption

The spikes rejected the AI-first design the roadmap implied. The measured result:

```
PDF in → does the page have a real text layer?
  ├─ YES  (digital-native — the common case)
  │        → PURE GEOMETRY on pdf.js data. No model, no download, 0.42–0.70 ms/page.
  │          Proven: 12/12 ruled cells, 12/12 borderless cells, 3/3 headings,
  │          two-column reading order matching poppler exactly.
  └─ NO   (scanned / image-only)
           → tesseract.js (ALREADY SHIPPED) + deskew/binarize preprocessing.
             Measured 50× better than PP-OCR on degraded scans, 200× on Arabic.

→ ordered DocBlock[] → .docx via `docx` (dolanmiu)
```

**Rejected, with measured cause:**
- **Granite-Docling VLM** — 1.17 GB payload, 107 s cold load, and it returned **empty table structure** on both a ruled and a borderless table. Its one justifying capability failed.
- **PP-OCR as a tesseract replacement** — loses 50× on degraded scans and 200× on Arabic (character-order-reversed bug), is 39 MB not the claimed 16 MB, and its SDK **silently falls back to a jsDelivr CDN** for wasm, which would break the site's core privacy promise.

W7 is therefore a **classical-algorithms wave**. The risk lives in the borderless-table heuristic and docx mapping — ordinary code, not model behaviour.

## 2. The layout engine — `src/lib/pdf/layout/` (pure, unit-tested, no DOM)

Consumes pdf.js output, emits an ordered document model. Every module is pure and fixture-tested; no component imports pdf.js directly.

### 2.1 `segments.ts`
`toSegments(textContent, viewport): Segment[]` where `Segment = { text; x; y; w; h; fontSize; fontName; dir: "ltr"|"rtl" }`.
- Derive `fontSize = hypot(transform[0], transform[1])`; origin from `transform[4], transform[5]`.
- **A segment is same-baseline AND horizontal gap < 20pt.** Do NOT group runs into full lines before reading-order analysis — columns share baselines, so full-line grouping merges text across the gutter (spike A trap #2).

### 2.2 `reading-order.ts`
`orderSegments(segments, pageBox): Segment[][]` → column-ordered regions.
- **Column-first XY-cut with header peel** (spike A trap #1 — the naive band-split-first version scrambles paragraph order *while still passing a marker-sequence test*):
  1. Attempt a vertical gutter split (persistent x-gap spanning the region's height).
  2. A full-width title crosses the gutter, so peel the top `k` segments as a header band for `k = 0..6`; the first `k` yielding ≥2 columns each with ≥2 segments wins.
  3. Recurse into each column. Band-split only when no gutter exists.
- RTL: layout geometry is direction-agnostic. Only the **intra-line run sort** is direction-aware (descending x when the line is majority `rtl`).

### 2.3 `rules.ts`
`extractRules(operatorList, viewport): { h: Line[]; v: Line[] }` — ruling lines from vector ops.
- Walk `getOperatorList()`; handle `constructPath [opCodes, coords, minMax]`.
- **Track the CTM manually, composing `ctm = ctm ∘ args` (args applied first).** Inverting this silently yields garbage coordinates with no error (spike A trap #5).
- **Support both rule idioms** (trap #6): filled thin rects (`OPS.rectangle` — Chrome/CSS borders) and stroked `moveTo`/`lineTo` (LaTeX/Word). Coord array is a flat stream indexed by op arity (rectangle 4, moveTo/lineTo 2, curveTo 6, curveTo2/3 4).
- Classify a path as a rule when one dimension is ≤ 2pt and the other ≥ 10pt.

### 2.4 `tables.ts`
- `detectRuledTable(rules, segments)` — require **≥2 rules on each axis**; build the grid from distinct x/y rule positions; assign segments by centroid. (The ≥2-per-axis requirement is why single clip-rects on non-table pages correctly yield zero tables.)
- `detectBorderlessTable(segments, opts)` — rows by vertical overlap; keep rows with ≥2 segments; find maximal runs of ≥3 rows with matching segment count and left edges within `colTol`.
  - **MUST be called per reading-order column region, never page-wide** (spike A trap #3). Page-wide, two-column prose *is* an aligned grid and false-positives as a table.
  - **`colTol` is font-size-derived: `0.3 * fontSize`, floor 3pt** (trap #4). A fixed tol below ~3pt silently drops the header row, because bold glyph bearings shift its left edge ~2.1pt.
  - A fill-ratio content heuristic was measured and **FAILED** (FP 0.772 sat between true positives 0.735/0.794). **Do not implement it.**

### 2.5 `blocks.ts`
`classify(regions, tables): DocBlock[]`:
```ts
type DocBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; rows: string[][]; ruled: boolean };
```
- Body size = the font size carrying the most characters. Heading = > 1.12× body, levels ranked by descending size (3/3 correct, no false positives on the fixture).
- Lists via leading-marker regex (`•`, `-`, `1.`, `a)`) with consistent indent.
- Table regions are excluded from paragraph flow so text isn't emitted twice.

### 2.6 `index.ts`
`extractDocument(pdfData: Uint8Array, opts): Promise<DocBlock[]>` — orchestrates per page; **copies the buffer before handing it to pdf.js** (`new Uint8Array(data)`), because `getDocument` detaches its input — the exact bug that broke every PDF tool in W2 (PR #46).
- Detect the scanned case here: a page whose text coverage is ~0 relative to page area routes to the OCR path instead.

## 3. Docx generation — `src/lib/docx/build.ts`
`buildDocx(blocks: DocBlock[], meta): Promise<Blob>` using **`docx`** (dolanmiu, ~4.65 MB, 5.3M weekly downloads, browser-verified).
- Map: heading→`HeadingLevel`, paragraph→`Paragraph`, list→numbered/bulleted `Paragraph`s, table→`Table`/`TableRow`/`TableCell` (ruled tables get borders, borderless get none).
- RTL blocks set `bidirectional: true` on the paragraph so Arabic round-trips.
- Pure function over `DocBlock[]` → fully unit-testable without a browser.

## 4. Word → PDF — `src/lib/docx/parse.ts`
`docxToHtml(file): Promise<string>` via **`mammoth.js`** (ships `mammoth.browser.js`), then render to PDF through the existing print pipeline.
- Mammoth is deliberately lossy (semantic HTML, not fixed-layout). The UI must say so plainly: styling is normalized, complex layouts/floats will not survive. Honesty rule — no "pixel-perfect" claim anywhere.

## 5. OCR upgrade — `src/lib/ocr/preprocess.ts` + `ImageToText`
Non-AI, per the measurements.
- `deskew(canvas)` — estimate skew via projection-profile variance over ±10°, rotate to correct.
- `binarize(canvas)` — adaptive (Sauvola-style) threshold.
- **PDF input**: accept a PDF, render pages via pdf.js to canvas, OCR each page. This is the roadmap's "PDF input" item and it also serves §2.6's scanned branch.
- Keep tesseract.js as the engine and **keep `ara` for Arabic unconditionally** (measured 200× better than the alternative).

## 6. Components / tools
- `src/components/PdfToWord.tsx` — drop PDF → progress → preview of detected structure (block counts: N headings, N tables…) → download .docx. Honest disclosure panel.
- `src/components/WordToPdf.tsx` — drop .docx → HTML preview → download PDF.
- `ImageToText.tsx` — add PDF input + a preprocessing toggle (deskew/binarize).
- Reuse: `src/lib/pdf/pdfjs-doc.ts` (`openPdf`), `@/lib/download`, existing R3 molecules (`SettingsCard`/`OptionRow`), `useActiveFileIndex` file-reselection pattern from W4.

## 7. Plumbing (per W1–W6 conventions)
- **tools-config**: two entries in the PDF/Document category; field order `name→href→icon→available→order→creationDate`; DISTINCT lucide icons (verify each appears exactly twice in the file); `creationDate: "2026-07-19"`. Slugs `/tools/pdf-to-word`, `/tools/word-to-pdf`.
- **The 4 registration points (each missed ≥1× in W4/W5 — do ALL):** tools-config entry; `HAS_OWN_H1` in `tool-title.tsx` (verify `grep -o "<h1" | wc -l` == 1 per route); `tool-popularity.ts` ("pdf to word" is a top-tier query — rank high); `README.md`.
- **i18n**: `Tools.PdfToWord` / `Tools.WordToPdf` + `ToolsConfig.tools.<slug>` in `messages/en.json`, English placeholders in the other 8, then ONE fan-out task translates (8 parallel agents, one per locale). Locale parity is tsc-enforced.
- **SEO content**: bespoke `tool-content.ts` entries (en + ar) — honest about fidelity limits (see §9). `related`: pdf, image-to-text, compress-pdf, merge-pdf.
- **OG/Twitter images** per route (mirror `compress-video`); **e2e** `tool-routes.json` regenerated AFTER the pages exist.
- **Assets**: ship `pdfjs-dist/standard_fonts/` and set `standardFontDataUrl` (spike A: absent → degraded font metrics), plus `cMaps/` for CJK. Extend the existing `copy-assets` predev/prebuild step.

## 8. Blog (en + ar)
1. `convert-pdf-to-word-free` — the flagship: convert in-browser, nothing uploaded, what converts well and what doesn't.
2. `pdf-to-word-formatting-guide` — why converters mangle layout (reading order, columns, borderless tables), and how to get a clean result.

## 9. Honesty requirements (binding)
Measured limits, stated plainly in-product:
- Digital-native PDFs convert well; **scanned PDFs depend on OCR quality** and will be lower fidelity.
- **Borderless tables are the weakest link** — the heuristic is a genuine guess in a way ruled-table detection is not. Expect failures on right-aligned numeric columns, merged/spanning cells, and cells wrapping to two lines.
- **Merged/spanning cells and multi-line cells are not supported in v1.**
- Word→PDF normalizes styling; it is not a fixed-layout renderer.
- Never claim "pixel-perfect", "identical formatting", or "no quality loss".

## 10. Testing & gates
- **Unit (no browser):** the layout engine against committed PDF fixtures — the spike corpus (`doc1-simple`, `doc2-twocol`, `doc3-tables`, `doc4-arabic`, a stroked-rule PDF) checked into `src/__tests__/fixtures/`. Assertions: **full reading-order sequence** (not just the ALPHA/BETA markers — the naive algorithm passes a marker-only test while being wrong), 12/12 ruled cells, 12/12 borderless cells, **0 borderless false positives on doc2**, 3/3 headings, RTL 5/5. A `constructPath`-shape fixture test guards the pinned pdf.js internal contract.
- **Docx:** `buildDocx` output unzipped and asserted on `document.xml` structure.
- **Real-browser (mandatory):** convert each fixture through the live tool, open the .docx, confirm structure survives; dark + RTL (ar) + mobile viewport.
- **Per-task gates:** `bun run test` · `bunx tsc --noEmit` · `bun run lint` · `bun run validate`. Wave-level: `CI=true bun run build` · `CI=true bun run e2e:smoke` · full suite under `LC_ALL=en_US.UTF-8 TZ=UTC`.
- **Parallel-agent rule:** implementer agents run ONE AT A TIME in the shared worktree.

## 11. Out of scope
Images/figures inside PDF→Word (text, headings, lists, tables only — disclosed); merged/spanning and multi-line table cells; PP-OCR (measured net-negative; revisit only if the SDK ships angle classifiers and drops the CDN fallback); any VLM path; hyphenation rejoining; Arabic combining-mark merge pass; same-size-bold heading detection via `commonObjs`; fixed-layout Word→PDF fidelity; OCR languages beyond those already shipped.
