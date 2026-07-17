import { describe, it, expect } from "vitest";
import { splitGroups } from "@/lib/groups";

const id = () => 0; // deterministic (no shuffle) for assertion

describe("splitGroups", () => {
  it("count mode spreads remainder evenly", () => {
    const g = splitGroups(["a", "b", "c", "d", "e"], { kind: "count", n: 2 }, id);
    expect(g.map((x) => x.length).sort()).toEqual([2, 3]);
    expect(g.flat().sort()).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("size mode caps group size", () => {
    const g = splitGroups(["a", "b", "c", "d", "e"], { kind: "size", size: 2 }, id);
    expect(Math.max(...g.map((x) => x.length))).toBeLessThanOrEqual(2);
    expect(g.flat().sort()).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("returns an empty array for an empty name list", () => {
    expect(splitGroups([], { kind: "count", n: 3 }, id)).toEqual([]);
  });

  it("group sizes differ by at most 1 in count mode", () => {
    const g = splitGroups(["a", "b", "c", "d", "e", "f", "g"], { kind: "count", n: 3 }, id);
    const lengths = g.map((x) => x.length);
    expect(Math.max(...lengths) - Math.min(...lengths)).toBeLessThanOrEqual(1);
    expect(g.flat().sort()).toEqual(["a", "b", "c", "d", "e", "f", "g"]);
  });

  it("uses Math.random by default (shuffles without an injected rng)", () => {
    const g = splitGroups(["a", "b", "c", "d"], { kind: "count", n: 2 });
    expect(g.flat().sort()).toEqual(["a", "b", "c", "d"]);
  });

  it("count mode clamps group count to the number of names", () => {
    const g = splitGroups(["a", "b", "c"], { kind: "count", n: 10 }, id);
    expect(g).toHaveLength(3);
    expect(g.every((group) => group.length > 0)).toBe(true);
    expect(g.flat().sort()).toEqual(["a", "b", "c"]);
  });

  it("size mode never yields empty groups when size implies more groups than names", () => {
    const g = splitGroups(["a", "b", "c"], { kind: "size", size: 0.1 }, id);
    expect(g.every((group) => group.length > 0)).toBe(true);
    expect(g.flat().sort()).toEqual(["a", "b", "c"]);
  });
});
