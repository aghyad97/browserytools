"use client";

// Step 3 of Subtitle Studio: the caption style panel. Lets the user start
// from a preset (which replaces the whole style) and then fine-tune
// individual fields — each control merges just its one field into the
// current style and reports the result via onChange. Presets and the
// CaptionStyle shape live in @/lib/subtitles/styles and are shared with the
// live JASSUB preview and the ASS generator that feeds the ffmpeg burn-in.

import { useId } from "react";
import { useTranslations } from "next-intl";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { SliderRow } from "@/components/shared/SliderRow";
import { ModePicker } from "@/components/shared/ModePicker";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PRESETS, type CaptionStyle } from "@/lib/subtitles/styles";
import s from "./StylePanel.module.css";

const PRESET_NAMES = Object.keys(PRESETS) as Array<keyof typeof PRESETS>;

// Small set of fonts that resolve to themselves (not a generic fallback
// substitution) on both the live JASSUB preview and the server-side ffmpeg
// burn-in — every preset's fontName is included so picking a preset never
// lands on a value missing from this list.
const FONT_OPTIONS = ["Arial", "Arial Black", "Helvetica", "Impact", "Georgia", "Verdana"];

// Numpad-style alignment layout (ASS convention): 7-8-9 top row, 4-5-6
// middle, 1-2-3 bottom — laid out top-to-bottom to match how it reads on
// screen, independent of the numeric values.
const ALIGNMENT_GRID: CaptionStyle["alignment"][] = [7, 8, 9, 4, 5, 6, 1, 2, 3];

const ANIMATIONS: CaptionStyle["animation"][] = ["none", "pop-on", "karaoke", "word-highlight"];

function presetLabel(t: ReturnType<typeof useTranslations>, name: keyof typeof PRESETS): string {
  switch (name) {
    case "tiktok-bold":
      return t("presetTiktokBold");
    case "clean-caption":
      return t("presetCleanCaption");
    case "subtitle-bar":
      return t("presetSubtitleBar");
    default:
      return name;
  }
}

function animationLabel(t: ReturnType<typeof useTranslations>, a: CaptionStyle["animation"]): string {
  switch (a) {
    case "none":
      return t("animationNone");
    case "pop-on":
      return t("animationPopOn");
    case "karaoke":
      return t("animationKaraoke");
    case "word-highlight":
      return t("animationWordHighlight");
  }
}

function alignmentLabel(t: ReturnType<typeof useTranslations>, a: CaptionStyle["alignment"]): string {
  switch (a) {
    case 7:
      return t("positionTopLeft");
    case 8:
      return t("positionTopCenter");
    case 9:
      return t("positionTopRight");
    case 4:
      return t("positionMiddleLeft");
    case 5:
      return t("positionMiddleCenter");
    case 6:
      return t("positionMiddleRight");
    case 1:
      return t("positionBottomLeft");
    case 2:
      return t("positionBottomCenter");
    case 3:
      return t("positionBottomRight");
  }
}

export interface StylePanelProps {
  value: CaptionStyle;
  onChange: (style: CaptionStyle) => void;
}

export function StylePanel({ value, onChange }: StylePanelProps) {
  const t = useTranslations("Tools.SubtitleStudio");
  const fontId = useId();
  const primaryId = useId();
  const highlightId = useId();
  const outlineId = useId();
  const boxId = useId();

  const set = <K extends keyof CaptionStyle>(field: K, next: CaptionStyle[K]) => {
    onChange({ ...value, [field]: next });
  };

  // Highlights the preset button only when the current style is exactly that
  // preset (byte-for-byte) — once the user tweaks a single field the style no
  // longer matches any preset, and none is shown active. Presets are small
  // plain objects, so a stringify compare is cheap and avoids importing a
  // deep-equal helper for this alone.
  const activePreset = PRESET_NAMES.find(
    (name) => JSON.stringify(PRESETS[name]) === JSON.stringify(value)
  );

  const emphasizeHighlight = value.animation === "karaoke" || value.animation === "word-highlight";

  return (
    <SettingsCard
      title={t("styleTitle")}
      description={t("styleDescription")}
      data-testid="style-panel"
    >
      <OptionRow label={t("presetLabel")}>
        <div className={s.presetRow} role="group" aria-label={t("presetLabel")}>
          {PRESET_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              className={s.presetButton}
              aria-pressed={activePreset === name}
              data-active={activePreset === name || undefined}
              data-testid={`style-preset-${name}`}
              onClick={() => onChange(PRESETS[name])}
            >
              {presetLabel(t, name)}
            </button>
          ))}
        </div>
      </OptionRow>

      <OptionRow label={t("fontFamilyLabel")} htmlFor={fontId}>
        <select
          id={fontId}
          className={s.select}
          data-testid="style-font-family"
          value={value.fontName}
          onChange={(e) => set("fontName", e.target.value)}
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </OptionRow>

      <SliderRow
        label={t("fontSizeLabel")}
        value={value.fontSize}
        display={<span dir="ltr">{value.fontSize}px</span>}
        onChange={(v) => set("fontSize", v)}
        min={16}
        max={120}
        data-testid="style-font-size"
      />

      <OptionRow label={t("primaryColorLabel")} htmlFor={primaryId}>
        {/* content color: the caption text color the user picks, not a UI token. */}
        <Input
          id={primaryId}
          type="color"
          value={value.primary}
          data-testid="style-primary-color"
          onChange={(e) => set("primary", e.target.value)}
          className="h-10 w-16 cursor-pointer p-1"
        />
      </OptionRow>

      <OptionRow
        label={t("highlightColorLabel")}
        hint={emphasizeHighlight ? undefined : t("highlightColorHint")}
        htmlFor={highlightId}
      >
        {/* content color: the karaoke/word-highlight "spoken word" accent. Only
            visually emphasized (ring) while an animation that uses it is
            selected — otherwise it's still shown, just not called out. */}
        <div className={emphasizeHighlight ? s.emphasized : undefined}>
          <Input
            id={highlightId}
            type="color"
            value={value.highlight}
            data-testid="style-highlight-color"
            onChange={(e) => set("highlight", e.target.value)}
            className="h-10 w-16 cursor-pointer p-1"
          />
        </div>
      </OptionRow>

      <OptionRow label={t("outlineColorLabel")} htmlFor={outlineId}>
        {/* content color: the caption outline/stroke color the user picks. */}
        <Input
          id={outlineId}
          type="color"
          value={value.outline}
          data-testid="style-outline-color"
          onChange={(e) => set("outline", e.target.value)}
          className="h-10 w-16 cursor-pointer p-1"
        />
      </OptionRow>

      <SliderRow
        label={t("outlineWidthLabel")}
        value={value.outlineWidth}
        display={<span dir="ltr">{value.outlineWidth}px</span>}
        onChange={(v) => set("outlineWidth", v)}
        min={0}
        max={8}
        step={0.5}
        data-testid="style-outline-width"
      />

      <div className="flex items-center gap-2">
        <Checkbox
          id={boxId}
          data-testid="style-box"
          checked={value.box}
          onCheckedChange={(checked) => set("box", checked)}
        />
        <Label htmlFor={boxId} className="cursor-pointer">
          {t("backgroundBoxLabel")}
        </Label>
      </div>

      <OptionRow label={t("positionLabel")}>
        <div
          className={s.positionGrid}
          role="group"
          aria-label={t("positionLabel")}
          data-testid="style-position"
        >
          {ALIGNMENT_GRID.map((a) => (
            <button
              key={a}
              type="button"
              className={s.positionButton}
              aria-label={alignmentLabel(t, a)}
              aria-pressed={value.alignment === a}
              data-active={value.alignment === a || undefined}
              data-testid={`style-alignment-${a}`}
              onClick={() => set("alignment", a)}
            >
              <span className={s.positionDot} aria-hidden />
            </button>
          ))}
        </div>
      </OptionRow>

      <OptionRow label={t("animationLabel")}>
        <ModePicker
          aria-label={t("animationLabel")}
          value={value.animation}
          onChange={(v) => set("animation", v)}
          options={ANIMATIONS.map((a) => ({ value: a, label: animationLabel(t, a) }))}
          data-testid="style-animation"
        />
      </OptionRow>
    </SettingsCard>
  );
}
