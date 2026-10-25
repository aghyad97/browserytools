// Per-slug overrides for the English <title> and meta description built by
// src/lib/metadata.ts. Only for pages where Search Console shows the templated
// "<Name> - Free Browser Tool" title is under-performing on a known query.
// Keys are tool slugs (segment after /tools/). Absent slug = templated default.
export interface SeoOverride {
  /** Replaces `${tool.name} - Free Browser Tool`. Site suffix is still appended by the root layout. */
  title?: string;
  /** Replaces the templated description. ≤ 155 characters. */
  description?: string;
}

export const seoOverrides: Record<string, SeoOverride> = {
  // The ASCII tool converts images only (there is no text-to-ASCII mode), so
  // the title and description describe image input only.
  "ascii-art": {
    title: "ASCII Art Generator – Image to ASCII Converter",
    description:
      "Turn any photo or PNG into ASCII art. Set width and character set, invert or add colour, then copy, download .txt or export PNG. Runs in your browser.",
  },
  "depth-map": {
    title: "Free AI Depth Map Generator – Image to Depth Map",
    description:
      "Generate a depth map from any image with Depth Anything V2 running in your browser. Grayscale or colour output, PNG download. Free, no upload.",
  },
};

export function getSeoOverride(slug: string): SeoOverride | undefined {
  return Object.prototype.hasOwnProperty.call(seoOverrides, slug)
    ? seoOverrides[slug]
    : undefined;
}
