import { MetadataRoute } from "next";
import { getAllTools } from "@/lib/tools-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://browserytools.com";
  const currentDate = new Date();

  // Get all available tools
  const allTools = getAllTools().filter((tool) => tool.available);

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // Tool routes
  const toolRoutes: MetadataRoute.Sitemap = allTools.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes];
}
