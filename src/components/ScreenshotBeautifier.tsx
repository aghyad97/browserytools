"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { canvasToBlob } from "@/lib/image/canvas";
import { downloadUrl } from "@/lib/download";

// ── Background presets ────────────────────────────────────────────────────────
// Each gradient/mesh is described declaratively so it can be painted onto a
// canvas (for export) and mirrored as a CSS background (for the live preview).
interface GradientStop {
  color: string;
  pos: number; // 0..1
}
interface BackgroundPreset {
  id: string;
  type: "solid" | "linear" | "mesh";
  // linear: angle in degrees + stops; solid: single color in stops[0]
  angle?: number;
  stops: GradientStop[];
  // mesh: a list of radial blobs painted over a base color
  mesh?: { color: string; x: number; y: number }[];
  base?: string;
}

const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { id: "ocean", type: "linear", angle: 135, stops: [{ color: "#4f46e5", pos: 0 }, { color: "#06b6d4", pos: 1 }] },
  { id: "sunset", type: "linear", angle: 135, stops: [{ color: "#f97316", pos: 0 }, { color: "#db2777", pos: 1 }] },
  { id: "forest", type: "linear", angle: 135, stops: [{ color: "#059669", pos: 0 }, { color: "#0d9488", pos: 1 }] },
  { id: "candy", type: "linear", angle: 135, stops: [{ color: "#ec4899", pos: 0 }, { color: "#8b5cf6", pos: 1 }] },
  { id: "midnight", type: "linear", angle: 135, stops: [{ color: "#0f172a", pos: 0 }, { color: "#334155", pos: 1 }] },
  { id: "peach", type: "linear", angle: 135, stops: [{ color: "#fde68a", pos: 0 }, { color: "#fca5a5", pos: 1 }] },
  {
    id: "mesh",
    type: "mesh",
    stops: [],
    base: "#1e1b4b",
    mesh: [
      { color: "#7c3aed", x: 0.1, y: 0.2 },
      { color: "#2563eb", x: 0.9, y: 0.1 },
      { color: "#db2777", x: 0.8, y: 0.9 },
      { color: "#0891b2", x: 0.2, y: 0.8 },
    ],
  },
];

const ASPECT_PRESETS = [
  { id: "auto", ratio: null as number | null },
  { id: "16:9", ratio: 16 / 9 },
  { id: "1:1", ratio: 1 },
  { id: "4:3", ratio: 4 / 3 },
  { id: "9:16", ratio: 9 / 16 },
  { id: "twitter", ratio: 1200 / 675 }, // Twitter/X card
  { id: "og", ratio: 1200 / 630 }, // Open Graph
];

type BgMode = "preset" | "solid" | "image";

interface SourceImage {
  url: string;
  width: number;
  height: number;
  name: string;
}

// Draw a rounded rectangle path.
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export default function ScreenshotBeautifier() {
  const t = useTranslations("Tools.ScreenshotBeautifier");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [image, setImage] = useState<SourceImage | null>(null);
  const [bgMode, setBgMode] = useState<BgMode>("preset");
  const [presetId, setPresetId] = useState("ocean");
  const [solidColor, setSolidColor] = useState("#6366f1");
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);

  const [padding, setPadding] = useState(80);
  const [radius, setRadius] = useState(16);
  const [shadowBlur, setShadowBlur] = useState(40);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowOpacity, setShadowOpacity] = useState(35);
  const [tilt, setTilt] = useState(0);
  const [windowFrame, setWindowFrame] = useState(true);
  const [browserBar, setBrowserBar] = useState(false);
  const [aspect, setAspect] = useState("auto");

  const [outputSize, setOutputSize] = useState<number>(0);
  const [outputDims, setOutputDims] = useState<{ w: number; h: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadUrlRef = useRef<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (file.size > 15 * 1024 * 1024) {
        toast.error(t("imageTooLarge"));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          setImage({
            url: reader.result as string,
            width: img.width,
            height: img.height,
            name: file.name,
          });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    },
    [t],
  );

  const onDropBackground = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setBgImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  // Paint the composite onto the canvas. Runs whenever any control changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    let cancelled = false;

    const render = async () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // The screenshot is drawn at its natural size; the frame chrome and
      // padding scale relative to it.
      const barHeight = browserBar ? 44 : windowFrame ? 32 : 0;
      const innerW = image.width;
      const innerH = image.height + barHeight;

      // Compute canvas size: padded box, then optionally fit an aspect ratio.
      let canvasW = innerW + padding * 2;
      let canvasH = innerH + padding * 2;
      const ratio = ASPECT_PRESETS.find((a) => a.id === aspect)?.ratio ?? null;
      if (ratio) {
        const current = canvasW / canvasH;
        if (current < ratio) {
          canvasW = Math.round(canvasH * ratio);
        } else {
          canvasH = Math.round(canvasW / ratio);
        }
      }

      canvas.width = canvasW;
      canvas.height = canvasH;

      // ── Background ──────────────────────────────────────────────────────────
      if (bgMode === "image" && bgImageUrl) {
        const bg = new Image();
        bg.src = bgImageUrl;
        await new Promise((res) => {
          bg.onload = res;
          bg.onerror = res;
        });
        if (cancelled) return;
        // cover fit
        const scale = Math.max(canvasW / bg.width, canvasH / bg.height);
        const dw = bg.width * scale;
        const dh = bg.height * scale;
        ctx.drawImage(bg, (canvasW - dw) / 2, (canvasH - dh) / 2, dw, dh);
      } else if (bgMode === "solid") {
        ctx.fillStyle = solidColor;
        ctx.fillRect(0, 0, canvasW, canvasH);
      } else {
        const preset = BACKGROUND_PRESETS.find((p) => p.id === presetId) ?? BACKGROUND_PRESETS[0];
        if (preset.type === "mesh") {
          ctx.fillStyle = preset.base ?? "#000";
          ctx.fillRect(0, 0, canvasW, canvasH);
          for (const blob of preset.mesh ?? []) {
            const grad = ctx.createRadialGradient(
              blob.x * canvasW,
              blob.y * canvasH,
              0,
              blob.x * canvasW,
              blob.y * canvasH,
              Math.max(canvasW, canvasH) * 0.6,
            );
            grad.addColorStop(0, blob.color);
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvasW, canvasH);
          }
        } else {
          const a = ((preset.angle ?? 135) * Math.PI) / 180;
          const cx = canvasW / 2;
          const cy = canvasH / 2;
          const len = (Math.abs(Math.cos(a)) * canvasW + Math.abs(Math.sin(a)) * canvasH) / 2;
          const grad = ctx.createLinearGradient(
            cx - Math.cos(a) * len,
            cy - Math.sin(a) * len,
            cx + Math.cos(a) * len,
            cy + Math.sin(a) * len,
          );
          for (const s of preset.stops) grad.addColorStop(s.pos, s.color);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvasW, canvasH);
        }
      }

      // ── Composite the framed screenshot ─────────────────────────────────────
      const boxX = (canvasW - innerW) / 2;
      const boxY = (canvasH - innerH) / 2;

      ctx.save();

      // 3D tilt: rotate around the center of the box.
      if (tilt !== 0) {
        ctx.translate(boxX + innerW / 2, boxY + innerH / 2);
        ctx.rotate((tilt * Math.PI) / 180);
        ctx.translate(-(boxX + innerW / 2), -(boxY + innerH / 2));
      }

      // Drop shadow on the rounded card.
      ctx.shadowColor = `rgba(0,0,0,${shadowOpacity / 100})`;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetY = shadowBlur / 3 + shadowSpread;

      roundRect(ctx, boxX, boxY, innerW, innerH, radius);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Clip subsequent draws to the rounded card; disable shadow inside.
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      roundRect(ctx, boxX, boxY, innerW, innerH, radius);
      ctx.clip();

      // Window / browser chrome bar.
      if (barHeight > 0) {
        ctx.fillStyle = "#e5e7eb";
        ctx.fillRect(boxX, boxY, innerW, barHeight);
        // Traffic-light dots.
        const dotY = boxY + barHeight / 2;
        const colors = ["#ff5f57", "#febc2e", "#28c840"];
        colors.forEach((c, i) => {
          ctx.beginPath();
          ctx.fillStyle = c;
          ctx.arc(boxX + 20 + i * 20, dotY, 6, 0, Math.PI * 2);
          ctx.fill();
        });
        // Browser URL pill.
        if (browserBar) {
          ctx.fillStyle = "#ffffff";
          roundRect(ctx, boxX + 84, boxY + 10, innerW - 104, barHeight - 20, (barHeight - 20) / 2);
          ctx.fill();
        }
      }

      // Draw the screenshot below the bar.
      const screenshot = new Image();
      screenshot.src = image.url;
      await new Promise((res) => {
        screenshot.onload = res;
        screenshot.onerror = res;
      });
      if (cancelled) return;
      ctx.drawImage(screenshot, boxX, boxY + barHeight, innerW, image.height);

      ctx.restore();

      setOutputDims({ w: canvasW, h: canvasH });
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [
    image,
    bgMode,
    presetId,
    solidColor,
    bgImageUrl,
    padding,
    radius,
    shadowBlur,
    shadowSpread,
    shadowOpacity,
    tilt,
    windowFrame,
    browserBar,
    aspect,
  ]);

  useEffect(() => {
    return () => {
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
    };
  }, []);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    try {
      const blob = await canvasToBlob(canvas, "image/png");
      if (!blob) throw new Error("no blob");
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
      const url = URL.createObjectURL(blob);
      downloadUrlRef.current = url;
      setOutputSize(blob.size);

      const base = image.name.split(".")[0] || "screenshot";
      downloadUrl(url, `${base}_beautified.png`);
      toast.success(t("downloadedSuccess"));
    } catch {
      toast.error(t("exportFailed"));
    }
  };

  return (
    <ToolShell
      slug="screenshot-beautifier"
      title={tc("tools.screenshot-beautifier.name")}
      sub={tc("tools.screenshot-beautifier.description")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Preview / canvas */}
          <div className="space-y-4">
            <Card className="p-6 shadow-none">
              {!image ? (
                <FileDropzone
                  onFiles={onDrop}
                  accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] }}
                  multiple={false}
                  className={({ isDragActive }) =>
                    `h-80 rounded-lg border-2 border-dashed flex flex-col items-center justify-center space-y-4 p-8 cursor-pointer transition-[border-color,background-color] duration-150 ${
                      isDragActive
                        ? "border-primary bg-primary/10 scale-[0.99]"
                        : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                    }`
                  }
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{t("dropImageHere")}</h3>
                    <p className="text-sm text-muted-foreground">{t("supportedFormats")}</p>
                  </div>
                </FileDropzone>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg overflow-hidden bg-[conic-gradient(at_top_left,_#f3f4f6_25%,_#fff_0_50%,_#f3f4f6_0_75%,_#fff_0)] [background-size:20px_20px] flex items-center justify-center p-2">
                    <canvas
                      ref={canvasRef}
                      data-testid="beautifier-canvas"
                      className="max-w-full h-auto rounded shadow-sm"
                    />
                  </div>
                  {outputDims && (
                    <p className="text-sm text-muted-foreground text-center" dir="ltr">
                      {outputDims.w} × {outputDims.h}px
                      {outputSize > 0 && ` · ${(outputSize / 1024).toFixed(1)} KB`}
                    </p>
                  )}
                </div>
              )}
            </Card>

            {image && (
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setImage(null);
                    setOutputSize(0);
                    setOutputDims(null);
                  }}
                >
                  {t("changeImage")}
                </Button>
                <Button className="flex-1" onClick={handleDownload}>
                  <Download className="w-4 h-4 me-2" />
                  {t("downloadPng")}
                </Button>
              </div>
            )}
          </div>

          {/* Controls */}
          <Card className="p-4 space-y-5 h-fit">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("background")}</label>
              <Select value={bgMode} onValueChange={(v) => setBgMode(v as BgMode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preset">{t("bgModePreset")}</SelectItem>
                  <SelectItem value="solid">{t("bgModeSolid")}</SelectItem>
                  <SelectItem value="image">{t("bgModeImage")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bgMode === "preset" && (
              <div className="grid grid-cols-4 gap-2">
                {BACKGROUND_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-label={t(`preset_${p.id}` as never)}
                    onClick={() => setPresetId(p.id)}
                    className={`h-12 rounded-md ring-1 ring-border transition-all ${
                      presetId === p.id ? "ring-2 ring-primary scale-95" : "hover:scale-95"
                    }`}
                    style={{
                      background:
                        p.type === "mesh"
                          ? p.base
                          : `linear-gradient(135deg, ${p.stops.map((s) => s.color).join(", ")})`,
                    }}
                  />
                ))}
              </div>
            )}

            {bgMode === "solid" && (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  aria-label={t("solidColor")}
                  value={solidColor}
                  onChange={(e) => setSolidColor(e.target.value)}
                  className="h-10 w-16 rounded cursor-pointer bg-transparent"
                />
                <span className="text-sm text-muted-foreground" dir="ltr">
                  {solidColor}
                </span>
              </div>
            )}

            {bgMode === "image" && (
              <BgImageDrop onDrop={onDropBackground} label={t("uploadBackground")} hasImage={!!bgImageUrl} replaceLabel={t("changeBackground")} />
            )}

            <SliderRow label={t("padding")} value={padding} min={0} max={200} unit="px" onChange={setPadding} />
            <SliderRow label={t("cornerRadius")} value={radius} min={0} max={48} unit="px" onChange={setRadius} />
            <SliderRow label={t("shadowBlur")} value={shadowBlur} min={0} max={120} unit="px" onChange={setShadowBlur} />
            <SliderRow label={t("shadowSpread")} value={shadowSpread} min={0} max={60} unit="px" onChange={setShadowSpread} />
            <SliderRow label={t("shadowOpacity")} value={shadowOpacity} min={0} max={100} unit="%" onChange={setShadowOpacity} />
            <SliderRow label={t("tilt")} value={tilt} min={-15} max={15} unit="°" onChange={setTilt} />

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="window-frame">
                {t("windowFrame")}
              </label>
              <Switch id="window-frame" checked={windowFrame} onCheckedChange={setWindowFrame} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="browser-bar">
                {t("browserBar")}
              </label>
              <Switch id="browser-bar" checked={browserBar} onCheckedChange={setBrowserBar} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("aspectRatio")}</label>
              <Select value={aspect} onValueChange={setAspect}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASPECT_PRESETS.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {t(`aspect_${a.id.replace(":", "_")}` as never)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>
      <p className="sr-only">{tCommon("download")}</p>
    </ToolShell>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm text-muted-foreground" dir="ltr">
          {value}
          {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={1}
      />
    </div>
  );
}

function BgImageDrop({
  onDrop,
  label,
  replaceLabel,
  hasImage,
}: {
  onDrop: (files: File[]) => void;
  label: string;
  replaceLabel: string;
  hasImage: boolean;
}) {
  return (
    <FileDropzone
      onFiles={onDrop}
      accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
      multiple={false}
      className={({ isDragActive }) =>
        `rounded-md border-2 border-dashed p-4 text-center cursor-pointer text-sm transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/50 hover:border-primary"
        }`
      }
    >
      <ImageIcon className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
      {hasImage ? replaceLabel : label}
    </FileDropzone>
  );
}
