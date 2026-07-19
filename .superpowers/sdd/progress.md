# Wave 7 — Document Conversion (SDD ledger)
Branch wave-7-document-conversion off main@32dd29b. Spec+plan committed. Commits UNSIGNED (1Password down); last signed = 32dd29b.

Spikes (pre-plan, all measured): geometry beats AI decisively for digital-native PDF->Word (0.42-0.70ms/page, 12/12 ruled + 12/12 borderless cells); PP-OCR REJECTED as tesseract replacement (50x worse degraded, 200x worse Arabic, CDN privacy landmine); Granite-Docling VLM REJECTED (1.17GB, empty table structure).

- [x] T1 fixtures + segments — complete (3dd3f46..d5bc44f, review clean after word-spacing fix, 1011 tests)
- [x] T2 reading order (column-first + header peel) — complete, 1016 tests. Gutter clearance tightened 80%->zero-crossings and band gap 3x->2.5x line height (both measured; 80% absorbed the title and left page structure hinging on a 0.001pt margin). See task-2-report.md.
- [ ] T3 ruling-line extraction (CTM)
- [ ] T4 table detection (ruled + borderless)
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
