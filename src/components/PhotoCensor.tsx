"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
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
import { Upload, Download, Undo2, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { canvasToBlob } from "@/lib/image/canvas";
import { downloadUrl } from "@/lib/download";

type CensorMode = "blur" | "pixelate" | "blackbox";

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ImageInfo {
  url: string;
  name: string;
}

const modeOptions: { value: CensorMode; labelKey: string }[] = [
  { value: "blur", labelKey: "modeBlur" },
  { value: "pixelate", labelKey: "modePixelate" },
  { value: "blackbox", labelKey: "modeBlackbox" },
];

const formatOptions = [
  { value: "image/png", label: "PNG", quality: false },
  { value: "image/jpeg", label: "JPEG", quality: true },
  { value: "image/webp", label: "WebP", quality: true },
];

// Normalize a drag (which may go in any direction) into a positive-size rect.
function normalizeRect(a: { x: number; y: number }, b: { x: number; y: number }): Region {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: Math.abs(a.x - b.x),
    h: Math.abs(a.y - b.y),
  };
}

// Apply the chosen censor effect to a single region of the destination canvas.
// Reads from the clean source canvas so re-applying never compounds.
function applyCensor(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  region: Region,
  mode: CensorMode,
  blurRadius: number,
  pixelSize: number
) {
  const x = Math.round(region.x);
  const y = Math.round(region.y);
  const w = Math.round(region.w);
  const h = Math.round(region.h);
  if (w < 1 || h < 1) return;

  ctx.save();
  if (mode === "blackbox") {
    ctx.fillStyle = "#000000";
    ctx.fillRect(x, y, w, h);
  } else if (mode === "blur") {
    // Clip to the region, then draw the source with a CSS-style blur filter.
    ctx.beginPath();
    ctx.rect?.(x, y, w, h);
    ctx.clip?.();
    ctx.filter = `blur(${blurRadius}px)`;
    ctx.drawImage(source, 0, 0);
  } else if (mode === "pixelate") {
    // Downscale the region into a tiny offscreen canvas, then scale it back up
    // with smoothing disabled to get a mosaic.
    const block = Math.max(1, Math.round(pixelSize));
    const smallW = Math.max(1, Math.round(w / block));
    const smallH = Math.max(1, Math.round(h / block));
    const tmp = document.createElement("canvas");
    tmp.width = smallW;
    tmp.height = smallH;
    const tmpCtx = tmp.getContext("2d");
    if (tmpCtx) {
      tmpCtx.drawImage(source, x, y, w, h, 0, 0, smallW, smallH);
      ctx.imageSmoothingEnabled = false;
      ctx.beginPath();
      ctx.rect?.(x, y, w, h);
      ctx.clip?.();
      ctx.drawImage(tmp, 0, 0, smallW, smallH, x, y, w, h);
    }
  }
  ctx.restore();
}

export default function PhotoCensor() {
  const t = useTranslations("Tools.PhotoCensor");
  const tCommon = useTranslations("Common");

  const [image, setImage] = useState<ImageInfo | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [mode, setMode] = useState<CensorMode>("blur");
  const [blurRadius, setBlurRadius] = useState(12);
  const [pixelSize, setPixelSize] = useState(16);
  const [targetFormat, setTargetFormat] = useState("image/png");
  const [quality, setQuality] = useState(90);
  const [outputSize, setOutputSize] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgElRef = useRef<HTMLImageElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const drawingRef = useRef(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const draftRef = useRef<Region | null>(null);

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
        setImage({ url: reader.result as string, name: file.name });
        setRegions([]);
        setOutputSize(null);
      };
      reader.readAsDataURL(file);
    },
    [t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: false,
  });

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  // Load the source image into a backing canvas whenever the image changes.
  useEffect(() => {
    if (!image) {
      sourceCanvasRef.current = null;
      imgElRef.current = null;
      return;
    }
    const img = new Image();
    img.onload = () => {
      const src = document.createElement("canvas");
      src.width = img.naturalWidth || img.width;
      src.height = img.naturalHeight || img.height;
      const sctx = src.getContext("2d");
      if (sctx) sctx.drawImage(img, 0, 0);
      sourceCanvasRef.current = src;
      imgElRef.current = img;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = src.width;
        canvas.height = src.height;
      }
      redraw(regions, null);
    };
    img.onerror = () => toast.error(t("loadFailed"));
    img.src = image.url;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  // Redraw the visible canvas: clean source + every committed region + an
  // optional in-progress draft rectangle outline.
  const redraw = useCallback(
    (regs: Region[], draft: Region | null) => {
      const canvas = canvasRef.current;
      const source = sourceCanvasRef.current;
      if (!canvas || !source) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(source, 0, 0);
      for (const r of regs) {
        applyCensor(ctx, source, r, mode, blurRadius, pixelSize);
      }
      if (draft) {
        ctx.save();
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = Math.max(2, canvas.width / 400);
        ctx.setLineDash?.([6, 4]);
        ctx.strokeRect?.(draft.x, draft.y, draft.w, draft.h);
        ctx.restore();
      }
    },
    [mode, blurRadius, pixelSize]
  );

  // Re-render committed regions when the censor settings change.
  useEffect(() => {
    redraw(regions, null);
  }, [regions, redraw]);

  // Translate a pointer event into canvas pixel coordinates.
  function pointerToCanvas(
    e: React.PointerEvent<HTMLCanvasElement>
  ): { x: number; y: number } {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!sourceCanvasRef.current) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drawingRef.current = true;
    startRef.current = pointerToCanvas(e);
    draftRef.current = null;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || !startRef.current) return;
    const cur = pointerToCanvas(e);
    const draft = normalizeRect(startRef.current, cur);
    draftRef.current = draft;
    redraw(regions, draft);
  }

  function handlePointerUp() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const draft = draftRef.current;
    startRef.current = null;
    draftRef.current = null;
    if (draft && draft.w >= 4 && draft.h >= 4) {
      setRegions((prev) => [...prev, draft]);
      setOutputSize(null);
    } else {
      redraw(regions, null);
    }
  }

  const handleUndo = () => {
    setRegions((prev) => prev.slice(0, -1));
    setOutputSize(null);
  };

  const handleClear = () => {
    setRegions([]);
    setOutputSize(null);
  };

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    if (regions.length === 0) {
      toast.error(t("noRegions"));
      return;
    }
    try {
      const blob = await canvasToBlob(canvas, targetFormat, quality / 100);
      if (!blob) throw new Error("Export produced no output");

      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      setOutputSize(blob.size);

      const ext =
        formatOptions.find((f) => f.value === targetFormat)?.label.toLowerCase() ||
        "png";
      downloadUrl(url, `${image.name.split(".")[0]}_censored.${ext}`);
      toast.success(t("exportedSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("exportFailed"));
    }
  };

  const formatOption = formatOptions.find((f) => f.value === targetFormat);

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Canvas / dropzone */}
          <div className="md:col-span-2 space-y-4">
            <Card className="p-6 shadow-none">
              {image ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {t("drawHint")}
                  </p>
                  <div className="w-full overflow-auto flex justify-center bg-muted/30 rounded-lg p-2">
                    <canvas
                      ref={canvasRef}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerLeave={handlePointerUp}
                      className="max-w-full h-auto touch-none cursor-crosshair rounded-md"
                      style={{ touchAction: "none" }}
                      data-testid="censor-canvas"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUndo}
                      disabled={regions.length === 0}
                    >
                      <Undo2 className="w-4 h-4 me-2" />
                      {t("undo")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClear}
                      disabled={regions.length === 0}
                    >
                      <Trash2 className="w-4 h-4 me-2" />
                      {t("clearAll")}
                    </Button>
                    <span
                      className="text-sm text-muted-foreground self-center"
                      dir="ltr"
                    >
                      {t("regionCount", { count: regions.length })}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`
                    h-80 rounded-lg border-2 border-dashed
                    flex flex-col items-center justify-center space-y-4 p-8
                    cursor-pointer transition-all duration-200
                    ${
                      isDragActive
                        ? "border-primary bg-primary/10 scale-[0.99]"
                        : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      {t("dropImageHere")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("supportedFormats")}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                {t("privacyNote")}
              </p>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <Card className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("censorMode")}</label>
                <Select
                  value={mode}
                  onValueChange={(v) => setMode(v as CensorMode)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modeOptions.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.value === "blur"
                          ? t("modeBlur")
                          : m.value === "pixelate"
                          ? t("modePixelate")
                          : t("modeBlackbox")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {mode === "blur" && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      {t("blurRadius")}
                    </label>
                    <span className="text-sm text-muted-foreground" dir="ltr">
                      {blurRadius}px
                    </span>
                  </div>
                  <Slider
                    value={[blurRadius]}
                    onValueChange={([v]) => setBlurRadius(v)}
                    min={2}
                    max={40}
                    step={1}
                  />
                </div>
              )}

              {mode === "pixelate" && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      {t("pixelSize")}
                    </label>
                    <span className="text-sm text-muted-foreground" dir="ltr">
                      {pixelSize}px
                    </span>
                  </div>
                  <Slider
                    value={[pixelSize]}
                    onValueChange={([v]) => setPixelSize(v)}
                    min={4}
                    max={48}
                    step={1}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("targetFormat")}</label>
                <Select value={targetFormat} onValueChange={setTargetFormat}>
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

              {formatOption?.quality && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">{t("quality")}</label>
                    <span className="text-sm text-muted-foreground" dir="ltr">
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

              <Button
                onClick={handleDownload}
                className="w-full"
                disabled={!image || regions.length === 0}
              >
                <Download className="w-4 h-4 me-2" />
                {tCommon("download")}
              </Button>

              {outputSize !== null && (
                <p className="text-sm text-muted-foreground text-center" dir="ltr">
                  {t("outputSize")}: {(outputSize / 1024).toFixed(2)} KB
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
