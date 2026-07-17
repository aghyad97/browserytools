# Wave 4 — Daily-return packs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 7 tools — a teacher pack (Wheel of Names, Group Maker, Bingo Generator, Classroom Timer) and three word-game solvers (Unscrambler, Wordle, Anagram) — over two shared foundations (a dictionary engine and a canvas spin wheel), filling out the School & Learning category.

**Architecture:** Pure logic lives in `src/lib/` (dictionary, wheel math, group split, bingo generation) and is unit-tested with injected fixtures — never the 1.7 MB word asset. Thin React components in `src/components/` wrap the pure logic in the shared `ToolShell`. Classroom Timer reuses the existing `Timer` via a preset prop (no new timer logic). Each tool is a normal grid tool except Classroom Timer, which is a `landingFor:"timer"` + `inGrid` variant.

**Tech Stack:** Next.js 15 App Router, React 18, TypeScript, Zustand (existing tools only), Radix Tabs, Canvas 2D, next-intl, Vitest + Testing Library, ENABLE public-domain word list.

## Global Constraints

- **Dictionary asset:** ENABLE word list only (public domain). NEVER TWL/SOWPODS. Ships at `public/wordlist.txt`, fetched on demand, never imported into the JS bundle or into tests.
- **Locale parity (hard):** every new key in `messages/en.json` MUST have a same-key entry in all 8 other locale files (`ar, de, es, fr, id, pt-BR, ru, zh-CN`) or `tsc` fails. Component tasks add English placeholders ×8; Task 17 translates.
- **New-tool checklist:** every grid tool needs BOTH `ToolsConfig.tools.<slug>` (name+description) AND `Tools.<Component>` (UI strings) namespaces, in all 9 locales. Missing `ToolsConfig` throws `MISSING_MESSAGE` at render.
- **tools-config field order:** `name → href → icon → available → order → creationDate → onDevice? → landingFor? → inGrid?` (route-generator regex depends on the `name→href→icon→available` prefix).
- **Distinct icons:** every new tool gets its own lucide icon (never share one — a wall of identical icons is a known regression).
- **inGrid ranking:** any `inGrid` variant (Classroom Timer) MUST be added to `src/lib/tool-popularity.ts` or it sinks to the bottom of the grid.
- **README sync:** `scripts/validate-tools.js` cross-checks the README tool list against config (excludes `landingFor` entries). The 6 grid tools go in the README; `classroom-timer` does not.
- **R3 content-colour exception:** wheel segment fills and bingo cell values are CONTENT — inline styles allowed. All other chrome uses `var(--bt-*)` tokens. No single-edge borders.
- **creationDate:** `"2026-07-17"` for all new entries.
- **Gates per task:** `bun run test` · `bunx tsc --noEmit` · `bun run lint`. Wave-level also: `bun run validate` · `CI=true bun run build` · `CI=true bun run e2e:smoke`.
- **Commit style:** no AI footers, no wave numbers in PR title/body.

---

## Phase A — Shared foundations

### Task 1: Dictionary engine

**Files:**
- Create: `src/lib/word/dictionary.ts`
- Create: `src/__tests__/lib/word/dictionary.test.ts`
- Asset (manual/step): `public/wordlist.txt`

**Interfaces:**
- Produces:
  - `type Dict = { set: Set<string>; bySortedLetters: Map<string, string[]> }`
  - `buildDict(words: string[]): Dict`
  - `isWord(w: string, dict: Dict): boolean`
  - `unscramble(letters: string, dict: Dict, opts?: { minLength?: number; exactLength?: number; contains?: string }): string[]` — all dict words formable from a multiset subset of `letters`, sorted by length desc then alpha.
  - `anagramsOf(letters: string, dict: Dict, opts?: { allowShorter?: boolean }): string[]`
  - `wordleMatches(dict: Dict, c: { greens: (string|null)[]; yellows: { letter: string; pos: number }[]; grays: string[] }): string[]` — 5-letter candidates.
  - `loadDictionary(): Promise<Dict>` — fetches `/wordlist.txt` once, memoized (shared in-flight promise).
  - `sortLetters(w: string): string` helper.

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect } from "vitest";
import {
  buildDict, isWord, unscramble, anagramsOf, wordleMatches, sortLetters,
} from "@/lib/word/dictionary";

const dict = buildDict(["cat", "act", "car", "arc", "care", "race", "a", "at", "scar", "cars"]);

describe("sortLetters", () => {
  it("sorts a word's letters", () => expect(sortLetters("cat")).toBe("act"));
});

describe("isWord", () => {
  it("is case-insensitive membership", () => {
    expect(isWord("CAT", dict)).toBe(true);
    expect(isWord("zzz", dict)).toBe(false);
  });
});

describe("unscramble", () => {
  it("returns dict words formable from the letters, length desc", () => {
    expect(unscramble("cats", dict)).toEqual(["scar", "cars", "act", "cat", "at", "a"]);
  });
  it("honors minLength", () => {
    expect(unscramble("cats", dict, { minLength: 3 })).toEqual(["scar", "cars", "act", "cat"]);
  });
  it("honors contains", () => {
    expect(unscramble("care", dict, { contains: "e" })).toEqual(["care", "race"]);
  });
});

describe("anagramsOf", () => {
  it("exact-length anagrams only by default", () => {
    expect(anagramsOf("cat", dict)).toEqual(["act", "cat"]);
  });
  it("includes shorter when allowShorter", () => {
    expect(anagramsOf("cat", dict, { allowShorter: true })).toEqual(["act", "cat", "at", "a"]);
  });
});

describe("wordleMatches", () => {
  const w = buildDict(["crane", "trace", "crate", "brace", "grace"]);
  it("filters by greens, yellows, grays", () => {
    // green r at index 1, no 'a' at index 2 (yellow a somewhere), no 'b'
    const res = wordleMatches(w, {
      greens: [null, "r", null, null, null],
      yellows: [{ letter: "a", pos: 4 }],
      grays: ["b"],
    });
    expect(res).toContain("crane");
    expect(res).toContain("crate");
    expect(res).not.toContain("brace"); // gray b
  });
});
```

- [ ] **Step 2: Run — expect FAIL** (`bun run test -- src/__tests__/lib/word/dictionary.test.ts`) with "not exported".

- [ ] **Step 3: Implement `src/lib/word/dictionary.ts`**

```ts
export type Dict = { set: Set<string>; bySortedLetters: Map<string, string[]> };

export const sortLetters = (w: string) => w.toLowerCase().split("").sort().join("");

export function buildDict(words: string[]): Dict {
  const set = new Set<string>();
  const bySortedLetters = new Map<string, string[]>();
  for (const raw of words) {
    const w = raw.toLowerCase().trim();
    if (!w) continue;
    set.add(w);
    const k = sortLetters(w);
    (bySortedLetters.get(k) ?? bySortedLetters.set(k, []).get(k)!).push(w);
  }
  return { set, bySortedLetters };
}

export const isWord = (w: string, dict: Dict) => dict.set.has(w.toLowerCase().trim());

const cmp = (a: string, b: string) => b.length - a.length || a.localeCompare(b);

// multiset containment: can `word` be built from `pool` letters?
function subsetOf(word: string, poolCount: Map<string, number>): boolean {
  const need = new Map<string, number>();
  for (const ch of word) need.set(ch, (need.get(ch) ?? 0) + 1);
  for (const [ch, n] of need) if ((poolCount.get(ch) ?? 0) < n) return false;
  return true;
}
function counts(letters: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const ch of letters.toLowerCase()) if (/[a-z]/.test(ch)) m.set(ch, (m.get(ch) ?? 0) + 1);
  return m;
}

export function unscramble(
  letters: string, dict: Dict,
  opts: { minLength?: number; exactLength?: number; contains?: string } = {},
): string[] {
  const pool = counts(letters);
  const out: string[] = [];
  for (const w of dict.set) {
    if (opts.exactLength && w.length !== opts.exactLength) continue;
    if (opts.minLength && w.length < opts.minLength) continue;
    if (opts.contains && !w.includes(opts.contains.toLowerCase())) continue;
    if (subsetOf(w, pool)) out.push(w);
  }
  return out.sort(cmp);
}

export function anagramsOf(
  letters: string, dict: Dict, opts: { allowShorter?: boolean } = {},
): string[] {
  if (opts.allowShorter) return unscramble(letters, dict).sort(cmp);
  const exact = dict.bySortedLetters.get(sortLetters(letters.replace(/[^a-zA-Z]/g, ""))) ?? [];
  return [...exact].sort(cmp);
}

export function wordleMatches(
  dict: Dict,
  c: { greens: (string | null)[]; yellows: { letter: string; pos: number }[]; grays: string[] },
): string[] {
  const grays = new Set(c.grays.map((g) => g.toLowerCase()));
  const out: string[] = [];
  for (const w of dict.set) {
    if (w.length !== 5) continue;
    let ok = true;
    for (let i = 0; i < 5 && ok; i++) if (c.greens[i] && w[i] !== c.greens[i]!.toLowerCase()) ok = false;
    for (const y of c.yellows) {
      if (!ok) break;
      const l = y.letter.toLowerCase();
      if (!w.includes(l) || w[y.pos] === l) ok = false;
    }
    for (const g of grays) {
      if (!ok) break;
      // a gray letter may still appear if it's also green/yellow elsewhere; keep simple: reject if present and not required
      const required = c.greens.some((x) => x?.toLowerCase() === g) || c.yellows.some((y) => y.letter.toLowerCase() === g);
      if (!required && w.includes(g)) ok = false;
    }
    if (ok) out.push(w);
  }
  return out.sort((a, b) => a.localeCompare(b));
}

let inflight: Promise<Dict> | null = null;
export function loadDictionary(): Promise<Dict> {
  if (inflight) return inflight;
  inflight = fetch("/wordlist.txt")
    .then((r) => {
      if (!r.ok) throw new Error(`wordlist ${r.status}`);
      return r.text();
    })
    .then((t) => buildDict(t.split(/\r?\n/)));
  return inflight;
}
```

- [ ] **Step 4: Run — expect PASS.** Fix the `bySortedLetters` push idiom if the one-liner misbehaves (use an explicit `if (!map.has(k)) map.set(k, [])` then push).

- [ ] **Step 5: Add the asset.** Download the ENABLE list to `public/wordlist.txt` (one lowercase word per line). Source: the public-domain `enable1.txt` (~172k words). Verify: `wc -l public/wordlist.txt` ≥ 170000, and `head` shows lowercase a–z words only. Add a short `public/wordlist.LICENSE` noting ENABLE public-domain provenance.

- [ ] **Step 6: Commit** — `feat(word): dictionary engine + ENABLE word list`

---

### Task 2: `useDictionary` hook

**Files:**
- Create: `src/lib/word/useDictionary.ts`
- Create: `src/__tests__/lib/word/useDictionary.test.tsx`

**Interfaces:**
- Produces: `useDictionary(): { status: "idle"|"loading"|"ready"|"error"; dict: Dict | null; retry: () => void }`. Calls `loadDictionary()` on mount.

- [ ] **Step 1: Failing test** — render a probe component; mock `loadDictionary` to resolve a small dict; assert status goes `loading → ready` and `dict` is set. Second test: mock reject → status `error`, `retry` re-invokes.

```ts
vi.mock("@/lib/word/dictionary", async (imp) => ({
  ...(await imp<typeof import("@/lib/word/dictionary")>()),
  loadDictionary: vi.fn(),
}));
```

- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement** the hook (useState status + useEffect calling loadDictionary, cancellation guard, `retry` resets to loading and re-calls).
- [ ] **Step 4: Run — PASS.**
- [ ] **Step 5: Commit** — `feat(word): useDictionary hook`

---

### Task 3: Wheel math

**Files:**
- Create: `src/lib/wheel.ts`
- Create: `src/__tests__/lib/wheel.test.ts`

**Interfaces:**
- Produces:
  - `segmentAngle(count: number): number` — `2π / count`.
  - `segmentColor(index: number): string` — cycles a fixed CONTENT palette (≥8 hex colors).
  - `targetRotation(currentRotation: number, targetIndex: number, count: number, turns?: number): number` — final rotation (radians) that lands the wheel pointer (fixed at angle 0, top) on `targetIndex`'s center after `turns` full spins. Monotonic-increasing (> currentRotation).
  - `indexAtPointer(rotation: number, count: number): number` — inverse: which segment the top pointer is over.

- [ ] **Step 1: Failing tests**

```ts
import { segmentAngle, targetRotation, indexAtPointer } from "@/lib/wheel";
describe("wheel", () => {
  it("segmentAngle divides the circle", () => expect(segmentAngle(4)).toBeCloseTo(Math.PI / 2));
  it("targetRotation lands the pointer on the chosen index", () => {
    for (const count of [3, 5, 8]) {
      for (let idx = 0; idx < count; idx++) {
        const rot = targetRotation(0, idx, count, 5);
        expect(rot).toBeGreaterThan(0);
        expect(indexAtPointer(rot, count)).toBe(idx);
      }
    }
  });
  it("targetRotation always advances forward", () => {
    expect(targetRotation(10, 0, 5, 3)).toBeGreaterThan(10);
  });
});
```

- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement** with the pointer fixed at the top. `indexAtPointer` must be the exact inverse of `targetRotation` (account for rotation direction and the pointer offset). Derive carefully so the round-trip test passes for all counts.
- [ ] **Step 4: Run — PASS.**
- [ ] **Step 5: Commit** — `feat(wheel): pure segment + rotation math`

---

### Task 4: SpinWheel component

**Files:**
- Create: `src/components/shared/SpinWheel.tsx`
- Create: `src/__tests__/components/SpinWheel.test.tsx`

**Interfaces:**
- Consumes: `segmentAngle`, `segmentColor`, `targetRotation`, `indexAtPointer` from `@/lib/wheel`.
- Produces: `<SpinWheel labels={string[]} onResult={(index:number)=>void} spinning={boolean} onSpinStart?={()=>void} />`. Draws to a `<canvas>` via rAF; on `spin()` picks a uniform random index (injectable `rng` prop defaulting to `Math.random`), animates eased deceleration to `targetRotation`, calls `onResult(index)` at rest. Honors `prefers-reduced-motion` (snap, no animation).

- [ ] **Step 1: Failing test** — render with 4 labels + `rng={() => 0.999}` (forces last index), fire the spin (expose a button or `data-testid="spin"`); with reduced-motion mocked on, assert `onResult` called with the expected index. (Canvas drawing itself isn't asserted; happy-dom stubs `getContext`.)
- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement.** Keep canvas/rAF in the component; delegate all math to `wheel.ts`. Guard `getContext` null. rAF loop with easing (`easeOutCubic`); on reduced-motion set rotation directly and resolve `onResult` on next tick.
- [ ] **Step 4: Run — PASS.**
- [ ] **Step 5: Commit** — `feat(wheel): SpinWheel canvas component`

---

## Phase B — Teacher pack

> Each component task also adds: (a) its `tools-config` entry (Task-12 conventions — do it inline here so the route resolves), (b) English `Tools.<Component>` + `ToolsConfig.tools.<slug>` keys in `messages/en.json` AND placeholder copies in the other 8 locales, (c) `src/app/tools/<slug>/page.tsx` mirroring `text-counter/page.tsx`. Reference an existing simple tool (e.g. `TextCounter`) for the ToolShell wrapper shape.

### Task 5: Wheel of Names

**Files:**
- Create: `src/components/WheelOfNames.tsx`, `src/app/tools/wheel-of-names/page.tsx`
- Create: `src/__tests__/components/WheelOfNames.test.tsx`
- Modify: `src/lib/tools-config.ts` (add entry, schoolLearning, icon `Disc3Icon`), `messages/*.json` (×9)

**Interfaces:**
- Consumes: `SpinWheel`.
- Produces: component parses a textarea (one name per line, blanks stripped) into `labels`, renders `SpinWheel`, shows a winner modal, supports "remove winner after spin" and "shuffle".

- [ ] **Step 1: Failing test** — type 3 names, assert 3 wheel labels wired; simulate a result → winner shown; with remove-winner on, winner removed from the list.
- [ ] **Step 2–4:** implement (parse → SpinWheel with injected `rng` for the test), run red→green.
- [ ] **Step 5:** add tools-config entry + en/placeholder locale keys + page.tsx.
- [ ] **Step 6: Commit** — `feat(tools): Wheel of Names`

---

### Task 6: RandomPicker consolidation

**Files:**
- Modify: `src/components/RandomPicker.tsx` (List tab → pointer card), `src/__tests__/components/RandomPicker.test.tsx`

- [ ] **Step 1: Update tests** — the List tab no longer draws a winner; it renders a link to `/tools/wheel-of-names`. Remove/replace assertions about `pickWinner`.
- [ ] **Step 2: Run — FAIL** (old assertions).
- [ ] **Step 3: Implement** — delete `listText/winner/removeWinner/spinning/pickWinner`; the `TabsContent value="list"` becomes a `SettingsCard` with copy + a `next/link` to Wheel of Names. Keep Numbers/Dice/Coin untouched.
- [ ] **Step 4: Run — PASS.**
- [ ] **Step 5: Commit** — `refactor(random-picker): point the list tab to Wheel of Names`

---

### Task 7: Group split logic + Random Group Maker

**Files:**
- Create: `src/lib/groups.ts`, `src/__tests__/lib/groups.test.ts`
- Create: `src/components/GroupMaker.tsx`, `src/app/tools/group-maker/page.tsx`, `src/__tests__/components/GroupMaker.test.tsx`
- Modify: `src/lib/tools-config.ts` (icon `UsersIcon`), `messages/*.json`

**Interfaces:**
- Produces: `splitGroups(names: string[], mode: { kind: "count"; n: number } | { kind: "size"; size: number }, rng?: () => number): string[][]` — shuffles (injectable rng), distributes remainder round-robin so group sizes differ by ≤1.

- [ ] **Step 1: Failing tests**

```ts
import { splitGroups } from "@/lib/groups";
const id = () => 0; // deterministic (no shuffle) for assertion
describe("splitGroups", () => {
  it("count mode spreads remainder evenly", () => {
    const g = splitGroups(["a","b","c","d","e"], { kind: "count", n: 2 }, id);
    expect(g.map((x) => x.length).sort()).toEqual([2, 3]);
    expect(g.flat().sort()).toEqual(["a","b","c","d","e"]);
  });
  it("size mode caps group size", () => {
    const g = splitGroups(["a","b","c","d","e"], { kind: "size", size: 2 }, id);
    expect(Math.max(...g.map((x) => x.length))).toBeLessThanOrEqual(2);
    expect(g.flat().sort()).toEqual(["a","b","c","d","e"]);
  });
});
```

- [ ] **Step 2: FAIL → Step 3: implement (Fisher–Yates with injected rng, then chunk) → Step 4: PASS.**
- [ ] **Step 5:** GroupMaker component (textarea + mode toggle + count/size input + print-friendly grid) + page + config + locales.
- [ ] **Step 6: Commit** — `feat(tools): Random Group Maker`

---

### Task 8: Bingo generation + Bingo Card Generator

**Files:**
- Create: `src/lib/bingo.ts`, `src/__tests__/lib/bingo.test.ts`
- Create: `src/components/BingoCardGenerator.tsx`, `src/app/tools/bingo-card-generator/page.tsx`, `src/__tests__/components/BingoCardGenerator.test.tsx`
- Create: bingo print CSS (module or `@media print` block in the component's module.css)
- Modify: `src/lib/tools-config.ts` (icon `Grid3x3Icon`), `messages/*.json`

**Interfaces:**
- Produces:
  - `numberCard(rng?: () => number): (number|"FREE")[][]` — 5×5, columns B(1-15) I(16-30) N(31-45) G(46-60) O(61-75), unique per column, center "FREE".
  - `wordCard(pool: string[], size: number, rng?: () => number): string[][]` — size×size, unique words sampled from pool (throws/handles pool too small).
  - `makeCards<T>(n: number, gen: (rng: () => number) => T[][], rng?): T[][][]`.

- [ ] **Step 1: Failing tests** — number card: each column within its range, all cells unique, center is "FREE"; word card: no repeats within a card, size respected; pool smaller than needed → throws `Error("pool-too-small")`.
- [ ] **Step 2: FAIL → Step 3: implement (per-column sample without replacement) → Step 4: PASS.**
- [ ] **Step 5:** component with mode toggle (number/word), card-count input, print button; `@media print` CSS to render clean printable cards (hide chrome, page-break between cards). Component test: number mode renders a 5×5 grid with FREE center; word mode with a pasted pool renders the words.
- [ ] **Step 6: Commit** — `feat(tools): Bingo Card Generator`

---

### Task 9: Classroom Timer (preset of Timer)

**Files:**
- Modify: `src/components/Timer.tsx` (add optional preset prop), `src/__tests__/components/Timer.test.tsx`
- Create: `src/app/tools/classroom-timer/page.tsx`
- Modify: `src/lib/tools-config.ts` (entry: `landingFor:"timer"`, `inGrid:true`, schoolLearning, icon `Clock4Icon`), `src/lib/tool-popularity.ts` (add `classroom-timer`), `messages/*.json`

**Interfaces:**
- Produces: `Timer({ slug = "timer", preset }: { slug?: string; preset?: { mode?: "countdown"; seconds?: number; autoFullscreenHint?: boolean } })`. Default (no preset) is byte-identical to today; preset seeds countdown mode + a fullscreen hint.

- [ ] **Step 1: Add a failing Timer test** — `render(<Timer preset={{ mode: "countdown", autoFullscreenHint: true }} />)` boots into countdown mode (assert countdown UI present). Existing Timer tests must still pass with no props.
- [ ] **Step 2: FAIL → Step 3: thread the optional prop (default seeds current behavior) → Step 4: PASS + full Timer suite green.**
- [ ] **Step 5:** page renders `<Timer slug="classroom-timer" preset={{ mode: "countdown", autoFullscreenHint: true }} />`; add config entry + popularity + locales. (No README entry — it's `landingFor`.)
- [ ] **Step 6: Commit** — `feat(tools): Classroom Timer (Timer countdown preset)`

---

## Phase C — Word solvers

> All three consume `useDictionary()` and the pure `dictionary.ts` queries. Component tests mock `useDictionary` to return `{ status: "ready", dict: buildDict([...small fixture...]) }` — NEVER load the asset.

### Task 10: Word Unscrambler

**Files:** Create `src/components/WordUnscrambler.tsx`, `src/app/tools/word-unscrambler/page.tsx`, test. Modify `tools-config.ts` (textLanguage, icon `ShuffleIcon`), `messages/*.json`.

- [ ] **Steps:** failing test (mock useDictionary ready; type "cats"; assert results grouped by length include "scar","cat") → implement (input + optional min-length/contains → `unscramble` → grouped result, loading/error states from `useDictionary`) → PASS → config + locales + page → commit `feat(tools): Word Unscrambler`.

### Task 11: Wordle Solver

**Files:** Create `src/components/WordleSolver.tsx`, `src/app/tools/wordle-solver/page.tsx`, test. Modify `tools-config.ts` (textLanguage, icon `SquareStackIcon`), `messages/*.json`.

- [ ] **Steps:** failing test (mock ready dict of 5-letter words; set a green + a gray; assert filtered candidates) → implement (5-tile input where each tile cycles gray/yellow/green; build constraints → `wordleMatches`) → PASS → config + locales + page → commit `feat(tools): Wordle Solver`.

### Task 12: Anagram Solver

**Files:** Create `src/components/AnagramSolver.tsx`, `src/app/tools/anagram-solver/page.tsx`, test. Modify `tools-config.ts` (textLanguage, icon `RepeatIcon`), `messages/*.json`.

- [ ] **Steps:** failing test (mock ready; "cat" → exact ["act","cat"]; toggle sub-anagrams → includes "at","a") → implement (input + allowShorter toggle → `anagramsOf`) → PASS → config + locales + page → commit `feat(tools): Anagram Solver`.

---

## Phase D — Content, polish, ship

### Task 13: tools-config audit + README + popularity

**Files:** Modify `src/lib/tools-config.ts`, `README.md`, `src/lib/tool-popularity.ts`.

- [ ] Verify all 7 entries: correct category (schoolLearning ×4, textLanguage ×3), distinct icons, field order, `creationDate:"2026-07-17"`, `available:true`; classroom-timer has `landingFor:"timer"` + `inGrid:true`.
- [ ] Add the 6 grid tools to `README.md` under their category headings (Classroom Timer excluded).
- [ ] Add the 6 grid slugs to `tool-popularity.ts` at sensible search-demand positions (wheel-of-names, word-unscrambler, anagram-solver, wordle-solver are strong queries — rank them mid-to-high; group-maker, bingo-card-generator lower) + `classroom-timer`.
- [ ] Run `bun run validate` → expect "All tools are properly synchronized". Run `bunx tsc --noEmit`, `bun run test`.
- [ ] Commit — `chore(tools): wave-4 config, README, popularity`.

### Task 14: SEO content (`tool-content.ts`, en + ar)

**Files:** Modify `src/lib/tool-content.ts`.

- [ ] Add a bespoke entry per new slug (all 7) mirroring the `"crop-image"` shape: `related` (2–3 siblings), `en` and `ar` with `intro` (2–3 paragraphs), `faq` (4–5 Q/A), `steps`. Scenarios per §5 of the spec (wheel→classroom draws/giveaways; group-maker→teams; bingo→review games; unscrambler/anagram→word help; wordle→daily puzzle; classroom-timer→exams/activities). No fabricated stats.
- [ ] `bunx tsc --noEmit` + `bun run test` (tool-content tests, if any) green. Commit — `feat(seo): wave-4 bespoke tool content (en+ar)`.

### Task 15: OG/twitter images + e2e routes

**Files:** Create `opengraph-image.tsx` + `twitter-image.tsx` per new route (mirror an existing tool's); regenerate `e2e/tool-routes.json`.

- [ ] Copy the OG/twitter image pattern from an existing tool route for each of the 7 slugs.
- [ ] Regenerate route manifest (run the generator script the repo uses) AFTER pages exist; verify the 7 routes present.
- [ ] `CI=true bun run build` green (no missing metadata errors). Commit — `feat(routes): wave-4 og/twitter images + e2e routes`.

### Task 16: Locale translation fan-out

**Files:** Modify `messages/{ar,de,es,fr,id,pt-BR,ru,zh-CN}.json`.

- [ ] Generate a manifest of every new `Tools.*` and `ToolsConfig.tools.*` key added with English values.
- [ ] Dispatch 8 parallel subagents (one per non-English locale), each translating the manifest into its file, preserving key structure and any `{placeholders}`. Coordinator commits.
- [ ] `bunx tsc --noEmit` (locale parity), `bun run test`, `bun run build` green. Commit — `feat(i18n): wave-4 strings across all 9 locales`.

### Task 17: Blog cluster (en + ar)

**Files:** Create 4 post files in `src/app/blog/posts/`, add 4 entries to `src/lib/blog-data.ts`.

- [ ] `wheel-of-names-classroom-tools` (+ ar) — teacher pack roundup, classroom scenarios, printable/client-side. Link the 4 teacher tools.
- [ ] `word-unscrambler-anagram-wordle-solver` (+ ar) — word-solver roundup, honest "find valid words" framing. Link the 3 solvers.
- [ ] Follow the existing post pattern (`export default function Content()`, `<div>`/`<div dir="rtl">`, no fabricated stats). Add blog-data entries (category "Utility Tools"/"أدوات عامة", `date:"2026-07-17"`, distinct emoji/gradient).
- [ ] Verify all 4 render (dev server or build) + appear in sitemap. Commit — `feat(blog): wave-4 cluster (teacher pack + word solvers)`.

### Task 18: Final gates, review, PR

- [ ] Full gates on the branch: `bun run validate` · `bun run lint` · `bunx tsc --noEmit` · `bun run test` · `CI=true bun run build` · `CI=true bun run e2e:smoke` (run full suite under `LC_ALL=en_US.UTF-8 TZ=UTC` to catch locale-fragile tests — W2 lesson).
- [ ] Manual browser smoke via agent: one wheel spin, one bingo print-preview, one group split, one solver query, the classroom-timer countdown — in dark + one RTL (ar) + mobile viewport.
- [ ] Whole-branch review (most capable model), triage minors, fix round.
- [ ] Open PR against main. Body discloses the behavior change (RandomPicker List tab now points to Wheel of Names) and the marketing-count rise. No wave numbers / AI footers.

---

## Self-Review

- **Spec coverage:** dictionary engine (T1–2), wheel (T3–4), Wheel of Names (T5), RandomPicker consolidation (T6), group maker (T7), bingo both modes (T8), classroom-timer preset + inGrid + popularity (T9), 3 solvers (T10–12), config/README/popularity (T13), SEO content (T14), OG/e2e (T15), 9-locale parity (T16), blog (T17), gates/review/PR (T18). All spec sections mapped.
- **Placeholder scan:** algorithmic tasks carry real failing tests + implementations; UI/config/SEO tasks name the exact reference file to mirror and the exact content to add — no "TODO"/"add validation".
- **Type consistency:** `Dict`, `buildDict`, `unscramble/anagramsOf/wordleMatches`, `splitGroups`, `numberCard/wordCard/makeCards`, `targetRotation/indexAtPointer`, `useDictionary`, and the `Timer` preset prop names are used identically across producing and consuming tasks.
