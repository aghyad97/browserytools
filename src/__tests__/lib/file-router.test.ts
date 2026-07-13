import { describe, it, expect } from "vitest";
import {
  FILE_ROUTES,
  FALLBACK_ROUTE,
  routeFile,
  extOf,
} from "@/lib/file-router";
import { getAllTools } from "@/lib/tools-config";

/* Every slug the router can ever suggest must resolve to a real tool route —
   the table is hand-maintained, so this guards against typos and renames. */
describe("file-router — table integrity", () => {
  const validHrefs = new Set(getAllTools().map((t) => t.href));

  it("every suggested slug maps to a real tools-config route", () => {
    const allSlugs = [
      ...FILE_ROUTES.flatMap((r) => r.slugs),
      ...FALLBACK_ROUTE.slugs,
    ];
    for (const slug of allSlugs) {
      expect(validHrefs.has(`/tools/${slug}`), `unknown tool slug: ${slug}`).toBe(
        true,
      );
    }
  });

  it("ranks suggestions (first slug is the primary tool)", () => {
    for (const rule of FILE_ROUTES) {
      expect(rule.slugs.length).toBeGreaterThan(0);
    }
  });
});

describe("extOf", () => {
  it("extracts the lowercase extension", () => {
    expect(extOf("Photo.JPG")).toBe("jpg");
    expect(extOf("archive.tar.gz")).toBe("gz");
  });
  it("returns '' for extension-less and dot-leading names", () => {
    expect(extOf("README")).toBe("");
    expect(extOf(".gitignore")).toBe("");
  });
});

describe("routeFile — kind routing", () => {
  const cases: [string, string, string, string][] = [
    // [filename, mime, expected kind, expected primary slug]
    ["photo.jpg", "image/jpeg", "image", "image-compression"],
    ["scan.png", "image/png", "image", "image-compression"],
    ["report.pdf", "application/pdf", "pdf", "pdf"],
    ["song.mp3", "audio/mpeg", "audio", "audio"],
    ["clip.mp4", "video/mp4", "video", "video"],
    ["data.json", "application/json", "json", "json-formatter"],
    ["table.csv", "text/csv", "csv", "json-csv"],
    ["bundle.zip", "application/zip", "zip", "zip"],
    ["notes.md", "text/markdown", "markdown", "markdown-html"],
    ["readme.txt", "text/plain", "code", "code-format"],
    ["app.ts", "", "code", "code-format"],
  ];

  it.each(cases)("%s (%s) → %s / %s", (name, mime, kind, primary) => {
    const match = routeFile(name, mime);
    expect(match.kind).toBe(kind);
    expect(match.slugs[0]).toBe(primary);
  });

  it("routes .svg to the SVG tools, not image compression (specific beats prefix)", () => {
    const match = routeFile("logo.svg", "image/svg+xml");
    expect(match.kind).toBe("svg");
    expect(match.slugs).toEqual(["svg", "svg-png"]);
  });

  it("falls back to the file converter for unknown kinds", () => {
    const match = routeFile("model.blend", "application/octet-stream");
    expect(match).toEqual(FALLBACK_ROUTE);
    expect(match.slugs[0]).toBe("file-converter");
  });

  it("matches by extension when the browser supplies no MIME type", () => {
    expect(routeFile("export.csv", "").kind).toBe("csv");
    expect(routeFile("doc.pdf", "").kind).toBe("pdf");
  });

  it("matches by MIME when the name has no extension", () => {
    expect(routeFile("upload", "image/webp").kind).toBe("image");
    expect(routeFile("blob", "video/webm").kind).toBe("video");
  });
});
