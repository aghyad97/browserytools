import { mkdir, copyFile, access, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Self-hosts JASSUB (in-browser libass) assets under public/jassub so the
 * subtitle burn-in path runs with ZERO external/CDN fetches — mirrors
 * scripts/copy-ffmpeg.mjs.
 *
 * JASSUB's worker (dist/worker/worker.js) ships as an ESM module with bare
 * imports (abslink, lfa-ponyfill) and inline renderer/emscripten-glue imports,
 * so it must be BUNDLED into a single self-contained module worker before it
 * can be served as a static file. We bundle it with Bun and copy the wasm
 * cores + the default (Liberation Sans) font alongside it.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "node_modules", "jassub", "dist");
const destDir = join(root, "public", "jassub");

const workerEntry = join(distDir, "worker", "worker.js");
const copyFiles = [
  // non-SIMD fallback core + SIMD ("modern") core, referenced explicitly via
  // wasmUrl / modernWasmUrl at runtime.
  ["wasm/jassub-worker.wasm", "jassub-worker.wasm"],
  ["wasm/jassub-worker-modern.wasm", "jassub-worker-modern.wasm"],
  // default Liberation Sans fallback font (woff2).
  ["default.woff2", "default.woff2"],
];

async function main() {
  try {
    await access(distDir);
  } catch {
    console.warn(
      "[copy-jassub] jassub not installed yet; skipping. Run again after install."
    );
    return;
  }

  await mkdir(destDir, { recursive: true });

  // Bundle the module worker into a single self-contained ESM file.
  const result = await Bun.build({
    entrypoints: [workerEntry],
    target: "browser",
    format: "esm",
    minify: true,
    // The emscripten glue references its .wasm via new URL(..., import.meta.url);
    // we override that at runtime with wasmUrl/modernWasmUrl, so keep the wasm
    // OUT of the bundle (served separately as static files).
    external: ["*.wasm"],
  });

  if (!result.success) {
    for (const log of result.logs) console.error(log);
    throw new Error("[copy-jassub] worker bundle failed");
  }

  for (const out of result.outputs) {
    if (out.kind === "entry-point") {
      const code = await out.text();
      await writeFile(join(destDir, "jassub-worker.bundle.js"), code);
      console.log(
        `[copy-jassub] bundled worker -> public/jassub/jassub-worker.bundle.js (${(
          code.length / 1024
        ).toFixed(0)} KB)`
      );
    }
  }

  for (const [src, dest] of copyFiles) {
    await copyFile(join(distDir, src), join(destDir, dest));
    console.log(`[copy-jassub] copied ${dest} -> public/jassub/${dest}`);
  }
}

main().catch((err) => {
  console.error("[copy-jassub] failed:", err);
  process.exit(1);
});
