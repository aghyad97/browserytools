import { describe, it, expect } from "vitest";
import { formatBytes, formatPercent } from "@/lib/format";

describe("formatBytes", () => {
  it("returns bare-integer bytes under 1 KB", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1)).toBe("1 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1023)).toBe("1023 B");
  });

  it("formats KB to 1 decimal (dominant variant)", () => {
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });

  it("formats MB to 2 decimals (dominant variant)", () => {
    expect(formatBytes(1024 * 1024)).toBe("1.00 MB");
    expect(formatBytes(2.34 * 1024 * 1024)).toBe("2.34 MB");
  });

  it("formats GB to 2 decimals", () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe("1.00 GB");
    expect(formatBytes(3.5 * 1024 * 1024 * 1024)).toBe("3.50 GB");
  });

  it("guards negatives and non-finite input", () => {
    expect(formatBytes(-1)).toBe("0 B");
    expect(formatBytes(NaN)).toBe("0 B");
    expect(formatBytes(Infinity)).toBe("0 B");
  });
});

describe("formatPercent", () => {
  it("multiplies a ratio by 100 and defaults to 0 digits", () => {
    expect(formatPercent(0.5)).toBe("50%");
    expect(formatPercent(1)).toBe("100%");
    expect(formatPercent(0)).toBe("0%");
  });

  it("honors the digits argument", () => {
    expect(formatPercent(0.583, 1)).toBe("58.3%");
    expect(formatPercent(0.12345, 2)).toBe("12.35%");
  });

  it("guards non-finite input", () => {
    expect(formatPercent(NaN)).toBe("0%");
    expect(formatPercent(Infinity, 2)).toBe("0%");
  });
});
