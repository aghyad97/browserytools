import { tools, Tool, ToolCategory } from "./tools-config";

// Levenshtein distance function for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

// Calculate similarity score (0-1, where 1 is perfect match)
function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 1 : 1 - distance / maxLength;
}

// Synonym mapping for common terms
const synonyms: Record<string, string[]> = {
  image: ["picture", "photo", "pic", "img", "graphic"],
  video: ["movie", "clip", "film"],
  audio: ["sound", "music", "mp3"],
  text: ["words", "content", "writing"],
  file: ["document", "doc"],
  convert: ["transform", "change", "translate"],
  compress: ["zip", "reduce", "shrink"],
  edit: ["modify", "change", "alter"],
  generate: ["create", "make", "produce"],
  remove: ["delete", "eliminate", "strip"],
  background: ["bg", "backdrop"],
  password: ["pass", "pwd", "key"],
  qr: ["qrcode", "quick response"],
  base64: ["base 64", "b64"],
  json: ["javascript object notation"],
  csv: ["comma separated", "spreadsheet"],
  pdf: ["portable document"],
  svg: ["vector", "scalable vector"],
  png: ["portable network graphics"],
  jpg: ["jpeg", "jpeg image"],
  gif: ["graphics interchange"],
  webp: ["web picture"],
  mp3: ["mpeg audio"],
  mp4: ["mpeg video"],
  wav: ["wave audio"],
  flac: ["free lossless audio"],
  avi: ["audio video interleave"],
  mov: ["quicktime"],
  zip: ["archive", "compressed"],
  excel: ["xlsx", "xls", "spreadsheet"],
  code: ["programming", "script", "source"],
  format: ["style", "layout", "structure"],
  case: ["capitalization", "upper", "lower"],
  counter: ["count", "calculator", "statistics"],
  unit: ["measurement", "converter"],
  lorem: ["ipsum", "placeholder", "dummy"],
  rich: ["formatted", "styled", "markup"],
  editor: ["writer", "creator", "maker"],
};

// Expand search terms with synonyms
function expandSearchTerms(query: string): string[] {
  const terms = query.toLowerCase().split(/\s+/);
  const expandedTerms = new Set<string>();

  terms.forEach((term) => {
    expandedTerms.add(term);

    // Add synonyms
    Object.entries(synonyms).forEach(([key, values]) => {
      if (key.includes(term) || term.includes(key)) {
        values.forEach((synonym) => expandedTerms.add(synonym));
      }
      values.forEach((synonym) => {
        if (synonym.includes(term) || term.includes(synonym)) {
          expandedTerms.add(key);
          values.forEach((s) => expandedTerms.add(s));
        }
      });
    });
  });

  return Array.from(expandedTerms);
}

// Normalize a string for matching: lowercase, trim, collapse whitespace.
function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, " ");
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Calculate a search score for a tool given a query.
 *
 * Scoring is strictly tiered so that the *more exact* a match is, the higher it
 * ranks — and an exact tool-name match always wins:
 *
 *   exact name (===)            → 10000   (always first)
 *   name starts with query      → +1200
 *   query is a substring of name → +500 (+ earlier-position bonus)
 *   all query words are in name  → +400 (whole-word) / +250 (prefix)
 *   per-word name matches        → +70 / +45 / +18
 *   description matches          → low (tiebreaker)
 *   fuzzy similarity (typos)     → low (tiebreaker)
 *   synonyms                     → lowest (tiebreaker)
 *
 * This fixes the bug where e.g. "age calculator" ranked "Percentage Calculator"
 * (which literally contains the substring "age calculator") at the same +100 as
 * the exact "Age Calculator".
 */
function calculateSearchScore(tool: Tool, query: string): number {
  const q = normalize(query);
  if (!q) return 0;

  const name = normalize(tool.name);
  const desc = (tool.description || "").toLowerCase();
  const qTokens = q.split(" ");
  const nameTokens = name.split(" ");

  // 1. Exact full-name match always wins.
  if (name === q) return 10000;

  let score = 0;

  // 2. Name starts with the full query.
  if (name.startsWith(q)) {
    score += 1200;
  } else if (name.includes(q)) {
    // 3. Query appears as a substring elsewhere in the name (e.g. "age
    //    calculator" inside "percentage calculator") — relevant, but ranked
    //    well below an exact or prefix match. Earlier position scores higher.
    score += 500 + Math.max(0, 80 - name.indexOf(q) * 4);
  }

  // 4. All query words present in the name (order-independent).
  const wholeWord = (t: string) => nameTokens.includes(t);
  const prefixWord = (t: string) => nameTokens.some((nt) => nt.startsWith(t));
  if (qTokens.every(wholeWord)) {
    score += 400;
  } else if (qTokens.every((t) => wholeWord(t) || prefixWord(t))) {
    score += 250;
  }

  // 5. Per-word name matches.
  qTokens.forEach((t) => {
    if (wholeWord(t)) score += 70;
    else if (prefixWord(t)) score += 45;
    else if (name.includes(t)) score += 18;
  });

  // 6. Description matches (low weight — tiebreakers only).
  if (desc.includes(q)) score += 40;
  qTokens.forEach((t) => {
    if (new RegExp(`\\b${escapeRegExp(t)}`).test(desc)) score += 8;
  });

  // 7. Fuzzy similarity for typo tolerance (capped, tiebreaker).
  const nameSimilarity = calculateSimilarity(q, name);
  if (nameSimilarity > 0.72) score += nameSimilarity * 25;
  qTokens.forEach((t) => {
    if (t.length < 4) return;
    nameTokens.forEach((nt) => {
      const sim = calculateSimilarity(t, nt);
      if (sim > 0.8) score += sim * 15;
    });
  });

  // 8. Synonyms (lowest weight — only helps when nothing else matched).
  expandSearchTerms(q).forEach((term) => {
    if (term === q) return;
    if (nameTokens.includes(term)) score += 12;
    else if (desc.includes(term)) score += 4;
  });

  return score;
}

// Main search function that returns filtered and scored tools
export function searchTools(query: string): ToolCategory[] {
  if (!query.trim()) {
    return tools
      .map((category) => ({
        ...category,
        // Copy before sorting — `tools` is a shared imported module constant and
        // an in-place sort mutates it, which caused SSR/client hydration
        // mismatches once the rail shell rendered `tools` on every route.
        items: [...category.items].sort((a, b) => a.order - b.order),
      }))
      .sort((a, b) => a.order - b.order); // Sort categories by order
  }

  const queryLower = query.toLowerCase();

  return tools
    .map((category) => {
      const scoredItems = category.items
        .map((tool) => ({
          ...tool,
          searchScore: calculateSearchScore(tool, query),
        }))
        .filter((tool) => tool.searchScore > 10) // Minimum threshold
        .sort((a, b) => {
          // First sort by search score (relevance), then by order for ties
          const scoreDiff = b.searchScore - a.searchScore;
          return scoreDiff !== 0 ? scoreDiff : a.order - b.order;
        });

      return {
        ...category,
        items: scoredItems,
      };
    })
    .filter((category) => category.items.length > 0)
    .sort((a, b) => a.order - b.order); // Sort categories by order
}

// Get all tools as a flat array for sidebar search
export function searchAllTools(
  query: string
): (Tool & { category: string; searchScore: number })[] {
  if (!query.trim()) {
    return tools
      .flatMap((category) =>
        category.items.map((tool) => ({
          ...tool,
          category: category.category,
          searchScore: 0,
        }))
      )
      .sort((a, b) => a.order - b.order); // Sort by order when no search
  }

  const queryLower = query.toLowerCase();
  const allTools = tools.flatMap((category) =>
    category.items.map((tool) => ({ ...tool, category: category.category }))
  );

  return allTools
    .map((tool) => ({
      ...tool,
      searchScore: calculateSearchScore(tool, query),
    }))
    .filter((tool) => tool.searchScore > 10)
    .sort((a, b) => {
      // First sort by search score (relevance), then by order for ties
      const scoreDiff = b.searchScore - a.searchScore;
      return scoreDiff !== 0 ? scoreDiff : a.order - b.order;
    });
}

// Find the first (most relevant) tool matching a search query
function findFirstTool(
  query: string
): (Tool & { category: string; searchScore: number }) | null {
  if (!query.trim()) {
    return null;
  }

  const allTools = tools.flatMap((category) =>
    category.items.map((tool) => ({ ...tool, category: category.category }))
  );

  const scoredTools = allTools
    .map((tool) => ({
      ...tool,
      searchScore: calculateSearchScore(tool, query),
    }))
    .filter((tool) => tool.searchScore > 10) // Minimum threshold
    .sort((a, b) => {
      // First sort by search score (relevance), then by order for ties
      const scoreDiff = b.searchScore - a.searchScore;
      return scoreDiff !== 0 ? scoreDiff : a.order - b.order;
    });

  // Return the first (highest scored) tool, or null if no matches
  return scoredTools.length > 0 ? scoredTools[0] : null;
}

// Export individual functions for advanced usage
export {
  calculateSearchScore,
  expandSearchTerms,
  calculateSimilarity,
  findFirstTool,
};
