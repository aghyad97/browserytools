/**
 * Copy the tesseract.js worker and ALL tesseract.js-core engine files out of
 * node_modules into public/tesseract/ so the OCR tool is fully self-hosted
 * (no third-party CDN for the engine). The language traineddata is still
 * fetched on demand from the official tessdata CDN — see the privacy note in
 * the Image to Text tool.
 *
 * We copy every file in tesseract.js-core (all SIMD / relaxedsimd / lstm
 * variants) because the engine selects a variant at runtime based on the
 * browser's WASM feature support (e.g. tesseract-core-relaxedsimd-lstm.wasm.js
 * on modern Chrome). Copying only a subset breaks OCR on browsers that pick a
 * variant we didn't ship.
 *
 * Wired into package.json via the "copy-assets" (postinstall / prebuild) script.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "tesseract");
const coreDir = path.join(root, "node_modules", "tesseract.js-core");
const workerSrc = path.join(
  root,
  "node_modules",
  "tesseract.js",
  "dist",
  "worker.min.js"
);

function main() {
  if (!fs.existsSync(coreDir)) {
    console.warn("[copy-tesseract] tesseract.js-core not installed; skipping.");
    return;
  }
  fs.mkdirSync(outDir, { recursive: true });

  let copied = 0;

  // Copy every engine file (all wasm + loader variants).
  for (const file of fs.readdirSync(coreDir)) {
    if (
      file.endsWith(".wasm") ||
      file.endsWith(".wasm.js") ||
      file.startsWith("tesseract-core")
    ) {
      fs.copyFileSync(path.join(coreDir, file), path.join(outDir, file));
      copied++;
    }
  }

  // The worker script (loaded via workerPath).
  if (fs.existsSync(workerSrc)) {
    fs.copyFileSync(workerSrc, path.join(outDir, "worker.min.js"));
    copied++;
  }

  console.log(`[copy-tesseract] copied ${copied} file(s) to public/tesseract/`);
}

main();
