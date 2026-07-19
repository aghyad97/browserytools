#!/usr/bin/env node

/**
 * Copy PDF.js Worker + Font/CMap Assets
 *
 * Copies the pdf.worker.min.mjs that ships with the installed pdfjs-dist
 * version into public/ so the worker is self-hosted (no runtime CDN load).
 * Also copies standard_fonts/ and cmaps/ into public/ — the layout engine
 * (src/lib/pdf/layout/) sets standardFontDataUrl/cMapUrl to these, since a
 * spike measured that omitting them degrades the font metrics
 * (item.width/height) it depends on for table/column geometry (wave spec
 * §7); cmaps/ additionally covers CJK text.
 * Running this from the installed package guarantees every copied asset's
 * version always matches the pdfjs-dist API version used in the app.
 */

const fs = require("fs");
const path = require("path");

const pdfjsDistDir = path.join(__dirname, "..", "node_modules", "pdfjs-dist");
const destDir = path.join(__dirname, "..", "public");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// pdf.worker.min.mjs — single file.
const workerSrc = path.join(pdfjsDistDir, "build", "pdf.worker.min.mjs");
if (!fs.existsSync(workerSrc)) {
  console.error(`PDF.js worker not found at ${workerSrc}. Did you run install?`);
  process.exit(1);
}
fs.copyFileSync(workerSrc, path.join(destDir, "pdf.worker.min.mjs"));

// standard_fonts/ and cmaps/ — whole directories.
for (const dirName of ["standard_fonts", "cmaps"]) {
  const dirSrc = path.join(pdfjsDistDir, dirName);
  if (!fs.existsSync(dirSrc)) {
    console.error(`PDF.js ${dirName} not found at ${dirSrc}. Did you run install?`);
    process.exit(1);
  }
  fs.cpSync(dirSrc, path.join(destDir, dirName), { recursive: true });
}

const version = require("../node_modules/pdfjs-dist/package.json").version;
console.log(
  `Copied pdf.worker.min.mjs, standard_fonts/, cmaps/ (pdfjs-dist@${version}) to public/`
);
