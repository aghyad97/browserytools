import { describe, it, expect } from "vitest";
import { toAss, hexToAssColor } from "@/lib/subtitles/ass";
import { PRESETS } from "@/lib/subtitles/styles";
import type { CueDoc } from "@/lib/subtitles/cues";

const doc: CueDoc = [{ id: "a", start: 0, end: 1, text: "Hi", words: [{ start: 0, end: 1, text: "Hi" }] }];

describe("ass", () => {
  it("hexToAssColor flips RGB->BGR with 00 alpha", () => expect(hexToAssColor("#112233")).toBe("&H00332211"));
  it("toAss has header sized to the video", () => {
    const s = toAss(doc, PRESETS["clean-caption"], { w: 1080, h: 1920 });
    expect(s).toContain("PlayResX: 1080");
    expect(s).toContain("PlayResY: 1920");
    expect(s).toMatch(/\[V4\+ Styles\]/);
    expect(s).toMatch(/Dialogue:.*Hi/);
  });
  it("karaoke emits \\k centisecond tags from word timings", () => {
    const kdoc: CueDoc = [
      { id: "a", start: 0, end: 1, text: "a b", words: [{ start: 0, end: 0.5, text: "a" }, { start: 0.5, end: 1, text: "b" }] },
    ];
    const s = toAss(kdoc, { ...PRESETS["clean-caption"], animation: "karaoke" }, { w: 1280, h: 720 });
    expect(s).toMatch(/\{\\k50\}a/); // 0.5s = 50cs
  });

  // BUG 1: SecondaryColour was hardcoded to pure red (&H000000FF) regardless
  // of the style — every karaoke/word-highlight caption flashed red on
  // not-yet-spoken words. It must instead derive from the style's own
  // `highlight` accent colour.
  // libass \k semantics: a syllable renders in SecondaryColour until its own
  // cumulative \k timer elapses, then switches to (and stays) PrimaryColour.
  // So the "sung" (lit-up) state is PrimaryColour and "unsung" is
  // SecondaryColour — the accent belongs in PrimaryColour, the base text
  // colour in SecondaryColour, which is the reverse of a naive mapping.
  it("karaoke style maps accent to PrimaryColour (sung) and base to SecondaryColour (unsung), not red", () => {
    const s = toAss(doc, { ...PRESETS["tiktok-bold"], animation: "karaoke" }, { w: 1080, h: 1920 });
    const styleLine = s.split("\n").find((l) => l.startsWith("Style: Default,"));
    expect(styleLine).toBeDefined();
    const expectedPrimary = hexToAssColor(PRESETS["tiktok-bold"].highlight);
    const expectedSecondary = hexToAssColor(PRESETS["tiktok-bold"].primary);
    expect(styleLine).toContain(`,${expectedPrimary},${expectedSecondary},`);
    expect(styleLine).not.toContain(",&H000000FF,");
  });

  it("non-karaoke style doesn't show a stray highlight (SecondaryColour == PrimaryColour)", () => {
    const s = toAss(doc, PRESETS["clean-caption"], { w: 1080, h: 1920 });
    const styleLine = s.split("\n").find((l) => l.startsWith("Style: Default,"));
    expect(styleLine).toBeDefined();
    const primary = hexToAssColor(PRESETS["clean-caption"].primary);
    // PrimaryColour and SecondaryColour must be identical so there's no
    // colour to clash with — no \k tags are ever emitted for this style.
    expect(styleLine).toContain(`,${primary},${primary},`);
  });

  // BUG 2: \k durations are cumulative from Dialogue Start. Deriving each
  // tag only from (word.end - word.start) silently drops gaps between
  // words, causing every later word's highlight to fire early.
  it("emits a gap \\k to account for silence between words", () => {
    const gdoc: CueDoc = [
      {
        id: "a",
        start: 0,
        end: 1.5,
        text: "a b",
        words: [
          { start: 0, end: 0.5, text: "a" },
          { start: 1.0, end: 1.5, text: "b" },
        ],
      },
    ];
    const s = toAss(gdoc, { ...PRESETS["clean-caption"], animation: "karaoke" }, { w: 1280, h: 720 });
    const dialogueLine = s.split("\n").find((l) => l.startsWith("Dialogue:"));
    expect(dialogueLine).toBeDefined();
    // Extract all \k tags in order and sum them up to the point "b" appears.
    const tags = [...(dialogueLine as string).matchAll(/\{\\k(\d+)\}([^{]*)/g)];
    let cumulative = 0;
    let bStartCs = -1;
    for (const [, csStr, text] of tags) {
      if (text.includes("b")) {
        bStartCs = cumulative;
        break;
      }
      cumulative += Number(csStr);
    }
    expect(bStartCs).toBe(100); // word "b" starts at 1.0s = 100cs, not 50cs
  });

  // Fix: editing a cue's text under a word-highlight/karaoke preset must not
  // silently keep rendering the stale per-word `\k` runs. When `words` is
  // absent (cleared by CueEditor on a text edit), dialogueText must fall
  // back to the plain, current `cue.text` — not an empty line, not a throw.
  it("word-highlight/karaoke falls back to plain cue.text when words is absent", () => {
    const editedDoc: CueDoc = [{ id: "a", start: 0, end: 1, text: "edited line", words: undefined }];
    const s = toAss(editedDoc, { ...PRESETS["tiktok-bold"], animation: "word-highlight" }, { w: 1080, h: 1920 });
    const dialogueLine = s.split("\n").find((l) => l.startsWith("Dialogue:"));
    expect(dialogueLine).toBeDefined();
    expect(dialogueLine).toContain("edited line");
    expect(dialogueLine).not.toMatch(/\\k\d+/);
  });
});
