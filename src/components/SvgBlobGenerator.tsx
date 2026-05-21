"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Copy, Download } from "lucide-react";

type Mode = "blob" | "wave";
type Fill = "solid" | "gradient";

// ── Deterministic PRNG (mulberry32) seeded by an integer ──────────────────────
function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

// Smooth closed path through points using Catmull-Rom → cubic bézier.
function smoothClosedPath(pts: Array<[number, number]>): string {
  const n = pts.length;
  if (n < 3) return "";
  let d = `M${round(pts[0][0])},${round(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${round(c1x)},${round(c1y)} ${round(c2x)},${round(c2y)} ${round(p2[0])},${round(p2[1])}`;
  }
  return `${d}Z`;
}

function buildBlobPath(
  size: number,
  points: number,
  randomness: number,
  rng: () => number,
): string {
  const cx = size / 2;
  const cy = size / 2;
  const baseR = size * 0.36;
  const maxJitter = baseR * (randomness / 100);
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const r = baseR + (rng() * 2 - 1) * maxJitter;
    pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
  }
  return smoothClosedPath(pts);
}

function buildWavePath(
  width: number,
  height: number,
  points: number,
  randomness: number,
  rng: () => number,
): string {
  const segs = Math.max(2, points);
  const midY = height * 0.5;
  const amp = height * 0.4 * (0.4 + (randomness / 100) * 0.6);
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= segs; i++) {
    const x = (i / segs) * width;
    const y = midY + (rng() * 2 - 1) * amp;
    pts.push([x, y]);
  }
  // Smooth open curve, then close down to the bottom edge for a filled divider.
  let d = `M0,${round(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${round(c1x)},${round(c1y)} ${round(c2x)},${round(c2y)} ${round(p2[0])},${round(p2[1])}`;
  }
  d += `L${width},${height}L0,${height}Z`;
  return d;
}

export default function SvgBlobGenerator() {
  const t = useTranslations("Tools.SvgBlobGenerator");

  const [mode, setMode] = useState<Mode>("blob");
  const [points, setPoints] = useState(6);
  const [randomness, setRandomness] = useState(40);
  const [size, setSize] = useState(400);
  const [fill, setFill] = useState<Fill>("gradient");
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#ec4899");
  const [seed, setSeed] = useState(1);

  const waveHeight = Math.round(size * 0.4);

  const { svg, path, viewW, viewH } = useMemo(() => {
    const rng = makeRng(seed);
    const gradId = "blobGradient";
    const fillRef =
      fill === "gradient" ? `url(#${gradId})` : color1;

    if (mode === "wave") {
      const w = size;
      const h = waveHeight;
      const p = buildWavePath(w, h, points, randomness, rng);
      const defs =
        fill === "gradient"
          ? `<defs><linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${color1}"/><stop offset="100%" stop-color="${color2}"/></linearGradient></defs>`
          : "";
      const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${defs}<path fill="${fillRef}" d="${p}"/></svg>`;
      return { svg: markup, path: p, viewW: w, viewH: h };
    }

    const w = size;
    const h = size;
    const p = buildBlobPath(size, points, randomness, rng);
    const defs =
      fill === "gradient"
        ? `<defs><linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${color1}"/><stop offset="100%" stop-color="${color2}"/></linearGradient></defs>`
        : "";
    const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${defs}<path fill="${fillRef}" d="${p}"/></svg>`;
    return { svg: markup, path: p, viewW: w, viewH: h };
  }, [mode, points, randomness, size, fill, color1, color2, seed, waveHeight]);

  const regenerate = () => {
    setSeed(Math.floor(Math.random() * 1_000_000) + 1);
  };

  const copySvg = async () => {
    try {
      await navigator.clipboard.writeText(svg);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  const downloadSvg = () => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "wave" ? "wave-divider.svg" : "blob.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={mode === "blob" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("blob")}
              data-testid="mode-blob"
            >
              {t("modeBlob")}
            </Button>
            <Button
              variant={mode === "wave" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("wave")}
              data-testid="mode-wave"
            >
              {t("modeWave")}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <Label>{t("complexity")}</Label>
                  <span className="text-muted-foreground tabular-nums">
                    {points}
                  </span>
                </div>
                <Slider
                  min={3}
                  max={12}
                  value={[points]}
                  onValueChange={([v]) => setPoints(v)}
                  data-testid="slider-complexity"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <Label>{t("randomness")}</Label>
                  <span className="text-muted-foreground tabular-nums">
                    {randomness}%
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  value={[randomness]}
                  onValueChange={([v]) => setRandomness(v)}
                  data-testid="slider-randomness"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <Label>{t("size")}</Label>
                  <span className="text-muted-foreground tabular-nums">
                    {size}px
                  </span>
                </div>
                <Slider
                  min={120}
                  max={800}
                  step={20}
                  value={[size]}
                  onValueChange={([v]) => setSize(v)}
                  data-testid="slider-size"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("fill")}</Label>
                <Select
                  value={fill}
                  onValueChange={(v) => setFill(v as Fill)}
                >
                  <SelectTrigger data-testid="fill-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">{t("fillSolid")}</SelectItem>
                    <SelectItem value="gradient">
                      {t("fillGradient")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  {fill === "gradient" ? t("colorStart") : t("color")}
                </Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="h-10 w-20 rounded cursor-pointer border"
                    aria-label={t("color")}
                  />
                  <span className="font-mono text-sm">{color1}</span>
                </div>
              </div>
              {fill === "gradient" && (
                <div className="space-y-2">
                  <Label>{t("colorEnd")}</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="h-10 w-20 rounded cursor-pointer border"
                      aria-label={t("colorEnd")}
                    />
                    <span className="font-mono text-sm">{color2}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={regenerate} data-testid="regenerate">
              <RefreshCw className="me-2 h-4 w-4" />
              {t("regenerate")}
            </Button>
            <Button variant="outline" onClick={copySvg} data-testid="copy-svg">
              <Copy className="me-2 h-4 w-4" />
              {t("copySvg")}
            </Button>
            <Button
              variant="outline"
              onClick={downloadSvg}
              data-testid="download-svg"
            >
              <Download className="me-2 h-4 w-4" />
              {t("downloadSvg")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("preview")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8 bg-muted/30 rounded-b-lg">
            <svg
              viewBox={`0 0 ${viewW} ${viewH}`}
              className="max-w-full"
              style={{ width: 320, height: (320 * viewH) / viewW }}
              data-testid="preview-svg"
            >
              {fill === "gradient" && (
                <defs>
                  <linearGradient
                    id="previewGradient"
                    x1="0%"
                    y1="0%"
                    x2={mode === "wave" ? "100%" : "100%"}
                    y2={mode === "wave" ? "0%" : "100%"}
                  >
                    <stop offset="0%" stopColor={color1} />
                    <stop offset="100%" stopColor={color2} />
                  </linearGradient>
                </defs>
              )}
              <path
                d={path}
                fill={fill === "gradient" ? "url(#previewGradient)" : color1}
                data-testid="preview-path"
              />
            </svg>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("svgOutput")}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre
              dir="ltr"
              className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all max-h-72"
              data-testid="svg-output"
            >
              {svg}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
