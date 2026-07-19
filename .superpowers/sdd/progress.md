# Wave 7 — Document Conversion (SDD ledger)
Branch wave-7-document-conversion off main@32dd29b. Spec+plan committed. Commits UNSIGNED (1Password down); last signed = 32dd29b.

Spikes (pre-plan, all measured): geometry beats AI decisively for digital-native PDF->Word (0.42-0.70ms/page, 12/12 ruled + 12/12 borderless cells); PP-OCR REJECTED as tesseract replacement (50x worse degraded, 200x worse Arabic, CDN privacy landmine); Granite-Docling VLM REJECTED (1.17GB, empty table structure).

- [x] T1 fixtures + segments — complete (3dd3f46..d5bc44f, review clean after word-spacing fix, 1011 tests)
- [x] T2 reading order (column-first + header peel) — complete, 1016 tests. Gutter clearance tightened 80%->zero-crossings and band gap 3x->2.5x line height (both measured; 80% absorbed the title and left page structure hinging on a 0.001pt margin). See task-2-report.md.
- [x] T3 ruling-line extraction — complete (59bcfc9..a7ccc71, review approved after rect current-point fix, 1032 tests)
- [x] T4 table detection (ruled + borderless) — complete (1abb221, 9 tests, 1041 total)
- [ ] T5 block classification
- [ ] T6 document orchestrator
- [ ] T7 buildDocx
- [ ] T8 docxToHtml
- [ ] T9 OCR preprocess + PDF input
- [ ] T10 PDF->Word tool
- [ ] T11 Word->PDF tool
- [ ] T12 E2E browser verification
- [ ] T13 SEO content
- [ ] T14 OG + e2e routes
- [ ] T15 Blog cluster
- [ ] T16 Locale fan-out
- [ ] T17 Final gates + review + PR

## Minor findings (final-review triage)
- Spike C follow-up: Granite-Docling's empty <otsl> table output MIGHT be prompt-fixable (task-specific prompt vs IBM demo's generic one). Does not change the reject call (1.17GB disqualifying regardless), but note if VLMs are revisited.
- Spike B follow-up: PP-OCR is genuinely better on CLEAN docs + tables (0.0000 vs 0.3176 CER) and 5-10x faster. Possible future opt-in "clean document/tables" mode IF shipped as .onnx (not .ort), executionProviders forced to ["webgpu","wasm"], wasmPaths pinned locally to kill the jsDelivr fallback, ~39MB lazy. Never route degraded scans or Arabic to it.
- T2 IMPORTANT follow-up -> CARRY TO T12 (real-world PDF verification): header/footer peel accepts any (k,j) whose REMAINDER looks column-like, without verifying the peeled band actually caused the gutter block. Reachable failure: if the left column ends higher than the right and something near the bottom blocks the gutter, real left-column tail lines get peeled as "footer" and emitted AFTER the right column -> inverted cross-column reading order. Bounded to <=3 segments (MAX_FOOTER_PEEL); symmetric to already-accepted header-peel risk; no fixture demonstrates it. FIX: only accept a peel if the removed band's x-extent overlaps the gutter range that was blocked at j-1. Stress with real 2-col PDFs in T12.
- T2 minor: test.ts:116 asserts `text.split("7").length-1===1` — counts every "7" in the whole output; assert the literal "- 7 -" instead.
- T2 minor: post-fix runtime not re-measured (footer peel 4x's gutter-search attempts 7->28 per cut()). Budget 0.42-0.70ms/page had headroom; re-check in T12.
- T2 NOTE for all future ordering tests: endpoint-marker assertions PASS against band-scrambled output (trap hit 3x now — spike, T2 impl, T2 fix). Ordering tests MUST include an interleaving probe pair from opposite columns.
- T3 -> CARRY TO T4: `extractRules` deliberately does NOT bounds-filter its output (raw coords, so the inverted-CTM test can observe them). T4 MUST defend against out-of-page rules before clustering — a real-world PDF with a garbage CTM would otherwise poison the grid. Nothing downstream currently enforces bounds.
- T3 -> T4 handoff (verified aligned): doc3 yields h=15/v=16 RAW segments (Chrome draws one filled rect per cell edge, not per grid line). T4's plan already says "cluster within 2pt" + "require >=2 rules on each axis", which consumes exactly this unmerged output. Duplicate/overlapping rules are expected, not a defect.
- T3 minor: redundant double buffer-copy in rulesForPage (harmless, left as-is). No coverage of the "stroked rectangle" (`re ... S`) idiom — out of scope for the 2 specified idioms; note if a future fixture needs it.
- T4 -> CARRY TO T6 (orchestrator): `detectBorderlessTable` MUST be called per reading-order column region, never page-wide. Contract is documented loudly in the function docstring and guarded by a two-directional test on doc2-twocol (per-region -> null for every region; page-wide -> DOES return a table). Nothing in the type system enforces it — T6 is where it can actually be violated.
- T4 -> T5/T6 note: doc3-tables.pdf is a SINGLE reading-order region (no gutter), so its two tables are not separated by `orderSegments`. Borderless detection there picks the longest aligned run and ties break topmost; T6 will need block classification (T5) or a rule-box exclusion to split "ruled table region" from "borderless table region" on such pages.
- T4 minor: fill-ratio content heuristic re-confirmed as NOT implemented (measured failure: FP 0.772 between TPs 0.735/0.794). The docstring says so explicitly to stop a future reviewer "helpfully" adding it back.
