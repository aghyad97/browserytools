# Wave 7 — Document Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** ship client-side **PDF → Word (.docx)**, **Word → PDF**, and an **OCR upgrade** (PDF input + deskew/binarize), with document structure recovered by pure geometry.

**Architecture:** pdf.js text + vector geometry → ordered `DocBlock[]` → `.docx`. No AI on the digital-native path (measured 1,000–3,000× faster than the VLM alternative, which also failed to extract tables). Scanned pages route to the already-shipped tesseract.js.

**Tech Stack:** Next.js 15 App Router, React 18, TypeScript, Bun, Zustand, next-intl (9 locales), Vitest + Testing Library (happy-dom), Radix UI, Tailwind. New deps: `docx` (build .docx), `mammoth` (parse .docx). Existing: `pdfjs-dist` ^4.10.38, `tesseract.js` ^7.

**Spec:** `docs/superpowers/specs/2026-07-19-wave-7-document-conversion-design.md`
**Spike findings (BINDING — every trap below was measured):** `docs/superpowers/specs/2026-07-19-wave-7-spike-findings.md`

## Global Constraints

Every task's requirements implicitly include this section.

1. **Never single-edge borders on cards** — all-around hairline ring only. Repo-wide hard rule.
2. **No AI footers / no `Co-Authored-By`** in commits or PR bodies.
3. **Commit signing is OFF** for this worktree (1Password outage) — plain `git commit`, never `-S`. Last signed = `32dd29b`.
4. **One implementer at a time** in the shared worktree — parallel `git add` sweeps others' files into the wrong commit (W4 lesson). Read-only agents may parallelize.
5. **`pdf.js getDocument() DETACHES its input buffer.** Always pass `new Uint8Array(data)` — a copy. This broke every PDF tool in W2 (PR #46).
6. **Any `*.module.css` change must also run `CI=true bun run build`** — CSS Modules don't compile under vitest/tsc/lint and a bad one 500s every route (W4 lesson).
7. **i18n parity is tsc-enforced**: every new `messages/en.json` key needs the same key in all 8 other locales or the build fails.
8. **The 4 registration points for a new grid tool** (each missed ≥1× in prior waves): tools-config entry (distinct icon, appears exactly twice in file); `HAS_OWN_H1` in `tool-title.tsx`; `tool-popularity.ts`; `README.md`.
9. **Honesty**: never claim "pixel-perfect", "identical formatting", or "no quality loss". State the measured limits (§9 of the spec).
10. **Pin `pdfjs-dist`** — `constructPath`'s `[ops, coords, minMax]` shape is an internal contract with no cross-major stability guarantee.

---

## Phase A — Layout engine (pure, no DOM)

### Task 1: Fixtures + segment extraction

**Files:**
- Create: `src/__tests__/fixtures/pdf/` — copy the 5 spike PDFs from `/private/tmp/claude-501/-Users-aghyad-dev-browserytools/c247f678-c3c0-4467-b311-f4866d6b2f80/scratchpad/w7fix/`: `doc1-simple.pdf`, `doc2-twocol.pdf`, `doc3-tables.pdf`, `doc4-arabic.pdf`, plus `doc1-simple-scanned.pdf`
- Create: `src/lib/pdf/layout/segments.ts`
- Test: `src/__tests__/lib/pdf/layout/segments.test.ts`

**Interfaces — Produces:**
```ts
export interface Segment {
  text: string; x: number; y: number; w: number; h: number;
  fontSize: number; fontName: string; dir: "ltr" | "rtl";
}
export function toSegments(items: TextItem[], viewport: PageViewport): Segment[];
```

- [ ] **Step 1: Write failing tests.** Load `doc3-tables.pdf` via pdfjs (`pdfjs-dist/legacy/build/pdf.mjs` in the Node test env), call `getTextContent()`, pass through `toSegments`. Assert: a segment with text `"Region"` exists; its `fontSize` is ~12 (±0.5); `x`/`y` are finite and within page bounds. On `doc2-twocol.pdf`, assert **no segment spans both columns** — i.e. no segment's text contains both `"ALPHA-START"` and `"BETA-START"`.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement.** `fontSize = Math.hypot(transform[0], transform[1])`; origin `x = transform[4]`, `y = transform[5]`; `dir` from `item.dir`. **Merge adjacent runs into a segment only when they share a baseline (|Δy| < 1pt) AND the horizontal gap is < 20pt** — do NOT merge into full lines (columns share baselines; full-line merging destroys column separation).
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(layout): pdf segment extraction + fixtures`

### Task 2: Reading order (column-first XY-cut with header peel)

**Files:** Create `src/lib/pdf/layout/reading-order.ts`; Test `src/__tests__/lib/pdf/layout/reading-order.test.ts`

**Interfaces:**
- Consumes: `Segment` from Task 1.
- Produces: `export function orderSegments(segments: Segment[], pageBox: {x0,y0,x1,y1}): Segment[][]` — array of ordered regions, each region's segments in reading order.

**THE CRITICAL TRAP (measured):** the obvious "split into horizontal bands first, then columns" algorithm **scrambles paragraph order while still emitting the ALPHA/BETA markers in the correct sequence**. A marker-only test passes against broken code. Tests MUST assert the full sequence.

- [ ] **Step 1: Write failing tests.** On `doc2-twocol.pdf`, concatenate the ordered output and assert the **full ordered text sequence**: `"ALPHA-START"` … then `"Method"` … then `"The procedure terminates"` … then `"ALPHA-END"` … then `"BETA-START"` … then `"Results"` … then `"BETA-END"`. Concretely, assert the index of each of those 7 probes is strictly increasing in the joined output. Also assert doc1 and doc4 produce a single region with ≥1 segment and no reordering regressions (doc4: the 5 Arabic lines appear top-to-bottom).
- [ ] **Step 2: Run, verify fail** (a band-first implementation will fail on `"Method"` preceding `"The procedure terminates"`).
- [ ] **Step 3: Implement column-first with header peel:**
  1. Find a vertical gutter: project segment x-extents; a gutter is a persistent x-gap ≥ 12pt spanning ≥ 80% of the region height.
  2. A full-width title crosses the gutter and blocks the split — so for `k = 0..6`, peel the top `k` segments (by y) as a header band and retry the gutter search on the remainder. **The first `k` that yields ≥2 columns each containing ≥2 segments wins.**
  3. Emit header band first, then recurse into each column left→right (for `ltr` majority; right→left when the page is majority `rtl`).
  4. If no gutter exists at any `k`, fall back to horizontal band splitting.
  5. Within a region, sort by y descending (pdf origin is bottom-left) then x ascending; **for a majority-`rtl` line, sort x descending**.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(layout): column-first reading order with header peel`

### Task 3: Ruling-line extraction from vector ops

**Files:** Create `src/lib/pdf/layout/rules.ts`; Test `src/__tests__/lib/pdf/layout/rules.test.ts`

**Interfaces:** Produces
```ts
export interface Line { x0: number; y0: number; x1: number; y1: number }
export function extractRules(opList: PDFOperatorList, viewport: PageViewport): { h: Line[]; v: Line[] };
```

**Traps (measured):** (a) **CTM composition order is `ctm = ctm ∘ args`** — args applied FIRST; inverting it silently yields coordinates like y=−1731 with no error. (b) **Two rule idioms exist**: Chrome/CSS borders emit filled thin rects (`OPS.rectangle`); LaTeX/Word emit stroked `moveTo`/`lineTo`. Support both. (c) `constructPath`'s coord array is a flat stream indexed by op arity: rectangle 4, moveTo/lineTo 2, curveTo 6, curveTo2/curveTo3 4.

- [ ] **Step 1: Write failing tests.** On `doc3-tables.pdf`: assert `extractRules` returns **≥4 horizontal and ≥4 vertical** lines for the ruled table; assert all returned coordinates are within the page box (this is the regression guard for the inverted-CTM bug — the buggy version returns y≈−1731); assert `doc1-simple.pdf` yields fewer than 2 rules on at least one axis (so it is correctly not a table). Add a **shape-guard test**: assert the `constructPath` arg tuple is `[Array, Array, Array]` — this fails loudly if a pdf.js upgrade changes the internal contract.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement.** Walk the op list maintaining a CTM stack (`save`/`restore`/`transform`). On `constructPath`, decode ops by arity, transform points by the current CTM, then classify a path as a rule when one dimension ≤ 2pt and the other ≥ 10pt. Bucket into `h`/`v`.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(layout): ruling-line extraction with CTM tracking`

### Task 4: Table detection (ruled + borderless)

**Files:** Create `src/lib/pdf/layout/tables.ts`; Test `src/__tests__/lib/pdf/layout/tables.test.ts`

**Interfaces:**
- Consumes: `Segment`, `Line`.
- Produces:
```ts
export interface DetectedTable { rows: string[][]; ruled: boolean; box: {x0,y0,x1,y1} }
export function detectRuledTable(rules: {h:Line[];v:Line[]}, segments: Segment[]): DetectedTable | null;
export function detectBorderlessTable(segments: Segment[]): DetectedTable | null;
```

**Traps (measured):**
- `detectBorderlessTable` **MUST be called per reading-order column region, never page-wide.** Page-wide, two-column prose *is* geometrically an aligned grid and false-positives as a table.
- **`colTol = Math.max(3, 0.3 * fontSize)`** — font-size-derived. A fixed tol below 3pt **silently drops the header row** (bold glyph bearings shift its left edge ~2.1pt).
- A **fill-ratio** content heuristic ("cells don't fill their column, prose does") was measured and **FAILED** — the false positive (0.772) sat between the true positives (0.735/0.794). **Do not implement it.**

- [ ] **Step 1: Write failing tests.** Ground truth for `doc3-tables.pdf`:
  - ruled: `[["Region","Units","Revenue"],["North","1240","48200"],["South","980","36150"],["East","1515","59870"]]`
  - borderless: `[["Product","Stock","Reorder"],["Widget A","320","100"],["Widget B","85","150"],["Widget C","640","200"]]`
  Assert `detectRuledTable` returns exactly the ruled grid (**12/12 cells**) and `detectBorderlessTable` exactly the borderless grid (**12/12 cells**).
  **The false-positive guard:** on `doc2-twocol.pdf`, running `detectBorderlessTable` **per column region** must return `null` for every region (0 false positives). Add a second assertion documenting the trap: running it page-wide on doc2 DOES return a table — proving the guard is load-bearing.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement.** Ruled: require **≥2 rules on each axis**; grid from distinct rule positions (cluster within 2pt); assign segments by centroid. Borderless: rows by vertical overlap → keep rows with ≥2 segments → maximal runs of ≥3 consecutive rows with matching segment count and left edges within `colTol`.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(layout): ruled and borderless table detection`

### Task 5: Block classification

**Files:** Create `src/lib/pdf/layout/blocks.ts`; Test `src/__tests__/lib/pdf/layout/blocks.test.ts`

**Interfaces:** Produces
```ts
export type DocBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string; rtl?: boolean }
  | { type: "paragraph"; text: string; rtl?: boolean }
  | { type: "list"; ordered: boolean; items: string[]; rtl?: boolean }
  | { type: "table"; rows: string[][]; ruled: boolean };
export function classify(regions: Segment[][], tables: DetectedTable[]): DocBlock[];
```

- [ ] **Step 1: Write failing tests.** On `doc1-simple.pdf`: assert exactly one `heading` with `level:1` and text `"Quarterly Operations Report"`; two `level:2` headings (`"Key Developments"`, `"Outlook"`); a `list` block with exactly 3 items; and **zero** false-positive headings among the body paragraphs (assert every non-heading block is `paragraph` or `list`). On `doc4-arabic.pdf`, assert blocks carry `rtl: true`.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement.** Body size = the font size carrying the most characters across the page. Heading if `fontSize > 1.12 * bodySize`; level by descending distinct heading size (largest→1). List items via leading-marker regex `/^\s*([•·▪-]|\d+[.)]|[a-z][.)])\s+/i` with consistent left indent — group consecutive matches into one `list` block. Segments falling inside a `DetectedTable.box` are excluded from paragraph flow (emit the `table` block at that position instead) so text isn't duplicated. `rtl` when the region is majority `dir === "rtl"`.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(layout): block classification (headings, lists, paragraphs)`

### Task 6: Document orchestrator

**Files:** Create `src/lib/pdf/layout/index.ts`; Test `src/__tests__/lib/pdf/layout/extract-document.test.ts`

**Interfaces:** Produces
```ts
export interface ExtractResult { blocks: DocBlock[]; pageCount: number; scannedPages: number[] }
export function extractDocument(data: Uint8Array, opts?: { onProgress?: (p: number) => void }): Promise<ExtractResult>;
```

- [ ] **Step 1: Write failing tests.** On `doc3-tables.pdf` assert `blocks` contains ≥2 `table` blocks and `scannedPages` is empty. **On `doc1-simple-scanned.pdf` assert `scannedPages` is `[0]`** (image-only page detected). **Buffer-detach regression test:** make the pdf.js mock (or a wrapper) detach its input, then assert the caller's original `Uint8Array` still has its original `length` after `extractDocument` returns — this is the W2/PR#46 bug class.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement.** `getDocument({ data: new Uint8Array(data) })` — **always copy**. Per page: `getTextContent` → `toSegments`; if total segment area / page area is ~0 (< 0.5%) push the index to `scannedPages` and skip layout for that page; else `getOperatorList` → `extractRules` → `orderSegments` → per-region `detectBorderlessTable` + page-level `detectRuledTable` → `classify`. Emit progress per page.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(layout): document extraction orchestrator`

---

## Phase B — Docx

### Task 7: Build .docx from DocBlock[]

**Files:** Modify `package.json` (add `docx`); Create `src/lib/docx/build.ts`; Test `src/__tests__/lib/docx/build.test.ts`

**Interfaces:** Consumes `DocBlock`. Produces `export function buildDocx(blocks: DocBlock[], meta?: { title?: string }): Promise<Blob>`

- [ ] **Step 1: Install** — `bun add docx`
- [ ] **Step 2: Write failing tests.** Build from a handcrafted `DocBlock[]` (one h1, one paragraph, a 2×2 table, a 2-item list). Unzip the resulting Blob (use `fflate`/`jszip` if already a dep, else read the Blob bytes and assert the ZIP magic `PK` plus a non-trivial size) and assert `word/document.xml` contains `<w:tbl>` (table), a `w:pStyle` referencing `Heading1`, and both list item texts. Assert an `rtl: true` paragraph emits `<w:bidi`.
- [ ] **Step 3: Run, verify fail.**
- [ ] **Step 4: Implement.** Map heading→`HeadingLevel.HEADING_1..3`, paragraph→`Paragraph`, list→`Paragraph` with `bullet`/`numbering`, table→`Table`/`TableRow`/`TableCell`; ruled tables get visible borders, borderless get `BorderStyle.NONE`. `bidirectional: true` when `rtl`.
- [ ] **Step 5: Run, verify pass.**
- [ ] **Step 6: Commit** — `feat(docx): build .docx from document blocks`

### Task 8: Parse .docx → HTML

**Files:** Modify `package.json` (add `mammoth`); Create `src/lib/docx/parse.ts`; Test `src/__tests__/lib/docx/parse.test.ts`

**Interfaces:** Produces `export function docxToHtml(file: File | ArrayBuffer): Promise<{ html: string; messages: string[] }>`

- [ ] **Step 1: Install** — `bun add mammoth`
- [ ] **Step 2: Write failing tests.** Round-trip: build a .docx with `buildDocx` (Task 7) from known blocks, feed it to `docxToHtml`, assert the HTML contains the heading text inside an `<h1>`, the paragraph text, and a `<table>` with the right cell values. Assert `messages` surfaces mammoth's warnings array (so the UI can disclose lossiness).
- [ ] **Step 3: Run, verify fail.**
- [ ] **Step 4: Implement** using `mammoth.convertToHtml({ arrayBuffer })` (browser build). Return both the HTML and mammoth's `messages` mapped to strings.
- [ ] **Step 5: Run, verify pass.**
- [ ] **Step 6: Commit** — `feat(docx): parse .docx to html via mammoth`

---

## Phase C — OCR upgrade

### Task 9: Deskew/binarize + PDF input

**Files:** Create `src/lib/ocr/preprocess.ts`; Modify `src/components/ImageToText.tsx`; Test `src/__tests__/lib/ocr/preprocess.test.ts`

**Interfaces:** Produces
```ts
export function estimateSkew(gray: ImageData): number;          // degrees, -10..10
export function deskew(canvas: HTMLCanvasElement, deg: number): HTMLCanvasElement;
export function binarize(canvas: HTMLCanvasElement): HTMLCanvasElement;
```

- [ ] **Step 1: Write failing tests.** Construct a synthetic `ImageData` of horizontal dark text-like bars rotated by a known +3°; assert `estimateSkew` returns ~3 (±1). Assert `binarize` output contains only 0 and 255 in RGB channels. (Use a canvas stub — the repo's `test-setup.ts` already mocks canvas; extend it if needed.)
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement.** `estimateSkew`: for angles −10..10 step 0.5, rotate-project rows and compute the variance of the horizontal projection profile; the max-variance angle is the skew. `binarize`: Sauvola-style adaptive threshold over a local window.
- [ ] **Step 4: Add PDF input to `ImageToText`.** Accept `application/pdf`; render each page to a canvas via `openPdf` from `src/lib/pdf/pdfjs-doc.ts` (already copies the buffer) and OCR page by page, concatenating results with a page separator. Add a preprocessing toggle (off by default) that applies deskew+binarize before OCR. Keep tesseract as the engine; **keep `ara` available for Arabic**.
- [ ] **Step 5: Run tests + `CI=true bun run build`** (ImageToText is an existing shipped tool — do not regress it).
- [ ] **Step 6: Commit** — `feat(ocr): deskew/binarize preprocessing + pdf input`

---

## Phase D — UI

### Task 10: PDF → Word tool

**Files:** Create `src/components/PdfToWord.tsx`, `src/app/tools/pdf-to-word/page.tsx`, test; Modify `src/lib/tools-config.ts`, `src/components/layout/tool-title.tsx`, `src/lib/tool-popularity.ts`, `README.md`, `messages/*.json` (9)

- [ ] **Step 1: Write failing tests.** Mock `@/lib/pdf/layout` and `@/lib/docx/build`. Assert: dropping a PDF calls `extractDocument`; the structure summary renders the detected counts (e.g. "2 tables"); clicking Convert calls `buildDocx` and then `downloadBlob` with a `.docx` filename; when `scannedPages` is non-empty a scanned-pages notice renders.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement.** `ToolShell` + R3 molecules (`SettingsCard`/`OptionRow`; **no single-edge borders**). Flow: drop PDF → `extractDocument` with progress → summary of detected blocks → Convert → `buildDocx` → `downloadBlob`. Include the honest disclosure panel (spec §9): scanned pages are OCR-dependent; borderless tables are the weakest link; merged/multi-line cells unsupported; images not carried over in v1. Support file re-selection (the W4 `useActiveFileIndex`/Change-file pattern).
- [ ] **Step 4: Register in all 4 places** (tools-config with a DISTINCT icon — verify it appears exactly twice in the file; `HAS_OWN_H1`; `tool-popularity.ts` ranked high — "pdf to word" is top-tier; README). Add `Tools.PdfToWord` + `ToolsConfig.tools.pdf-to-word` to `messages/en.json` and English placeholders to the other 8.
- [ ] **Step 5: Verify** `bun run test`, `bunx tsc --noEmit`, `bun run lint`, `bun run validate`, and the route returns 200 with exactly one `<h1>`.
- [ ] **Step 6: Commit** — `feat(tools): PDF to Word converter`

### Task 11: Word → PDF tool

**Files:** Create `src/components/WordToPdf.tsx`, `src/app/tools/word-to-pdf/page.tsx`, test; Modify the same 4 registration points + `messages/*.json`

- [ ] **Step 1: Write failing tests.** Mock `@/lib/docx/parse`. Assert dropping a .docx calls `docxToHtml`, the returned HTML renders in a preview container, mammoth's `messages` surface as a lossiness notice, and Download triggers the PDF path.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement.** Drop .docx → `docxToHtml` → sanitized preview → Download PDF via the existing print/jsPDF pipeline. Disclose plainly that styling is normalized and complex layouts won't survive (spec §9) — no "pixel-perfect" claim.
- [ ] **Step 4: Register in all 4 places** + i18n (`Tools.WordToPdf`, `ToolsConfig.tools.word-to-pdf`, 9 locales).
- [ ] **Step 5: Verify** same gates as Task 10 + route 200 + one `<h1>`.
- [ ] **Step 6: Commit** — `feat(tools): Word to PDF converter`

---

## Phase E — Verify, content, ship

### Task 12: End-to-end real-browser verification

**Files:** none shipped unless bugs are found; then fix + regression test.

- [ ] Drive the LIVE tools in a real browser (dev server + Playwright MCP). Upload each fixture PDF to `/tools/pdf-to-word`, download the .docx, **unzip and inspect `document.xml`** to confirm structure survived (headings, both tables, list). Confirm the two-column fixture's reading order is correct in the output — this is the claim the whole wave rests on.
- [ ] Upload a .docx to `/tools/word-to-pdf`; confirm the PDF downloads and renders.
- [ ] Upload a scanned PDF to `/tools/image-to-text`; confirm PDF input + preprocessing work.
- [ ] Check dark + RTL (ar) + a mobile viewport on both new tools.
- [ ] Fix any bug found, each with a regression test. Commit — `test(docs): end-to-end browser verification + fixes`

### Task 13: SEO content (en + ar)
- [ ] Add `pdf-to-word` and `word-to-pdf` entries to `src/lib/tool-content.ts` mirroring the `compress-video` shape: `related: ["pdf","image-to-text","compress-pdf","merge-pdf"]` (verify each slug exists), en + ar intro/faq/steps, native Arabic transcreation. FAQ must be honest about fidelity limits and that nothing is uploaded. No fabricated stats.
- [ ] `bunx tsc --noEmit` + `bun run test`. Commit — `feat(seo): document-conversion content (en+ar)`

### Task 14: OG/Twitter images + e2e routes
- [ ] Create `opengraph-image.tsx` + `twitter-image.tsx` under both new tool dirs, mirroring `src/app/tools/compress-video/opengraph-image.tsx` verbatim with the slug swapped. Regenerate `bun run e2e:routes`. `CI=true bun run build` green. Commit — `feat(routes): document-conversion og/twitter + e2e routes`

### Task 15: Blog cluster (en + ar)
- [ ] Create 4 posts in `src/app/blog/posts/`: `convert-pdf-to-word-free` (+`-ar`), `pdf-to-word-formatting-guide` (+`-ar`). Use `<ToolCTA slug="pdf-to-word" variant="inline" />` after the first paragraph and `variant="card"` at the end, plus an inline prose link. Add 4 entries to `src/lib/blog-data.ts` (`date:"2026-07-19"`, `author:"BrowseryTools Team"`, EN category `"PDF Tools"` / AR equivalent matching existing PDF posts, DISTINCT `coverEmoji`+`coverGradient` not already used).
- [ ] Verify all 4 routes 200 + in sitemap. Commit — `feat(blog): document-conversion cluster`

### Task 16: Locale fan-out
- [ ] 8 parallel agents (one per locale: ar, de, es, fr, id, pt-BR, ru, zh-CN), each editing ONLY its `messages/<locale>.json`, translating the new `Tools.PdfToWord` / `Tools.WordToPdf` / `ToolsConfig.tools.*` values. No git ops by agents; coordinator verifies (balanced per-file diff, 0 placeholder mismatches, tsc) and commits once — `feat(i18n): translate document-conversion strings (8 locales)`

### Task 17: Final gates + review + PR
- [ ] `CI=true bun run build` · `CI=true bun run e2e:smoke` · full suite under `LC_ALL=en_US.UTF-8 TZ=UTC` · `bunx tsc --noEmit` · `bun run lint` · `bun run validate`
- [ ] Whole-branch review (most capable model) with accumulated-minors triage → one fix subagent for Critical/Important.
- [ ] Push to `origin` (GitHub — `main` tracks `origin/main`); open PR with a minimal body (no wave/roadmap framing). Flag the unsigned-commit batch (last signed `32dd29b`) if 1Password is still down.
