# Wave 2 — PDF Workbench (spec)

**Date:** 2026-07-16 · **Branch:** `wave-2-pdf-workbench` (stacked on wave-1-instant-volume, PR #43) · **Roadmap:** §5 Wave 2 · **Design contract:** R3 interior contract (binding)

**Goal:** make `/tools/pdf` honest AND great — the copy already promises compress/rotate that don't exist. Add 6 operations to the existing 3, expose each behind a per-operation SEO landing page (biggest query family of the program), and ride the invoice monetization experiment along, dark.

## 1. Workbench operations

Existing (keep, behavior-identical): images→PDF, merge, split. New (6):

| Op | Engine | Notes |
|---|---|---|
| **Compress** | pdf.js render each page → canvas → JPEG re-encode at quality preset → rebuild via pdf-lib | Roadmap-mandated image re-encode pipeline. HONESTY: output pages are rasterized (text no longer selectable) — say so in the UI (`compressRasterNote`) and show before/after sizes. Quality presets High (0.8/1.5×), Balanced (0.6/1.2×), Small (0.4/1.0×) (jpeg quality / render scale). |
| **Rotate** | pdf-lib `setRotation(degrees(existing + delta))`, per-page or all pages | PERSISTED — replaces today's preview-only rotate promise. UI: page thumbnail grid, click-to-rotate 90° steps, all-pages buttons. |
| **Reorder** | pdf-lib `copyPages` into new doc in chosen order; supports page delete | Drag-drop thumbnail grid — reuse PhotoCollage's native HTML5 pattern (`dragIndex` + `reorder(from,to)` splice, PhotoCollage.tsx:297-424). No new DnD dependency. |
| **Watermark** | pdf-lib `drawText` on every page: text, font size, opacity, rotation (diagonal default), 9-anchor or center, color | Text watermark only this wave (image watermark = follow-up). Reuse `Anchor`/`anchorPosition` semantics from `src/lib/image/watermark-draw.ts` conceptually, but PDF coordinate space (bottom-left origin) — separate pure module. |
| **Extract text** | pdf.js `getTextContent()` per page → plain text with `--- Page N ---` separators | Net-new in repo (zero getTextContent usage today). Output via `OutputPanel` (copy + download .txt). HONESTY: scanned/image PDFs yield no text — detect empty result and point to Image to Text (OCR) tool. |
| **Sign** | SignaturePad (extracted from SignatureMaker) or PNG upload → pdf.js page preview → drag/resize placement box → pdf-lib `embedPng` + `drawImage` | Placement on one page at a time; position/scale via pointer drag on the rendered preview (normalized coords → PDF points, y-flipped). |

### 1.1 Architecture
- Pure engines in `src/lib/pdf/`: `rotate.ts`, `reorder.ts`, `watermark.ts`, `compress.ts`, `extract-text.ts`, `sign.ts` — each takes/returns `Uint8Array` (+options), pdf.js-dependent ones accept an injectable render/document factory for unit tests. All unit-tested.
- `src/components/pdf-workbench/` panel components per new op; `PDFTools.tsx` becomes the shell: op picker (keep shadcn Tabs — 9 structurally-different panels, per ratified R3 precedent), shared `files` state, per-op panels. Slug stays `/tools/pdf`; component name stays `PDFTools`.
- Preset props (W1 pattern): `PDFTools({ slug = "pdf", preset?: { op?: WorkbenchOp } })` where `WorkbenchOp = "images" | "merge" | "split" | "compress" | "rotate" | "reorder" | "watermark" | "extract" | "sign"`. Landing pages pass `preset.op`; default tab unchanged ("images") without preset.
- SignaturePad extraction: `src/components/shared/SignaturePad.tsx` (strokes state, pointer handlers, quadratic `renderStrokes`, undo/clear, color/width, type-mode text render — from SignatureMaker.tsx:54-231). SignatureMaker rewires to consume it with byte-parity behavior (W1 crop/watermark extraction discipline); pad exposes `getBlob(): Promise<Blob|null>` for the sign panel.
- Existing PDFTools tests stay green (the 3 existing ops must not change behavior; tabs structure may gain new entries).

## 2. Landing pages (9, all `landingFor: "pdf"`)

| Slug | Preset op | Name (en) |
|---|---|---|
| merge-pdf | merge | Merge PDF |
| split-pdf | split | Split PDF |
| compress-pdf | compress | Compress PDF |
| rotate-pdf | rotate | Rotate PDF |
| watermark-pdf | watermark | Watermark PDF |
| sign-pdf | sign | Sign PDF |
| extract-text-from-pdf | extract | Extract Text from PDF |
| reorder-pdf-pages | reorder | Reorder PDF Pages |
| jpg-to-pdf | images | JPG to PDF |

No collisions (recon-verified). Each: tools-config entry (fileTools, `landingFor:"pdf"`, field order name→href→icon→available→…), `ToolsConfig.tools.<slug>` ×9 locales, HAS_OWN_H1, page.tsx + og/twitter images, bespoke `tool-content.ts` entry (en+ar; §7 substance — each op names its own scenarios: sign→contracts/leases remote signing; compress→email caps and portal limits; jpg-to-pdf→scanned-document submission; extract→quoting/repurposing text; watermark→draft/confidential stamps), related[] = 2-3 op siblings + `pdf` canonical (+ `signature-maker` for sign-pdf, `image-to-text` for extract). e2e routes regenerated (156→165).
- Update `ToolsConfig.tools.pdf` description ×9 to reflect the real op set, and refresh `tool-content.ts` `pdf` entry (en+ar) — the current copy's compress/rotate promises become TRUE this wave; extend it to enumerate all 9 ops.

## 3. Invoice experiment (rides along, ships DARK)

- New `src/lib/pro-config.ts`: `INVOICE_PRO_PAYMENT_LINK = ""` (Stripe payment link, user fills post-merge to activate) + `API_WAITLIST_MAILTO` (prefilled mailto: subject "BrowseryTools invoice API waitlist").
- Invoice template picker: `templateId: "classic" | "modern" | "compact"` in the invoice store (persisted). Classic = today's layout (free, default, byte-identical output). Modern + Compact = two new jsPDF layouts, marked **Pro**.
- Pro gating: if `INVOICE_PRO_PAYMENT_LINK` is empty, Pro templates render as disabled "coming soon" previews (no price shown, no dead-end purchase). If set: "$5 unlock" dialog → payment link (new tab) → honor-system unlock via `?unlocked=pro` redirect param → localStorage flag. NO fake payment flows; PR discloses the honor-system limitation and the flip-on step.
- "Need this as an API?" link (mailto) on the export tab — always visible, harmless.
- No breakage: default template output byte-identical to today; InvoiceGenerator has NO existing tests (recon) — add a template-picker unit test.

## 4. Locales ×9

New `Tools.PDFTools` keys for 6 ops (~40 keys), `Tools.InvoiceGenerator` template/pro keys (~10), `Tools.SignatureMaker` unchanged (pad extraction reuses namespace), `ToolsConfig.tools.<slug>` ×9 entries + pdf description update. W1 pattern: en + English-placeholder parity in component tasks; one 8-agent parallel fan-out task translates from a generated manifest.

## 5. Blog (en + ar)

1. `compress-pdf-under-limit` — email/portal caps, rasterization tradeoff honestly explained.
2. `sign-pdf-online-free` — remote signing walkthrough, privacy (never uploaded).
3. `merge-split-reorder-pdf` — page-management roundup.

## 6. Checklist & gates

Per-wave checklist (roadmap §9) as W1: no README bullets needed (all 9 are landing variants; `pdf` already listed), validate green, sitemap automatic, e2e regen, HAS_OWN_H1, marketing counts unaffected (landing variants). Gates per task: `bun run test` · `bunx tsc --noEmit` · `bun run lint` · `bun run validate` · `CI=true bun run build` · `CI=true bun run e2e:smoke`. Zero user-visible breakage to existing merge/split/images ops and SignatureMaker; existing tests unmodified except reported invalidated assertions. Launch action: blog cluster + PR note for outreach; sitemap ping post-merge.

## 7. Out of scope

PDF password/encryption (copy already says Coming Soon), image watermarks on PDF, OCR-in-PDF (W7), PDF→Word (W7), multi-signature workflows, real payment verification backend.
