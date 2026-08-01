/**
 * hreflang families for blog posts.
 *
 * Blog translations do NOT use locale-prefixed URLs — they predate them and
 * already have their own top-level URLs via a `-<locale>` slug suffix
 * (`/blog/meme-generator-guide` ↔ `/blog/meme-generator-guide-es`). Those are
 * the canonical URLs and this file does not move them; it only discovers which
 * slugs are translations of each other so each post can declare the others as
 * hreflang alternates.
 *
 * Legacy Arabic posts are transliterated rather than suffixed off an English
 * base (`ibqa-aljihaz-mustayqizan-ar`), so they form single-member families and
 * honestly declare no alternates rather than being guessed into the wrong one.
 */
import { SITE_URL, localeCodes, defaultLocale, type Locale } from "./locales";
import { blogPosts, getPostLocale } from "./blog-data";

/** Strip a trailing `-<locale>` suffix, if the post is a suffixed translation. */
function baseSlug(slug: string, locale: Locale): string {
  if (locale === defaultLocale) return slug;
  const suffix = `-${locale}`;
  return slug.endsWith(suffix) ? slug.slice(0, -suffix.length) : slug;
}

/** base slug -> { locale -> slug } */
const families = (() => {
  const map = new Map<string, Partial<Record<Locale, string>>>();
  for (const post of blogPosts) {
    const locale = getPostLocale(post);
    const base = baseSlug(post.slug, locale);
    const family = map.get(base) ?? {};
    // First writer wins — a base slug should map to at most one post per locale.
    if (!family[locale]) family[locale] = post.slug;
    map.set(base, family);
  }
  return map;
})();

/** slug -> its family, for O(1) lookup from a post page. */
const familyBySlug = (() => {
  const map = new Map<string, Partial<Record<Locale, string>>>();
  for (const family of families.values()) {
    for (const slug of Object.values(family)) {
      if (slug) map.set(slug, family);
    }
  }
  return map;
})();

/**
 * The `alternates.languages` map for a blog post, or undefined when the post
 * has no known translations (emitting a one-entry self-referential map is the
 * invalid pattern this avoids).
 */
export function blogHreflang(slug: string): Record<string, string> | undefined {
  const family = familyBySlug.get(slug);
  if (!family) return undefined;

  const entries = localeCodes
    .filter((code) => family[code])
    .map((code) => [code, `${SITE_URL}/blog/${family[code]}`] as const);

  if (entries.length < 2) return undefined;

  const languages: Record<string, string> = Object.fromEntries(entries);
  const english = family[defaultLocale];
  if (english) languages["x-default"] = `${SITE_URL}/blog/${english}`;
  return languages;
}

/** Every post slug grouped by translation family — used by the sitemap. */
export function blogFamilies(): Partial<Record<Locale, string>>[] {
  return [...families.values()];
}
