#!/usr/bin/env node
// SEO block parity check (no dependencies).
// Usage: node scripts/seo-parity.mjs <baseUrl> [outFile] [--attr=data-testid="tool-seo-content"]
// For four tool pages, extracts the JSON-LD blocks (keys sorted, volatile fields dropped)
// and the text of the SEO block, and writes normalized JSON to outFile (or stdout).
// Selector: the SEO block root is located by the attribute string below. The default,
// data-testid="tool-seo-content", is on the root <section> both on main (e8de6e2) and on
// the server-component branch, so one run config works for both trees.
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const flag = args.find((a) => a.startsWith("--attr="));
const ATTR = flag ? flag.slice(7) : 'data-testid="tool-seo-content"';
const [base, outFile] = args.filter((a) => !a.startsWith("--attr="));
if (!base) { console.error("usage: seo-parity.mjs <baseUrl> [outFile]"); process.exit(2); }

const PAGES = ["/tools/depth-map", "/ru/tools/compress-image-to-1mb", "/de/tools/compress-pdf", "/ar/tools/token-counter"];
const VOLATILE = new Set(["dateModified", "datePublished"]);

const norm = (v) => Array.isArray(v) ? v.map(norm)
  : v && typeof v === "object"
    ? Object.fromEntries(Object.keys(v).sort().filter((k) => !VOLATILE.has(k)).map((k) => [k, norm(v[k])]))
    : v;

const decode = (s) => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");

function seoText(html) {
  const at = html.indexOf(ATTR);
  if (at < 0) return null;
  const start = html.lastIndexOf("<", at);
  const tag = /^<([a-zA-Z0-9]+)/.exec(html.slice(start))[1];
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "g");
  re.lastIndex = start;
  let depth = 0, m, end = html.length;
  while ((m = re.exec(html))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) { end = re.lastIndex; break; }
  }
  const inner = html.slice(start, end).replace(/<(script|style)\b[\s\S]*?<\/\1>/g, "").replace(/<!--[\s\S]*?-->/g, "");
  return decode(inner.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

const out = {};
for (const p of PAGES) {
  const res = await fetch(base + p);
  const html = await res.text();
  const ld = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.stringify(norm(JSON.parse(decode(m[1]).trim()))));
  out[p] = { status: res.status, jsonLd: ld.map((s) => JSON.parse(s)), seoText: seoText(html) };
}
const json = JSON.stringify(out, null, 2) + "\n";
outFile ? writeFileSync(outFile, json) : process.stdout.write(json);
