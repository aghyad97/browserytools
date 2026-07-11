# Wave R3: Tool-Interior Design Contract

> Authored by the coordinator from two recon reports (`.superpowers/sdd/r3-recon-interiors.md`, `r3-recon-width.md`).
> Binding for every R3 agent. Deviations require coordinator adjudication — STOP and report, never improvise.

**Goal:** the 137 tool interiors read as the same product as the R2 chrome. One palette, one spacing rhythm,
one set of interior molecules, width that fits each tool's shape.

**Evidence base (recon):** interiors reference `--bt-*` **zero** times; 139/157 components build on stock-shadcn
zinc (Card 139, `text-muted-foreground` 129, `bg-muted` 84). Every shadcn primitive routes through ~15 HSL
variables in `src/app/globals.css`. Nothing inside tools self-caps width; the shell is the only width lever.
Dead space at 1920: 394px/side. Width appetite: ~70 NARROW / ~45 MEDIUM / ~20 WIDE.

## F1 — Token bridge (the one-file re-skin; DO FIRST)

Redefine the shadcn HSL triplets in `src/app/globals.css` (`:root` AND `.dark`) as the HSL-triplet
transcode of their `--bt-*` counterparts. Mapping (light → from design-tokens.css values; dark analogues
from the `.dark` block):

| shadcn var | takes the value of | note |
|---|---|---|
| `--background` | `--bt-bg` | #fcfcfb → `60 14% 99%` (verify exact conversion) |
| `--foreground` | `--bt-ink` | |
| `--card` / `--popover` | `--bt-surface` | |
| `--card-foreground` / `--popover-foreground` | `--bt-ink` | |
| `--muted` | `--bt-fill` | |
| `--muted-foreground` | `--bt-muted` | |
| `--primary` | `--bt-ink` (buttons read as ink, matching pillDark) | `--primary-foreground` = `--bt-bg` |
| `--secondary` | `--bt-fill` | `--secondary-foreground` = `--bt-ink` |
| `--accent` | `--bt-fill-hover` | `--accent-foreground` = `--bt-ink` |
| `--border` / `--input` | `--bt-line` **flattened to opaque** (rgba hairline → nearest opaque triplet on bg) | close-not-identical accepted |
| `--ring` | `--bt-accent` | |
| `--destructive` | keep current red pair | out of bt palette by design |

Rules: compute triplets from the actual hex values (don't guess); comment each line with its bt source;
the `--bt-*` block itself is untouched; visual verify light AND dark on 5 Card-heavy tools before commit.

## F2 — Width variant

- `ToolShell` gains `width?: "default" | "wide"`. Wide = `max-inline-size: min(100%, 1180px)`, still centered.
  Default stays 880. Under wide: Related grid allows 4-up (auto-fill), the layout's SEO zone gets
  `max-w-5xl` (needs a signal from shell to layout — a data attribute on the shell root that the
  layout zone styles against is acceptable).
- Registry: apply `width="wide"` to exactly these 24 call sites — WIDE bucket: expense-tracker, invoice,
  periodic-table, spreadsheet, charts, mermaid, mind-map, photo-collage, code-screenshot, model-comparison,
  prompt-library, habit-tracker, world-clock, json-schema-builder, mcp-config, signature-maker, depth-map,
  object-cutout, photo-censor, barcode-scanner; plus cramped MEDIUM: json-formatter, markdown-html,
  css-gradient, qr-generator.
- RTL and <900px behavior unchanged; the exactly-one-h1 smoke gate must stay green.

## F3 — Interior molecules (`src/components/shared/`) + utils

All styled via `var(--bt-*)` directly (CSS modules, logical properties, both themes), consistent with
ToolTile/FileDropzone. APIs small; every molecule ships with a unit test.

| Component | API sketch | Replaces (recon counts) |
|---|---|---|
| `OutputPanel` | `{title?, text, filename?, mime?, children?}` → mono block + CopyButton + download via lib/download | ~60 hand-rolled result panels |
| `SettingsCard` + `OptionRow` | Card shell (ONE padding rule: 20px inline, 16px block) + `OptionRow {label, hint?, htmlFor?, children}` | 71 Card+label patterns |
| `SliderRow` | `{label, value, display?, onChange, min, max, step?}` label + slider + live value | 23 |
| `StatStrip` | row of `{label, value}` — SUPERSEDES ControlStat visual (keep ControlStat working; StatStrip is the interior version) | 18 |
| `ModePicker` | segmented control `{options: {value,label}[], value, onChange}` — replaces Tabs-as-mode-picker where trivially compatible | 38 |
| `TwoPane` | responsive input/output split (stack <720px container) | ~40 editors |

Utils in `src/lib/format.ts`: `formatBytes(n)`, `formatPercent(n, digits?)` — port the best existing copy,
test, then sweep the 6 `formatBytes` copies + inline call sites in batches (not in F3).

## Batch rules (Phase D)

Per tool: adopt bridge-inherited primitives as-is where they already look right; swap hand-rolled
molecules for the shared ones where the swap is behavior-identical; normalize padding to the SettingsCard
scale; kill component-local hex/gray classes (`text-gray-*`, `slate-*`, raw hex) in favor of semantic
classes or bt vars. NO functional changes; existing tests unmodified (report any invalidated by intentional
markup changes). Bespoke keeps require per-tool justification. Full gates per batch (unit, tsc, build,
138-smoke, RTL+dark spot-checks ×2).

## Exit gate

Zero `text-gray-|slate-|#[0-9a-f]{6}` color literals inside tool components (grep-enforced, allowlist for
genuine content like color-picker swatch data); molecules adopted at the recon counts ±20%; all 24 wide
tools verified at 1440+1920; unit+smoke+e2e green; RTL + dark full pass.

## Post-review amendments (coordinator, after foundation approval)
- Light `--bt-muted` darkened #8a8a85 → #757570 (4.5:1 AA on surface; review finding I-1). Bridge transcode synced.
- StatStrip's value-above-caption order is DELIBERATE (conventional stat-card reading); ControlStat keeps caption-above-value in the controls bar. Not a defect (M-2).
- ModePicker dark-mode indicator lifts with --bt-fill-hover (M-3).
- Pilot review precedents RATIFIED: Tabs→ModePicker only when panels structurally identical AND options fit narrow containers (see ModePicker overflow fix); shell ControlsBar keeps global controls — SettingsCard only for hand-rolled body options; computed explanations → titled SettingsCard prose; OutputPanel owns copy+download (controls-bar copy deduped).
