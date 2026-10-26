import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

// Every tool page renders its own SEO block with an explicit slug. A new tool
// that forgets it would ship without About/FAQ/JSON-LD, so fail here instead.
const toolsDir = path.resolve(__dirname, "../../app/tools");
const slugs = fs
  .readdirSync(toolsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(toolsDir, d.name, "page.tsx")))
  .map((d) => d.name);

describe("tool pages render the SEO block", () => {
  it("finds tool pages", () => {
    expect(slugs.length).toBeGreaterThan(100);
  });

  it.each(slugs)("%s", (slug) => {
    const src = fs.readFileSync(path.join(toolsDir, slug, "page.tsx"), "utf8");
    expect(src).toContain(`ToolSeoContent slug="${slug}"`);
    expect(src).toContain('from "@/components/tool-seo/tool-seo-content"');
  });
});
