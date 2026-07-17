import { describe, it, expect } from "vitest";
import {
  buildDict, isWord, unscramble, anagramsOf, wordleMatches, sortLetters,
} from "@/lib/word/dictionary";

const dict = buildDict(["cat", "act", "car", "arc", "care", "race", "a", "at", "scar", "cars"]);

describe("sortLetters", () => {
  it("sorts a word's letters", () => expect(sortLetters("cat")).toBe("act"));
});

describe("isWord", () => {
  it("is case-insensitive membership", () => {
    expect(isWord("CAT", dict)).toBe(true);
    expect(isWord("zzz", dict)).toBe(false);
  });
});

describe("unscramble", () => {
  it("returns dict words formable from the letters, length desc", () => {
    // "cats" has no "r", so "scar"/"cars" (and, transitively, "car"/"arc") cannot be formed.
    expect(unscramble("cats", dict)).toEqual(["act", "cat", "at", "a"]);
  });
  it("honors minLength", () => {
    expect(unscramble("cats", dict, { minLength: 3 })).toEqual(["act", "cat"]);
  });
  it("honors contains", () => {
    expect(unscramble("care", dict, { contains: "e" })).toEqual(["care", "race"]);
  });
});

describe("anagramsOf", () => {
  it("exact-length anagrams only by default", () => {
    expect(anagramsOf("cat", dict)).toEqual(["act", "cat"]);
  });
  it("includes shorter when allowShorter", () => {
    expect(anagramsOf("cat", dict, { allowShorter: true })).toEqual(["act", "cat", "at", "a"]);
  });
});

describe("wordleMatches", () => {
  const w = buildDict(["crane", "trace", "crate", "brace", "grace"]);
  it("filters by greens, yellows, grays", () => {
    // green r at index 1, no 'a' at index 2 (yellow a somewhere), no 'b'
    const res = wordleMatches(w, {
      greens: [null, "r", null, null, null],
      yellows: [{ letter: "a", pos: 4 }],
      grays: ["b"],
    });
    expect(res).toContain("crane");
    expect(res).toContain("crate");
    expect(res).not.toContain("brace"); // gray b
  });
});
