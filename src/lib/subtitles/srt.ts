export interface SubtitleCue {
  id: string;
  start: number;
  end: number;
  text: string;
}

export function parseSrtTimestamp(value: string): number {
  const match = value.trim().match(/^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/);
  if (!match) return Number.NaN;
  const [, h, m, s, ms] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms) / 1000;
}

export function parseSrt(input: string): SubtitleCue[] {
  return input.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").split(/\n{2,}/).flatMap((block, index) => {
    const lines = block.split("\n").map((line) => line.trimEnd());
    const timingIndex = lines.findIndex((line) => line.includes("-->"));
    if (timingIndex < 0) return [];
    const [startRaw, endRaw] = lines[timingIndex].split("-->").map((v) => v.trim().split(/\s+/)[0]);
    const start = parseSrtTimestamp(startRaw);
    const end = parseSrtTimestamp(endRaw);
    const text = lines.slice(timingIndex + 1).join("\n").trim();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start || !text) return [];
    return [{ id: lines.slice(0, timingIndex).join("-") || String(index + 1), start, end, text }];
  });
}

export function activeCue(cues: SubtitleCue[], time: number, offset = 0): SubtitleCue | undefined {
  const adjusted = time + offset;
  return cues.find((cue) => adjusted >= cue.start && adjusted < cue.end);
}
