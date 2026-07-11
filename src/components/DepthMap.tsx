"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Download, MountainIcon, InfoIcon } from "lucide-react";
import { toast } from "sonner";
import { canvasToBlob } from "@/lib/image/canvas";
import { downloadUrl } from "@/lib/download";
import { getPipeline, type LoadProgress } from "@/lib/hf-pipeline";

const MODEL = "onnx-community/depth-anything-v2-small";

// Minimal shape of a Transformers.js depth-estimation result. The `depth`
// field is a single-channel grayscale RawImage (data: 0-255, channels: 1).
type RawDepthImage = {
  data: Uint8Array | Uint8ClampedArray;
  width: number;
  height: number;
  channels: number;
};
type DepthOutput = { depth: RawDepthImage };
type DepthEstimator = (input: string) => Promise<DepthOutput>;

type Colormap = "grayscale" | "inferno" | "viridis";

// Small perceptual color ramps (5 stops each) sampled from matplotlib.
// We linearly interpolate between adjacent stops for a smooth gradient.
const RAMPS: Record<Exclude<Colormap, "grayscale">, [number, number, number][]> = {
  inferno: [
    [0, 0, 4],
    [87, 16, 110],
    [188, 55, 84],
    [249, 142, 9],
    [252, 255, 164],
  ],
  viridis: [
    [68, 1, 84],
    [59, 82, 139],
    [33, 145, 140],
    [94, 201, 98],
    [253, 231, 37],
  ],
};

function rampColor(
  ramp: [number, number, number][],
  v: number
): [number, number, number] {
  const t = Math.max(0, Math.min(1, v / 255));
  const scaled = t * (ramp.length - 1);
  const i = Math.min(Math.floor(scaled), ramp.length - 2);
  const f = scaled - i;
  const a = ramp[i];
  const b = ramp[i + 1];
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ];
}

// Paint a single-channel depth RawImage onto a canvas using the chosen colormap.
function paintDepth(
  canvas: HTMLCanvasElement,
  depth: RawDepthImage,
  colormap: Colormap
): void {
  canvas.width = depth.width;
  canvas.height = depth.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  const imageData = ctx.createImageData(depth.width, depth.height);
  const out = imageData.data;
  const src = depth.data;
  const ramp = colormap === "grayscale" ? null : RAMPS[colormap];

  for (let i = 0; i < src.length; i++) {
    const g = src[i];
    const o = i * 4;
    if (ramp) {
      const [r, gg, b] = rampColor(ramp, g);
      out[o] = r;
      out[o + 1] = gg;
      out[o + 2] = b;
    } else {
      out[o] = g;
      out[o + 1] = g;
      out[o + 2] = g;
    }
    out[o + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}

export default function DepthMap() {
  const t = useTranslations("Tools.DepthMap");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("image");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [colormap, setColormap] = useState<Colormap>("grayscale");
  const [hasResult, setHasResult] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const depthRef = useRef<RawDepthImage | null>(null);

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
        setImageUrl(reader.result as string);
        setFileName(file.name.replace(/\.[^.]+$/, "") || "image");
        setHasResult(false);
        depthRef.current = null;
      };
      reader.readAsDataURL(file);
    },
    [t]
  );

  const generate = useCallback(async () => {
    if (!imageUrl) {
      toast.error(t("uploadFirst"));
      return;
    }
    setBusy(true);
    setHasResult(false);
    try {
      const estimator = await getPipeline<DepthEstimator>(
        "depth-estimation",
        MODEL,
        { device: "auto", onProgress: setProgress }
      );
      const out = await estimator(imageUrl);
      depthRef.current = out.depth;
      if (canvasRef.current) {
        paintDepth(canvasRef.current, out.depth, colormap);
      }
      setHasResult(true);
    } catch (err) {
      console.error(err);
      toast.error(t("failed"));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [imageUrl, colormap, t]);

  // Re-paint when the colormap changes after a result already exists.
  useEffect(() => {
    if (hasResult && depthRef.current && canvasRef.current) {
      paintDepth(canvasRef.current, depthRef.current, colormap);
    }
  }, [colormap, hasResult]);

  const download = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasResult) return;
    const blob = await canvasToBlob(canvas);
    if (!blob) {
      toast.error(t("failed"));
      return;
    }
    const url = URL.createObjectURL(blob);
    downloadUrl(url, `${fileName}-depth.png`);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(t("downloaded"));
  }, [hasResult, fileName, t]);

  return (
    <ToolShell
      slug="depth-map"
      title={tc("tools.depth-map.name")}
      sub={tc("tools.depth-map.description")}
      width="wide"
    >
      <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original */}
            <Card className="p-4 space-y-3">
              <span className="text-sm font-medium">{t("original")}</span>
              <FileDropzone
                onFiles={onDrop}
                accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                multiple={false}
                className={({ isDragActive }) =>
                  `h-72 rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer transition-[border-color,background-color] duration-150 ${
                    isDragActive
                      ? "border-primary bg-primary/10 scale-[0.99]"
                      : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                  }`
                }
              >
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={t("altOriginal")}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold mb-1">
                      {t("dropImageHere")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t("supportedFormats")}
                    </p>
                  </div>
                )}
              </FileDropzone>
            </Card>

            {/* Depth result */}
            <Card className="p-4 space-y-3">
              <span className="text-sm font-medium">{t("depthMap")}</span>
              <div className="h-72 rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center overflow-hidden bg-muted/30">
                <canvas
                  ref={canvasRef}
                  data-testid="depth-canvas"
                  className={`max-h-full max-w-full object-contain ${
                    hasResult ? "block" : "hidden"
                  }`}
                />
                {!hasResult && (
                  <div className="text-center px-4">
                    <MountainIcon className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {t("depthPlaceholder")}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="dm-colormap">
                {t("colormap")}
              </label>
              <Select
                value={colormap}
                onValueChange={(v) => setColormap(v as Colormap)}
              >
                <SelectTrigger id="dm-colormap" data-testid="colormap-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grayscale">{t("grayscale")}</SelectItem>
                  <SelectItem value="inferno">{t("inferno")}</SelectItem>
                  <SelectItem value="viridis">{t("viridis")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={generate}
                disabled={!imageUrl || busy}
                className="flex-1"
                data-testid="generate-btn"
              >
                {busy ? t("generating") : t("generate")}
              </Button>
              <Button
                onClick={download}
                disabled={!hasResult || busy}
                variant="secondary"
                className="flex-1"
                data-testid="download-btn"
              >
                <Download className="w-4 h-4 me-2" />
                {tCommon("download")}
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
