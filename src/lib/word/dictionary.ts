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
    if (!bySortedLetters.has(k)) bySortedLetters.set(k, []);
    bySortedLetters.get(k)!.push(w);
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
