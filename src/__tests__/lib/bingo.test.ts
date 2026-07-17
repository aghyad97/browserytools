import { describe, it, expect } from "vitest";
import { numberCard, wordCard, makeCards } from "@/lib/bingo";

const id = () => 0; // deterministic (reversal shuffle) for assertions

const COLUMN_RANGES: Array<[number, number]> = [
  [1, 15],
  [16, 30],
  [31, 45],
  [46, 60],
  [61, 75],
];

describe("numberCard", () => {
  it("is a 5x5 grid", () => {
    const card = numberCard(id);
    expect(card).toHaveLength(5);
    for (const row of card) expect(row).toHaveLength(5);
  });

  it("every column's values fall within that column's B/I/N/G/O range", () => {
    const card = numberCard(id);
    for (let col = 0; col < 5; col++) {
      const [min, max] = COLUMN_RANGES[col];
      for (let row = 0; row < 5; row++) {
        const cell = card[row][col];
        if (cell === "FREE") continue;
        expect(cell).toBeGreaterThanOrEqual(min);
        expect(cell).toBeLessThanOrEqual(max);
      }
    }
  });

  it("has no duplicate values within any column", () => {
    const card = numberCard(id);
    for (let col = 0; col < 5; col++) {
      const values = card.map((row) => row[col]).filter((v) => v !== "FREE");
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("center cell is FREE", () => {
    const card = numberCard(id);
    expect(card[2][2]).toBe("FREE");
  });

  it("no other cell is FREE", () => {
    const card = numberCard(id);
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (row === 2 && col === 2) continue;
        expect(card[row][col]).not.toBe("FREE");
      }
    }
  });

  it("uses Math.random by default", () => {
    const card = numberCard();
    expect(card).toHaveLength(5);
    expect(card[2][2]).toBe("FREE");
  });
});

describe("wordCard", () => {
  const pool = Array.from({ length: 30 }, (_, i) => `word-${i}`);

  it("produces a size x size grid", () => {
    const card = wordCard(pool, 5, id);
    expect(card).toHaveLength(5);
    for (const row of card) expect(row).toHaveLength(5);
  });

  it("has no repeated words within a card", () => {
    const card = wordCard(pool, 5, id);
    const flat = card.flat();
    expect(new Set(flat).size).toBe(flat.length);
  });

  it("only uses words from the pool", () => {
    const card = wordCard(pool, 4, id);
    for (const word of card.flat()) {
      expect(pool).toContain(word);
    }
  });

  it("supports non-5 sizes (e.g. 4x4)", () => {
    const card = wordCard(pool, 4, id);
    expect(card).toHaveLength(4);
    expect(card.flat()).toHaveLength(16);
  });

  it("throws pool-too-small when the pool can't fill size x size", () => {
    expect(() => wordCard(["a", "b", "c"], 5, id)).toThrow("pool-too-small");
  });

  it("throws pool-too-small at the exact boundary (needs one more)", () => {
    const small = Array.from({ length: 24 }, (_, i) => `w${i}`);
    expect(() => wordCard(small, 5, id)).toThrow("pool-too-small");
  });

  it("succeeds at the exact boundary (pool exactly size x size)", () => {
    const exact = Array.from({ length: 25 }, (_, i) => `w${i}`);
    expect(() => wordCard(exact, 5, id)).not.toThrow();
  });
});

describe("makeCards", () => {
  it("generates n cards", () => {
    const cards = makeCards(3, numberCard, id);
    expect(cards).toHaveLength(3);
    for (const card of cards) {
      expect(card).toHaveLength(5);
      expect(card[2][2]).toBe("FREE");
    }
  });

  it("returns an empty array for n = 0", () => {
    expect(makeCards(0, numberCard, id)).toEqual([]);
  });

  it("forwards the rng to a word-card generator", () => {
    const pool = Array.from({ length: 9 }, (_, i) => `w${i}`);
    const cards = makeCards(2, (rng) => wordCard(pool, 3, rng), id);
    expect(cards).toHaveLength(2);
    for (const card of cards) {
      expect(card.flat()).toHaveLength(9);
    }
  });
});
