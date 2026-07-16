"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Trash2, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { downloadBlob } from "@/lib/download";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { SliderRow } from "@/components/shared/SliderRow";
import {
  SignaturePad,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  type Stroke,
  type SignaturePadHandle,
} from "@/components/shared/SignaturePad";

// Handwriting-style fonts. We rely on web-safe cursive/serif families plus the
// generic `cursive` fallback so a signature look is available without bundling fonts.
const TYPE_FONTS = [
  { value: "'Brush Script MT', cursive", label: "Brush Script" },
  { value: "'Segoe Script', 'Bradley Hand', cursive", label: "Segoe Script" },
  { value: "'Snell Roundhand', 'Apple Chancery', cursive", label: "Snell Roundhand" },
  { value: "'Lucida Handwriting', cursive", label: "Lucida Handwriting" },
  { value: "Georgia, 'Times New Roman', serif", label: "Elegant Serif" },
  { value: "cursive", label: "Cursive" },
];

export default function SignatureMaker() {
  const t = useTranslations("Tools.SignatureMaker");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  // ── Draw mode ────────────────────────────────────────────────────────────
  // The canvas + pointer logic lives in the shared SignaturePad; SignatureMaker
  // stays the single source of truth for strokes (needed for SVG export and the
  // undo/clear button state) and the pen knobs.
  const drawPadRef = useRef<SignaturePadHandle>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  // content value: default pen color (user-adjustable via the color-picker input below)
  const [penColor, setPenColor] = useState("#1d4ed8");
  const [penWidth, setPenWidth] = useState(3);

  // ── Type mode ────────────────────────────────────────────────────────────
  const typePadRef = useRef<SignaturePadHandle>(null);
  const [typedName, setTypedName] = useState("");
  const [typeFont, setTypeFont] = useState(TYPE_FONTS[0].value);
  // content value: default text color (user-adjustable via the color-picker input below)
  const [typeColor, setTypeColor] = useState("#1d4ed8");
  const [typeSize, setTypeSize] = useState(64);

  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    drawPadRef.current?.clear();
  };

  // Export the drawn signature as a transparent PNG.
  const handleExportDraw = async () => {
    if (strokes.length === 0) {
      toast.error(t("nothingToExport"));
      return;
    }
    const blob = await drawPadRef.current?.getBlob();
    if (!blob) {
      toast.error(t("exportFailed"));
      return;
    }
    downloadBlob(blob, "signature.png");
    toast.success(t("downloaded"));
  };

  // Export the drawn signature as an SVG (one <polyline> per stroke).
  const handleExportSvg = () => {
    if (strokes.length === 0) {
      toast.error(t("nothingToExport"));
      return;
    }
    const polylines = strokes
      .map((s) => {
        const pts = s.points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
        return `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="${s.width}" stroke-linecap="round" stroke-linejoin="round"/>`;
      })
      .join("\n  ");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}">\n  ${polylines}\n</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    downloadBlob(blob, "signature.svg");
    toast.success(t("downloaded"));
  };

  // Render the typed name to a transparent PNG (offscreen render lives in the pad).
  const handleExportType = async () => {
    if (!typedName.trim()) {
      toast.error(t("enterName"));
      return;
    }
    const blob = await typePadRef.current?.getBlob();
    if (!blob) {
      toast.error(t("exportFailed"));
      return;
    }
    downloadBlob(blob, "signature.png");
    toast.success(t("downloaded"));
  };

  return (
    <ToolShell
      slug="signature-maker"
      title={tc("tools.signature-maker.name")}
      sub={tc("tools.signature-maker.description")}
      width="wide"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <Tabs defaultValue="draw" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw">{t("drawTab")}</TabsTrigger>
            <TabsTrigger value="type">{t("typeTab")}</TabsTrigger>
          </TabsList>

          {/* ── Draw mode ──────────────────────────────────────────────── */}
          <TabsContent value="draw" className="space-y-4">
            <SettingsCard>
              <div
                className="rounded-lg border-2 border-dashed border-muted-foreground/40"
                // content value: fixed neutral checkerboard = "transparent background"
                // indicator (same convention as image editors), independent of app theme
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              >
                <SignaturePad
                  ref={drawPadRef}
                  mode="draw"
                  strokes={strokes}
                  onStrokesChange={setStrokes}
                  penColor={penColor}
                  penWidth={penWidth}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <OptionRow label={t("penColor")} hint={<span dir="ltr">{penColor}</span>}>
                  <input
                    type="color"
                    aria-label={t("penColor")}
                    value={penColor}
                    onChange={(e) => setPenColor(e.target.value)}
                    className="h-9 w-12 rounded border border-input bg-background p-1"
                  />
                </OptionRow>
                <SliderRow
                  label={t("thickness")}
                  value={penWidth}
                  display={`${penWidth}px`}
                  onChange={setPenWidth}
                  min={1}
                  max={12}
                  step={1}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleUndo}
                  disabled={strokes.length === 0}
                >
                  <Undo2 className="w-4 h-4 me-2" />
                  {t("undo")}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={strokes.length === 0}
                >
                  <Trash2 className="w-4 h-4 me-2" />
                  {tCommon("clear")}
                </Button>
                <Button onClick={handleExportDraw} className="ms-auto">
                  <Download className="w-4 h-4 me-2" />
                  {t("downloadPng")}
                </Button>
                <Button variant="secondary" onClick={handleExportSvg}>
                  <Download className="w-4 h-4 me-2" />
                  {t("downloadSvg")}
                </Button>
              </div>
            </SettingsCard>
          </TabsContent>

          {/* ── Type mode ──────────────────────────────────────────────── */}
          <TabsContent value="type" className="space-y-4">
            <SettingsCard>
              <OptionRow label={t("yourName")} htmlFor="typed-name">
                <Input
                  id="typed-name"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                />
              </OptionRow>

              <div
                className="rounded-lg border-2 border-dashed border-muted-foreground/40 flex items-center justify-center min-h-[140px] p-4"
                // content value: fixed neutral checkerboard = "transparent background"
                // indicator (same convention as image editors), independent of app theme
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              >
                <span
                  data-testid="signature-preview"
                  style={{
                    fontFamily: typeFont,
                    color: typeColor,
                    fontSize: `${typeSize}px`,
                    lineHeight: 1,
                  }}
                >
                  {typedName || t("namePlaceholder")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <OptionRow label={t("font")}>
                  <Select value={typeFont} onValueChange={setTypeFont}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_FONTS.map((f) => (
                        <SelectItem
                          key={f.value}
                          value={f.value}
                          style={{ fontFamily: f.value }}
                        >
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </OptionRow>
                <OptionRow label={t("textColor")} hint={<span dir="ltr">{typeColor}</span>}>
                  <input
                    type="color"
                    aria-label={t("textColor")}
                    value={typeColor}
                    onChange={(e) => setTypeColor(e.target.value)}
                    className="h-9 w-12 rounded border border-input bg-background p-1"
                  />
                </OptionRow>
              </div>

              <SliderRow
                label={t("fontSize")}
                value={typeSize}
                display={`${typeSize}px`}
                onChange={setTypeSize}
                min={24}
                max={120}
                step={2}
              />

              {/* Headless pad: renders no visible surface in type mode; it owns
                  the offscreen typed-name render behind getBlob(). */}
              <SignaturePad
                ref={typePadRef}
                mode="type"
                text={typedName}
                font={typeFont}
                fontSize={typeSize}
                color={typeColor}
              />

              <div className="flex justify-end">
                <Button onClick={handleExportType}>
                  <Download className="w-4 h-4 me-2" />
                  {t("downloadPng")}
                </Button>
              </div>
            </SettingsCard>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center">
          {t("privacyNote")}
        </p>
      </div>
    </ToolShell>
  );
}
