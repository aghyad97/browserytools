// ASS (Advanced SubStation Alpha) script generation from the cue model +
// a caption style. Consumed by both the live JASSUB preview and the
// ffmpeg burn-in, so the encoding here must be exactly right — timing,
// colour, and animation tags are not re-validated downstream.

import type { CueDoc, Word } from "./cues";
import type { CaptionStyle } from "./styles";

// "#RRGGBB" -> ASS "&HAABBGGRR" (alpha, blue, green, red — reverse of hex
// RGB order, with a forced 00 alpha since captions are always opaque).
export function hexToAssColor(hex: string): string {
  const clean = hex.replace("#", "");
  const r = clean.slice(0, 2);
  const g = clean.slice(2, 4);
  const b = clean.slice(4, 6);
  return `&H00${b}${g}${r}`.toUpperCase();
}

// ASS dialogue timestamps: H:MM:SS.cc (centiseconds, single leading hour
// digit, dot separator) — distinct from SRT/VTT's HH:MM:SS,mmm.
function assTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const totalCs = Math.round(s * 100);
  const h = Math.floor(totalCs / 360000);
  const m = Math.floor((totalCs % 360000) / 6000);
  const sec = Math.floor((totalCs % 6000) / 100);
  const cs = totalCs % 100;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${h}:${pad(m)}:${pad(sec)}.${pad(cs)}`;
}

// Escape ASS override-block special characters and normalize newlines.
// Backslash must be escaped first so the backslashes introduced by the
// brace/newline escaping below aren't themselves re-escaped.
function escapeAssText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\r\n/g, "\\N")
    .replace(/\n/g, "\\N");
}

// Per-word karaoke tags: {\k<centiseconds>}word for each word, so the
// player highlights/reveals one word at a time as it plays.
function karaokeText(words: Word[]): string {
  return words
    .map((w) => {
      const cs = Math.round((w.end - w.start) * 100);
      return `{\\k${cs}}${escapeAssText(w.text)}`;
    })
    .join(" ");
}

function dialogueText(cue: CueDoc[number], style: CaptionStyle): string {
  if (style.animation === "karaoke" || style.animation === "word-highlight") {
    if (cue.words && cue.words.length > 0) return karaokeText(cue.words);
    return escapeAssText(cue.text);
  }
  if (style.animation === "pop-on") {
    return `{\\fad(120,80)}${escapeAssText(cue.text)}`;
  }
  return escapeAssText(cue.text);
}

export function toAss(doc: CueDoc, style: CaptionStyle, dims: { w: number; h: number }): string {
  const bold = style.bold ? -1 : 0;
  const borderStyle = style.box ? 3 : 1;

  const header = [
    "[Script Info]",
    "ScriptType: v4.00+",
    `PlayResX: ${dims.w}`,
    `PlayResY: ${dims.h}`,
    "WrapStyle: 0",
    "ScaledBorderAndShadow: yes",
    "YCbCr Matrix: TV.601",
    "",
    "[V4+ Styles]",
    "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
    `Style: Default,${style.fontName},${style.fontSize},${hexToAssColor(style.primary)},&H000000FF,${hexToAssColor(style.outline)},${hexToAssColor(style.back)},${bold},0,0,0,100,100,0,0,${borderStyle},${style.outlineWidth},${style.shadow},${style.alignment},10,10,${style.marginV},1`,
    "",
    "[Events]",
    "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
  ].join("\n");

  const events = doc
    .map((cue) => {
      const start = assTime(cue.start);
      const end = assTime(cue.end);
      const text = dialogueText(cue, style);
      return `Dialogue: 0,${start},${end},Default,,0,0,0,,${text}`;
    })
    .join("\n");

  return `${header}\n${events}\n`;
}
