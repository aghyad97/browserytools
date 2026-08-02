/**
 * Pure match predicate shared by the ⌘K command palette (and any future
 * search surface) — kept in its own module so it is unit-testable without
 * mounting the palette's React tree.
 *
 * Matches on the tool's own name/category/slug (as before) PLUS its curated
 * `keywords` (see `Tool.keywords` in tools-config.ts) — alternative phrasings
 * for what a user wants to DO ("remove background", "ocr", "how many
 * tokens") rather than the tool's own name. Keywords are a search index
 * only: they widen what matches, they are never rendered.
 */
export interface SearchableTool {
  name: string;
  category: string;
  slug: string;
  keywords?: string[];
}

/**
 * Letters that carry no combining mark to strip, so NFD leaves them alone.
 * Each is folded to the base letter a user is likely to type on a keyboard
 * that lacks it.
 *
 * `ı` (Turkish dotless i) is the important one: `"İmza".toLowerCase()` yields
 * `i` + U+0307 COMBINING DOT ABOVE, so a Turkish user typing `imza` matched
 * nothing at all and the tool was unreachable from search. Stripping combining
 * marks fixes that direction; this table fixes the reverse, where the tool
 * name contains `ı` and the query contains `i`.
 */
const NON_DECOMPOSING_FOLDS: Record<string, string> = {
  ı: "i",
  ł: "l",
  đ: "d",
  ð: "d",
  ø: "o",
  æ: "ae",
  œ: "oe",
  ß: "ss",
  "ẞ": "ss",
};

/**
 * Fold a string for search comparison: decompose, drop combining marks, lower
 * case, then fold the letters that decomposition cannot reach.
 *
 * Deliberately locale-independent. A locale-aware `toLocaleLowerCase(locale)`
 * would fix Turkish only for Turkish users, but the catalogue is searched in
 * 17 languages and a visitor may type a query in one script against a tool
 * name in another. Diacritic-insensitive folding means `imza` finds `İmza`,
 * `isik` finds `ışık`, `tep` finds `tệp`, and `grosse` finds `größe`.
 */
export function foldForSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[ıłđðøæœßẞ]/g, (c) => NON_DECOMPOSING_FOLDS[c] ?? c);
}

/**
 * True if `query` matches this tool. Pass the raw query — matching is
 * case- and diacritic-insensitive internally.
 */
export function matchesToolQuery(tool: SearchableTool, query: string): boolean {
  const q = foldForSearch(query.trim());
  if (!q) return true;

  if (
    foldForSearch(tool.name).includes(q) ||
    foldForSearch(tool.category).includes(q) ||
    foldForSearch(tool.slug).includes(q)
  ) {
    return true;
  }

  return (tool.keywords ?? []).some((keyword) =>
    foldForSearch(keyword).includes(q)
  );
}
