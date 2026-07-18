// Caption style presets consumed by both the live JASSUB preview and the
// ASS script generator that feeds the ffmpeg burn-in. Colours are plain
// "#RRGGBB" hex — converted to ASS's "&H00BBGGRR" form at render time via
// hexToAssColor (see ass.ts), so presets stay readable here.

export interface CaptionStyle {
  fontName: string;
  fontSize: number;
  primary: string;
  // Accent colour ("#RRGGBB") used for the karaoke/word-highlight "spoken"
  // state. Only takes visual effect when animation is "karaoke" or
  // "word-highlight" — ass.ts neutralizes it (equal to primary) otherwise so
  // it can never be seen as a stray colour.
  highlight: string;
  outline: string;
  back: string;
  outlineWidth: number;
  shadow: number;
  bold: boolean;
  alignment: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  marginV: number;
  box: boolean;
  animation: "none" | "pop-on" | "karaoke" | "word-highlight";
}

export const PRESETS: Record<string, CaptionStyle> = {
  "tiktok-bold": {
    fontName: "Arial Black",
    fontSize: 72,
    primary: "#FFFFFF",
    highlight: "#FFD400",
    outline: "#000000",
    back: "#000000",
    outlineWidth: 4,
    shadow: 0,
    bold: true,
    alignment: 2,
    marginV: 120,
    box: false,
    animation: "word-highlight",
  },
  "clean-caption": {
    fontName: "Helvetica",
    fontSize: 48,
    primary: "#FFFFFF",
    highlight: "#22C1FF",
    outline: "#000000",
    back: "#000000",
    outlineWidth: 2,
    shadow: 1,
    bold: false,
    alignment: 2,
    marginV: 60,
    box: false,
    animation: "none",
  },
  "subtitle-bar": {
    fontName: "Arial",
    fontSize: 40,
    primary: "#FFFFFF",
    highlight: "#22C1FF",
    outline: "#000000",
    back: "#000000",
    outlineWidth: 0,
    shadow: 0,
    bold: false,
    alignment: 2,
    marginV: 40,
    box: true,
    animation: "none",
  },
};
