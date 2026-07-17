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

// --- Cue-model editing operations ---
// All pure: they return NEW docs and never mutate their inputs. Every
// operation that changes a cue's timing guards against overlapping a
// neighbouring cue.

const DEFAULT_MAX_CHARS_PER_CUE = 42;
const DEFAULT_MAX_GAP = 1.5;

// Group Whisper-style word timestamps into readable cues. Starts a new cue
// when the gap since the previous word exceeds maxGap, or when appending the
// next word would exceed the maxCharsPerCue budget. Ids are synthesized
// deterministically from the cue's start time and index (no Math.random).
export function fromWhisperWords(
  words: Word[],
  opts: { maxCharsPerCue?: number; maxGap?: number } = {},
): CueDoc {
  const maxCharsPerCue = opts.maxCharsPerCue ?? DEFAULT_MAX_CHARS_PER_CUE;
  const maxGap = opts.maxGap ?? DEFAULT_MAX_GAP;
  if (words.length === 0) return [];

  const groups: Word[][] = [];
  let current: Word[] = [words[0]];

  for (let i = 1; i < words.length; i++) {
    const prev = words[i - 1];
    const word = words[i];
    const gap = word.start - prev.end;
    const candidateText = `${current.map((w) => w.text).join(" ")} ${word.text}`;
    const overBudget = candidateText.length > maxCharsPerCue;
    if (gap > maxGap || overBudget) {
      groups.push(current);
      current = [word];
    } else {
      current.push(word);
    }
  }
  groups.push(current);

  return groups.map((group, index) => {
    const start = group[0].start;
    const end = group[group.length - 1].end;
    const text = group.map((w) => w.text).join(" ");
    return { id: `${start}-${index}`, start, end, text, words: group };
  });
}

// Split a cue at atTime into two adjacent cues. A no-op (returns doc
// unchanged) when the cue isn't found or atTime isn't strictly inside its
// span, since a boundary split would produce a zero-length cue.
export function splitCue(doc: CueDoc, id: string, atTime: number): CueDoc {
  const index = doc.findIndex((c) => c.id === id);
  if (index === -1) return doc;
  const cue = doc[index];
  if (atTime <= cue.start || atTime >= cue.end) return doc;

  let firstWords: Word[] | undefined;
  let secondWords: Word[] | undefined;
  let firstText: string;
  let secondText: string;

  if (cue.words && cue.words.length > 0) {
    const first = cue.words.filter((w) => w.start < atTime);
    const second = cue.words.filter((w) => w.start >= atTime);
    firstWords = first.length > 0 ? first : undefined;
    secondWords = second.length > 0 ? second : undefined;
    firstText = first.map((w) => w.text).join(" ");
    secondText = second.map((w) => w.text).join(" ");
  } else {
    const tokens = cue.text.split(" ");
    const ratio = (atTime - cue.start) / (cue.end - cue.start);
    const splitAt = Math.max(1, Math.min(tokens.length - 1, Math.round(tokens.length * ratio)));
    firstText = tokens.slice(0, splitAt).join(" ");
    secondText = tokens.slice(splitAt).join(" ");
  }

  const first: Cue = {
    id: `${cue.id}-1`,
    start: cue.start,
    end: atTime,
    text: firstText,
    words: firstWords,
  };
  const second: Cue = {
    id: `${cue.id}-2`,
    start: atTime,
    end: cue.end,
    text: secondText,
    words: secondWords,
  };

  return [...doc.slice(0, index), first, second, ...doc.slice(index + 1)];
}

// Merge two cues (in either argument order) into one that spans both. Text
// is joined with a space, words are concatenated in doc order, and the span
// is the union of both cues' start/end.
export function mergeCues(doc: CueDoc, idA: string, idB: string): CueDoc {
  const idxA = doc.findIndex((c) => c.id === idA);
  const idxB = doc.findIndex((c) => c.id === idB);
  if (idxA === -1 || idxB === -1) return doc;

  const earlierIdx = Math.min(idxA, idxB);
  const laterIdx = Math.max(idxA, idxB);
  const earlier = doc[earlierIdx];
  const later = doc[laterIdx];

  const words =
    earlier.words || later.words
      ? [...(earlier.words ?? []), ...(later.words ?? [])]
      : undefined;

  const merged: Cue = {
    id: `${earlier.id}_${later.id}`,
    start: Math.min(earlier.start, later.start),
    end: Math.max(earlier.end, later.end),
    text: `${earlier.text} ${later.text}`.trim(),
    words,
  };

  const result = doc.slice();
  result.splice(laterIdx, 1);
  result.splice(earlierIdx, 1, merged);
  return result;
}

// Change a cue's start and/or end, clamped so it can never overlap a
// neighbouring cue: the new start can't precede the previous cue's end, and
// the new end can't exceed the next cue's start.
export function retime(
  doc: CueDoc,
  id: string,
  changes: { start?: number; end?: number },
): CueDoc {
  const index = doc.findIndex((c) => c.id === id);
  if (index === -1) return doc;
  const cue = doc[index];
  const prev = doc[index - 1];
  const next = doc[index + 1];

  let newStart = changes.start ?? cue.start;
  let newEnd = changes.end ?? cue.end;

  if (prev) newStart = Math.max(newStart, prev.end);
  if (next) newEnd = Math.min(newEnd, next.start);
  if (newStart > newEnd) newStart = newEnd;

  const updated: Cue = { ...cue, start: newStart, end: newEnd };
  return [...doc.slice(0, index), updated, ...doc.slice(index + 1)];
}

// Shift every cue (and its words, if present) by delta seconds. Clamped so
// no timestamp goes below zero.
export function shiftAll(doc: CueDoc, delta: number): CueDoc {
  return doc.map((cue) => ({
    ...cue,
    start: Math.max(0, cue.start + delta),
    end: Math.max(0, cue.end + delta),
    words: cue.words?.map((w) => ({
      ...w,
      start: Math.max(0, w.start + delta),
      end: Math.max(0, w.end + delta),
    })),
  }));
}
