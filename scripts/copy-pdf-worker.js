#!/usr/bin/env node

/**
 * Copy PDF.js Worker
 *
 * Copies the pdf.worker.min.mjs that ships with the installed pdfjs-dist
 * version into public/ so the worker is self-hosted (no runtime CDN load).
 * Running this from the installed package guarantees the worker version
 * always matches the pdfjs-dist API version used in the app.
 */

const fs = require("fs");
const path = require("path");

const src = path.join(
  __dirname,
  "..",
  "node_modules",
  "pdfjs-dist",
  "build",
  "pdf.worker.min.mjs"
);
const destDir = path.join(__dirname, "..", "public");
const dest = path.join(destDir, "pdf.worker.min.mjs");

if (!fs.existsSync(src)) {
  console.error(`PDF.js worker not found at ${src}. Did you run install?`);
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);

const version = require("../node_modules/pdfjs-dist/package.json").version;
console.log(`Copied pdf.worker.min.mjs (pdfjs-dist@${version}) to public/`);
