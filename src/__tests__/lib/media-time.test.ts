import { describe, it, expect } from "vitest";
import { parseTimeInput } from "@/lib/media/time";

describe("parseTimeInput", () => {
  it("parses plain seconds, including decimals", () => {
    expect(parseTimeInput("90")).toBe(90);
    expect(parseTimeInput("90.5")).toBe(90.5);
    expect(parseTimeInput("0")).toBe(0);
  });
  it("parses mm:ss and hh:mm:ss", () => {
    expect(parseTimeInput("1:30")).toBe(90);
    expect(parseTimeInput("01:02:03")).toBe(3723);
    expect(parseTimeInput("0:05")).toBe(5);
  });
  it("returns null for empty or whitespace input", () => {
    expect(parseTimeInput("")).toBeNull();
    expect(parseTimeInput("   ")).toBeNull();
  });
  it("returns null for garbage", () => {
    expect(parseTimeInput("abc")).toBeNull();
    expect(parseTimeInput("1:2:3:4")).toBeNull();
    expect(parseTimeInput("1:-5")).toBeNull();
    expect(parseTimeInput("1:75")).toBeNull(); // seconds part must be < 60 when minutes given
  });
});
