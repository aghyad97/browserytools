import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://browserytools.com";

  // Paths that should never be crawled (non-content / redirect routes).
  const disallow = [
    "/api/",
    "/_next/",
    "/admin/",
    "/private/",
    "/coffee",
    "/gh",
    "/x",
  ];

  // Major AI / LLM crawlers we explicitly welcome so the tools and articles
  // can be cited in AI answers. They get the same allow/disallow as search
  // engines (all public content, no internal routes).
  const aiCrawlers = [
    "GPTBot", // OpenAI training crawler
    "OAI-SearchBot", // OpenAI / ChatGPT search
    "ChatGPT-User", // ChatGPT browsing on user request
    "ClaudeBot", // Anthropic crawler
    "Claude-Web", // Anthropic Claude browsing
    "anthropic-ai", // Anthropic
    "PerplexityBot", // Perplexity
    "Perplexity-User", // Perplexity browsing on user request
    "Google-Extended", // Google Gemini / Vertex AI training
    "Applebot-Extended", // Apple Intelligence
    "CCBot", // Common Crawl (feeds many LLMs)
    "cohere-ai", // Cohere
    "Bytespider", // ByteDance / Doubao
    "DuckAssistBot", // DuckDuckGo AI assist
    "Amazonbot", // Amazon (Alexa / AI)
    "Meta-ExternalAgent", // Meta AI
    "YouBot", // You.com
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow,
      },
      // Explicitly welcome AI/LLM crawlers for citation discoverability.
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow,
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
