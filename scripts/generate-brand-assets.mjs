#!/usr/bin/env node
/**
 * Single-source brand asset generator.
 *
 * Canonical source: src/brand/logo.svg — a black-on-transparent mark, either
 * fill-based (flat shapes) or stroke-based (monoline), square-ish viewBox.
 *
 * Regenerates from it:
 *   - src/components/layout/brand-glyph.tsx  (React component, currentColor)
 *   - public/icon.svg + public/icon-dark.svg (512 dark tile, white mark)
 *   - public/safari-pinned-tab.svg           (black mark, no tile)
 *   - public/apple-touch-icon.png            (180, rasterized from icon.svg)
 *   - public/favicon.ico                     (16/32/48, rasterized + assembled)
 *
 * Usage: bun run brand  (== node scripts/generate-brand-assets.mjs)
 *
 * To swap the logo: replace src/brand/logo.svg with a new mark (fill or
 * stroke, black on transparent, square-ish viewBox) and re-run this script.
 * Every other brand artifact regenerates from that one file.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const LOGO_SRC = path.join(ROOT, "src/brand/logo.svg");
const GLYPH_OUT = path.join(ROOT, "src/components/layout/brand-glyph.tsx");
const ICON_OUT = path.join(ROOT, "public/icon.svg");
const ICON_DARK_OUT = path.join(ROOT, "public/icon-dark.svg");
const SAFARI_OUT = path.join(ROOT, "public/safari-pinned-tab.svg");
const APPLE_TOUCH_OUT = path.join(ROOT, "public/apple-touch-icon.png");
const FAVICON_OUT = path.join(ROOT, "public/favicon.ico");
// App Router convention file — served at /favicon.ico with PRIORITY over
// public/. Both must carry the same mark or browsers show the stale one.
const FAVICON_APP_OUT = path.join(ROOT, "src/app/favicon.ico");

const TILE_SIZE = 512;
const TILE_RADIUS_PCT = 0.24;
const TILE_INSET_PCT = 0.18;
const TILE_COLOR = "#161615";
// false = raw mark on transparent (no rounded dark tile behind app icons);
// icon.svg stays black (light UIs), icon-dark.svg becomes the white variant.
const TILE_ENABLED = false;
const BARE_INSET_PCT = 0.04;

const GENERATED_HEADER =
  "/* AUTO-GENERATED from src/brand/logo.svg — run: bun run brand */";

// Matches literal black fill/stroke declarations (both keyword and hex
// forms) so they can be swapped for currentColor / white / black depending
// on the output target.
const BLACK_ATTR_RE = /(fill|stroke)="(black|#000|#000000)"/gi;

function recolor(markup, color) {
  return markup.replace(BLACK_ATTR_RE, (_m, attr) => `${attr}="${color}"`);
}

// Converts kebab-case SVG presentation attributes to the camelCase JSX
// expects (stroke-width -> strokeWidth, fill-rule -> fillRule, etc).
function toJsxAttrs(markup) {
  return markup.replace(/([a-z]+)-([a-z]+)=/g, (_m, a, b) => {
    return `${a}${b[0].toUpperCase()}${b.slice(1)}=`;
  });
}

function readLogo() {
  const raw = fs.readFileSync(LOGO_SRC, "utf8");

  const viewBoxMatch = raw.match(/viewBox="([^"]+)"/);
  if (!viewBoxMatch) {
    throw new Error(`${LOGO_SRC}: <svg> is missing a viewBox attribute`);
  }
  const [vx, vy, vw, vh] = viewBoxMatch[1].trim().split(/\s+/).map(Number);

  const innerMatch = raw.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!innerMatch) {
    throw new Error(`${LOGO_SRC}: could not extract inner markup`);
  }
  const inner = innerMatch[1].trim();

  const hasStroke = /stroke-width="([\d.]+)"/.test(inner);
  const strokeWidthMatch = inner.match(/stroke-width="([\d.]+)"/);
  const sourceStrokeWidth = strokeWidthMatch ? Number(strokeWidthMatch[1]) : null;

  return { viewBox: viewBoxMatch[1].trim(), vx, vy, vw, vh, inner, hasStroke, sourceStrokeWidth };
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log(`  wrote ${path.relative(ROOT, filePath)}`);
}

// --- src/components/layout/brand-glyph.tsx ---------------------------------

function buildGlyphComponent(logo) {
  let inner = recolor(logo.inner, "currentColor");
  inner = toJsxAttrs(inner);

  if (logo.hasStroke) {
    inner = inner.replace(/strokeWidth="[\d.]+"/g, "strokeWidth={strokeWidth}");
  }

  const defaultStrokeWidth = logo.sourceStrokeWidth ?? 23;

  // Indent the mark markup one level inside the <svg>.
  const indented = inner
    .split("\n")
    .map((line) => (line.trim() ? `      ${line.trim()}` : line))
    .join("\n");

  return `${GENERATED_HEADER}
/**
 * BrandGlyph — the current brand mark, inlined from src/brand/logo.svg.
 *
 * Black/#000 fill and stroke in the source are rewritten to currentColor so
 * the mark themes for free (white on the dark rail tile, ink on light
 * contexts). Do not hand-edit — change src/brand/logo.svg and run
 * \`bun run brand\` instead.
 */
export function BrandGlyph({
  size = 16,
  strokeWidth = ${defaultStrokeWidth},
  className,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="${logo.viewBox}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
${indented}
    </svg>
  );
}
`;
}

// --- public/icon.svg + icon-dark.svg (dark tile, white mark, 18% inset) ----

function buildTileIcon(logo, { markColor = "#FFFFFF" } = {}) {
  const inset = TILE_SIZE * (TILE_ENABLED ? TILE_INSET_PCT : BARE_INSET_PCT);
  const innerBox = TILE_SIZE - inset * 2;
  const radius = TILE_SIZE * TILE_RADIUS_PCT;

  // Uniform scale so the mark's viewBox fits inside the inset box while
  // preserving aspect ratio (mark is square-ish, so scale is ~equal on both
  // axes, but this holds for non-square source viewBoxes too).
  const scale = Math.min(innerBox / logo.vw, innerBox / logo.vh);
  const tx = inset + (innerBox - logo.vw * scale) / 2 - logo.vx * scale;
  const ty = inset + (innerBox - logo.vh * scale) / 2 - logo.vy * scale;

  const mark = recolor(logo.inner, TILE_ENABLED ? "#FFFFFF" : markColor);
  const tileRect = TILE_ENABLED
    ? `\n<rect width="${TILE_SIZE}" height="${TILE_SIZE}" rx="${radius}" fill="${TILE_COLOR}"/>`
    : "";

  return `<svg width="${TILE_SIZE}" height="${TILE_SIZE}" viewBox="0 0 ${TILE_SIZE} ${TILE_SIZE}" fill="none" xmlns="http://www.w3.org/2000/svg">${tileRect}
<g transform="translate(${tx} ${ty}) scale(${scale})">
${mark}
</g>
</svg>
`;
}

// --- public/safari-pinned-tab.svg (black mark, no tile) --------------------

function buildSafariPinnedTab(logo) {
  const mark = recolor(logo.inner, "#000000");
  return `<svg width="${logo.vw}" height="${logo.vh}" viewBox="${logo.viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">
${mark}
</svg>
`;
}

// --- rasters -----------------------------------------------------------

async function rasterize(iconSvgPath) {
  const svgBuffer = fs.readFileSync(iconSvgPath);

  const appleTouch = await sharp(svgBuffer, { density: 384 })
    .resize(180, 180)
    .png()
    .toBuffer();
  fs.writeFileSync(APPLE_TOUCH_OUT, appleTouch);
  console.log(`  wrote ${path.relative(ROOT, APPLE_TOUCH_OUT)}`);

  const sizes = [16, 32, 48];
  const tmpDir = fs.mkdtempSync(path.join(ROOT, ".brand-tmp-"));
  try {
    const pngPaths = [];
    for (const size of sizes) {
      const png = await sharp(svgBuffer, { density: 384 })
        .resize(size, size)
        .png()
        .toBuffer();
      const p = path.join(tmpDir, `favicon-${size}.png`);
      fs.writeFileSync(p, png);
      pngPaths.push(p);
    }
    execFileSync("magick", [...pngPaths, FAVICON_OUT]);
    fs.copyFileSync(FAVICON_OUT, FAVICON_APP_OUT);
    console.log(`  wrote ${path.relative(ROOT, FAVICON_OUT)} (+ src/app copy)`);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// --- main ----------------------------------------------------------------

async function main() {
  console.log(`Reading ${path.relative(ROOT, LOGO_SRC)}...`);
  const logo = readLogo();

  console.log("Generating brand assets...");
  writeFile(GLYPH_OUT, buildGlyphComponent(logo));

  const tileIcon = buildTileIcon(logo, { markColor: "#000000" });
  writeFile(ICON_OUT, tileIcon);
  // Dark-UI variant: with the tile the two are identical; without it the
  // mark must flip to white or it vanishes on dark browser chrome.
  writeFile(
    ICON_DARK_OUT,
    TILE_ENABLED ? tileIcon : buildTileIcon(logo, { markColor: "#FFFFFF" })
  );

  writeFile(SAFARI_OUT, buildSafariPinnedTab(logo));

  console.log("Rasterizing...");
  await rasterize(ICON_OUT);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
