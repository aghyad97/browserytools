import { mkdir, copyFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcDir = join(root, "node_modules", "@ffmpeg", "core", "dist", "umd");
const destDir = join(root, "public", "ffmpeg");
const files = ["ffmpeg-core.js", "ffmpeg-core.wasm"];

async function main() {
  try {
    await access(srcDir);
  } catch {
    console.warn(
      "[copy-ffmpeg] @ffmpeg/core not installed yet; skipping. Run again after install."
    );
    return;
  }

  await mkdir(destDir, { recursive: true });
  for (const file of files) {
    await copyFile(join(srcDir, file), join(destDir, file));
    console.log(`[copy-ffmpeg] copied ${file} -> public/ffmpeg/${file}`);
  }
}

main().catch((err) => {
  console.error("[copy-ffmpeg] failed:", err);
  process.exit(1);
});
