import { describe, it, expect } from "vitest";
import {
  fromWhisperWords,
  splitCue,
  mergeCues,
  retime,
  shiftAll,
  type CueDoc,
  type Word,
} from "@/lib/subtitles/cues";

describe("fromWhisperWords", () => {
  it("groups words into cues, breaking on large gaps", () => {
    const words: Word[] = [
      { start: 0, end: 0.4, text: "Hello" },
      { start: 0.5, end: 0.9, text: "world" },
      { start: 3.0, end: 3.4, text: "Next" },
      { start: 3.5, end: 3.9, text: "cue" },
    ];
    const doc = fromWhisperWords(words, { maxGap: 1 });
    expect(doc).toHaveLength(2);
    expect(doc[0].text).toBe("Hello world");
    expect(doc[0].start).toBe(0);
    expect(doc[0].end).toBe(0.9);
    expect(doc[1].text).toBe("Next cue");
    expect(doc[1].start).toBe(3.0);
    expect(doc[1].end).toBe(3.9);
  });

  it("breaks on char budget", () => {
    const words: Word[] = [
      { start: 0, end: 0.4, text: "aaaaaaaaaa" },
      { start: 0.5, end: 0.9, text: "bbbbbbbbbb" },
      { start: 1.0, end: 1.4, text: "cccccccccc" },
    ];
    const doc = fromWhisperWords(words, { maxCharsPerCue: 15, maxGap: 10 });
    expect(doc.length).toBeGreaterThan(1);
    for (const cue of doc) {
      expect(cue.text.length).toBeLessThanOrEqual(25);
    }
  });

  it("produces deterministic ids without randomness", () => {
    const words: Word[] = [
      { start: 0, end: 0.4, text: "Hi" },
      { start: 5, end: 5.4, text: "there" },
    ];
    const doc = fromWhisperWords(words, { maxGap: 1 });
    expect(doc[0].id).toBe("0-0");
    expect(doc[1].id).toBe("5-1");
  });

  it("attaches words to each cue", () => {
    const words: Word[] = [
      { start: 0, end: 0.4, text: "Hi" },
      { start: 0.5, end: 0.9, text: "there" },
    ];
    const doc = fromWhisperWords(words, { maxGap: 1 });
    expect(doc[0].words).toEqual(words);
  });

  it("returns empty doc for empty input", () => {
    expect(fromWhisperWords([])).toEqual([]);
  });
});

describe("splitCue", () => {
  const doc: CueDoc = [
    {
      id: "a",
      start: 0,
      end: 2,
      text: "Hello there world",
      words: [
        { start: 0, end: 0.5, text: "Hello" },
        { start: 0.6, end: 1.1, text: "there" },
        { start: 1.5, end: 2, text: "world" },
      ],
    },
    { id: "b", start: 2, end: 3, text: "next" },
  ];

  it("splits a cue at atTime into two", () => {
    const result = splitCue(doc, "a", 1.2);
    expect(result).toHaveLength(3);
    expect(result[0].start).toBe(0);
    expect(result[0].end).toBe(1.2);
    expect(result[1].start).toBe(1.2);
    expect(result[1].end).toBe(2);
    expect(result[2].id).toBe("b");
  });

  it("partitions words by atTime", () => {
    const result = splitCue(doc, "a", 1.2);
    expect(result[0].words?.map((w) => w.text)).toEqual(["Hello", "there"]);
    expect(result[1].words?.map((w) => w.text)).toEqual(["world"]);
  });

  it("splits text proportionally when the cue has no word timings", () => {
    const noWordsDoc: CueDoc = [{ id: "x", start: 0, end: 4, text: "one two three four" }];
    const result = splitCue(noWordsDoc, "x", 2);
    expect(result).toHaveLength(2);
    expect(result[0].start).toBe(0);
    expect(result[0].end).toBe(2);
    expect(result[1].start).toBe(2);
    expect(result[1].end).toBe(4);
    expect(`${result[0].text} ${result[1].text}`.trim()).toBe("one two three four");
  });

  it("is a no-op when atTime is outside the cue span", () => {
    expect(splitCue(doc, "a", 5)).toEqual(doc);
    expect(splitCue(doc, "a", -1)).toEqual(doc);
  });

  it("does not mutate the input doc", () => {
    const before = JSON.parse(JSON.stringify(doc));
    splitCue(doc, "a", 1.2);
    expect(doc).toEqual(before);
  });
});

describe("mergeCues", () => {
  const doc: CueDoc = [
    { id: "a", start: 0, end: 1, text: "Hello", words: [{ start: 0, end: 1, text: "Hello" }] },
    { id: "b", start: 1, end: 2, text: "world", words: [{ start: 1, end: 2, text: "world" }] },
    { id: "c", start: 2, end: 3, text: "!" },
  ];

  it("joins two cues into one", () => {
    const result = mergeCues(doc, "a", "b");
    expect(result).toHaveLength(2);
    expect(result[0].text).toBe("Hello world");
    expect(result[0].start).toBe(0);
    expect(result[0].end).toBe(2);
    expect(result[0].words).toHaveLength(2);
    expect(result[1].id).toBe("c");
  });

  it("works regardless of argument order", () => {
    const result = mergeCues(doc, "b", "a");
    expect(result[0].text).toBe("Hello world");
    expect(result[0].start).toBe(0);
    expect(result[0].end).toBe(2);
  });

  it("does not mutate the input doc", () => {
    const before = JSON.parse(JSON.stringify(doc));
    mergeCues(doc, "a", "b");
    expect(doc).toEqual(before);
  });
});

describe("retime", () => {
  const doc: CueDoc = [
    { id: "a", start: 0, end: 1, text: "one" },
    { id: "b", start: 1, end: 2, text: "two" },
    { id: "c", start: 2, end: 3, text: "three" },
  ];

  it("changes start/end within bounds", () => {
    const result = retime(doc, "b", { start: 1.2, end: 1.8 });
    expect(result[1].start).toBe(1.2);
    expect(result[1].end).toBe(1.8);
  });

  it("clamps start so it cannot precede the previous cue's end", () => {
    const result = retime(doc, "b", { start: 0.5 });
    expect(result[1].start).toBe(1);
  });

  it("clamps end so it cannot exceed the next cue's start", () => {
    const result = retime(doc, "b", { end: 2.5 });
    expect(result[1].end).toBe(2);
  });

  it("does not mutate the input doc", () => {
    const before = JSON.parse(JSON.stringify(doc));
    retime(doc, "b", { start: 1.2 });
    expect(doc).toEqual(before);
  });
});

describe("shiftAll", () => {
  const doc: CueDoc = [
    {
      id: "a",
      start: 1,
      end: 2,
      text: "hi",
      words: [{ start: 1, end: 2, text: "hi" }],
    },
  ];

  it("shifts every cue and word by delta", () => {
    const result = shiftAll(doc, 5);
    expect(result[0].start).toBe(6);
    expect(result[0].end).toBe(7);
    expect(result[0].words?.[0].start).toBe(6);
    expect(result[0].words?.[0].end).toBe(7);
  });

  it("clamps to zero when delta is negative and would go below 0", () => {
    const result = shiftAll(doc, -5);
    expect(result[0].start).toBe(0);
  });

  it("does not mutate the input doc", () => {
    const before = JSON.parse(JSON.stringify(doc));
    shiftAll(doc, 5);
    expect(doc).toEqual(before);
  });
});
