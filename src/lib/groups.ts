/** How a list of names should be split into groups. */
export type GroupMode = { kind: "count"; n: number } | { kind: "size"; size: number };

/** Fisher–Yates shuffle with an injectable RNG (`rng()` returns [0, 1)). */
function shuffle<T>(items: T[], rng: () => number): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/**
 * Shuffles `names` and splits them into groups.
 *
 * - `{ kind: "count", n }` — exactly `n` groups.
 * - `{ kind: "size", size }` — as many groups as needed so no group exceeds
 *   `size` members.
 *
 * In both cases the remainder is distributed round-robin (assigning shuffled
 * items to groups in `i % groupCount` order) so group sizes never differ by
 * more than 1.
 */
export function splitGroups(
  names: string[],
  mode: GroupMode,
  rng: () => number = Math.random
): string[][] {
  if (names.length === 0) return [];

  const rawGroupCount =
    mode.kind === "count"
      ? Math.max(1, Math.floor(mode.n))
      : Math.max(1, Math.ceil(names.length / Math.max(1, Math.floor(mode.size))));

  // Never split into more groups than there are names — a non-empty input
  // must never yield a zero-length group.
  const groupCount = Math.min(rawGroupCount, names.length);

  const shuffled = shuffle(names, rng);
  const groups: string[][] = Array.from({ length: groupCount }, () => []);
  shuffled.forEach((name, i) => {
    groups[i % groupCount].push(name);
  });
  return groups;
}
