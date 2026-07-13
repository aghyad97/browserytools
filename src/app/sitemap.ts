import { MetadataRoute } from "next";
import { getAllTools } from "@/lib/tools-config";
import { blogPosts } from "@/lib/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://browserytools.com";
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

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: newestOverall.getTime() > 0 ? newestOverall : currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: newestBlogDate.getTime() > 0 ? newestBlogDate : currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Tool routes — lastModified reflects each tool's own creation date
  const toolRoutes: MetadataRoute.Sitemap = allTools.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: new Date(tool.creationDate),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Blog post routes — lastModified reflects each post's publish date
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...toolRoutes, ...blogRoutes];
}
