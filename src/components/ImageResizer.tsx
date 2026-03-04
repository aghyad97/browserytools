"use client";

import React, { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Lock,
  LockOpen,
  RefreshCw,
  Info,
} from "lucide-react";

interface ImageInfo {
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
  name: string;
}

type ResizeMode = "dimensions" | "percentage" | "longest-side" | "preset";

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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
export default function ImageResizer() {
  const t = useTranslations("Tools.ImageResizer");
  const [original, setOriginal] = useState<ImageInfo | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState<number>(0);
  const [resizedWh, setResizedWh] = useState<{ w: number; h: number } | null>(null);

  // Resize mode
  const [mode, setMode] = useState<ResizeMode>("dimensions");
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [percentage, setPercentage] = useState(100);
  const [longestSide, setLongestSide] = useState(1920);
  const [lockAspect, setLockAspect] = useState(true);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [quality, setQuality] = useState(85);
  const [isDragOver, setIsDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((file: File) => {
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
        setResizedUrl(null);
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        toast.success(t("imageLoaded"));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, [t]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) loadImage(file);
  }, [loadImage]);

  const handleWidthChange = useCallback((v: number) => {
    setWidth(v);
    if (lockAspect && original) {
      setHeight(Math.round(v * (original.height / original.width)));
    }
  }, [lockAspect, original]);

  const handleHeightChange = useCallback((v: number) => {
    setHeight(v);
    if (lockAspect && original) {
      setWidth(Math.round(v * (original.width / original.height)));
    }
  }, [lockAspect, original]);

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
        } else {
          return { w: Math.round(ls * (original.width / original.height)), h: ls };
        }
      }
      default:
        return { w: width, h: height };
    }
  }, [mode, width, height, percentage, longestSide, original]);

  const resizeImage = useCallback(async () => {
    if (!original || !previewUrl) {
      toast.error(t("uploadFirst"));
      return;
    }
    setProcessing(true);
    try {
      const { w: newW, h: newH } = computeTargetDimensions();
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = previewUrl;
      });
      const canvas = document.createElement("canvas");
      canvas.width = newW;
      canvas.height = newH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, 0, 0, newW, newH);
      const mime = `image/${outputFormat}`;
      const q = outputFormat === "png" ? undefined : quality / 100;
      canvas.toBlob((blob) => {
        if (!blob) { toast.error(t("resizeFailed")); return; }
        const url = URL.createObjectURL(blob);
        setResizedUrl(url);
        setResizedSize(blob.size);
        setResizedWh({ w: newW, h: newH });
        toast.success(`${newW}x${newH}`);
        setProcessing(false);
      }, mime, q);
    } catch (e) {
      toast.error(`Error: ${String(e)}`);
      setProcessing(false);
    }
  }, [original, previewUrl, outputFormat, quality, computeTargetDimensions, t]);

  const downloadResized = useCallback(() => {
    if (!resizedUrl || !original) return;
    const a = document.createElement("a");
    a.href = resizedUrl;
    const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
    const baseName = original.name.replace(/\.[^.]+$/, "");
    a.download = `${baseName}_resized.${ext}`;
    a.click();
    toast.success(t("downloaded"));
  }, [resizedUrl, original, outputFormat, t]);

  const { w: targetW, h: targetH } = computeTargetDimensions();

  return (
    <div className="container mx-auto max-w-5xl flex flex-col h-[calc(100vh-theme(spacing.16))] shadow-none">
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!original ? (
              <button
                className={`flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed p-12 transition-colors cursor-pointer ${isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">{t("dropImage")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("browseHint")}</p>
              </button>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
                <ImageIcon className="w-8 h-8 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{original.name}</p>
                  <p className="text-sm text-muted-foreground" dir="ltr">
                    {original.width}x{original.height}px | {original.format} | {formatBytes(original.size)}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><RefreshCw className="w-4 h-4 me-1" />{t("change")}</Button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) loadImage(file); }} />

            {original && (
              <>
                <div className="space-y-2">
                  <Label>{t("resizeMode")}</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {([
                      { value: "dimensions", label: t("modeDimensions") },
                      { value: "percentage", label: t("modePercentage") },
                      { value: "longest-side", label: t("modeLongestSide") },
                      { value: "preset", label: t("modePreset") },
                    ] as const).map((opt) => (
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
                  <div className="space-y-3">
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
                      <div className="space-y-1">
                        <Label>{t("widthPx")}</Label>
                        <Input dir="ltr" type="number" min="1" max="10000" value={width} onChange={(e) => handleWidthChange(Number(e.target.value))} />
                      </div>
                      <button onClick={() => setLockAspect(!lockAspect)} className="mb-1 p-1 rounded hover:bg-muted transition-colors" title={lockAspect ? t("unlockAspect") : t("lockAspect")}>
                        {lockAspect ? <Lock className="w-4 h-4 text-primary" /> : <LockOpen className="w-4 h-4 text-muted-foreground" />}
                      </button>
                      <div className="space-y-1">
                        <Label>{t("heightPx")}</Label>
                        <Input dir="ltr" type="number" min="1" max="10000" value={height} onChange={(e) => handleHeightChange(Number(e.target.value))} />
                      </div>
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
                          {p}%
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <Label>{t("customPercentage")}</Label>
                        <span className="text-sm font-mono">{percentage}%</span>
                      </div>
                      <Slider min={1} max={400} step={1} value={[percentage]} onValueChange={([v]) => setPercentage(v)} />
                    </div>
                    {original && (
                      <p className="text-sm text-muted-foreground" dir="ltr">
                        {t("outputInfo")}: {Math.round(original.width * percentage / 100)}x{Math.round(original.height * percentage / 100)}px
                      </p>
                    )}
                  </div>
                )}

                {mode === "longest-side" && (
                  <div className="space-y-2">
                    <Label>{t("maxLongestSide")}</Label>
                    <Input dir="ltr" type="number" min="1" max="10000" value={longestSide} onChange={(e) => setLongestSide(Number(e.target.value))} />
                  </div>
                )}

                {(mode === "preset" || mode === "dimensions") && (
                  <div className="space-y-2">
                    {mode === "preset" && <Label>{t("presetSizes")}</Label>}
                    {mode === "preset" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {PRESET_SIZES.map((p) => (
                          <Button
                            key={p.label}
                            variant={width === p.width && height === p.height ? "default" : "outline"}
                            size="sm"
                            className="w-full justify-start text-xs"
                            onClick={() => { setWidth(p.width); setHeight(p.height); }}
                          >
                            {p.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("outputFormat")}</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {!["png"].includes(outputFormat) && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>{t("quality")}</Label>
                        <span className="text-sm font-mono">{quality}%</span>
                      </div>
                      <Slider min={10} max={100} step={1} value={[quality]} onValueChange={([v]) => setQuality(v)} />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                  <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {t("outputInfo")}: <span className="font-medium text-foreground" dir="ltr">{targetW}x{targetH}px</span>
                    {resizedSize > 0 && (
                      <> &nbsp;&#<span>({formatBytes(resizedSize)})</span></>
                    )}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={resizeImage} disabled={processing} className="flex-1">
                    {processing ? t("resizing") : t("resizeImage")}
                  </Button>
                  {resizedUrl && (
                    <Button variant="outline" onClick={downloadResized}>
                      <Download className="w-4 h-4 me-2" />{t("download")}
                    </Button>
                  )}
                </div>
              </>
              )}

            {resizedUrl && original && (
              <div className="space-y-3">
                <Label>{t("beforeAfter")}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium" dir="ltr">
                      {t("original")} ‑ {original.width}x{original.height}px | {formatBytes(original.size)}
                    </p>
                    <img src={original.url} alt={t("original")} className="w-full h-48 object-contain rounded-lg border bg-muted/20" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium" dir="ltr">
                      {t("resized")} — {resizedWh?.w ?? 0}x{resizedWh?.h ?? 0}px | {formatBytes(resizedSize)}
                    </p>
                    <img src={resizedUrl} alt={t("resized")} className="w-full h-48 object-contain rounded-lg border bg-muted/20" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
