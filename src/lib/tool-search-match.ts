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
 * True if the (already-lowercased-by-caller-agnostic) `query` matches this
 * tool. Pass the raw query — matching is case-insensitive internally.
 */
export function matchesToolQuery(tool: SearchableTool, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  if (
    tool.name.toLowerCase().includes(q) ||
    tool.category.toLowerCase().includes(q) ||
    tool.slug.toLowerCase().includes(q)
  ) {
    return true;
  }

  return (tool.keywords ?? []).some((keyword) => keyword.toLowerCase().includes(q));
}
