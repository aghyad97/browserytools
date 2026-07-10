import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const REQUIRED = [
  "--bt-bg", "--bt-surface", "--bt-ink", "--bt-muted", "--bt-faint",
  "--bt-line", "--bt-line-strong", "--bt-accent", "--bt-green",
  "--bt-nav-idle", "--bt-nav-active", "--bt-fill", "--bt-fill-hover",
  "--bt-pill-active-bg", "--bt-pill-active-fg", "--bt-pill-idle-fg",
  "--bt-divider", "--bt-new-pink", "--bt-star", "--bt-coffee",
  "--bt-hover", "--bt-overlay", "--bt-shadow-pop",
  ...["image","file","media","text","data","math","prod","dev","design","sec","ai"]
    .flatMap((c) => [`--bt-cat-${c}-bg`, `--bt-cat-${c}-fg`]),
  "--bt-ease-out", "--bt-ease-in-out",
];

describe("design tokens", () => {
  const css = readFileSync("src/styles/design-tokens.css", "utf8");
  const root = css.split(".dark")[0];
  const dark = css.split(".dark")[1] ?? "";
  it.each(REQUIRED)("%s defined in :root", (t) => expect(root).toContain(`${t}:`));
  it.each(REQUIRED.filter((t) => !t.includes("ease")))("%s overridden in .dark", (t) =>
    expect(dark).toContain(`${t}:`),
  );
});
