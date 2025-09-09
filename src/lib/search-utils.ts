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

// Calculate search score for a tool
function calculateSearchScore(tool: Tool, query: string): number {
  const queryLower = query.toLowerCase();
  const nameLower = tool.name.toLowerCase();
  const descLower = tool.description.toLowerCase();

  let score = 0;

  // Exact matches get highest score
  if (nameLower.includes(queryLower)) {
    score += 100;
  }
  if (descLower.includes(queryLower)) {
    score += 50;
  }

  // Fuzzy matching for name
  const nameSimilarity = calculateSimilarity(queryLower, nameLower);
  if (nameSimilarity > 0.6) {
    score += nameSimilarity * 30;
  }

  // Fuzzy matching for description words
  const descWords = descLower.split(/\s+/);
  const queryWords = queryLower.split(/\s+/);

  queryWords.forEach((queryWord: string) => {
    descWords.forEach((descWord: string) => {
      const similarity = calculateSimilarity(queryWord, descWord);
      if (similarity > 0.7) {
        score += similarity * 10;
      }
    });
  });

  // Synonym matching
  const expandedTerms = expandSearchTerms(query);
  expandedTerms.forEach((term) => {
    if (nameLower.includes(term)) {
      score += 20;
    }
    if (descLower.includes(term)) {
      score += 10;
    }
  });

  return score;
}

// Main search function that returns filtered and scored tools
export function searchTools(query: string): ToolCategory[] {
  if (!query.trim()) {
    return tools
      .map((category) => ({
        ...category,
        items: category.items.sort((a, b) => a.order - b.order), // Sort by order when no search
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
export function findFirstTool(
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
