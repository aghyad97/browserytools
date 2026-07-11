"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { downloadUrl } from "@/lib/download";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Trash2,
  ScissorsIcon,
  InfoIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { segment, type SamPoint, type LoadProgress } from "@/lib/sam-segment";
import { hasWebGPU } from "@/lib/hf-pipeline";

type LoadedImage = {
  url: string;
  width: number;
  height: number;
  name: string;
};

export default function ObjectCutout() {
  const t = useTranslations("Tools.ObjectCutout");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [image, setImage] = useState<LoadedImage | null>(null);
  const [points, setPoints] = useState<SamPoint[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgElRef = useRef<HTMLImageElement | null>(null);
  const cutoutUrlRef = useRef<string | null>(null);

  // Draw the source image and any click points onto the canvas.
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgElRef.current;
    if (!canvas || !img || !image) return;
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, image.width, image.height);

    const r = Math.max(6, Math.round(Math.min(image.width, image.height) / 80));
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = p.label === 1 ? "#22c55e" : "#ef4444";
      ctx.fill();
      ctx.lineWidth = Math.max(2, r / 3);
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    }
  }, [image, points]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  useEffect(() => {
    return () => {
      if (cutoutUrlRef.current) URL.revokeObjectURL(cutoutUrlRef.current);
    };
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        const img = new Image();
        img.onload = () => {
          imgElRef.current = img;
          setImage({
            url,
            width: img.naturalWidth,
            height: img.naturalHeight,
            name: file.name,
          });
          setPoints([]);
          setCutoutUrl(null);
        };
        img.onerror = () => toast.error(t("loadFailed"));
        img.src = url;
      };
      reader.readAsDataURL(file);
    },
    [t]
  );

  // Map a click on the displayed canvas back to original image pixel coords.
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || !image || busy) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = image.width / rect.width;
      const scaleY = image.height / rect.height;
      const x = Math.round((e.clientX - rect.left) * scaleX);
      const y = Math.round((e.clientY - rect.top) * scaleY);
      // Right-click / alt-click marks a background (exclude) point.
      const label: 0 | 1 = e.altKey ? 0 : 1;
      setPoints((prev) => [...prev, { x, y, label }]);
      setCutoutUrl(null);
    },
    [image, busy]
  );

  const clearPoints = useCallback(() => {
    setPoints([]);
    setCutoutUrl(null);
  }, []);

  const handleReset = useCallback(() => {
    setImage(null);
    setPoints([]);
    setCutoutUrl(null);
    imgElRef.current = null;
  }, []);

  const runCutout = useCallback(async () => {
    if (!image || !imgElRef.current) {
      toast.error(t("uploadFirst"));
      return;
    }
    if (points.length === 0) {
      toast.error(t("clickFirst"));
      return;
    }
    setBusy(true);
    setCutoutUrl(null);
    try {
      const mask = await segment(image.url, points, setProgress);

      // Apply the mask to the source image to produce a transparent PNG.
      const out = document.createElement("canvas");
      out.width = image.width;
      out.height = image.height;
      const ctx = out.getContext("2d");
      if (!ctx) throw new Error("no-canvas-context");
      ctx.drawImage(imgElRef.current, 0, 0, image.width, image.height);
      const imageData = ctx.getImageData(0, 0, image.width, image.height);
      const data = imageData.data;
      // Mask may differ slightly in size; sample nearest.
      const mw = mask.width;
      const mh = mask.height;
      for (let y = 0; y < image.height; y++) {
        const my = Math.min(mh - 1, Math.floor((y * mh) / image.height));
        for (let x = 0; x < image.width; x++) {
          const mx = Math.min(mw - 1, Math.floor((x * mw) / image.width));
          if (!mask.data[my * mw + mx]) {
            data[(y * image.width + x) * 4 + 3] = 0; // make transparent
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) =>
        out.toBlob((b) => resolve(b), "image/png")
      );
      if (!blob) throw new Error("no-blob");

      if (cutoutUrlRef.current) URL.revokeObjectURL(cutoutUrlRef.current);
      const url = URL.createObjectURL(blob);
      cutoutUrlRef.current = url;
      setCutoutUrl(url);
      toast.success(t("cutoutReady"));
    } catch (err) {
      console.error(err);
      toast.error(t("failed"));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [image, points, t]);

  const handleDownload = useCallback(() => {
    if (!cutoutUrl || !image) return;
    const base = image.name.replace(/\.[^.]+$/, "");
    downloadUrl(cutoutUrl, `${base}-cutout.png`);
    toast.success(t("downloaded"));
  }, [cutoutUrl, image, t]);

  return (
    <ToolShell
      slug="object-cutout"
      title={tc("tools.object-cutout.name")}
      sub={tc("tools.object-cutout.description")}
      primaryAction={{
        label: tCommon("download"),
        onClick: handleDownload,
        disabled: !cutoutUrl,
      }}
    >
      <div className="space-y-4">
          {!hasWebGPU() && (
            <Card className="p-3 border-amber-500/40 bg-amber-500/5">
              <div className="flex items-start gap-3">
                <InfoIcon className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {t("webgpuNote")}
                </p>
              </div>
            </Card>
          )}

          {!image ? (
            <Card className="p-6">
              <FileDropzone
                onFiles={onDrop}
                accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                multiple={false}
                className={({ isDragActive }) =>
                  `h-64 rounded-lg border-2 border-dashed flex flex-col items-center justify-center space-y-4 p-8 cursor-pointer transition-[border-color,background-color] duration-150 ${
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
                  <h3 className="text-lg font-semibold mb-1">
                    {t("dropImageHere")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("supportedFormats")}
                  </p>
                </div>
              </FileDropzone>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Source + click points (canvas stays LTR) */}
              <Card className="p-4 space-y-3">
                <p className="text-sm font-medium">{t("clickInstruction")}</p>
                <div
                  className="relative w-full rounded-lg overflow-hidden bg-[repeating-conic-gradient(#e5e7eb_0_25%,transparent_0_50%)] bg-[length:20px_20px]"
                  dir="ltr"
                >
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    data-testid="cutout-canvas"
                    className="w-full h-auto cursor-crosshair"
                  />
                  {busy && (
                    <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-xs text-muted-foreground">
                        {t("segmenting")}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("pointsCount", { count: points.length })}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={runCutout} disabled={busy}>
                    <ScissorsIcon className="w-4 h-4 me-2" />
                    {busy ? t("cuttingOut") : t("cutOut")}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={clearPoints}
                    disabled={busy || points.length === 0}
                  >
                    <Trash2 className="w-4 h-4 me-2" />
                    {t("clearPoints")}
                  </Button>
                  <Button variant="ghost" onClick={handleReset} disabled={busy}>
                    {t("newImage")}
                  </Button>
                </div>

                {busy && progress && progress.status === "progress" && (
                  <div className="space-y-1">
                    <Progress value={progress.percent} />
                    <p className="text-xs text-muted-foreground">
                      {t("loadingModel")}{" "}
                      <span dir="ltr">{progress.percent}%</span>
                    </p>
                  </div>
                )}
              </Card>

              {/* Result */}
              <Card className="p-4 space-y-3">
                <p className="text-sm font-medium">{t("resultLabel")}</p>
                <div
                  className="w-full rounded-lg overflow-hidden bg-[repeating-conic-gradient(#e5e7eb_0_25%,transparent_0_50%)] bg-[length:20px_20px] min-h-[12rem] flex items-center justify-center"
                  dir="ltr"
                >
                  {cutoutUrl ? (
                    <img
                      src={cutoutUrl}
                      alt={t("resultAlt")}
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground p-8 text-center">
                      {t("resultPlaceholder")}
                    </p>
                  )}
                </div>
              </Card>
            </div>
          )}

          <Card className="p-4">
            <div className="flex items-start gap-3">
              <InfoIcon className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">{t("modelNote")}</p>
            </div>
          </Card>
      </div>
    </ToolShell>
  );
}
