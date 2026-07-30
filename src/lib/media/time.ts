/**
 * Parse a user-entered time ("90", "90.5", "1:30", "01:02:03") into seconds.
 * Returns null when the input is empty or unparseable — callers treat
 * non-empty-but-null as a validation error.
 */
export function parseTimeInput(input: string): number | null {
  const s = input.trim();
  if (s === "") return null;
  if (/^\d+(\.\d+)?$/.test(s)) return Number(s);
  const parts = s.split(":");
  if (parts.length < 2 || parts.length > 3) return null;
  if (!parts.every((p) => /^\d+(\.\d+)?$/.test(p))) return null;
  const nums = parts.map(Number);
  // Sub-unit fields must stay under 60 (the leading field is unbounded).
  if (nums.slice(1).some((n) => n >= 60)) return null;
  return nums.reduce((acc, n) => acc * 60 + n, 0);
}
