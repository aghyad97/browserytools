import { describe, it, expect } from "vitest";
import { formatStopwatch, formatMMSS } from "@/lib/time-format";

describe("time formatting", () => {
  it("formatStopwatch always includes hours and centiseconds (matches current Stopwatch output)", () => {
    expect(formatStopwatch(0)).toBe("00:00:00.00");
    expect(formatStopwatch(123450)).toBe("00:02:03.45");
    expect(formatStopwatch(3723000)).toBe("01:02:03.00");
  });
  it("formatMMSS never rolls minutes into hours (matches current Pomodoro output)", () => {
    expect(formatMMSS(0)).toBe("00:00");
    expect(formatMMSS(1500)).toBe("25:00");
    expect(formatMMSS(5400)).toBe("90:00");
  });
});
