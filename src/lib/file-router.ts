/**
 * File router — maps a dropped/picked file (extension + MIME type) to a
 * ranked list of tool suggestions for the landing's universal dropzone.
 *
 * Pure data + pure functions (no DOM), so it's fully unit-testable and the
 * table can be audited against src/lib/tools-config.ts slugs (a test asserts
 * every slug here resolves to a real tool route).
 *
 * Rules are ordered most-specific-first: exact extensions/MIME types match
 * before broad `image/` / `audio/` / `video/` prefixes (e.g. an .svg file is
 * image/svg+xml but should route to the SVG tools, not image compression).
 * Anything unmatched falls back to the universal file converter — the UI
 * pairs that with the ⌘K search as the escape hatch.
 */

export interface RouteMatch {
  /** Stable rule id — "image", "pdf", "audio", … ("file" for the fallback). */
  kind: string;
  /** Ranked tool slugs (best suggestion first); hrefs are /tools/<slug>. */
  slugs: string[];
}

interface RouteRule extends RouteMatch {
  /** Lowercase extensions without the dot. */
  exts?: string[];
  /** Exact MIME types. */
  mimes?: string[];
  /** MIME prefixes, e.g. "image/". Checked after exts/mimes of ALL rules. */
  mimePrefixes?: string[];
}

/* Common source-code extensions for the txt/code bucket. */
const CODE_EXTS = [
  "txt",
  "js",
  "jsx",
  "ts",
  "tsx",
  "py",
  "rb",
  "go",
  "rs",
  "java",
  "c",
  "h",
  "cpp",
  "cs",
  "php",
  "sh",
  "css",
  "html",
  "xml",
];

/** Ordered routing table — first match wins within each pass. */
export const FILE_ROUTES: RouteRule[] = [
  {
    kind: "svg",
    exts: ["svg"],
    mimes: ["image/svg+xml"],
    slugs: ["svg", "svg-png"],
  },
  {
    kind: "pdf",
    exts: ["pdf"],
    mimes: ["application/pdf"],
    slugs: ["pdf"],
  },
  {
    kind: "json",
    exts: ["json"],
    mimes: ["application/json"],
    slugs: ["json-formatter", "json-csv"],
  },
  {
    kind: "csv",
    exts: ["csv"],
    mimes: ["text/csv"],
    slugs: ["json-csv", "spreadsheet"],
  },
  {
    kind: "zip",
    exts: ["zip"],
    mimes: ["application/zip", "application/x-zip-compressed"],
    slugs: ["zip"],
  },
  {
    kind: "markdown",
    exts: ["md", "markdown"],
    mimes: ["text/markdown"],
    slugs: ["markdown-html"],
  },
  {
    kind: "code",
    exts: CODE_EXTS,
    mimes: ["text/plain"],
    slugs: ["code-format", "text-counter"],
  },
  {
    kind: "image",
    mimePrefixes: ["image/"],
    slugs: ["image-compression", "image-converter", "bg-removal"],
  },
  {
    kind: "audio",
    mimePrefixes: ["audio/"],
    slugs: ["audio", "audio-transcriber"],
  },
  {
    kind: "video",
    mimePrefixes: ["video/"],
    slugs: ["video", "compress-video", "audio-transcriber"],
  },
];

/** Universal fallback — the UI pairs this with the ⌘K search escape hatch. */
export const FALLBACK_ROUTE: RouteMatch = {
  kind: "file",
  slugs: ["file-converter"],
};

/** Lowercase extension of a filename, without the dot ("" when none). */
export function extOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(i + 1).toLowerCase() : "";
}

/**
 * Route a file to ranked tool suggestions by extension + MIME type.
 * Exact extension/MIME matches win over broad MIME-prefix matches
 * (so photo.svg → svg tools even though its MIME starts with image/).
 */
export function routeFile(name: string, mime: string): RouteMatch {
  const ext = extOf(name);
  const type = (mime || "").toLowerCase();

  for (const rule of FILE_ROUTES) {
    if (rule.exts?.includes(ext)) return { kind: rule.kind, slugs: rule.slugs };
    if (rule.mimes?.includes(type)) return { kind: rule.kind, slugs: rule.slugs };
  }
  for (const rule of FILE_ROUTES) {
    if (rule.mimePrefixes?.some((p) => type.startsWith(p)))
      return { kind: rule.kind, slugs: rule.slugs };
  }
  return FALLBACK_ROUTE;
}
