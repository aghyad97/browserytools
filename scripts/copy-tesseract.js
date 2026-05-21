/**
 * Copy the tesseract.js worker and the tesseract.js-core WASM files out of
 * node_modules into public/tesseract/ so the OCR tool can be fully self-hosted
 * (no third-party CDN for the engine itself). The language traineddata is still
 * fetched on demand from the official tessdata CDN — see the privacy note in the
 * Image to Text tool.
 *
 * Wired into package.json via the "postinstall" / "prebuild" scripts.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "tesseract");

const files = [
  // worker (loaded via workerPath)
  ["node_modules/tesseract.js/dist/worker.min.js", "worker.min.js"],
  // core engine (loaded via corePath — Tesseract picks the right variant)
  ["node_modules/tesseract.js-core/tesseract-core.wasm.js", "tesseract-core.wasm.js"],
  ["node_modules/tesseract.js-core/tesseract-core.wasm", "tesseract-core.wasm"],
  ["node_modules/tesseract.js-core/tesseract-core-simd.wasm.js", "tesseract-core-simd.wasm.js"],
  ["node_modules/tesseract.js-core/tesseract-core-simd.wasm", "tesseract-core-simd.wasm"],
  ["node_modules/tesseract.js-core/tesseract-core-lstm.wasm.js", "tesseract-core-lstm.wasm.js"],
  ["node_modules/tesseract.js-core/tesseract-core-lstm.wasm", "tesseract-core-lstm.wasm"],
  ["node_modules/tesseract.js-core/tesseract-core-simd-lstm.wasm.js", "tesseract-core-simd-lstm.wasm.js"],
  ["node_modules/tesseract.js-core/tesseract-core-simd-lstm.wasm", "tesseract-core-simd-lstm.wasm"],
];

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  let copied = 0;
  let missing = 0;
  for (const [from, to] of files) {
    const src = path.join(root, from);
    const dest = path.join(outDir, to);
    if (!fs.existsSync(src)) {
      // Some core variants may not exist in every tesseract.js-core version.
      // Skip silently rather than failing the whole build.
      missing++;
      continue;
    }
    fs.copyFileSync(src, dest);
    copied++;
  }
  console.log(`[copy-tesseract] copied ${copied} file(s) to public/tesseract/${missing ? ` (${missing} optional missing)` : ""}`);
}

main();
