"use client";

import React, { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { SliderRow } from "@/components/shared/SliderRow";
import { StatStrip } from "@/components/shared/StatStrip";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image as ImageIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { canvasToBlob, loadImage as loadHtmlImage } from "@/lib/image/canvas";
import {
  ASPECT_PRESETS,
  fitRectToAspect,
  moveRect,
  rectToSourcePixels,
  resizeRect,
  type CropRect,
} from "@/lib/image/crop-rect";
import { downloadUrl } from "@/lib/download";
import { formatBytes } from "@/lib/format";

interface ImageInfo {
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
  name: string;
}

const DEFAULT_CROP: CropRect = { x: 0.1, y: 0.1, w: 0.8, h: 0.8 };

export default function CropImage() {
  const t = useTranslations("Tools.CropImage");
  const tc = useTranslations("ToolsConfig");

  const [original, setOriginal] = useState<ImageInfo | null>(null);
  const [crop, setCrop] = useState<CropRect>(DEFAULT_CROP);
  const [cropAspect, setCropAspect] = useState<string>("free");
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [quality, setQuality] = useState(85);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [resultWh, setResultWh] = useState<{ w: number; h: number } | null>(null);
  const [processing, setProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropAreaRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    kind: "move" | "resize";
    startX: number;
    startY: number;
    orig: CropRect;
  } | null>(null);

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
          setCrop(DEFAULT_CROP);
          setCropAspect("free");
          setResultUrl(null);
          setResultWh(null);
          toast.success(t("imageLoaded"));
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    },
    [t]
  );

  const applyAspect = useCallback(
    (id: string) => {
      setCropAspect(id);
      const preset = ASPECT_PRESETS.find((a) => a.id === id);
      if (!preset || preset.ratio === null || !original) return;
      setCrop(fitRectToAspect(crop, preset.ratio, original.width, original.height));
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
        setCrop(moveRect(ds.orig, dx, dy));
      } else {
        const preset = ASPECT_PRESETS.find((a) => a.id === cropAspect);
        const aspect =
          preset && preset.ratio !== null && original ? preset.ratio : null;
        setCrop(
          resizeRect(
            ds.orig,
            dx,
            dy,
            aspect,
            original?.width ?? 1,
            original?.height ?? 1
          )
        );
      }
    },
    [cropAspect, original]
  );

  const onCropPointerUp = useCallback(() => {
    dragState.current = null;
  }, []);

  const runCrop = useCallback(async () => {
    if (!original) {
      toast.error(t("uploadFirst"));
      return;
    }
    const { sx, sy, sw, sh } = rectToSourcePixels(
      crop,
      original.width,
      original.height
    );
    setProcessing(true);
    try {
      const img = await loadHtmlImage(original.url);
      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      const mime = `image/${outputFormat}`;
      const q = outputFormat === "png" ? undefined : quality / 100;
      const blob = await canvasToBlob(canvas, mime, q);
      if (!blob) {
        toast.error(t("processFailed"));
        return;
      }
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
      setResultWh({ w: sw, h: sh });
      toast.success(`${sw}x${sh}`);
    } catch (e) {
      toast.error(`Error: ${String(e)}`);
    } finally {
      setProcessing(false);
    }
  }, [original, crop, outputFormat, quality, t]);

  const downloadResult = useCallback(() => {
    if (!resultUrl || !original) return;
    const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
    const base = original.name.replace(/\.[^.]+$/, "");
    downloadUrl(resultUrl, `${base}_cropped.${ext}`);
    toast.success(t("downloaded"));
  }, [resultUrl, original, outputFormat, t]);

  const cropW = original ? Math.max(1, Math.round(crop.w * original.width)) : 0;
  const cropH = original ? Math.max(1, Math.round(crop.h * original.height)) : 0;

  return (
    <ToolShell
      slug="crop-image"
      title={tc("tools.crop-image.name")}
      sub={tc("tools.crop-image.description")}
      primaryAction={{
        label: t("download"),
        onClick: downloadResult,
        disabled: !resultUrl,
      }}
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
              <div className="space-y-2">
                <Label>{t("aspectRatio")}</Label>
                <div className="flex flex-wrap gap-2">
                  {ASPECT_PRESETS.map((a) => (
                    <Button
                      key={a.id}
                      variant={cropAspect === a.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyAspect(a.id)}
                    >
                      {a.id === "free" ? (
                        t("aspectFree")
                      ) : a.id === "square" ? (
                        "1:1"
                      ) : (
                        <span dir="ltr">{a.id}</span>
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

              <StatStrip
                data-testid="crop-stats"
                items={[
                  {
                    label: t("statOriginal"),
                    value: (
                      <span dir="ltr">
                        {original.width}x{original.height}
                      </span>
                    ),
                  },
                  {
                    label: t("statCropped"),
                    value: (
                      <span dir="ltr">
                        {cropW}x{cropH}
                      </span>
                    ),
                  },
                  {
                    label: t("statOutputSize"),
                    value: resultUrl ? formatBytes(resultSize) : "—",
                    sub: resultWh ? (
                      <span dir="ltr">
                        {resultWh.w}x{resultWh.h}
                      </span>
                    ) : undefined,
                  },
                ]}
              />

              <SettingsCard title={t("outputFormat")}>
                <OptionRow label={t("outputFormat")} htmlFor="crop-format">
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger id="crop-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </OptionRow>
                {outputFormat !== "png" && (
                  <SliderRow
                    label={t("quality")}
                    value={quality}
                    min={10}
                    max={100}
                    step={1}
                    onChange={setQuality}
                    display={<span dir="ltr">{quality}%</span>}
                  />
                )}
              </SettingsCard>

              <div className="flex gap-3">
                <Button
                  onClick={runCrop}
                  disabled={processing}
                  className="flex-1"
                >
                  {processing ? t("processing") : t("cropImage")}
                </Button>
              </div>
            </>
          )}

          {resultUrl && (
            <div className="space-y-2">
              <img
                src={resultUrl}
                alt={t("statCropped")}
                className="w-full max-h-[420px] object-contain rounded-lg border bg-muted/20"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </ToolShell>
  );
}
