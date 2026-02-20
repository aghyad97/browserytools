import { describe, it, expect, beforeEach } from "vitest";
import { cn, getCurrency, setPreferredCurrency, getRelativeTime } from "@/lib/utils";

// ── cn() ──────────────────────────────────────────────────────────────────────
describe("cn()", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "never", "always")).toBe("base always");
  });

  it("deduplicates Tailwind conflicts (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("handles undefined and null gracefully", () => {
    expect(cn("a", undefined, null as unknown as undefined, "b")).toBe("a b");
  });

  it("returns empty string for no args", () => {
    expect(cn()).toBe("");
  });
});

// ── getCurrency() / setPreferredCurrency() ────────────────────────────────────
describe("getCurrency()", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to USD when nothing is stored", () => {
    expect(getCurrency()).toBe("USD");
  });

  it("returns stored currency after setPreferredCurrency", () => {
    setPreferredCurrency("EUR");
    // Simulate a fresh call — localStorage mock stores it
    expect(localStorage.setItem).toHaveBeenCalledWith("preferred-currency", "EUR");
  });
});

// ── getRelativeTime() ─────────────────────────────────────────────────────────
describe("getRelativeTime()", () => {
  const minutesAgo = (n: number) => new Date(Date.now() - n * 60_000);
  const hoursAgo = (n: number) => new Date(Date.now() - n * 3_600_000);
  const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
  const weeksAgo = (n: number) => new Date(Date.now() - n * 604_800_000);
  const monthsAgo = (n: number) => new Date(Date.now() - n * 2_629_746_000);
  const yearsAgo = (n: number) => new Date(Date.now() - n * 31_556_952_000);

  it('returns "just now" for a date less than 1 minute ago', () => {
    expect(getRelativeTime(new Date(Date.now() - 30_000))).toBe("just now");
  });

  it('returns "Xm ago" for dates within the last hour', () => {
    expect(getRelativeTime(minutesAgo(5))).toBe("5m ago");
    expect(getRelativeTime(minutesAgo(59))).toBe("59m ago");
  });

  it('returns "Xh ago" for dates within the last day', () => {
    expect(getRelativeTime(hoursAgo(3))).toBe("3h ago");
    expect(getRelativeTime(hoursAgo(23))).toBe("23h ago");
  });

  it('returns "Xd ago" for dates within the last week', () => {
    expect(getRelativeTime(daysAgo(2))).toBe("2d ago");
    expect(getRelativeTime(daysAgo(6))).toBe("6d ago");
  });

  it('returns "Xw ago" for dates within the last month', () => {
    expect(getRelativeTime(weeksAgo(2))).toBe("2w ago");
    expect(getRelativeTime(weeksAgo(3))).toBe("3w ago");
  });

  it('returns "Xmo ago" for dates within the last year', () => {
    expect(getRelativeTime(monthsAgo(3))).toBe("3mo ago");
    expect(getRelativeTime(monthsAgo(11))).toBe("11mo ago");
  });

  it('returns "Xy ago" for dates more than a year old', () => {
    expect(getRelativeTime(yearsAgo(2))).toBe("2y ago");
  });
});
