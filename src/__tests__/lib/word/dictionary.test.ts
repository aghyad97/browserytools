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

  describe("count-aware gray handling (double letters)", () => {
    it("green s + gray s means exactly one s: excludes a two-s candidate, includes a one-s candidate", () => {
      const dd = buildDict(["sadly", "spits", "today"]);
      const res = wordleMatches(dd, {
        greens: ["s", null, null, null, null],
        yellows: [],
        grays: ["s"],
      });
      expect(res).toContain("sadly"); // one s, at position 0
      expect(res).not.toContain("spits"); // two s's — gray s caps the count at 1
      expect(res).not.toContain("today"); // no s at all, fails the green
    });

    it("yellow s + gray s means exactly one s, not at the yellow position", () => {
      const dd = buildDict(["sadly", "spots", "toads"]);
      const res = wordleMatches(dd, {
        greens: [null, null, null, null, null],
        yellows: [{ letter: "s", pos: 1 }],
        grays: ["s"],
      });
      expect(res).toContain("sadly"); // one s, not at index 1
      expect(res).toContain("toads"); // one s, not at index 1
      expect(res).not.toContain("spots"); // two s's — gray s caps the count at 1
    });

    it("green k + gray k means exactly one k: excludes kayak (two k's)", () => {
      const dd = buildDict(["kayak", "koala", "kazoo"]);
      const res = wordleMatches(dd, {
        greens: ["k", null, null, null, null],
        yellows: [],
        grays: ["k"],
      });
      expect(res).toContain("koala");
      expect(res).toContain("kazoo");
      expect(res).not.toContain("kayak"); // two k's — gray k caps the count at 1
    });
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
