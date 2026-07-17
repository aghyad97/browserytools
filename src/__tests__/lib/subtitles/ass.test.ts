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
});
