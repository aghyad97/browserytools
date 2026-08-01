import { MetadataRoute } from "next";
import { getAllTools } from "@/lib/tools-config";
import { blogPosts } from "@/lib/blog-data";
import { comparisons } from "@/lib/comparisons";
import { TOOL_CLUSTERS } from "@/lib/tool-clusters";
import { blogHreflang } from "@/lib/blog-alternates";
import {
  SITE_URL,
  hreflangLanguages,
  localeCodes,
  localePath,
} from "@/lib/locales";

/**
 * Generated entirely from LOCALES × the tool registry × the blog data, so it
 * cannot drift from what the app actually serves: adding a locale to
 * `src/lib/locales.ts` or a tool to `tools-config.ts` extends this sitemap with
 * no edit here.
 *
 * Size: ~180 localizable paths × 9 locales + ~170 blog posts ≈ 1.8k URLs, an
 * order of magnitude under the 50,000-URL / 50 MB single-file limits, so no
 * sitemap index is needed. If the tool count or locale count grows ~25×, split
 * this into per-locale sitemaps behind an index.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Get all available tools
  const allTools = getAllTools().filter((tool) => tool.available);

  // Most recent content date drives the homepage/blog-index lastModified so
  // they reflect the freshest tool or post rather than the build time.
  const newestToolDate = allTools.reduce<Date>((latest, tool) => {
    const d = new Date(tool.creationDate);
    return d > latest ? d : latest;
  }, new Date(0));
  const newestBlogDate = blogPosts.reduce<Date>((latest, post) => {
    const d = new Date(post.date);
    return d > latest ? d : latest;
  }, new Date(0));
  const newestOverall =
    newestToolDate > newestBlogDate ? newestToolDate : newestBlogDate;

  /**
   * One entry per locale for a path that exists in every language, each
   * carrying the same reciprocal hreflang set. `hreflangLanguages` builds the
   * alternates from the same registry the URLs come from.
   */
  const localized = (
    path: string,
    lastModified: Date,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: number
  ): MetadataRoute.Sitemap => {
    const languages = hreflangLanguages(path);
    return localeCodes.map((locale) => ({
      url: `${SITE_URL}${localePath(path, locale)}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  };

  const homeDate = newestOverall.getTime() > 0 ? newestOverall : currentDate;
  const blogDate = newestBlogDate.getTime() > 0 ? newestBlogDate : currentDate;

  // Home and blog index exist in every locale.
  const staticRoutes: MetadataRoute.Sitemap = [
    ...localized("/", homeDate, "daily", 1),
    ...localized("/blog", blogDate, "weekly", 0.9),
    // Legal pages are English-only; no locale routes, so no alternates.
    {
      url: `${SITE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Tool routes — every tool in every locale, lastModified from its own
  // creation date. English stays at the unprefixed URL.
  const toolRoutes: MetadataRoute.Sitemap = allTools.flatMap((tool) =>
    localized(tool.href, new Date(tool.creationDate), "weekly", 0.8)
  );

  // Blog posts keep their existing top-level URLs (translations use a
  // `-<locale>` slug suffix rather than a path prefix), with hreflang linking
  // each translation family together.
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => {
    const languages = blogHreflang(post.slug);
    return {
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...(languages ? { alternates: { languages } } : {}),
    };
  });

  // Cluster hub routes (/collections/*) — sit between the homepage and the
  // individual tool pages, so they rank above tools and below the index.
  // English-only for now: there is no `[locale]/collections` segment, so these
  // get no locale variants and no alternates, same as the legal pages.
  const clusterRoutes: MetadataRoute.Sitemap = TOOL_CLUSTERS.map((cluster) => ({
    url: `${SITE_URL}${cluster.href}`,
    lastModified: newestToolDate.getTime() > 0 ? newestToolDate : currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Comparison ("alternative to X") routes — lastModified is the date each
  // page's competitor claims were last checked against their public pages.
  // English-only, like the cluster hubs: no `[locale]/alternatives` segment.
  const comparisonRoutes: MetadataRoute.Sitemap = comparisons.map((c) => ({
    url: `${SITE_URL}/alternatives/${c.slug}`,
    lastModified: new Date(c.checkedOn),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...clusterRoutes,
    ...comparisonRoutes,
    ...toolRoutes,
    ...blogRoutes,
  ];
}
