# Wave 7 — Document Conversion: spike findings (2026-07-19)

Three spikes run before any spec, on a shared fixture corpus. **Every number below was measured, not estimated.** Prior desk research is contradicted in two places; the measurements govern.

## Fixture corpus
Chrome-headless-printed PDFs (real text layer) + rasterized image-only variants:
`doc1-simple` (1-col, headings, list) · `doc2-twocol` (2-col + full-width title, embeds ordering markers ALPHA-START/ALPHA-END/BETA-START/BETA-END) · `doc3-tables` (a ruled AND a borderless 3x4 table, known values) · `doc4-arabic` (RTL) · `-scanned` (image-only, 0 text chars) · `doc1-degraded` (2 deg skew + Gaussian noise + blur).

---

## Spike A — pdf.js geometry (digital-native path). VERDICT: **YES, no AI needed.**

| Metric | Result |
|---|---|
| doc2 two-column reading order | PASS (matches poppler exactly) |
| Word agreement vs `pdftotext` (doc1/2/3) | 100% / 98.2% / 100% |
| Arabic RTL line order | 5/5 |
| Ruled table (filled-`re` rules) | **12/12 cells** |
| Ruled table (stroked `m`/`l` rules) | 9/9 cells |
| Borderless table | **12/12 cells** |
| Headings | 3/3, no false positives |
| Speed | **0.42-0.70 ms/page** warm; 3.0-4.8 ms cold |

`getOperatorList()` **does** expose usable ruling geometry — the key unknown, resolved YES. Paths arrive as `constructPath [opCodeArray, coordArray, minMax]`.

### Traps found (each is a binding requirement in the plan)
1. **Naive XY-cut fails SILENTLY.** Band-split-first scrambles paragraph order while the marker sequence still passes by luck. Correct algorithm = **column-first gutter split with header peel** (peel top k=0..6 segments, first k yielding >=2 columns of >=2 segments wins; band-split only if no gutter). Tests must assert FULL order, not just markers.
2. **Do not group runs into lines before cutting** — columns share baselines, so lines merge across the gutter. Segment = same baseline AND horizontal gap < 20pt.
3. **Borderless detection must run INSIDE each reading-order column region, never page-wide.** Page-wide, two-column prose is geometrically an aligned grid and false-positives as a table. A content-based mitigation (fill-ratio) was tried and **FAILED** — the FP (0.772) sat between the true positives (0.735, 0.794). Do not ship it. Column-scoped detection gives 0 false positives across all fixtures.
4. **`colTol` must be font-size-derived (~0.3em), not fixed.** Below ~3pt it SILENTLY DROPS the header row (bold glyph bearings shift its left edge 2.1pt).
5. **CTM composition order is `ctm = ctm ∘ args`** (args first). Inverted, the table lands at y=-1731 with no error raised.
6. **Two rule idioms exist**: Chrome/CSS borders emit filled thin rects (`OPS.rectangle`); LaTeX/Word emit stroked `moveTo`/`lineTo`. Support both.
7. `constructPath`'s shape is a pdf.js **internal** contract, no cross-major stability guarantee → pin `pdfjs-dist` and cover with a fixture test.

### Browser vs Node
Browser needs `GlobalWorkerOptions.workerSrc`, **`standardFontDataUrl` + shipped `standard_fonts/`** (absent → degraded font metrics), and `cMapUrl`+`cMaps/` for CJK. v4 removed `getTextContent({normalizeWhitespace, combineTextItems})` — merge manually (its default merging is what destroys column separation anyway).

### Where geometry genuinely breaks (none fixed by a VLM except #1)
1. **Scanned/image-only PDFs** — the real AI boundary, and the need is OCR, not layout. Trivially detectable.
2. Borderless table inside a column adjacent to prose — genuinely ambiguous.
3. Merged/spanning + multi-line cells — centroid assignment handles neither.
4. Same-size-but-bold headings (needs `commonObjs` font flags). 5. Hyphenation joins. 6. Arabic combining marks land after base letter (needs a mark-merge pass). 7. Floating sidebars, rotated text.

---

## Spike B — PP-OCR vs tesseract.js, real browser (Chrome 150, self-hosted, cross-origin isolated). VERDICT: **do NOT replace tesseract.**

CER (lower better):

| Fixture | PP-OCR v5-en | tesseract.js | Winner |
|---|---|---|---|
| doc1-simple (clean) | **0.0031** | 0.0124 | PP-OCR 4x |
| **doc1-degraded** | 0.6584 | **0.0124** | **Tesseract 50x** |
| doc2-twocol | 0.5440 | 0.5452 | tie (both interleave columns — reading-order problem, engine-independent) |
| doc3-tables | **0.0000** | 0.3176 | **PP-OCR perfect** (tesseract dropped whole ruled rows) |
| **doc4-arabic** | 0.7778 | **0.0038** | **Tesseract 200x** |

Speed (median, steady state): PP-OCR 118-294 ms (WebGPU) vs tesseract 788-2956 ms → **5-10x faster**.
Payload: tesseract eng **6.97 MB** (eng+ara 8.63) vs PP-OCR **39.43 MB** (models 12.6 + onnxruntime-web 13.5-26.8). The desk-research "~16 MB" figure is **wrong**.

### Research claims CONTRADICTED by measurement
- **"Rotated text 0.012 vs 0.984, Tesseract collapses" is backwards in-browser.** At 90/270 deg PP-OCR returns 17 chars (CER **0.989**) vs tesseract 0.829. PaddleOCR's published rotation robustness comes from **angle-classifier models the browser SDK does not ship**.
- Degradation robustness is inverted: tesseract is *completely unaffected* (0.0124 clean -> 0.0124 degraded); PP-OCR's **detector** fails (swept `maxSideLength` 640/960/1280/1600, CER stayed 0.610-0.690).
- **Arabic is a genuine bug**, not weak accuracy: output is character-order **reversed**.

### Integration landmines
1. **Hardcoded CDN fallback** — `platform.web.js` sets `ort.env.wasm.wasmPaths` to jsDelivr unless set first (silent privacy violation; also pins ORT 1.26.0 against whatever you bundle). Model URLs default to githubusercontent. Both overridable; self-hosting works once done.
2. **WebGPU is dead code by default** — `executionProviders: ["cpu"]`, auto-detect only runs when empty. `.ort` models **cannot** use WebGPU (`Failed to find op_id ... Conv:1` -> silent WASM fallback); only full `.onnx` can, where WebGPU is a real 2-10x. The default preset is `.ort` = slowest AND largest.
3. COOP/COEP not required (single-threaded WASM works); needed only for threading.

### Methodology note (self-caught)
A module-level `globalImageCache` persisted across service instances: "warm" runs were 5-18 ms cache hits and a second model silently returned the first model's text. Detected via byte-identical CERs, fixed with `noCache: true`, re-run. Warmup is severe (`[6382, 1795, 571]` ms) — discard >=3 warmups. n=1 per fixture on one machine: treat absolute ms as +/-30%; accuracy was bit-identical across two full runs.

---

## Spike C — Granite-Docling-258M VLM, real browser. VERDICT: **do not ship.**

Genuine WebGPU (verified adapter), config copied verbatim from IBM's live demo Space.

- **Payload 1.17 GB** measured across 13 requests (decoder 658 MB + vision encoder 374 MB + embeddings 116 MB + ORT 21.6 MB). Cold load 107 s; warm (cached) 1.28 s.
- Per page: doc1 9.89 s · doc2 11.00 s · doc3 4.44 s. Steady decode ~38-67 tok/s.
- **KV-cache bug NOT present** (reference: 6 tok/s bugged vs 111 healthy).
- Text quality and reading order genuinely good (doc2 column-major order correct).
- **TABLE STRUCTURE: TOTAL FAILURE.** Both tables correctly *located*, then emitted **empty `<otsl>` tags — zero cells, zero rows, zero content**, for both the ruled and the borderless table. Reproduced byte-identically twice. This is the one capability that would justify the cost.
- JS heap ~545 MB after 3 pages (excludes WebGPU-side weights; true peak likely 1.5-2+ GB).

Open follow-up (does not change the call): a table-specific prompt might fix the empty `<otsl>`. Even if it did, 1.17 GB / 107 s cold is disqualifying for a paste-and-convert web tool — ~8x the shipped Whisper precedent.

---

## Architecture decided by measurement

```
PDF in -> has real text layer?
  |- YES (digital-native, the common case) -> PURE GEOMETRY, no AI, no download, sub-ms/page
  |- NO  (scanned/image)                   -> tesseract.js (already shipped) + deskew/binarize preprocessing
                                              [PP-OCR optional opt-in: clean/tables only, NEVER degraded or Arabic]
VLM path: REJECTED (1.17 GB, empty tables)
-> structured blocks -> .docx via dolanmiu/docx
```

**W7 is therefore a classical-algorithms wave, not an AI wave.** The engineering budget goes to the borderless heuristic, span/merge handling, and the docx mapping — that is where the accuracy risk actually lives, and it is ordinary code.
