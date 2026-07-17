import { describe, it, expect, vi, afterEach } from "vitest";
import {
  buildDict, isWord, unscramble, anagramsOf, wordleMatches, sortLetters, loadDictionary,
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

describe("loadDictionary", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("clears the in-flight memo on failure so a retry re-fetches", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve("cat\ncar\nact"),
      });
    vi.stubGlobal("fetch", fetchMock);

    await expect(loadDictionary()).rejects.toThrow("network down");
    const dict = await loadDictionary();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(isWord("cat", dict)).toBe(true);
  });
});
