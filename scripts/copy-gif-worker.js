// Copies the gif.js web worker into public/ so it can be served locally
// (no runtime CDN dependency). Runs automatically via the postinstall and
// prebuild npm scripts. Idempotent — safe to run repeatedly.
const fs = require("node:fs");
const path = require("node:path");

const src = path.join(
  __dirname,
  "..",
  "node_modules",
  "gif.js",
  "dist",
  "gif.worker.js"
);
const dest = path.join(__dirname, "..", "public", "gif.worker.js");

try {
  if (!fs.existsSync(src)) {
    console.warn(
      "[copy-gif-worker] gif.js not installed yet; skipping worker copy."
    );
    process.exit(0);
  }
  fs.copyFileSync(src, dest);
  console.log(`[copy-gif-worker] Copied gif.worker.js -> ${dest}`);
} catch (err) {
  console.error("[copy-gif-worker] Failed to copy gif.worker.js:", err);
  process.exit(1);
}
