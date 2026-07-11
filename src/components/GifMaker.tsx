"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { downloadUrl } from "@/lib/download";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Upload,
  Download,
  Film,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { encodeGif, type GifFrame } from "@/lib/media/gif-encode";

interface Frame {
  id: string;
  url: string;
  name: string;
  width: number;
  height: number;
}

let frameSeq = 0;

// Draw an image "contain"-fitted and centered into a target-sized context,
// filling the letterbox area with the given background colour. Keeps every
// frame the same dimensions regardless of the source image's aspect ratio.
function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  tw: number,
  th: number,
  background: string
) {
  ctx.clearRect(0, 0, tw, th);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, tw, th);
  const scale = Math.min(tw / img.naturalWidth, th / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, (tw - dw) / 2, (th - dh) / 2, dw, dh);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}

export default function GifMaker() {
  const t = useTranslations("Tools.GifMaker");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [frames, setFrames] = useState<Frame[]>([]);
  const [delay, setDelay] = useState(200); // ms per frame
  const [maxWidth, setMaxWidth] = useState(480);
  const [quality, setQuality] = useState(10); // gif.js: 1 best/slow .. 20 fast
  const [loopForever, setLoopForever] = useState(true);
  const [boomerang, setBoomerang] = useState(false);
  const [background, setBackground] = useState("#ffffff");

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);

  const resultUrlRef = useRef<string | null>(null);

  // Revoke every outstanding object URL on unmount to avoid leaks.
  useEffect(() => {
    return () => {
      frames.forEach((f) => URL.revokeObjectURL(f.url));
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const next: Frame[] = [];
      for (const file of acceptedFiles) {
        if (file.size > 15 * 1024 * 1024) {
          toast.error(t("imageTooLarge"));
          continue;
        }
        const url = URL.createObjectURL(file);
        try {
          const img = await loadImage(url);
          next.push({
            id: `f${frameSeq++}`,
            url,
            name: file.name,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        } catch {
          URL.revokeObjectURL(url);
        }
      }
      if (next.length) setFrames((prev) => [...prev, ...next]);
    },
    [t]
  );

  const removeFrame = (id: string) => {
    setFrames((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((f) => f.id !== id);
    });
  };

  const move = (index: number, dir: -1 | 1) => {
    setFrames((prev) => {
      const to = index + dir;
      if (to < 0 || to >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[to]] = [copy[to], copy[index]];
      return copy;
    });
  };

  const reverse = () => setFrames((prev) => [...prev].reverse());

  const clearAll = () => {
    frames.forEach((f) => URL.revokeObjectURL(f.url));
    setFrames([]);
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
    setResult(null);
    setResultSize(0);
  };

  const handleGenerate = async () => {
    if (frames.length < 2) {
      toast.error(t("tooFewFrames"));
      return;
    }
    setIsGenerating(true);
    setProgress(0);
    try {
      // Target size: first frame's aspect ratio, capped at maxWidth.
      const first = frames[0];
      const tw = Math.max(1, Math.min(maxWidth, first.width));
      const th = Math.max(1, Math.round((tw * first.height) / first.width));

      // Build the playback order, optionally bouncing back to the start.
      let order = [...frames];
      if (boomerang && frames.length > 2) {
        order = [...frames, ...frames.slice(1, -1).reverse()];
      }

      // Render each frame onto its own canvas so every snapshot survives until
      // encoding (a single reused canvas would only hold the last frame).
      const gifFrames: GifFrame[] = [];
      for (const frame of order) {
        const img = await loadImage(frame.url);
        const canvas = document.createElement("canvas");
        canvas.width = tw;
        canvas.height = th;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no canvas context");
        drawContain(ctx, img, tw, th, background);
        gifFrames.push({ source: canvas, delayMs: delay });
      }

      const blob = await encodeGif(gifFrames, {
        width: tw,
        height: th,
        quality,
        repeat: loopForever ? 0 : -1,
        onProgress: (p) => setProgress(Math.round(p * 100)),
      });

      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResult(url);
      setResultSize(blob.size);
      toast.success(t("generated"));
    } catch (error) {
      console.error(error);
      toast.error(t("generateFailed"));
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadUrl(result, "animation.gif");
  };

  const fps = (1000 / delay).toFixed(1);

  return (
    <ToolShell
      slug="gif-maker"
      title={tc("tools.gif-maker.name")}
      sub={tc("tools.gif-maker.description")}
    >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: frames + controls */}
          <div className="space-y-4">
            <Card className="p-6 shadow-none">
              <FileDropzone
                onFiles={onDrop}
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"],
                }}
                multiple={true}
                className={({ isDragActive }) => `
                  h-40 rounded-lg border-2 border-dashed
                  flex flex-col items-center justify-center space-y-3 p-6
                  cursor-pointer transition-[border-color,background-color] duration-150
                  ${
                    isDragActive
                      ? "border-primary bg-primary/10 scale-[0.99]"
                      : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                  }
                `}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-semibold">{t("dropHere")}</h3>
                  <p className="text-sm text-muted-foreground">{t("supported")}</p>
                </div>
              </FileDropzone>
            </Card>

            {frames.length > 0 && (
              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {frames.length} {t("framesUnit")}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={reverse}
                      disabled={frames.length < 2}
                    >
                      <RefreshCw className="w-4 h-4 me-1" />
                      {t("reverse")}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={clearAll}>
                      <Trash2 className="w-4 h-4 me-1" />
                      {t("clearAll")}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {frames.map((frame, i) => (
                    <div
                      key={frame.id}
                      className="group relative aspect-square rounded-md overflow-hidden border bg-muted"
                    >
                      <img
                        src={frame.url}
                        alt={frame.name}
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute top-1 start-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-black/60 text-white">
                        {i + 1}
                      </span>
                      <div className="absolute inset-x-0 bottom-0 flex justify-between p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                        <button
                          type="button"
                          aria-label={t("moveLeft")}
                          onClick={() => move(i, -1)}
                          disabled={i === 0}
                          className="text-white disabled:opacity-30"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={t("removeFrame")}
                          onClick={() => removeFrame(frame.id)}
                          className="text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={t("moveRight")}
                          onClick={() => move(i, 1)}
                          disabled={i === frames.length - 1}
                          className="text-white disabled:opacity-30"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-4 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">{t("frameDelay")}</label>
                  <span className="text-sm text-muted-foreground">
                    {delay} ms · {fps} fps
                  </span>
                </div>
                <Slider
                  value={[delay]}
                  onValueChange={([v]) => setDelay(v)}
                  min={20}
                  max={1000}
                  step={10}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">{t("maxWidth")}</label>
                  <span className="text-sm text-muted-foreground">{maxWidth}px</span>
                </div>
                <Slider
                  value={[maxWidth]}
                  onValueChange={([v]) => setMaxWidth(v)}
                  min={100}
                  max={1000}
                  step={20}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">{t("quality")}</label>
                  <span className="text-sm text-muted-foreground">
                    {quality <= 5
                      ? t("betterQuality")
                      : quality >= 15
                      ? t("smallerFile")
                      : "·"}
                  </span>
                </div>
                <Slider
                  value={[quality]}
                  onValueChange={([v]) => setQuality(v)}
                  min={1}
                  max={20}
                  step={1}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="gif-loop"
                    checked={loopForever}
                    onCheckedChange={(c) => setLoopForever(Boolean(c))}
                  />
                  <label htmlFor="gif-loop" className="text-sm">
                    {t("loopForever")}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="gif-boomerang"
                    checked={boomerang}
                    onCheckedChange={(c) => setBoomerang(Boolean(c))}
                  />
                  <label htmlFor="gif-boomerang" className="text-sm">
                    {t("boomerang")}
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label htmlFor="gif-bg" className="text-sm font-medium">
                  {t("background")}
                </label>
                <input
                  id="gif-bg"
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="h-8 w-14 rounded border bg-transparent cursor-pointer"
                />
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full"
                disabled={frames.length < 2 || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 me-2 animate-spin" />
                    {t("generating")} {progress}%
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4 me-2" />
                    {t("generate")}
                  </>
                )}
              </Button>
            </Card>
          </div>

          {/* Right: result */}
          <div className="space-y-4">
            <Card className="p-6">
              <div className="min-h-64 rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center p-4">
                {result ? (
                  <div className="w-full text-center space-y-2">
                    <img
                      src={result}
                      alt={t("resultAlt")}
                      className="max-w-full max-h-[60vh] mx-auto object-contain"
                    />
                    <p className="text-sm text-muted-foreground">
                      {t("size")}: {(resultSize / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Film className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{t("resultPlaceholder")}</p>
                  </div>
                )}
              </div>
            </Card>

            <Button
              onClick={handleDownload}
              className="w-full"
              disabled={!result}
              variant="secondary"
            >
              <Download className="w-4 h-4 me-2" />
              {tCommon("download")}
            </Button>
          </div>
        </div>
    </ToolShell>
  );
}
