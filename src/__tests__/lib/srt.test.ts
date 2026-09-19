import { describe, expect, it } from "vitest";
import { activeCue, parseSrt, parseSrtTimestamp } from "@/lib/subtitles/srt";

describe("SRT timing", () => {
  it("parses millisecond timestamps exactly", () => expect(parseSrtTimestamp("01:02:03,450")).toBe(3723.45));
  it("parses multiline cues and ignores malformed blocks", () => {
    const cues = parseSrt("1\n00:00:01,000 --> 00:00:02,500\nHello\nworld\n\nbad\nno timing");
    expect(cues).toEqual([{ id: "1", start: 1, end: 2.5, text: "Hello\nworld" }]);
  });
  it("applies offset while choosing the active cue", () => {
    const cues = parseSrt("1\n00:00:01,000 --> 00:00:02,000\nHello");
    expect(activeCue(cues, 0.6, 0.5)?.text).toBe("Hello");
    expect(activeCue(cues, 2, 0.5)).toBeUndefined();
  });
});
