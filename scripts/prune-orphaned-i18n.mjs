#!/usr/bin/env node
/**
 * Prune orphaned copy-related i18n keys (Wave R3 cleanup).
 *
 * After the R2/R3 adoption of the shared <OutputPanel> / <CopyButton>
 * molecules, many tools stopped rendering their own copy button / toast, so
 * their tool-local copy strings became dead weight. This script finds every
 * `Tools.<Namespace>.<leaf>` whose leaf name matches a copy pattern
 * (copy / copied / copyFailed / failedToCopy / nothingToCopy) but is NOT
 * referenced (as a whole word) in that namespace's owner component
 * (the file that calls `useTranslations("Tools.<Namespace>")`), then deletes
 * those exact key paths from ALL locale files.
 *
 * en.json is the source of truth for WHICH keys are orphaned (code refs are
 * checked against src/). The same key paths are then removed from every
 * locale, so the per-locale deletion count MUST be identical across all 9.
 *
 * Usage:
 *   node scripts/prune-orphaned-i18n.mjs            # apply
 *   node scripts/prune-orphaned-i18n.mjs --dry-run  # report only
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const messagesDir = path.join(root, "messages");
const DRY = process.argv.includes("--dry-run");

const COPY_PATTERN = /copy|copied|failedtocopy|nothingtocopy/i;

const en = JSON.parse(readFileSync(path.join(messagesDir, "en.json"), "utf8"));
const tools = en.Tools ?? {};

function ownerFiles(ns) {
  try {
    return execSync(
      `grep -rlE '(useTranslations|getTranslations)\\("Tools\\.${ns}"' src --include='*.ts' --include='*.tsx'`,
      { cwd: root, encoding: "utf8" }
    )
      .trim()
      .split("\n")
      .filter(Boolean);
  } catch {
    return [];
  }
}

function leafReferenced(leaf, files) {
  if (files.length === 0) return true; // no known owner -> keep (conservative)
  try {
    execSync(`grep -lw ${JSON.stringify(leaf)} ${files.map((f) => JSON.stringify(f)).join(" ")}`, {
      cwd: root,
      encoding: "utf8",
    });
    return true;
  } catch {
    return false;
  }
}

// Derive the orphan key paths from en.json + src.
const orphanPaths = [];
for (const [ns, obj] of Object.entries(tools)) {
  if (typeof obj !== "object" || obj === null) continue;
  const leaves = Object.keys(obj).filter((k) => COPY_PATTERN.test(k));
  if (leaves.length === 0) continue;
  const files = ownerFiles(ns);
  for (const leaf of leaves) {
    if (!leafReferenced(leaf, files)) orphanPaths.push([ns, leaf]);
  }
}

console.log(`Derived ${orphanPaths.length} orphaned copy key(s) from en.json + src:\n`);
for (const [ns, leaf] of orphanPaths) console.log(`  Tools.${ns}.${leaf}`);
console.log("");

const locales = readdirSync(messagesDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

const counts = {};
for (const file of locales) {
  const full = path.join(messagesDir, file);
  const data = JSON.parse(readFileSync(full, "utf8"));
  let removed = 0;
  for (const [ns, leaf] of orphanPaths) {
    if (data.Tools?.[ns] && Object.hasOwn(data.Tools[ns], leaf)) {
      delete data.Tools[ns][leaf];
      removed++;
    }
  }
  counts[file] = removed;
  if (!DRY && removed > 0) {
    writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`);
  }
}

console.log(`${DRY ? "[dry-run] would remove" : "Removed"} per locale:`);
for (const file of locales) console.log(`  ${file.padEnd(10)} ${counts[file]}`);

const distinct = new Set(Object.values(counts));
if (distinct.size !== 1) {
  console.error(
    `\n⚠️  Per-locale counts differ — locale drift detected. A locale is missing keys en.json has: ${JSON.stringify(counts)}`
  );
  process.exit(1);
}
console.log(`\nAll ${locales.length} locales: ${[...distinct][0]} keys each. Parity OK.`);
