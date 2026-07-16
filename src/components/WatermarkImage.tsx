"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { SliderRow } from "@/components/shared/SliderRow";
import { ModePicker } from "@/components/shared/ModePicker";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ANCHORS,
  drawWatermark,
  type Anchor,
  type WatermarkKind,
} from "@/lib/image/watermark-draw";
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

export default function WatermarkImage() {
  const t = useTranslations("Tools.WatermarkImage");
  const tc = useTranslations("ToolsConfig");

  const [original, setOriginal] = useState<ImageInfo | null>(null);
  const [wmKind, setWmKind] = useState<WatermarkKind>("text");
  const [wmText, setWmText] = useState("© BrowseryTools");
  const [wmFontSize, setWmFontSize] = useState(48);
  // content value: default watermark draw color
  const [wmColor, setWmColor] = useState("#ffffff");
  const [wmOpacity, setWmOpacity] = useState(70);
  const [wmAnchor, setWmAnchor] = useState<Anchor>("bottom-right");
  const [wmScale, setWmScale] = useState(100);
  const [wmRotation, setWmRotation] = useState(0);
  const [wmTile, setWmTile] = useState(false);
  const [wmImageUrl, setWmImageUrl] = useState<string | null>(null);

  const [outputFormat, setOutputFormat] = useState("png");
  const [quality, setQuality] = useState(90);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [processing, setProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const wmFileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);

  /* Decoded bitmaps behind the live preview. They are state rather than refs
     because the preview has to redraw once a decode lands, not just when a
     control moves. */
  const [baseImg, setBaseImg] = useState<HTMLImageElement | null>(null);
  const [wmImg, setWmImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!original) {
      setBaseImg(null);
      return;
    }
    let cancelled = false;
    loadHtmlImage(original.url)
      .then((img) => {
        if (!cancelled) setBaseImg(img);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [original]);

  useEffect(() => {
    if (!wmImageUrl) {
      setWmImg(null);
      return;
    }
    let cancelled = false;
    loadHtmlImage(wmImageUrl)
      .then((img) => {
        if (!cancelled) setWmImg(img);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [wmImageUrl]);

  /* Live preview — the whole point being that the mark can be judged before it
     is committed, so this must not merely approximate the export.
     drawWatermark works purely through canvas transforms, so scaling the
     context and handing it the FULL-RESOLUTION dimensions renders the mark at
     exactly the geometry the export will use, shrunk as one piece. Feeding it
     the preview's own dimensions instead would resize the canvas but not the
     font, and every anchor pad (3% of the smaller side) would drift. */
  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !original || !baseImg) return;

    const MAX_PREVIEW_W = 880;
    const factor = Math.min(1, MAX_PREVIEW_W / original.width);
    const w = Math.max(1, Math.round(original.width * factor));
    const h = Math.max(1, Math.round(original.height * factor));
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(baseImg, 0, 0, w, h);

    ctx.save();
    ctx.scale(factor, factor);
    drawWatermark(ctx, original.width, original.height, {
      kind: wmKind,
      text: wmText,
      fontSize: wmFontSize,
      color: wmColor,
      opacity: wmOpacity,
      anchor: wmAnchor,
      scale: wmScale,
      rotation: wmRotation,
      tile: wmTile,
      image: wmImg,
    });
    ctx.restore();
  }, [
    original,
    baseImg,
    wmImg,
    wmKind,
    wmText,
    wmFontSize,
    wmColor,
    wmOpacity,
    wmAnchor,
    wmScale,
    wmRotation,
    wmTile,
  ]);

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
          setResultUrl(null);
          toast.success(t("imageLoaded"));
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    },
    [t]
  );

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

  const runWatermark = useCallback(async () => {
    if (!original) {
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
      const base = await loadHtmlImage(original.url);
      const canvas = document.createElement("canvas");
      canvas.width = original.width;
      canvas.height = original.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(base, 0, 0, original.width, original.height);

      const wmImg =
        wmKind === "image" ? await loadHtmlImage(wmImageUrl as string) : null;
      drawWatermark(ctx, canvas.width, canvas.height, {
        kind: wmKind,
        text: wmText,
        fontSize: wmFontSize,
        color: wmColor,
        opacity: wmOpacity,
        anchor: wmAnchor,
        scale: wmScale,
        rotation: wmRotation,
        tile: wmTile,
        image: wmImg,
      });

      const mime = `image/${outputFormat}`;
      const q = outputFormat === "png" ? undefined : quality / 100;
      const blob = await canvasToBlob(canvas, mime, q);
      if (!blob) {
        toast.error(t("processFailed"));
        return;
      }
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
      toast.success(`${canvas.width}x${canvas.height}`);
    } catch (e) {
      toast.error(`Error: ${String(e)}`);
    } finally {
      setProcessing(false);
    }
  }, [
    original,
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
    outputFormat,
    quality,
    t,
  ]);

  const downloadResult = useCallback(() => {
    if (!resultUrl || !original) return;
    const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
    const base = original.name.replace(/\.[^.]+$/, "");
    downloadUrl(resultUrl, `${base}_watermarked.${ext}`);
    toast.success(t("downloaded"));
  }, [resultUrl, original, outputFormat, t]);

  return (
    <ToolShell
      slug="watermark-image"
      title={tc("tools.watermark-image.name")}
      sub={tc("tools.watermark-image.description")}
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

          {/* Live preview — every control below writes straight to this canvas,
              so the mark can be judged before it is committed. */}
          {original && (
            <canvas
              ref={previewRef}
              data-testid="watermark-preview"
              role="img"
              aria-label={t("resultAlt")}
              className="w-full max-h-[420px] object-contain rounded-lg border bg-muted/20"
            />
          )}

          {original && (
            <>
              <div className="space-y-2">
                <Label>{t("watermarkType")}</Label>
                <ModePicker<WatermarkKind>
                  aria-label={t("watermarkType")}
                  value={wmKind}
                  onChange={setWmKind}
                  options={[
                    { value: "text", label: t("watermarkText") },
                    { value: "image", label: t("watermarkImage") },
                  ]}
                />
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
                    <SliderRow
                      label={t("watermarkFontSize")}
                      value={wmFontSize}
                      min={8}
                      max={200}
                      step={1}
                      onChange={setWmFontSize}
                      display={<span dir="ltr">{wmFontSize}px</span>}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="wm-color">{t("watermarkColor")}</Label>
                      <Input
                        id="wm-color"
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
                <SliderRow
                  label={t("watermarkOpacity")}
                  value={wmOpacity}
                  min={0}
                  max={100}
                  step={1}
                  onChange={setWmOpacity}
                  display={<span dir="ltr">{wmOpacity}%</span>}
                />
                <SliderRow
                  label={t("watermarkScale")}
                  value={wmScale}
                  min={10}
                  max={300}
                  step={1}
                  onChange={setWmScale}
                  display={<span dir="ltr">{wmScale}%</span>}
                />
                <SliderRow
                  label={t("watermarkRotation")}
                  value={wmRotation}
                  min={-180}
                  max={180}
                  step={1}
                  onChange={setWmRotation}
                  display={<span dir="ltr">{wmRotation}°</span>}
                />
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

              <SettingsCard title={t("outputFormat")}>
                <OptionRow label={t("outputFormat")} htmlFor="wm-format">
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger id="wm-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
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
                  onClick={runWatermark}
                  disabled={processing}
                  className="flex-1"
                >
                  {processing ? t("processing") : t("applyWatermark")}
                </Button>
              </div>
            </>
          )}

          {/* The preview above already shows the composite, so the export only
              needs to report what it weighs. */}
          {resultUrl && (
            <p className="text-sm text-muted-foreground text-center" dir="ltr">
              {formatBytes(resultSize)}
            </p>
          )}
        </CardContent>
      </Card>
    </ToolShell>
  );
}
