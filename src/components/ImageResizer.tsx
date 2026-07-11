"use client";

import React, { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Download,
  Image as ImageIcon,
  Lock,
  LockOpen,
  RefreshCw,
  Info,
  Crop as CropIcon,
  Stamp,
  Maximize2,
} from "lucide-react";
// `loadImage` is aliased to `loadHtmlImage` to avoid colliding with the
// File-based `loadImage` callback defined inside this component.
import { canvasToBlob, loadImage as loadHtmlImage } from "@/lib/image/canvas";
import { downloadUrl } from "@/lib/download";

interface ImageInfo {
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
  name: string;
}

type ResizeMode = "dimensions" | "percentage" | "longest-side" | "preset";

// Normalized crop rectangle (0..1 fractions of the source image).
interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

type WatermarkKind = "text" | "image";
// 3x3 anchor grid.
type Anchor =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const PRESET_SIZES = [
  { label: "HD (1920x1080)", width: 1920, height: 1080 },
  { label: "4K UHD (3840x2160)", width: 3840, height: 2160 },
  { label: "QVGA (320x240)", width: 320, height: 240 },
  { label: "VGA (640x480)", width: 640, height: 480 },
  { label: "XGA (1024x768)", width: 1024, height: 768 },
  { label: "Instagram Square (1080x1080)", width: 1080, height: 1080 },
  { label: "Instagram Landscape (1080x566)", width: 1080, height: 566 },
  { label: "Twitter/X Header (1500x500)", width: 1500, height: 500 },
  { label: "Facebook Cover (820x312)", width: 820, height: 312 },
  { label: "Landing Page (1440x900)", width: 1440, height: 900 },
];

const PERCENTAGE_PRESETS = [25, 50, 75, 100, 125, 150, 200];

// Aspect-ratio presets for cropping. `null` = free.
const ASPECT_PRESETS: { key: string; ratio: number | null }[] = [
  { key: "free", ratio: null },
  { key: "square", ratio: 1 },
  { key: "4:3", ratio: 4 / 3 },
  { key: "3:4", ratio: 3 / 4 },
  { key: "16:9", ratio: 16 / 9 },
  { key: "9:16", ratio: 9 / 16 },
];

const ANCHORS: Anchor[] = [
  "top-left",
  "top-center",
  "top-right",
  "center-left",
  "center",
  "center-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export default function ImageResizer() {
  const t = useTranslations("Tools.ImageResizer");
  const tc = useTranslations("ToolsConfig");
  const [original, setOriginal] = useState<ImageInfo | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  const [resultWh, setResultWh] = useState<{ w: number; h: number } | null>(null);

  // Active operation tab.
  const [tab, setTab] = useState<"resize" | "crop" | "watermark">("resize");

  // Resize state
  const [mode, setMode] = useState<ResizeMode>("dimensions");
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [percentage, setPercentage] = useState(100);
  const [longestSide, setLongestSide] = useState(1920);
  const [lockAspect, setLockAspect] = useState(true);

  // Crop state
  const [cropAspect, setCropAspect] = useState<string>("free");
  const [crop, setCrop] = useState<CropRect>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  const cropAreaRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    kind: "move" | "resize";
    startX: number;
    startY: number;
    orig: CropRect;
  } | null>(null);

  // Watermark state
  const [wmKind, setWmKind] = useState<WatermarkKind>("text");
  const [wmText, setWmText] = useState("© BrowseryTools");
  const [wmFontSize, setWmFontSize] = useState(48);
  const [wmColor, setWmColor] = useState("#ffffff");
  const [wmOpacity, setWmOpacity] = useState(70);
  const [wmAnchor, setWmAnchor] = useState<Anchor>("bottom-right");
  const [wmScale, setWmScale] = useState(100);
  const [wmRotation, setWmRotation] = useState(0);
  const [wmTile, setWmTile] = useState(false);
  const [wmImageUrl, setWmImageUrl] = useState<string | null>(null);
  const wmFileInputRef = useRef<HTMLInputElement>(null);

  // Shared output
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [quality, setQuality] = useState(85);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error(t("uploadError"));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setOriginal({
            url: src,
            width: img.naturalWidth,
            height: img.naturalHeight,
            size: file.size,
            format: file.type.split("/")[1].toUpperCase(),
            name: file.name,
          });
          setPreviewUrl(src);
          setResultUrl(null);
          setWidth(img.naturalWidth);
          setHeight(img.naturalHeight);
          setCrop({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
          setCropAspect("free");
          toast.success(t("imageLoaded"));
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    },
    [t]
  );

  const handleWidthChange = useCallback(
    (v: number) => {
      setWidth(v);
      if (lockAspect && original) {
        setHeight(Math.round(v * (original.height / original.width)));
      }
    },
    [lockAspect, original]
  );

  const handleHeightChange = useCallback(
    (v: number) => {
      setHeight(v);
      if (lockAspect && original) {
        setWidth(Math.round(v * (original.width / original.height)));
      }
    },
    [lockAspect, original]
  );

  const computeTargetDimensions = useCallback(() => {
    if (!original) return { w: width, h: height };
    switch (mode) {
      case "dimensions":
        return { w: width, h: height };
      case "percentage": {
        const scale = percentage / 100;
        return {
          w: Math.round(original.width * scale),
          h: Math.round(original.height * scale),
        };
      }
      case "longest-side": {
        const ls = longestSide;
        if (original.width >= original.height) {
          return { w: ls, h: Math.round(ls * (original.height / original.width)) };
        }
        return { w: Math.round(ls * (original.width / original.height)), h: ls };
      }
      default:
        return { w: width, h: height };
    }
  }, [mode, width, height, percentage, longestSide, original]);

  const finishExport = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      const mime = `image/${outputFormat}`;
      const q = outputFormat === "png" ? undefined : quality / 100;
      return canvasToBlob(canvas, mime, q).then((blob) => {
        if (!blob) {
          toast.error(t("processFailed"));
          return;
        }
        setResultUrl(URL.createObjectURL(blob));
        setResultSize(blob.size);
        setResultWh({ w, h });
        toast.success(`${w}x${h}`);
      });
    },
    [outputFormat, quality, t]
  );

  // ── RESIZE ──────────────────────────────────────────────────────────────
  const runResize = useCallback(async () => {
    if (!original || !previewUrl) {
      toast.error(t("uploadFirst"));
      return;
    }
    setProcessing(true);
    try {
      const { w: newW, h: newH } = computeTargetDimensions();
      const img = await loadHtmlImage(previewUrl);
      const canvas = document.createElement("canvas");
      canvas.width = newW;
      canvas.height = newH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, 0, 0, newW, newH);
      await finishExport(canvas, newW, newH);
    } catch (e) {
      toast.error(`Error: ${String(e)}`);
    } finally {
      setProcessing(false);
    }
  }, [original, previewUrl, computeTargetDimensions, finishExport, t]);

  // ── CROP ────────────────────────────────────────────────────────────────
  const applyAspect = useCallback(
    (key: string) => {
      setCropAspect(key);
      const preset = ASPECT_PRESETS.find((a) => a.key === key);
      if (!preset || preset.ratio === null || !original) return;
      // Re-fit the crop rect to the chosen pixel aspect ratio, centered.
      const ratio = preset.ratio; // width/height in pixels
      const imgRatio = original.width / original.height;
      // ratio in normalized coords = ratio * (imgH/imgW)
      const normRatio = ratio / imgRatio;
      let w = crop.w;
      let h = w / normRatio;
      if (h > 1) {
        h = 1;
        w = h * normRatio;
      }
      const x = clamp(crop.x, 0, 1 - w);
      const y = clamp(crop.y, 0, 1 - h);
      setCrop({ x, y, w, h });
    },
    [crop, original]
  );

  const onCropPointerDown = useCallback(
    (kind: "move" | "resize") => (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragState.current = {
        kind,
        startX: e.clientX,
        startY: e.clientY,
        orig: { ...crop },
      };
    },
    [crop]
  );

  const onCropPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const ds = dragState.current;
      const area = cropAreaRef.current;
      if (!ds || !area) return;
      const rect = area.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dx = (e.clientX - ds.startX) / rect.width;
      const dy = (e.clientY - ds.startY) / rect.height;
      if (ds.kind === "move") {
        setCrop({
          ...ds.orig,
          x: clamp(ds.orig.x + dx, 0, 1 - ds.orig.w),
          y: clamp(ds.orig.y + dy, 0, 1 - ds.orig.h),
        });
      } else {
        const preset = ASPECT_PRESETS.find((a) => a.key === cropAspect);
        let newW = clamp(ds.orig.w + dx, 0.05, 1 - ds.orig.x);
        let newH = clamp(ds.orig.h + dy, 0.05, 1 - ds.orig.y);
        if (preset && preset.ratio !== null && original) {
          const normRatio = preset.ratio / (original.width / original.height);
          newH = newW / normRatio;
          if (ds.orig.y + newH > 1) {
            newH = 1 - ds.orig.y;
            newW = newH * normRatio;
          }
        }
        setCrop({ ...ds.orig, w: newW, h: newH });
      }
    },
    [cropAspect, original]
  );

  const onCropPointerUp = useCallback(() => {
    dragState.current = null;
  }, []);

  const runCrop = useCallback(async () => {
    if (!original || !previewUrl) {
      toast.error(t("uploadFirst"));
      return;
    }
    const sx = Math.round(crop.x * original.width);
    const sy = Math.round(crop.y * original.height);
    const sw = Math.max(1, Math.round(crop.w * original.width));
    const sh = Math.max(1, Math.round(crop.h * original.height));
    setProcessing(true);
    try {
      const img = await loadHtmlImage(previewUrl);
      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      await finishExport(canvas, sw, sh);
    } catch (e) {
      toast.error(`Error: ${String(e)}`);
    } finally {
      setProcessing(false);
    }
  }, [original, previewUrl, crop, finishExport, t]);

  // ── WATERMARK ───────────────────────────────────────────────────────────
  const loadWatermarkImage = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error(t("uploadError"));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setWmImageUrl(e.target?.result as string);
        toast.success(t("watermarkLoaded"));
      };
      reader.readAsDataURL(file);
    },
    [t]
  );

  function anchorPosition(
    anchor: Anchor,
    canvasW: number,
    canvasH: number,
    itemW: number,
    itemH: number
  ): { x: number; y: number } {
    const [v, h] = anchor.split("-") as [string, string];
    const pad = Math.round(Math.min(canvasW, canvasH) * 0.03);
    let x = pad;
    let y = pad;
    if (h === "center") x = (canvasW - itemW) / 2;
    else if (h === "right") x = canvasW - itemW - pad;
    if (v === "center") y = (canvasH - itemH) / 2;
    else if (v === "bottom") y = canvasH - itemH - pad;
    return { x, y };
  }

  const runWatermark = useCallback(async () => {
    if (!original || !previewUrl) {
      toast.error(t("uploadFirst"));
      return;
    }
    if (wmKind === "text" && !wmText.trim()) {
      toast.error(t("watermarkTextRequired"));
      return;
    }
    if (wmKind === "image" && !wmImageUrl) {
      toast.error(t("watermarkImageRequired"));
      return;
    }
    setProcessing(true);
    try {
      const base = await loadHtmlImage(previewUrl);
      const canvas = document.createElement("canvas");
      canvas.width = original.width;
      canvas.height = original.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(base, 0, 0, original.width, original.height);
      ctx.globalAlpha = wmOpacity / 100;

      if (wmKind === "text") {
        const fontPx = Math.max(1, Math.round(wmFontSize * (wmScale / 100)));
        ctx.font = `${fontPx}px sans-serif`;
        ctx.fillStyle = wmColor;
        ctx.textBaseline = "top";
        const metrics = ctx.measureText(wmText);
        const itemW = metrics.width || fontPx * wmText.length;
        const itemH = fontPx;
        const drawOne = (x: number, y: number) => {
          ctx.save();
          ctx.translate(x + itemW / 2, y + itemH / 2);
          ctx.rotate((wmRotation * Math.PI) / 180);
          ctx.fillText(wmText, -itemW / 2, -itemH / 2);
          ctx.restore();
        };
        if (wmTile) {
          const stepX = itemW + fontPx;
          const stepY = itemH + fontPx;
          for (let y = 0; y < canvas.height; y += stepY) {
            for (let x = 0; x < canvas.width; x += stepX) {
              drawOne(x, y);
            }
          }
        } else {
          const { x, y } = anchorPosition(
            wmAnchor,
            canvas.width,
            canvas.height,
            itemW,
            itemH
          );
          drawOne(x, y);
        }
      } else {
        const wmImg = await loadHtmlImage(wmImageUrl as string);
        const baseW = canvas.width * 0.25 * (wmScale / 100);
        const ratio = wmImg.height / (wmImg.width || 1);
        const itemW = baseW;
        const itemH = baseW * ratio;
        const drawOne = (x: number, y: number) => {
          ctx.save();
          ctx.translate(x + itemW / 2, y + itemH / 2);
          ctx.rotate((wmRotation * Math.PI) / 180);
          ctx.drawImage(wmImg, -itemW / 2, -itemH / 2, itemW, itemH);
          ctx.restore();
        };
        if (wmTile) {
          const stepX = itemW + itemW * 0.5;
          const stepY = itemH + itemH * 0.5;
          for (let y = 0; y < canvas.height; y += stepY) {
            for (let x = 0; x < canvas.width; x += stepX) {
              drawOne(x, y);
            }
          }
        } else {
          const { x, y } = anchorPosition(
            wmAnchor,
            canvas.width,
            canvas.height,
            itemW,
            itemH
          );
          drawOne(x, y);
        }
      }
      ctx.globalAlpha = 1;
      await finishExport(canvas, canvas.width, canvas.height);
    } catch (e) {
      toast.error(`Error: ${String(e)}`);
    } finally {
      setProcessing(false);
    }
  }, [
    original,
    previewUrl,
    wmKind,
    wmText,
    wmFontSize,
    wmColor,
    wmOpacity,
    wmAnchor,
    wmScale,
    wmRotation,
    wmTile,
    wmImageUrl,
    finishExport,
    t,
  ]);

  const runActive = useCallback(() => {
    if (tab === "resize") return runResize();
    if (tab === "crop") return runCrop();
    return runWatermark();
  }, [tab, runResize, runCrop, runWatermark]);

  const downloadResult = useCallback(() => {
    if (!resultUrl || !original) return;
    const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
    const baseName = original.name.replace(/\.[^.]+$/, "");
    downloadUrl(resultUrl, `${baseName}_${tab}.${ext}`);
    toast.success(t("downloaded"));
  }, [resultUrl, original, outputFormat, tab, t]);

  const { w: targetW, h: targetH } = computeTargetDimensions();

  return (
    <ToolShell
      slug="image-resizer"
      title={tc("tools.image-resizer.name")}
      sub={tc("tools.image-resizer.description")}
    >
        <Card className="shadow-none">
          <CardContent className="space-y-6 pt-6">
            {!original ? (
              <FileDropzone
                onFiles={(files) => {
                  const file = files[0];
                  if (file) loadImage(file);
                }}
                accept={{ "image/*": [] }}
                multiple={false}
                className={({ isDragActive }) =>
                  `flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed p-12 transition-colors cursor-pointer ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"}`
                }
              >
                <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">{t("dropImage")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("browseHint")}</p>
              </FileDropzone>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
                <ImageIcon className="w-8 h-8 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{original.name}</p>
                  <p className="text-sm text-muted-foreground" dir="ltr">
                    {original.width}x{original.height}px | {original.format} |{" "}
                    {formatBytes(original.size)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <RefreshCw className="w-4 h-4 me-1" />
                  {t("change")}
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) loadImage(file);
              }}
            />

            {original && (
              <>
                <Tabs
                  value={tab}
                  onValueChange={(v) => {
                    setTab(v as typeof tab);
                    setResultUrl(null);
                  }}
                >
                  <TabsList className="grid w-full grid-cols-3 h-auto">
                    <TabsTrigger value="resize" className="gap-1.5 py-2">
                      <Maximize2 className="w-4 h-4" />
                      {t("tabResize")}
                    </TabsTrigger>
                    <TabsTrigger value="crop" className="gap-1.5 py-2">
                      <CropIcon className="w-4 h-4" />
                      {t("tabCrop")}
                    </TabsTrigger>
                    <TabsTrigger value="watermark" className="gap-1.5 py-2">
                      <Stamp className="w-4 h-4" />
                      {t("tabWatermark")}
                    </TabsTrigger>
                  </TabsList>

                  {/* ── RESIZE ── */}
                  <TabsContent value="resize" className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <Label>{t("resizeMode")}</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(
                          [
                            { value: "dimensions", label: t("modeDimensions") },
                            { value: "percentage", label: t("modePercentage") },
                            { value: "longest-side", label: t("modeLongestSide") },
                            { value: "preset", label: t("modePreset") },
                          ] as const
                        ).map((opt) => (
                          <Button
                            key={opt.value}
                            variant={mode === opt.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setMode(opt.value)}
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {mode === "dimensions" && (
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
                        <div className="space-y-1">
                          <Label>{t("widthPx")}</Label>
                          <Input
                            dir="ltr"
                            type="number"
                            min="1"
                            max="10000"
                            value={width}
                            onChange={(e) => handleWidthChange(Number(e.target.value))}
                          />
                        </div>
                        <button
                          onClick={() => setLockAspect(!lockAspect)}
                          className="mb-1 p-1 rounded hover:bg-muted transition-colors"
                          title={lockAspect ? t("unlockAspect") : t("lockAspect")}
                        >
                          {lockAspect ? (
                            <Lock className="w-4 h-4 text-primary" />
                          ) : (
                            <LockOpen className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                        <div className="space-y-1">
                          <Label>{t("heightPx")}</Label>
                          <Input
                            dir="ltr"
                            type="number"
                            min="1"
                            max="10000"
                            value={height}
                            onChange={(e) => handleHeightChange(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    )}

                    {mode === "percentage" && (
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {PERCENTAGE_PRESETS.map((p) => (
                            <Button
                              key={p}
                              variant={percentage === p ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPercentage(p)}
                            >
                              <span dir="ltr">{p}%</span>
                            </Button>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <Label>{t("customPercentage")}</Label>
                            <span className="text-sm font-mono" dir="ltr">
                              {percentage}%
                            </span>
                          </div>
                          <Slider
                            min={1}
                            max={400}
                            step={1}
                            value={[percentage]}
                            onValueChange={([v]) => setPercentage(v)}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground" dir="ltr">
                          {t("outputInfo")}:{" "}
                          {Math.round((original.width * percentage) / 100)}x
                          {Math.round((original.height * percentage) / 100)}px
                        </p>
                      </div>
                    )}

                    {mode === "longest-side" && (
                      <div className="space-y-2">
                        <Label>{t("maxLongestSide")}</Label>
                        <Input
                          dir="ltr"
                          type="number"
                          min="1"
                          max="10000"
                          value={longestSide}
                          onChange={(e) => setLongestSide(Number(e.target.value))}
                        />
                      </div>
                    )}

                    {mode === "preset" && (
                      <div className="space-y-2">
                        <Label>{t("presetSizes")}</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {PRESET_SIZES.map((p) => (
                            <Button
                              key={p.label}
                              variant={
                                width === p.width && height === p.height
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className="w-full justify-start text-xs"
                              onClick={() => {
                                setWidth(p.width);
                                setHeight(p.height);
                              }}
                            >
                              {p.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                      <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        {t("outputInfo")}:{" "}
                        <span className="font-medium text-foreground" dir="ltr">
                          {targetW}x{targetH}px
                        </span>
                      </p>
                    </div>
                  </TabsContent>

                  {/* ── CROP ── */}
                  <TabsContent value="crop" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>{t("aspectRatio")}</Label>
                      <div className="flex flex-wrap gap-2">
                        {ASPECT_PRESETS.map((a) => (
                          <Button
                            key={a.key}
                            variant={cropAspect === a.key ? "default" : "outline"}
                            size="sm"
                            onClick={() => applyAspect(a.key)}
                          >
                            {a.key === "free" ? (
                              t("aspectFree")
                            ) : a.key === "square" ? (
                              "1:1"
                            ) : (
                              <span dir="ltr">{a.key}</span>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div
                      ref={cropAreaRef}
                      data-testid="crop-area"
                      className="relative w-full select-none touch-none overflow-hidden rounded-lg border bg-muted/20"
                      onPointerMove={onCropPointerMove}
                      onPointerUp={onCropPointerUp}
                      onPointerLeave={onCropPointerUp}
                    >
                      <img
                        src={original.url}
                        alt={t("cropPreviewAlt")}
                        className="w-full h-auto max-h-[420px] object-contain pointer-events-none"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                      <div
                        data-testid="crop-box"
                        className="absolute border-2 border-primary cursor-move bg-transparent"
                        style={{
                          insetInlineStart: `${crop.x * 100}%`,
                          top: `${crop.y * 100}%`,
                          width: `${crop.w * 100}%`,
                          height: `${crop.h * 100}%`,
                          boxShadow: "0 0 0 9999px rgba(0,0,0,0.0)",
                        }}
                        onPointerDown={onCropPointerDown("move")}
                      >
                        <img
                          src={original.url}
                          alt=""
                          aria-hidden="true"
                          className="absolute pointer-events-none max-w-none"
                          style={{
                            width: `${(1 / crop.w) * 100}%`,
                            height: `${(1 / crop.h) * 100}%`,
                            insetInlineStart: `${(-crop.x / crop.w) * 100}%`,
                            top: `${(-crop.y / crop.h) * 100}%`,
                          }}
                          draggable={false}
                        />
                        <div
                          data-testid="crop-handle"
                          className="absolute -bottom-1.5 -end-1.5 w-4 h-4 rounded-sm bg-primary border-2 border-background cursor-nwse-resize"
                          onPointerDown={onCropPointerDown("resize")}
                        />
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground" dir="ltr">
                      {t("outputInfo")}:{" "}
                      {Math.max(1, Math.round(crop.w * original.width))}x
                      {Math.max(1, Math.round(crop.h * original.height))}px
                    </p>
                  </TabsContent>

                  {/* ── WATERMARK ── */}
                  <TabsContent value="watermark" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>{t("watermarkType")}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={wmKind === "text" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setWmKind("text")}
                        >
                          {t("watermarkText")}
                        </Button>
                        <Button
                          variant={wmKind === "image" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setWmKind("image")}
                        >
                          {t("watermarkImage")}
                        </Button>
                      </div>
                    </div>

                    {wmKind === "text" ? (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label>{t("watermarkContent")}</Label>
                          <Input
                            value={wmText}
                            onChange={(e) => setWmText(e.target.value)}
                            placeholder={t("watermarkContentPlaceholder")}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <Label>{t("watermarkFontSize")}</Label>
                              <span className="text-sm font-mono" dir="ltr">
                                {wmFontSize}px
                              </span>
                            </div>
                            <Slider
                              min={8}
                              max={200}
                              step={1}
                              value={[wmFontSize]}
                              onValueChange={([v]) => setWmFontSize(v)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>{t("watermarkColor")}</Label>
                            <Input
                              dir="ltr"
                              type="color"
                              value={wmColor}
                              onChange={(e) => setWmColor(e.target.value)}
                              className="h-9 p-1"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>{t("watermarkImage")}</Label>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => wmFileInputRef.current?.click()}
                          >
                            <ImageIcon className="w-4 h-4 me-1" />
                            {t("watermarkChoose")}
                          </Button>
                          {wmImageUrl && (
                            <img
                              src={wmImageUrl}
                              alt={t("watermarkPreviewAlt")}
                              className="h-9 w-9 object-contain rounded border bg-muted/20"
                            />
                          )}
                        </div>
                        <input
                          ref={wmFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          data-testid="watermark-file-input"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) loadWatermarkImage(file);
                          }}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>{t("watermarkPosition")}</Label>
                      <div className="grid grid-cols-3 gap-1.5 w-32">
                        {ANCHORS.map((a) => (
                          <button
                            key={a}
                            type="button"
                            data-testid={`anchor-${a}`}
                            aria-label={a}
                            aria-pressed={wmAnchor === a}
                            onClick={() => setWmAnchor(a)}
                            disabled={wmTile}
                            className={`h-9 rounded-md border transition-colors disabled:opacity-40 ${
                              wmAnchor === a
                                ? "bg-primary border-primary"
                                : "bg-muted/40 border-input hover:bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <Label>{t("watermarkOpacity")}</Label>
                          <span className="text-sm font-mono" dir="ltr">
                            {wmOpacity}%
                          </span>
                        </div>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[wmOpacity]}
                          onValueChange={([v]) => setWmOpacity(v)}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <Label>{t("watermarkScale")}</Label>
                          <span className="text-sm font-mono" dir="ltr">
                            {wmScale}%
                          </span>
                        </div>
                        <Slider
                          min={10}
                          max={300}
                          step={1}
                          value={[wmScale]}
                          onValueChange={([v]) => setWmScale(v)}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <Label>{t("watermarkRotation")}</Label>
                          <span className="text-sm font-mono" dir="ltr">
                            {wmRotation}°
                          </span>
                        </div>
                        <Slider
                          min={-180}
                          max={180}
                          step={1}
                          value={[wmRotation]}
                          onValueChange={([v]) => setWmRotation(v)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant={wmTile ? "default" : "outline"}
                          size="sm"
                          className="w-full"
                          aria-pressed={wmTile}
                          onClick={() => setWmTile(!wmTile)}
                        >
                          {t("watermarkTile")}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* ── Shared output controls ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("outputFormat")}</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {outputFormat !== "png" && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>{t("quality")}</Label>
                        <span className="text-sm font-mono" dir="ltr">
                          {quality}%
                        </span>
                      </div>
                      <Slider
                        min={10}
                        max={100}
                        step={1}
                        value={[quality]}
                        onValueChange={([v]) => setQuality(v)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={runActive} disabled={processing} className="flex-1">
                    {processing
                      ? t("processing")
                      : tab === "resize"
                        ? t("resizeImage")
                        : tab === "crop"
                          ? t("cropImage")
                          : t("applyWatermark")}
                  </Button>
                  {resultUrl && (
                    <Button variant="outline" onClick={downloadResult}>
                      <Download className="w-4 h-4 me-2" />
                      {t("download")}
                    </Button>
                  )}
                </div>
              </>
            )}

            {resultUrl && original && (
              <div className="space-y-3">
                <Label>{t("beforeAfter")}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p
                      className="text-xs text-muted-foreground font-medium"
                      dir="ltr"
                    >
                      {t("original")} - {original.width}x{original.height}px |{" "}
                      {formatBytes(original.size)}
                    </p>
                    <img
                      src={original.url}
                      alt={t("original")}
                      className="w-full h-48 object-contain rounded-lg border bg-muted/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <p
                      className="text-xs text-muted-foreground font-medium"
                      dir="ltr"
                    >
                      {t("result")} - {resultWh?.w ?? 0}x{resultWh?.h ?? 0}px |{" "}
                      {formatBytes(resultSize)}
                    </p>
                    <img
                      src={resultUrl}
                      alt={t("result")}
                      className="w-full h-48 object-contain rounded-lg border bg-muted/20"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
    </ToolShell>
  );
}
