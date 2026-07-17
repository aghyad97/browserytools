/** Pure bingo card generation — number cards (classic B-I-N-G-O) and word
 * cards (custom pool), plus a small helper to batch-generate N cards. All
 * randomness is injectable (`rng()` returns a float in [0, 1)) so callers
 * (and tests) can force a deterministic deal. */

/** Fisher–Yates shuffle with an injectable RNG. */
function shuffle<T>(items: T[], rng: () => number): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/** Samples `count` unique items from `pool` without replacement. */
function sample<T>(pool: T[], count: number, rng: () => number): T[] {
  return shuffle(pool, rng).slice(0, count);
}

export type NumberCell = number | "FREE";

const CARD_SIZE = 5;
const CENTER_INDEX = 2;
const FREE_COLUMN = 2; // "N" column carries the FREE center cell

/** [min, max] inclusive ranges for the B / I / N / G / O columns. */
const COLUMN_RANGES: Array<[number, number]> = [
  [1, 15],
  [16, 30],
  [31, 45],
  [46, 60],
  [61, 75],
];

/**
 * Classic 5x5 bingo card. Each column samples without replacement from its
 * own range (B 1-15, I 16-30, N 31-45, G 46-60, O 61-75); the center cell
 * (row 2, N column) is always `"FREE"`.
 */
export function numberCard(rng: () => number = Math.random): NumberCell[][] {
  const columns: NumberCell[][] = COLUMN_RANGES.map(([min, max], colIndex) => {
    const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    const picked: NumberCell[] = sample(range, CARD_SIZE, rng);
    if (colIndex === FREE_COLUMN) picked[CENTER_INDEX] = "FREE";
    return picked;
  });

  // Transpose columns -> rows.
  return Array.from({ length: CARD_SIZE }, (_, row) => columns.map((col) => col[row]));
}

/**
 * size x size bingo card built from a word pool: `size * size` unique words
 * sampled without replacement from `pool`. Throws `Error("pool-too-small")`
 * when the pool doesn't have enough distinct words.
 */
export function wordCard(
  pool: string[],
  size: number,
  rng: () => number = Math.random
): string[][] {
  const needed = size * size;
  if (pool.length < needed) {
    throw new Error("pool-too-small");
  }
  const picked = sample(pool, needed, rng);
  return Array.from({ length: size }, (_, row) => picked.slice(row * size, row * size + size));
}

/** Generates `n` independent cards using `gen` (e.g. `numberCard` or a
 * `wordCard` partial application), all drawing from the same `rng`. */
export function makeCards<T>(
  n: number,
  gen: (rng: () => number) => T[][],
  rng: () => number = Math.random
): T[][][] {
  return Array.from({ length: Math.max(0, n) }, () => gen(rng));
}
