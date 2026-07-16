# Wave 2 — PDF Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `/tools/pdf` from 3 to 9 operations (compress, persisted rotate, drag-drop reorder, watermark, text extraction, sign — plus the existing images/merge/split), expose 9 per-op SEO landing pages via the W1 `landingFor` system, and ship the invoice Pro-templates experiment dark.

**Architecture:** Pure engines in `src/lib/pdf/*` (pdf-lib for writes, pdf.js injected for render/read paths so tests run without a real renderer); panel components in `src/components/pdf-workbench/*`; `PDFTools.tsx` becomes a thin shell with `{slug, preset:{op}}` props (W1 pattern); SignatureMaker's pad extracted to a shared component with byte-parity (W1 crop/watermark discipline).

**Tech Stack:** pdf-lib 1.17 (static import precedent), pdfjs-dist 4.10 (self-hosted worker `/pdf.worker.min.mjs`), JSZip, jsPDF (invoice only), native HTML5 drag (PhotoCollage pattern), Vitest v4 + happy-dom, Playwright smoke.

## Global Constraints

- Work in worktree `/Users/aghyad/dev/browserytools/.claude/worktrees/redesign`, branch `wave-2-pdf-workbench`. ALWAYS `cd` in the same command / `git -C` — shell cwd resets between calls.
- R3 design contract: ToolShell + shared molecules, `var(--bt-*)` tokens only, no raw hex/gray/slate/green classes (content colors annotated), logical CSS, both themes, RTL-safe. No single-edge borders.
- One `<h1>` per page: new slugs → `HAS_OWN_H1` in `src/components/layout/tool-title.tsx`.
- Locale parity invariant: every new `messages/en.json` key needs identical-key English placeholder copies in the 8 other locale files (tsc enforces; Task 12 translates).
- tools-config field order `name→href→icon→available→…→landingFor` (route-generator regex needs the prefix). e2e/tool-routes.json regenerated ONLY via `bun run e2e:routes`, and only after pages exist (Task 10).
- Existing behavior frozen: images→PDF/merge/split ops, SignatureMaker UX, InvoiceGenerator classic output — all byte/behavior-identical. Existing tests unmodified; genuinely invalidated assertions → STOP and report.
- Gates for EVERY task before commit: `bun run test` && `bunx tsc --noEmit` && `bun run lint` && `bun run validate` && `CI=true bun run build` && `CI=true bun run e2e:smoke`. If smoke fails with "port 3000 already used": `lsof -ti :3000 | xargs -r kill` and retry.
- Conventional commits; NEVER Co-Authored-By/AI footers; 1Password signing fails twice → `--no-gpg-sign`.
- PDF coordinate space: pdf-lib origin is BOTTOM-left; pdf.js render viewport is TOP-left. Every placement/watermark computation must state which space it's in and flip y exactly once.

---

### Task 1: pdf-lib pure engines — rotate, reorder, watermark

**Files:**
- Create: `src/lib/pdf/rotate.ts`, `src/lib/pdf/reorder.ts`, `src/lib/pdf/watermark.ts`
- Test: `src/__tests__/lib/pdf-ops.test.ts`

**Interfaces (Tasks 5-6 rely on these exact names):**

```ts
// rotate.ts
export async function rotatePdf(bytes: Uint8Array, rotations: Record<number, number>): Promise<Uint8Array>;
// rotations: 0-based page index → ABSOLUTE target rotation in degrees (0/90/180/270).
// Implementation: PDFDocument.load(bytes) → for each entry page.setRotation(degrees(value)) → save().

// reorder.ts
export async function reorderPdf(bytes: Uint8Array, order: number[]): Promise<Uint8Array>;
// order = 0-based source page indices in desired output order; omitted indices are DELETED.
// Implementation: load src → PDFDocument.create() → copyPages(src, order) → addPage each → save().
// Throws Error("invalid-order") if order is empty or contains out-of-range/duplicate indices.

// watermark.ts
export type PdfWatermarkAnchor = "diagonal" | "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
export interface PdfWatermarkOptions {
  text: string; fontSize: number;          // pt
  opacity: number;                          // 0..100
  anchor: PdfWatermarkAnchor;               // diagonal = centered at 45°
  color: { r: number; g: number; b: number }; // 0..1 each (pdf-lib rgb())
}
export async function watermarkPdf(bytes: Uint8Array, opts: PdfWatermarkOptions): Promise<Uint8Array>;
// Every page: embed StandardFonts.Helvetica, measure widthOfTextAtSize, drawText with
// opacity/100, rotate degrees(45) only for "diagonal", 4% page padding for corner anchors,
// centered for center/diagonal. BOTTOM-LEFT origin (pdf-lib native) — corner anchors:
// top-* means y = height - pad - textHeight (approx fontSize), bottom-* means y = pad.
```

Real pdf-lib in tests (no mock — pdf-lib is pure JS, works in vitest): build a 3-page doc with `PDFDocument.create()` in a helper, run ops, reload output with `PDFDocument.load` and assert.

**Steps:**
- [ ] Write failing tests: rotate sets absolute rotation (assert `page.getRotation().angle`) and leaves untouched pages at 0; rotate on top of an existing rotation is absolute not additive; reorder [2,0] → 2 pages in that order (assert page count + a distinguishing property e.g. differing page sizes set at creation); reorder deletes omitted pages; reorder throws "invalid-order" on [] / [5] / [0,0]; watermark output reloads cleanly, page count unchanged, and content stream grew on every page (compare `save()` sizes or check `page.node.Contents()` presence); opacity/anchor variants execute without throw.
- [ ] `bun run test src/__tests__/lib/pdf-ops.test.ts` — FAIL (modules missing).
- [ ] Implement the three modules exactly per interfaces.
- [ ] Tests PASS; full gates.
- [ ] Commit: `feat(pdf): pure engines — persisted rotate, reorder/delete, text watermark`

---

### Task 2: pdf.js-dependent engines — compress, extract-text

**Files:**
- Create: `src/lib/pdf/compress.ts`, `src/lib/pdf/extract-text.ts`, `src/lib/pdf/pdfjs-doc.ts`
- Test: `src/__tests__/lib/pdf-render-ops.test.ts`

**Interfaces:**

```ts
// pdfjs-doc.ts — the ONLY place that imports pdfjs-dist in src/lib/pdf/.
// Re-exports a loader mirroring PDFTools.tsx:43-50 (same worker guard, same "/pdf.worker.min.mjs").
export interface PdfJsDocument {  // minimal structural type used by the two engines
  numPages: number;
  getPage(n: number): Promise<{
    getViewport(o: { scale: number }): { width: number; height: number };
    render(o: { canvasContext: CanvasRenderingContext2D; viewport: unknown }): { promise: Promise<void> };
    getTextContent(): Promise<{ items: Array<{ str: string }> }>;
  }>;
}
export async function openPdf(bytes: Uint8Array): Promise<PdfJsDocument>;

// compress.ts
export type CompressPreset = "high" | "balanced" | "small";
export const COMPRESS_PRESETS: Record<CompressPreset, { quality: number; scale: number }>;
// high {0.8, 1.5}, balanced {0.6, 1.2}, small {0.4, 1.0}
export interface CompressResult { bytes: Uint8Array; pageCount: number; before: number; after: number }
export async function compressPdf(
  bytes: Uint8Array, preset: CompressPreset,
  deps?: { open?: (b: Uint8Array) => Promise<PdfJsDocument>;
           encode?: (canvas: HTMLCanvasElement, quality: number) => Promise<Blob | null> }
): Promise<CompressResult>;
// For each page: render at preset.scale to a canvas → encode JPEG at preset.quality
// (default canvasToBlob from @/lib/image/canvas) → embedJpg into a fresh pdf-lib doc,
// page sized to the ORIGINAL page's point dimensions (viewport at scale 1). Throws
// Error("encode-failed") if the encoder returns null.

// extract-text.ts
export interface ExtractedText { pages: string[]; full: string; isEmpty: boolean }
export async function extractPdfText(
  bytes: Uint8Array,
  deps?: { open?: (b: Uint8Array) => Promise<PdfJsDocument> }
): Promise<ExtractedText>;
// pages[i] = items.map(i => i.str).join(" ") normalized whitespace;
// full = pages joined with "\n\n--- Page N ---\n\n" headers (N is 1-based);
// isEmpty = every page trimmed length === 0.
```

Tests inject fake `open`/`encode` (deterministic fake doc: numPages 2, viewport 612×792 at scale 1 multiplied by requested scale, render no-op, getTextContent returns known items) — no real pdf.js in unit tests. compress output verified by reloading with real pdf-lib (page count, page dimensions = original points, before/after numbers). extract: page joins, header format exact, isEmpty true for all-empty items.

**Steps:**
- [ ] Failing tests per above (include: compress page dimensions equal ORIGINAL viewport points even when scale=1.5; encoder null → "encode-failed"; extract normalizes runs of whitespace).
- [ ] Run — FAIL. Implement all three files.
- [ ] PASS; full gates.
- [ ] Commit: `feat(pdf): compress (rasterizing re-encode) and text-extraction engines`

---

### Task 3: SignaturePad extraction (byte-parity with SignatureMaker)

**Files:**
- Create: `src/components/shared/SignaturePad.tsx`
- Modify: `src/components/SignatureMaker.tsx` (rewires to consume the pad; UI/behavior byte-parity)
- Test: `src/__tests__/components/SignaturePad.test.tsx` (new; existing SignatureMaker.test.tsx UNMODIFIED and green)

**Interfaces (Task 7 relies on):**

```ts
export interface SignaturePadHandle { getBlob(): Promise<Blob | null>; clear(): void; isEmpty(): boolean }
export interface SignaturePadProps {
  mode: "draw" | "type";
  // draw: penColor, penWidth; type: text, font, fontSize, color — mirror SignatureMaker's state lifting
  // exact prop set decided by the extraction: lift ALL knobs SignatureMaker currently owns so the
  // parent stays the single source of truth and SignatureMaker renders identically.
}
export const SignaturePad: ForwardRefExoticComponent<SignaturePadProps & RefAttributes<SignaturePadHandle>>;
```

Extraction source: SignatureMaker.tsx lines ~54-166 (strokes state, pointer handlers, quadratic `renderStrokes`, undo/clear) and ~204-231 (type-mode offscreen render). SignatureMaker keeps its own Tabs/controls/i18n (`Tools.SignatureMaker`) and export buttons — the pad renders the canvas and exposes the handle. `data-testid="signature-canvas"` must stay on the same canvas element (existing test queries it). SVG export stays in SignatureMaker (it reads strokes — pad exposes a `getStrokes()` accessor or SignatureMaker passes strokes down; choose the minimal-churn direction and document it).

**Steps:**
- [ ] Failing SignaturePad test: renders canvas; pointer draw → `isEmpty()` false; `getBlob()` resolves a Blob (mock `canvasToBlob` or rely on happy-dom `toBlob` stub used by the existing SignatureMaker test — copy its setup); clear() → isEmpty() true.
- [ ] Extract; rewire SignatureMaker. Run new + EXISTING SignatureMaker tests (must pass untouched).
- [ ] Full gates.
- [ ] Commit: `refactor(signature): extract shared SignaturePad; SignatureMaker behavior-identical`

---

### Task 4: Workbench shell — PDFTools op registry + slug/preset props

**Files:**
- Modify: `src/components/PDFTools.tsx`
- Create: `src/components/pdf-workbench/ops.ts` (op registry: `WorkbenchOp` union, ordered op list with i18n label keys + icons)
- Modify: `messages/en.json` + 8 placeholder copies (`Tools.PDFTools`: 6 new tab labels `tabCompress, tabRotate, tabReorder, tabWatermark, tabExtract, tabSign` — final key list at implementation)
- Test: `src/__tests__/components/PDFToolsPreset.test.tsx` (new)

**Interfaces (Task 10 relies on):**

```ts
export type WorkbenchOp = "images" | "merge" | "split" | "compress" | "rotate" | "reorder" | "watermark" | "extract" | "sign";
export default function PDFTools({ slug = "pdf", preset }: { slug?: string; preset?: { op?: WorkbenchOp } } = {})
```

- Tabs list gains the 6 new entries (panels are placeholders this task: a `SettingsCard` with the op's label — replaced in Tasks 5-8). `defaultValue={preset?.op ?? "images"}`.
- `slug` → ToolShell identity via `tc(\`tools.${slug}.name\`)` (W1 pattern; ToolsConfig entries for landing slugs arrive Task 9 — default slug used until then, tests use default slug or mock).
- Existing 3 ops keep their exact markup/behavior; existing PDFTools.test.tsx untouched and green (it asserts the 3 operation tabs render — adding tabs must not break it; if its assertions are count-exact, STOP and report).

**Steps:**
- [ ] Failing test: `<PDFTools preset={{op:"compress"}} />` renders with the compress tab active (assert its placeholder content visible, images dropzone NOT visible); default render keeps images tab active.
- [ ] Implement registry + shell changes + en keys (+8 placeholders).
- [ ] New + existing tests PASS; full gates.
- [ ] Commit: `feat(pdf): workbench shell — 9-op registry, slug/preset props for landing pages`

---

### Task 5: Compress + Rotate panels

**Files:**
- Create: `src/components/pdf-workbench/CompressPanel.tsx`, `src/components/pdf-workbench/RotatePanel.tsx`
- Modify: `src/components/PDFTools.tsx` (mount panels), `messages/en.json` (+8 placeholders)
- Test: `src/__tests__/components/PdfCompressRotate.test.tsx`

**Behavior:**
- Both panels receive the shared `files` state (single-PDF ops: use first file; show FileDropzone when empty — mirror split tab's selectedFile pattern).
- **CompressPanel**: ModePicker for the 3 presets (`high/balanced/small` labels via i18n), the rasterization honesty note (`compressRasterNote`) always visible, action button → `compressPdf` → StatStrip before/after/`formatBytes` + reduction % → download `${base}_compressed.pdf` via `downloadBlob`. Errors → toast.
- **RotatePanel**: thumbnail grid (reuse `generateThumbnail`-style pdf.js render — render ALL pages at scale 0.3, cache per file+page), click a thumbnail → +90° for that page (badge shows current angle), "rotate all ⟲/⟳" buttons, Apply → `rotatePdf` with the ABSOLUTE angles map → download `${base}_rotated.pdf`. Thumbnails visually rotate via CSS transform to preview.
- i18n keys (en + 8 placeholders): compress preset labels/hints, `compressRasterNote`, `applyCompress`, rotate keys (`rotateAll`, `applyRotate`, `rotatedBadge` etc.).

**Steps:**
- [ ] Failing tests: mock `@/lib/pdf/compress` / `@/lib/pdf/rotate` + pdf.js thumbnails (mirror PDFTools.test.tsx's pdfjs-dist mock); compress panel: preset picker renders, action calls engine with chosen preset and file bytes, StatStrip appears from mocked result; rotate panel: thumbnails render per page, click accumulates 90°, apply calls `rotatePdf` with `{0: 90}`-style map.
- [ ] Implement; mount in shell replacing placeholders.
- [ ] PASS; full gates.
- [ ] Commit: `feat(pdf): compress and persisted-rotate panels`

---

### Task 6: Reorder + Watermark panels

**Files:**
- Create: `src/components/pdf-workbench/ReorderPanel.tsx`, `src/components/pdf-workbench/WatermarkPanel.tsx`
- Modify: `src/components/PDFTools.tsx`, `messages/en.json` (+8 placeholders)
- Test: `src/__tests__/components/PdfReorderWatermark.test.tsx`

**Behavior:**
- **ReorderPanel**: page-thumbnail grid, native HTML5 drag per PhotoCollage.tsx:297-424 (`draggable`, `dragIndex` state, `onDragOver preventDefault`, `onDrop → reorder(from,to)` splice), per-page delete button (X), page-number badges show CURRENT position, Apply → `reorderPdf(bytes, order)` → download `${base}_reordered.pdf`. Guard: deleting all pages disables Apply.
- **WatermarkPanel**: text input (default "DRAFT"), fontSize SliderRow (12-144, default 48), opacity SliderRow (default 30), anchor ModePicker (diagonal default + center + 4 corners), color input (content color, annotated), live preview note (no canvas preview this wave — state the applied-on-export behavior), Apply → `watermarkPdf` → download `${base}_watermarked.pdf`.
- i18n keys accordingly (`dragToReorderPages`, `deletePage`, `applyReorder`, `watermarkTextLabel`, `applyWatermark`, anchor labels — reuse wording from Tools.WatermarkImage where sensible but keys live under Tools.PDFTools).

**Steps:**
- [ ] Failing tests: reorder grid renders N thumbs (mocked pdf.js), drag simulate (fireEvent dragStart/drop) reorders badges, delete removes a thumb, apply calls `reorderPdf` with the expected order array; watermark: controls render, apply calls `watermarkPdf` with `{text, fontSize, opacity, anchor, color}` matching UI state.
- [ ] Implement; mount.
- [ ] PASS; full gates.
- [ ] Commit: `feat(pdf): drag-drop reorder/delete and text-watermark panels`

---

### Task 7: Extract-text + Sign panels

**Files:**
- Create: `src/components/pdf-workbench/ExtractPanel.tsx`, `src/components/pdf-workbench/SignPanel.tsx`
- Modify: `src/components/PDFTools.tsx`, `messages/en.json` (+8 placeholders)
- Test: `src/__tests__/components/PdfExtractSign.test.tsx`

**Behavior:**
- **ExtractPanel**: action → `extractPdfText` → `OutputPanel` (`text` = full, `filename` = `${base}.txt`); when `isEmpty`, show a notice linking `/tools/image-to-text` (`extractEmptyNotice` with an anchor — check ToolSeo/link precedent for in-tool links).
- **SignPanel**: two signature sources via ModePicker — "Draw" (shared `SignaturePad` from Task 3, draw mode) and "Upload PNG" (FileDropzone accept image/png). Page picker (number input, 1-based, clamped to page count). pdf.js preview of the chosen page rendered to canvas (~scale 0.8 fit); signature box overlaid as a draggable/resizable rect (pointer events; reuse the normalized-rect approach of `src/lib/image/crop-rect.ts` — import `clamp`/`moveRect`/`resizeRect` if they fit, else local minimal math with a comment). Apply → `signPdf` — ADD to `src/lib/pdf/sign.ts` in THIS task:

```ts
export interface SignPlacement { pageIndex: number; x: number; y: number; w: number; h: number } // normalized 0..1 in TOP-LEFT space
export async function signPdf(bytes: Uint8Array, signaturePng: Uint8Array, placement: SignPlacement): Promise<Uint8Array>;
// pdf-lib: embedPng, page.drawImage at x*pw, (1 - y - h)*ph (y-flip ONCE), w*pw × h*ph.
```

  → download `${base}_signed.pdf`. Unit-test `signPdf` with real pdf-lib (embed a tiny valid PNG fixture — a 1×1 PNG as a base64 constant in the test) asserting reload + content growth on the target page only.
- i18n keys accordingly.

**Steps:**
- [ ] Failing tests: `signPdf` y-flip math (place at top-left normalized {0,0,.5,.25} on 612×792 → drawImage called at x=0, y=594 — assert via a mocked page object OR verify structurally with real pdf-lib reload); ExtractPanel shows OutputPanel text from mocked engine and empty-notice when isEmpty; SignPanel renders pad, upload path accepts PNG, apply calls signPdf with normalized placement.
- [ ] Implement `sign.ts` + panels; mount.
- [ ] PASS; full gates.
- [ ] Commit: `feat(pdf): text extraction and sign-pdf (signature placement) panels`

---

### Task 8: Invoice experiment (dark)

**Files:**
- Create: `src/lib/pro-config.ts`
- Modify: `src/components/InvoiceGenerator.tsx`, `src/store/invoice-store.ts`, `messages/en.json` (+8 placeholders)
- Test: `src/__tests__/components/InvoiceTemplates.test.tsx` (new — none exist today)

**Deliverables:**

```ts
// src/lib/pro-config.ts
export const INVOICE_PRO_PAYMENT_LINK = ""; // Stripe payment link — empty ⇒ Pro UI shows "coming soon", no price
export const API_WAITLIST_MAILTO = "mailto:aaa1997aaa@gmail.com?subject=BrowseryTools%20invoice%20API%20waitlist";
export function isInvoiceProUnlocked(): boolean; // localStorage "bt-invoice-pro" === "1"
export function unlockInvoicePro(): void;
```

- Store: `templateId: "classic" | "modern" | "compact"` (default "classic", persisted with existing store mechanics).
- Template picker card on the preview tab: three tiles; classic free; modern/compact badged Pro. jsPDF export branches by templateId: classic = EXACT current code path (byte-identical default output — refactor by extraction only if the diff proves identity, otherwise leave the classic path untouched inline); modern (accent header band using invoice accent color, right-aligned totals block); compact (single-column, smaller type, no logo box).
- Gating: if `!isInvoiceProUnlocked()` and a Pro template selected → export button disabled + upsell note. Upsell dialog: if `INVOICE_PRO_PAYMENT_LINK` empty → "coming soon" copy (no price); else "$5 unlock" linking out + on return `?unlocked=pro` → `unlockInvoicePro()` (read param in a useEffect, then strip it via router.replace).
- API waitlist link (mailto, `API_WAITLIST_MAILTO`) on the export tab — small text link, always visible.
- i18n keys: `templatesTitle, templateClassic, templateModern, templateCompact, proBadge, proComingSoon, proUnlockCta, proUnlockedToast, apiWaitlist` (en + 8 placeholders).

**Steps:**
- [ ] Failing tests: template picker renders 3 tiles; selecting modern while locked disables export + shows upsell; with `INVOICE_PRO_PAYMENT_LINK` empty the dialog has no "$5" text; `unlockInvoicePro()` + rerender enables export; classic default → export button enabled (mock jsPDF as the existing pattern — none exists, mock `jspdf` module with a recording constructor).
- [ ] Implement.
- [ ] PASS; full gates.
- [ ] Commit: `feat(invoice): template picker + dark Pro unlock scaffold + API waitlist link`

---

### Task 9: Registry seed — 9 landing entries + en names + HAS_OWN_H1 + pdf copy refresh

**Files:**
- Modify: `src/lib/tools-config.ts` (fileTools category, after the `pdf` entry), `messages/en.json` (+8 placeholder copies for the 19 new strings incl. pdf description), `src/components/layout/tool-title.tsx`, `src/lib/tool-content.ts` (pdf entry refresh only — landing entries come in Task 11)

**Exact entries** (all `available: true`, `creationDate: "2026-07-16"`, `landingFor: "pdf"`, icon `FileTextIcon`, orders 60-68):

| slug | name | description (en) |
|---|---|---|
| merge-pdf | Merge PDF | Combine multiple PDF files into one document, in order, right in your browser. |
| split-pdf | Split PDF | Extract pages or page ranges from a PDF into separate files — no upload. |
| compress-pdf | Compress PDF | Shrink PDF file size in your browser with three quality presets. |
| rotate-pdf | Rotate PDF | Rotate PDF pages permanently — single pages or the whole document. |
| watermark-pdf | Watermark PDF | Stamp DRAFT, CONFIDENTIAL, or any text across every page of a PDF. |
| sign-pdf | Sign PDF | Draw or upload your signature and place it on any page — files never leave your device. |
| extract-text-from-pdf | Extract Text from PDF | Pull selectable text out of a PDF and copy or download it as .txt. |
| reorder-pdf-pages | Reorder PDF Pages | Drag and drop to rearrange or delete PDF pages, then save. |
| jpg-to-pdf | JPG to PDF | Turn JPG and PNG images into a single PDF with page size and margin controls. |

- `ToolsConfig.tools.pdf.description` (en, + 8 placeholders): "The full PDF workbench: merge, split, compress, rotate, reorder, watermark, sign, extract text, and turn images into PDFs — all in your browser."
- Refresh `tool-content.ts` `pdf` en+ar entry to enumerate the 9 ops (its compress/rotate promises are now true).
- Add all 9 slugs to `HAS_OWN_H1`. NO README bullets (landing variants exempt). NO popularity inserts (variants excluded from grid).
- Sanity: `getAllTools()` +9 (=165), `getCatalogTools()` unchanged (142).

**Steps:**
- [ ] Add entries + en.json (+8 placeholders) + HAS_OWN_H1 + pdf copy refresh; run sanity numbers; full gates.
- [ ] Commit: `feat(tools): register 9 PDF landing variants; pdf copy reflects real workbench`

---

### Task 10: Routes — 9 pages + og/twitter + e2e regen

**Files:**
- Create per slug: `src/app/tools/<slug>/page.tsx` + `opengraph-image.tsx` + `twitter-image.tsx` (W1 templates verbatim; page renders `<PDFTools slug="<slug>" preset={{ op: "<op>" }} />` per the §2 spec table; jpg-to-pdf → op "images").
- Modify: `e2e/tool-routes.json` via `bun run e2e:routes` (156→165).

**Steps:**
- [ ] Generate 27 files; regen routes; verify +9.
- [ ] Full gates including build + smoke (165 routes: <400, one h1, zero console errors). Debug wiring-level failures only; component breakage → STOP.
- [ ] Commit: `feat(routes): 9 PDF landing routes wired and smoke-covered`

---

### Task 11: Bespoke SEO content (en + ar) — 9 landing entries

**Files:**
- Modify: `src/lib/tool-content.ts`

Same rejection criteria as W1 Task 13 (unique intros, 4-5 FAQ, 3-4 steps, honesty: no invented portal limits, compress rasterization stated, extract-vs-OCR distinction, sign legal-validity honesty — "an image placed on a page, not a cryptographic e-signature"). related[]: op siblings + `pdf`; sign-pdf adds `signature-maker`; extract adds `image-to-text`; jpg-to-pdf adds `image-converter`. Arabic = native transcreation.

**Steps:**
- [ ] Read the refreshed `pdf` entry + one W1 entry for tone; write 9 entries (en+ar+related).
- [ ] Full gates.
- [ ] Commit: `feat(seo): bespoke content for 9 PDF landing pages (en+ar)`

---

### Task 12: Locale fan-out ×8

Coordinator generates a manifest (all new/changed keys since branch base: ToolsConfig entries ×9 + pdf description + Tools.PDFTools new keys + Tools.InvoiceGenerator new keys) → 8 parallel Sonnet agents, one per locale file, translating placeholder values; no gates/commits in agents; coordinator runs gates and commits `feat(i18n): wave-2 strings across all 9 locales`.

---

### Task 13: Blog cluster (3 × en + ar)

**Files:** `src/app/blog/posts/` ×6 + `src/lib/blog-data.ts` (+6 basePosts).
Posts per spec §5: `compress-pdf-under-limit`, `sign-pdf-online-free`, `merge-split-reorder-pdf` (+ `-ar` transcreations). 800-1200 words, date "2026-07-16", link the op landing pages + `/tools/pdf`, honesty rules (rasterization tradeoff explicit; sign = image placement not cryptographic signature). Cross-link existing `signature-maker-guide` post.

**Steps:**
- [ ] Write 6 posts + entries; full gates; commit: `feat(blog): wave-2 PDF cluster (en+ar)`

---

### Task 14: Final wave review + PR

- [ ] Ledger minors roll-up → final whole-branch review (most capable model) with review-package vs merge-base; fix round if needed.
- [ ] Exit gates from clean state (clear stale :3000 first).
- [ ] Manual browser smoke via agent: /tools/pdf (all 9 tabs), /tools/compress-pdf (preset preselected), /tools/sign-pdf (pad renders, placement box drags), dark + ar RTL + 390px mobile spot-checks; invoice template picker (Pro dark: no price shown).
- [ ] Push; PR against main titled `feat: Wave 2 — PDF Workbench (9 ops) + 9 landing pages + invoice experiment (dark)`; body discloses: PDF copy now truthful, compress rasterizes (stated in UI), invoice Pro ships dark with flip-on instructions (create $5 Stripe payment link → set INVOICE_PRO_PAYMENT_LINK). NO AI footers. Note: PR base = main; if #43 merges first this PR shows only W2 commits, else it contains W1 too — note the stacking in the body.
- [ ] Report PR URL.

## Self-review notes

- Spec §1 ops → Tasks 1-2 (engines) + 4-7 (panels); §1.1 SignaturePad → Task 3; §2 landing → Tasks 9-10; §3 invoice → Task 8; §4 locales → per-task placeholders + Task 12; §5 blog → Task 13; §6 gates/launch → globals + Task 14.
- Type consistency: `WorkbenchOp` (T4) consumed by T10 pages; engine signatures (T1/T2/T7) consumed by panels (T5-7); `SignaturePadHandle` (T3) consumed by T7; `INVOICE_PRO_PAYMENT_LINK` (T8) self-contained.
- Sequencing: 1→2→3 any order but run sequentially (en.json only in 3? no — 1-2 touch no messages; 3 touches none; still sequential per worktree discipline); 4 after 1-3 not required but after 3 keeps shell test stable — order 1,2,3,4,5,6,7,8,9,10,11,12,13,14. en.json touched by 4,5,6,7,8,9 — strictly sequential. 12 fans out on disjoint locale files only.
