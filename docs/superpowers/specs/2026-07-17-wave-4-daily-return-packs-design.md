# Wave 4 — Daily-return packs (spec)

**Date:** 2026-07-17 · **Branch:** `wave-4-daily-return-packs` (off main @225ed8d) · **Roadmap:** §5 Wave 4 · **Design contract:** R3 interior contract (binding)

**Goal:** add tools people return to on a schedule — a teacher/classroom pack and a word-game solver set — to fill out the sparse **School & Learning** category and give the site recurring, shareable daily-use surface. Seven new tools across two independent clusters, shipped as one wave.

## 1. Clusters

### 1.1 Teacher pack (4 tools)
| Tool | Slug | What it does |
|---|---|---|
| **Wheel of Names** | `wheel-of-names` | Paste names → visual spinning canvas wheel → winner. Options: remove-winner-after-spin, shuffle, sound on/off. Absorbs the job of RandomPicker's List tab (see §4). |
| **Random Group Maker** | `group-maker` | Paste names → split into **N groups** or **groups of size M** (mode toggle). Shuffle, print-friendly result. |
| **Bingo Card Generator** | `bingo-card-generator` | Two modes: **classic number bingo** (1–75, standard B/I/N/G/O column ranges, free center) and **custom-word bingo** (paste a word/term pool → NxN cards). Generate 1–N unique cards; print via print stylesheet. |
| **Classroom Timer** | `classroom-timer` | A **preset landing variant of the existing Timer** — boots into a large, fullscreen-ready countdown. No new timer logic (§3). |

### 1.2 Word-game solvers (3 tools, one shared dictionary engine)
| Tool | Slug | What it does |
|---|---|---|
| **Word Unscrambler** | `word-unscrambler` | Letters (+ optional min/exact length, contains-letter filter) → all valid dictionary words, grouped by length descending. |
| **Wordle Solver** | `wordle-solver` | Green (position-locked), yellow (present, wrong spot), gray (absent) constraints → candidate 5-letter words, ranked by letter-frequency commonness. |
| **Anagram Solver** | `anagram-solver` | Letters → exact-length anagrams and (optionally) shorter sub-anagrams. |

## 2. Shared foundations

### 2.1 Dictionary engine — `src/lib/word/dictionary.ts`
- Loads a **public-domain** word list from `/public/wordlist.txt` (ENABLE, ~172k words, ~1.7 MB). ENABLE is public domain — do NOT use TWL/SOWPODS (copyrighted Scrabble lists).
- Loaded **on demand** on first solver use (never in the JS bundle): `loadDictionary(): Promise<void>` fetches once, splits to a module-level `Set<string>` (lowercased) plus a precomputed **sorted-letters → words[]** map for anagram/unscramble lookups. Idempotent; concurrent callers share one in-flight promise.
- Pure query surface (unit-testable with an injected small word set — the functions take an optional `dict` param defaulting to the loaded singleton):
  - `isWord(w)`, `unscramble(letters, opts)`, `anagramsOf(letters, {allowShorter})`, `wordleMatches({greens, yellows, grays})`.
- Wordle needs 5-letter words: derive a 5-letter subset from the same list at load (no separate asset).
- Loading/error states surfaced to each solver via a small hook `useDictionary()` (status: idle/loading/ready/error) so the UI can show a one-time "loading dictionary…" and an honest error if the fetch fails.

### 2.2 Canvas wheel — `src/components/shared/SpinWheel.tsx`
- Reusable segmented wheel: takes `labels: string[]`, draws equal segments with category-token colors, spins with eased deceleration to a **uniformly-random** target index, fires `onResult(index)`. Draw math (segment angles, target→rotation) split into a pure helper `src/lib/wheel.ts` for unit tests; the component owns rAF + canvas only.
- Respects `prefers-reduced-motion` (snap to result, no spin animation).

### 2.3 Content colours (R3)
Wheel segment fills and bingo cell states are CONTENT (the tool's data/visual) — inline styles allowed per the R3 content-colour exception. All other chrome uses `var(--bt-*)` tokens.

## 3. Classroom Timer — preset mechanism
- `Timer.tsx` currently takes no props. Add an optional preset prop following the W1/W2 pattern: `Timer({ slug = "timer", preset }: { slug?: string; preset?: { mode?: "countdown"; seconds?: number; autoFullscreenHint?: boolean } })`. Default (no preset) is byte-identical to today.
- `classroom-timer` is a `landingFor: "timer"` variant with `inGrid: true` (a distinct intent — the W3-era Tests/Games + classroom use — that surfaces as its own card, per the PR #45 convention). Route: `page.tsx` renders `<Timer slug="classroom-timer" preset={{ mode: "countdown", autoFullscreenHint: true }} />`.
- Add `classroom-timer` to `tool-popularity.ts` so it isn't buried (inGrid variants must be ranked — PR #45 lesson).
- Existing Timer tests stay green; add one asserting the preset boots countdown mode.

## 4. RandomPicker consolidation
- RandomPicker keeps Numbers / Dice / Coin. Its **List tab** is **demoted, not deleted**: the tab content becomes a short pointer card ("Picking a name? Try **Wheel of Names** →" linking `/tools/wheel-of-names`) so no user hits a dead end and there's a single canonical name-picker. The list-picking state/logic is removed from RandomPicker (Wheel of Names owns it).
- Update RandomPicker's tests: the List tab no longer performs a draw; it renders the pointer.

## 5. Placement, config, SEO
- **School & Learning** (`schoolLearning`) gains: Wheel of Names, Group Maker, Bingo Card Generator, Classroom Timer. **Word solvers** (unscrambler, wordle, anagram) go in **`textLanguage`** (Text & Language) — they are word/letter processors alongside the existing text-counter / text-case / word-frequency tools — grouped contiguously by adjacent `order` values.
- `tools-config` entries: field order `name→href→icon→available→order→creationDate→…`; distinct icons each (no shared icon — PR #45 lesson). Word-solvers and teacher tools are **real grid tools** (not `landingFor`), except `classroom-timer` which is `landingFor:"timer"` + `inGrid`.
- `ToolsConfig.tools.<slug>` (name + description) AND `Tools.<Component>` UI strings in **all 9 locales** (en + English-placeholder parity in component tasks, then one 8-agent fan-out translates from a generated manifest — W1 pattern). Locale-parity invariant: every new en.json key needs same-key copies in all 8 others or tsc fails.
- Bespoke `src/lib/tool-content.ts` (en+ar) per new slug: intro/FAQ/steps/related, each naming its own scenarios (wheel→classroom draws/giveaways; group-maker→team/breakout assignment; bingo→classroom review games/events; unscrambler & anagram→word-game help; wordle→daily puzzle). §7 substance guardrail.
- OG/twitter images per route; e2e `tool-routes.json` regenerated AFTER pages exist; sitemap automatic.
- README tool list updated for the new **grid** tools (validate-tools.js cross-checks README↔config and excludes `landingFor`; classroom-timer stays out, the other 6 go in). This bit us in W1 — do not skip.

## 6. Blog (en + ar)
1. `wheel-of-names-classroom-tools` — the teacher pack roundup (wheel, groups, bingo, timer), classroom scenarios, all client-side/printable.
2. `word-unscrambler-anagram-wordle-solver` — the word-solver roundup, honest about being a dictionary lookup (helps you find words; not cheating-as-a-service framing).

## 7. Testing & gates
- Unit: dictionary engine (isWord/unscramble/anagram/wordle against an injected fixture set — NOT the 1.7MB asset); `wheel.ts` draw+target math; group-split (N-groups and size-M, remainder distribution, shuffle determinism via injected RNG); bingo card generation (uniqueness within a card, column ranges for number mode, NxN for word mode); each solver component (input → results render). RandomPicker updated. Timer preset test.
- The dictionary asset is NOT imported in tests (keeps them fast/offline); components mock `useDictionary` to `ready` with a small set.
- Per-task gates: `bun run test` · `bunx tsc --noEmit` · `bun run lint` · `bun run validate` · `CI=true bun run build` · `CI=true bun run e2e:smoke`. Zero breakage to Timer's default behavior or RandomPicker's Numbers/Dice/Coin.
- Final wave: whole-branch review (most capable model) → fix round → manual browser smoke (dark/RTL/mobile, one wheel spin, one bingo print preview, one solver query) → PR with behavior-change disclosures (RandomPicker List tab demotion).

## 8. Out of scope
Multiplayer/shared wheels, saving/accounts, non-English dictionaries for the solvers (English list only this wave), bingo daubing/gameplay (generation + print only), picture bingo.
