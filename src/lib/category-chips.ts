/**
 * Per-category chip colours — token references only (light + dark are handled by
 * the token layer in styles/design-tokens.css). Keyed by tools-config category id.
 *
 * Single source of truth shared by the landing crawlable surface
 * (components/landing/landing.tsx) and the tool template
 * (components/template/tool-shell.tsx) so the map never drifts between the two.
 */
export const CHIP: Record<string, { bg: string; fg: string }> = {
  imageTools: { bg: "var(--bt-cat-image-bg)", fg: "var(--bt-cat-image-fg)" },
  fileTools: { bg: "var(--bt-cat-file-bg)", fg: "var(--bt-cat-file-fg)" },
  mediaTools: { bg: "var(--bt-cat-media-bg)", fg: "var(--bt-cat-media-fg)" },
  textLanguage: { bg: "var(--bt-cat-text-bg)", fg: "var(--bt-cat-text-fg)" },
  dataTools: { bg: "var(--bt-cat-data-bg)", fg: "var(--bt-cat-data-fg)" },
  mathFinance: { bg: "var(--bt-cat-math-bg)", fg: "var(--bt-cat-math-fg)" },
  productivity: { bg: "var(--bt-cat-prod-bg)", fg: "var(--bt-cat-prod-fg)" },
  devTools: { bg: "var(--bt-cat-dev-bg)", fg: "var(--bt-cat-dev-fg)" },
  designTools: { bg: "var(--bt-cat-design-bg)", fg: "var(--bt-cat-design-fg)" },
  securityTools: { bg: "var(--bt-cat-sec-bg)", fg: "var(--bt-cat-sec-fg)" },
  aiTools: { bg: "var(--bt-cat-ai-bg)", fg: "var(--bt-cat-ai-fg)" },
  testsGames: { bg: "var(--bt-cat-games-bg)", fg: "var(--bt-cat-games-fg)" },
  schoolLearning: {
    bg: "var(--bt-cat-school-bg)",
    fg: "var(--bt-cat-school-fg)",
  },
  business: { bg: "var(--bt-cat-biz-bg)", fg: "var(--bt-cat-biz-fg)" },
};
