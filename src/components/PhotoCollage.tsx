"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Download,
  LayoutGrid,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { toast } from "sonner";
import { canvasToBlob } from "@/lib/image/canvas";
import { downloadUrl } from "@/lib/download";

interface CollageImage {
  id: string;
  url: string;
  el: HTMLImageElement;
  fit: "cover" | "contain";
}

// A layout describes a grid: the canvas is divided into `cols` x `rows`,
// and each cell occupies a rectangular span. Cells fill in source order.
interface Cell {
  c: number; // column start (0-based)
  r: number; // row start (0-based)
  cs: number; // column span
  rs: number; // row span
}

interface LayoutTemplate {
  id: string;
  cols: number;
  rows: number;
  cells: Cell[];
}

// Templates ordered by the number of photos they expect.
const layoutTemplates: LayoutTemplate[] = [
  {
    id: "grid-2x2",
    cols: 2,
    rows: 2,
    cells: [
      { c: 0, r: 0, cs: 1, rs: 1 },
      { c: 1, r: 0, cs: 1, rs: 1 },
      { c: 0, r: 1, cs: 1, rs: 1 },
      { c: 1, r: 1, cs: 1, rs: 1 },
    ],
  },
  {
    id: "grid-3x3",
    cols: 3,
    rows: 3,
    cells: Array.from({ length: 9 }, (_, i) => ({
      c: i % 3,
      r: Math.floor(i / 3),
      cs: 1,
      rs: 1,
    })),
  },
  {
    id: "strip-horizontal",
    cols: 3,
    rows: 1,
    cells: [
      { c: 0, r: 0, cs: 1, rs: 1 },
      { c: 1, r: 0, cs: 1, rs: 1 },
      { c: 2, r: 0, cs: 1, rs: 1 },
    ],
  },
  {
    id: "strip-vertical",
    cols: 1,
    rows: 3,
    cells: [
      { c: 0, r: 0, cs: 1, rs: 1 },
      { c: 0, r: 1, cs: 1, rs: 1 },
      { c: 0, r: 2, cs: 1, rs: 1 },
    ],
  },
  {
    // Mosaic: one large feature image on the start side, two stacked beside it.
    id: "mosaic",
    cols: 3,
    rows: 2,
    cells: [
      { c: 0, r: 0, cs: 2, rs: 2 },
      { c: 2, r: 0, cs: 1, rs: 1 },
      { c: 2, r: 1, cs: 1, rs: 1 },
    ],
  },
];

const aspectPresets = [
  { id: "square", w: 1080, h: 1080 },
  { id: "portrait", w: 1080, h: 1350 },
  { id: "landscape", w: 1350, h: 1080 },
  { id: "story", w: 1080, h: 1920 },
  { id: "wide", w: 1920, h: 1080 },
];

const formatOptions = [
  { value: "image/png", label: "PNG" },
  { value: "image/jpeg", label: "JPEG" },
];

// Draw one image into a destination rectangle, honoring the fit mode and a
// rounded-corner clip. `cover` crops to fill, `contain` letterboxes inside.
function drawImageFitted(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  fit: "cover" | "contain",
  radius: number
) {
  ctx.save();
  // Rounded rectangle clip for the cell.
  const rr = Math.min(radius, dw / 2, dh / 2);
  ctx.beginPath();
  ctx.moveTo(dx + rr, dy);
  ctx.arcTo(dx + dw, dy, dx + dw, dy + dh, rr);
  ctx.arcTo(dx + dw, dy + dh, dx, dy + dh, rr);
  ctx.arcTo(dx, dy + dh, dx, dy, rr);
  ctx.arcTo(dx, dy, dx + dw, dy, rr);
  ctx.closePath();
  ctx.clip();

  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) {
    ctx.restore();
    return;
  }
  const scale =
    fit === "cover"
      ? Math.max(dw / iw, dh / ih)
      : Math.min(dw / iw, dh / ih);
  const sw = iw * scale;
  const sh = ih * scale;
  const ox = dx + (dw - sw) / 2;
  const oy = dy + (dh - sh) / 2;
  ctx.drawImage(img, ox, oy, sw, sh);
  ctx.restore();
}

export default function PhotoCollage() {
  const t = useTranslations("Tools.PhotoCollage");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [images, setImages] = useState<CollageImage[]>([]);
  const [layoutId, setLayoutId] = useState("grid-2x2");
  const [presetId, setPresetId] = useState("square");
  const [gap, setGap] = useState(8);
  const [radius, setRadius] = useState(0);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(92);
  const [outputSize, setOutputSize] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const exportUrlRef = useRef<string | null>(null);

  const layout =
    layoutTemplates.find((l) => l.id === layoutId) ?? layoutTemplates[0];
  const preset =
    aspectPresets.find((p) => p.id === presetId) ?? aspectPresets[0];
  const formatOption = formatOptions.find((f) => f.value === format);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const valid = acceptedFiles.filter((f) => f.type.startsWith("image/"));
      if (valid.length === 0) {
        toast.error(t("noImages"));
        return;
      }
      const loaded: CollageImage[] = [];
      let pending = valid.length;
      valid.forEach((file) => {
        const url = URL.createObjectURL(file);
        objectUrlsRef.current.push(url);
        const el = new Image();
        el.onload = () => {
          pending -= 1;
          if (pending === 0) {
            setImages((prev) => [...prev, ...loaded]);
          }
        };
        el.onerror = () => {
          pending -= 1;
          if (pending === 0 && loaded.length > 0) {
            setImages((prev) => [...prev, ...loaded]);
          }
        };
        el.src = url;
        loaded.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          url,
          el,
          fit: "cover",
        });
      });
    },
    [t]
  );

  // Clean up all object URLs on unmount.
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      if (exportUrlRef.current) URL.revokeObjectURL(exportUrlRef.current);
    };
  }, []);

  // Redraw the live preview whenever inputs change.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = preset.w;
    const H = preset.h;
    canvas.width = W;
    canvas.height = H;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    const g = gap;
    const cellW = (W - g * (layout.cols + 1)) / layout.cols;
    const cellH = (H - g * (layout.rows + 1)) / layout.rows;

    layout.cells.forEach((cell, i) => {
      const img = images[i];
      const dx = g + cell.c * (cellW + g);
      const dy = g + cell.r * (cellH + g);
      const dw = cell.cs * cellW + (cell.cs - 1) * g;
      const dh = cell.rs * cellH + (cell.rs - 1) * g;
      if (img) {
        drawImageFitted(ctx, img.el, dx, dy, dw, dh, img.fit, radius);
      } else {
        // Empty-cell placeholder so the layout structure is visible.
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.06)";
        const rr = Math.min(radius, dw / 2, dh / 2);
        ctx.beginPath();
        ctx.moveTo(dx + rr, dy);
        ctx.arcTo(dx + dw, dy, dx + dw, dy + dh, rr);
        ctx.arcTo(dx + dw, dy + dh, dx, dy + dh, rr);
        ctx.arcTo(dx, dy + dh, dx, dy, rr);
        ctx.arcTo(dx, dy, dx + dw, dy, rr);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    });
  }, [images, layout, preset, gap, radius, bgColor]);

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const toggleFit = (id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? { ...img, fit: img.fit === "cover" ? "contain" : "cover" }
          : img
      )
    );
  };

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleExport = async () => {
    if (images.length === 0 || isExporting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);
    try {
      let source = canvas;
      // Optionally scale the output to a custom longest-edge size.
      if (outputSize > 0) {
        const scale = outputSize / Math.max(canvas.width, canvas.height);
        const scaled = document.createElement("canvas");
        scaled.width = Math.round(canvas.width * scale);
        scaled.height = Math.round(canvas.height * scale);
        const sctx = scaled.getContext("2d");
        if (sctx) {
          sctx.drawImage(canvas, 0, 0, scaled.width, scaled.height);
          source = scaled;
        }
      }

      const blob = await canvasToBlob(source, format, quality / 100);
      if (!blob) throw new Error("Export produced no output");

      if (exportUrlRef.current) URL.revokeObjectURL(exportUrlRef.current);
      const url = URL.createObjectURL(blob);
      exportUrlRef.current = url;

      const ext = formatOption?.label.toLowerCase() || "png";
      downloadUrl(url, `collage.${ext}`);

      toast.success(
        t("exportedSuccess", { size: (blob.size / 1024).toFixed(0) })
      );
    } catch (error) {
      console.error(error);
      toast.error(t("exportFailed"));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ToolShell
      slug="photo-collage"
      title={tc("tools.photo-collage.name")}
      sub={tc("tools.photo-collage.description")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls column */}
        <div className="space-y-4">
          <Card className="p-6 shadow-none">
              <FileDropzone
                onFiles={onDrop}
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"],
                }}
                multiple
                className={({ isDragActive }) => `
                  min-h-40 rounded-lg border-2 border-dashed
                  flex flex-col items-center justify-center space-y-4 p-8
                  cursor-pointer transition-all duration-200
                  ${
                    isDragActive
                      ? "border-primary bg-primary/10 scale-[0.99]"
                      : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                  }
                `}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    {t("dropImagesHere")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("supportedFormats")}
                  </p>
                </div>
              </FileDropzone>

              {images.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">
                      {t("photos")} ({images.length})
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {t("dragToReorder")}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, index) => (
                      <div
                        key={img.id}
                        draggable
                        onDragStart={() => setDragIndex(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (dragIndex !== null) reorder(dragIndex, index);
                          setDragIndex(null);
                        }}
                        className="group relative aspect-square rounded-md overflow-hidden border bg-muted cursor-grab active:cursor-grabbing"
                        data-testid="collage-thumb"
                      >
                        <img
                          src={img.url}
                          alt={t("photoAlt", { index: index + 1 })}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          aria-label={t("removePhoto")}
                          className="absolute top-1 end-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFit(img.id)}
                          aria-label={t("toggleFit")}
                          className="absolute bottom-1 start-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {img.fit === "cover" ? (
                            <Minimize2 className="w-3 h-3" />
                          ) : (
                            <Maximize2 className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("layout")}</label>
                <Select value={layoutId} onValueChange={setLayoutId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {layoutTemplates.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.id === "grid-2x2"
                          ? t("layoutGrid2x2")
                          : l.id === "grid-3x3"
                            ? t("layoutGrid3x3")
                            : l.id === "strip-horizontal"
                              ? t("layoutStripH")
                              : l.id === "strip-vertical"
                                ? t("layoutStripV")
                                : t("layoutMosaic")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("aspect")}</label>
                <Select value={presetId} onValueChange={setPresetId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectPresets.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.id === "square"
                          ? t("aspectSquare")
                          : p.id === "portrait"
                            ? t("aspectPortrait")
                            : p.id === "landscape"
                              ? t("aspectLandscape")
                              : p.id === "story"
                                ? t("aspectStory")
                                : t("aspectWide")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">{t("gap")}</label>
                  <span className="text-sm text-muted-foreground" dir="ltr">
                    {gap}px
                  </span>
                </div>
                <Slider
                  value={[gap]}
                  onValueChange={([v]) => setGap(v)}
                  min={0}
                  max={60}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    {t("borderRadius")}
                  </label>
                  <span className="text-sm text-muted-foreground" dir="ltr">
                    {radius}px
                  </span>
                </div>
                <Slider
                  value={[radius]}
                  onValueChange={([v]) => setRadius(v)}
                  min={0}
                  max={120}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("background")}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    aria-label={t("background")}
                    className="h-9 w-12 rounded border bg-transparent p-1"
                    data-testid="bg-color"
                  />
                  <span
                    className="text-sm text-muted-foreground uppercase"
                    dir="ltr"
                  >
                    {bgColor}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("format")}</label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formatOption?.value === "image/jpeg" && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">
                        {t("quality")}
                      </label>
                      <span
                        className="text-sm text-muted-foreground"
                        dir="ltr"
                      >
                        {quality}%
                      </span>
                    </div>
                    <Slider
                      value={[quality]}
                      onValueChange={([v]) => setQuality(v)}
                      min={1}
                      max={100}
                      step={1}
                    />
                  </div>
                )}
              </div>

              <Button
                onClick={handleExport}
                className="w-full"
                disabled={images.length === 0 || isExporting}
                data-testid="export-btn"
              >
                <Download className="w-4 h-4 me-2" />
                {isExporting ? t("exporting") : t("export")}
              </Button>
            </Card>
          </div>

          {/* Preview column */}
          <div className="space-y-4">
            <Card className="p-6 flex items-center justify-center min-h-64">
              {images.length > 0 ? (
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[70vh] w-auto h-auto rounded-md shadow-sm"
                  data-testid="collage-canvas"
                />
              ) : (
                <div className="text-center">
                  <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">{t("previewPlaceholder")}</p>
                  {/* Keep canvas mounted for the live draw effect even before images. */}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}
            </Card>
          </div>
        </div>
    </ToolShell>
  );
}
