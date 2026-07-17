import { describe, it, expect } from "vitest";
import { srtTime, vttTime, buildSrt, buildVtt, type CueDoc } from "@/lib/subtitles/cues";

const doc: CueDoc = [
  { id: "a", start: 0, end: 1.5, text: "Hello" },
  { id: "b", start: 1.5, end: 3, text: "world" },
];

describe("srt/vtt", () => {
  it("srtTime uses comma ms", () => expect(srtTime(1.5)).toBe("00:00:01,500"));
  it("vttTime uses dot ms", () => expect(vttTime(1.5)).toBe("00:00:01.500"));
  it("buildSrt numbers cues", () =>
    expect(buildSrt(doc)).toContain("1\n00:00:00,000 --> 00:00:01,500\nHello"));
  it("buildVtt has header", () => expect(buildVtt(doc).startsWith("WEBVTT")).toBe(true));
});
