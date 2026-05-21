import { ImageResponse } from "next/og";
import { findToolByHref } from "./tools-config";

// Shared OG image config — used by file-based opengraph-image / twitter-image routes.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const BRAND = "BrowseryTools";

/**
 * Renders a branded 1200x630 OpenGraph image for a given tool slug.
 * Falls back to a sensible default brand card when the slug is unknown.
 */
export function generateToolOgImage(slug: string): ImageResponse {
  const tool = findToolByHref(`/tools/${slug}`);

  const title = tool?.name ?? BRAND;
  const category = tool?.category ?? "Free Browser-Based Tools";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: category pill */}
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 600,
              color: "#a5b4fc",
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.4)",
              borderRadius: 9999,
              padding: "12px 28px",
            }}
          >
            {category}
          </div>
        </div>

        {/* Middle: tool name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 34,
              color: "#cbd5e1",
              fontWeight: 500,
            }}
          >
            Free · Private · Runs in your browser
          </div>
        </div>

        {/* Bottom: brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            B
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
            {BRAND}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#94a3b8",
              marginLeft: 8,
            }}
          >
            browserytools.com
          </div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
