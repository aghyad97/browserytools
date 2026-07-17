// Shared subtitle cue types and SRT/VTT builders, used by any tool that
// produces timestamped text (audio transcription, subtitle editing, etc.).

export interface Word {
  start: number;
  end: number;
  text: string;
}

export interface Cue {
  id: string;
  start: number;
  end: number;
  text: string;
  words?: Word[];
}

export type CueDoc = Cue[];

// Format seconds as an SRT timestamp: HH:MM:SS,mmm
export function srtTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  const ms = Math.round((s - Math.floor(s)) * 1000);
  const pad = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)},${pad(ms, 3)}`;
}

// VTT uses a dot for milliseconds: HH:MM:SS.mmm
export function vttTime(seconds: number): string {
  return srtTime(seconds).replace(",", ".");
}

export function buildSrt(doc: CueDoc): string {
  return doc
    .map((c, i) => {
      const start = c.start ?? 0;
      const end = c.end ?? start;
      return `${i + 1}\n${srtTime(start)} --> ${srtTime(end)}\n${c.text.trim()}\n`;
    })
    .join("\n");
}

export function buildVtt(doc: CueDoc): string {
  const body = doc
    .map((c) => {
      const start = c.start ?? 0;
      const end = c.end ?? start;
      return `${vttTime(start)} --> ${vttTime(end)}\n${c.text.trim()}\n`;
    })
    .join("\n");
  return `WEBVTT\n\n${body}`;
}
