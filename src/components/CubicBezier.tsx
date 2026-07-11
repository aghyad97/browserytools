"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";

type Bezier = [number, number, number, number];

interface Preset {
  key: string;
  label: string;
  value: Bezier;
}

const PRESETS: Preset[] = [
  { key: "linear", label: "linear", value: [0, 0, 1, 1] },
  { key: "ease", label: "ease", value: [0.25, 0.1, 0.25, 1] },
  { key: "ease-in", label: "ease-in", value: [0.42, 0, 1, 1] },
  { key: "ease-out", label: "ease-out", value: [0, 0, 0.58, 1] },
  { key: "ease-in-out", label: "ease-in-out", value: [0.42, 0, 0.58, 1] },
  { key: "back-in-out", label: "back", value: [0.68, -0.55, 0.27, 1.55] },
];

const DEFAULT: Bezier = [0.25, 0.1, 0.25, 1];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const round2 = (n: number) => Math.round(n * 100) / 100;

// SVG geometry (LTR coordinate space). The drawing box is 0..1 mapped to a
// padded square so handles can overshoot above/below for "back"-style curves.
const SIZE = 320;
const PAD = 70; // vertical overshoot room for y outside [0,1]
const W = SIZE;
const H = SIZE + PAD * 2;

// Map a bezier-space point (x in [0,1], y in [0,1+]) to SVG pixel coords.
// y=0 at the bottom of the unit box, y=1 at the top.
const toPx = (x: number, y: number): [number, number] => [x * W, PAD + (1 - y) * SIZE];

export default function CubicBezier() {
  const t = useTranslations("Tools.CubicBezier");
  const tc = useTranslations("ToolsConfig");
  const [bezier, setBezier] = useState<Bezier>(DEFAULT);
  const [duration, setDuration] = useState(1);
  const [playKey, setPlayKey] = useState(0);
  const [activePreset, setActivePreset] = useState<string | null>("ease");
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef<0 | 1 | null>(null);

  const [x1, y1, x2, y2] = bezier;
  const cssFn = `cubic-bezier(${round2(x1)}, ${round2(y1)}, ${round2(x2)}, ${round2(y2)})`;
  const cssOutput = `transition-timing-function: ${cssFn};`;

  const applyPreset = (p: Preset) => {
    setBezier(p.value);
    setActivePreset(p.key);
  };

  const setValue = (i: number, raw: number) => {
    setActivePreset(null);
    setBezier((prev) => {
      const next = [...prev] as Bezier;
      // x must stay within [0,1]; y is unbounded but we keep it sane.
      next[i] = i === 0 || i === 2 ? clamp01(raw) : raw;
      return next;
    });
  };

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (dragging.current === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    const bx = clamp01(px / W);
    const by = 1 - (py - PAD) / SIZE; // can exceed [0,1]
    setActivePreset(null);
    setBezier((prev) => {
      const next = [...prev] as Bezier;
      if (dragging.current === 0) {
        next[0] = round2(bx);
        next[1] = round2(by);
      } else {
        next[2] = round2(bx);
        next[3] = round2(by);
      }
      return next;
    });
  }, []);

  const stopDrag = useCallback(() => {
    dragging.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", stopDrag);
  }, [onPointerMove]);

  const startDrag = (handle: 0 | 1) => (e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = handle;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDrag);
  };

  const reset = () => {
    setBezier(DEFAULT);
    setActivePreset("ease");
  };

  const [h0x, h0y] = toPx(x1, y1);
  const [h1x, h1y] = toPx(x2, y2);
  const [startX, startY] = toPx(0, 0);
  const [endX, endY] = toPx(1, 1);
  const curvePath = `M ${startX} ${startY} C ${h0x} ${h0y}, ${h1x} ${h1y}, ${endX} ${endY}`;

  return (
    <ToolShell
      slug="cubic-bezier"
      title={tc("tools.cubic-bezier.name")}
      sub={tc("tools.cubic-bezier.description")}
    >
      <div className="max-w-5xl mx-auto space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Curve editor — forced LTR so the canvas math is direction-agnostic */}
            <div dir="ltr" className="space-y-3">
              <Label>{t("curveEditor")}</Label>
              <div className="rounded-lg border bg-muted/30 p-3">
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${W} ${H}`}
                  className="w-full h-auto touch-none select-none"
                  role="img"
                  aria-label={t("curveEditor")}
                  data-testid="bezier-canvas"
                >
                  {/* unit box */}
                  <rect x={0} y={PAD} width={W} height={SIZE} fill="none" stroke="currentColor" strokeOpacity={0.15} />
                  {/* grid */}
                  {[0.25, 0.5, 0.75].map((g) => (
                    <line key={`v${g}`} x1={g * W} y1={PAD} x2={g * W} y2={PAD + SIZE} stroke="currentColor" strokeOpacity={0.08} />
                  ))}
                  {[0.25, 0.5, 0.75].map((g) => (
                    <line key={`h${g}`} x1={0} y1={PAD + g * SIZE} x2={W} y2={PAD + g * SIZE} stroke="currentColor" strokeOpacity={0.08} />
                  ))}
                  {/* handle guide lines */}
                  <line x1={startX} y1={startY} x2={h0x} y2={h0y} className="stroke-primary/50" strokeWidth={2} />
                  <line x1={endX} y1={endY} x2={h1x} y2={h1y} className="stroke-primary/50" strokeWidth={2} />
                  {/* curve */}
                  <path d={curvePath} fill="none" className="stroke-primary" strokeWidth={3} strokeLinecap="round" />
                  {/* endpoints */}
                  <circle cx={startX} cy={startY} r={5} className="fill-muted-foreground" />
                  <circle cx={endX} cy={endY} r={5} className="fill-muted-foreground" />
                  {/* draggable handles */}
                  <circle
                    cx={h0x}
                    cy={h0y}
                    r={9}
                    className="fill-primary cursor-grab active:cursor-grabbing"
                    onPointerDown={startDrag(0)}
                    data-testid="handle-0"
                  />
                  <circle
                    cx={h1x}
                    cy={h1y}
                    r={9}
                    className="fill-primary cursor-grab active:cursor-grabbing"
                    onPointerDown={startDrag(1)}
                    data-testid="handle-1"
                  />
                </svg>
              </div>
              <p className="text-xs text-muted-foreground">{t("dragHint")}</p>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>{t("presets")}</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => applyPreset(p)}
                      data-testid={`preset-${p.key}`}
                      className={`px-3 py-1 rounded text-sm border font-mono transition-colors ${
                        activePreset === p.key
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("values")}</Label>
                <div dir="ltr" className="grid grid-cols-4 gap-2">
                  {(["X1", "Y1", "X2", "Y2"] as const).map((lbl, i) => (
                    <div key={lbl} className="space-y-1">
                      <span className="text-xs text-muted-foreground font-mono">{lbl}</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={bezier[i]}
                        onChange={(e) => setValue(i, Number.parseFloat(e.target.value) || 0)}
                        data-testid={`input-${i}`}
                        className="font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t("duration")}</Label>
                  <span className="text-sm text-muted-foreground tabular-nums">{duration}s</span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={3}
                  step={0.1}
                  value={duration}
                  onChange={(e) => setDuration(Number.parseFloat(e.target.value))}
                  className="w-full"
                  aria-label={t("duration")}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("preview")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div dir="ltr" className="relative h-12 rounded-lg bg-muted/40 overflow-hidden">
              <div
                key={playKey}
                data-testid="preview-dot"
                className="absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary"
                style={{
                  left: 8,
                  animation: `bezier-move ${duration}s ${cssFn} forwards`,
                }}
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => setPlayKey((k) => k + 1)} data-testid="play-preview">
              {t("playPreview")}
            </Button>
            <style>{`@keyframes bezier-move { from { left: 8px; } to { left: calc(100% - 40px); } }`}</style>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("cssOutput")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <pre
              dir="ltr"
              data-testid="css-output"
              className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap"
            >
              {cssOutput}
            </pre>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={cssOutput} label={t("copyCSS")} successMessage={t("copied")} />
              <Button variant="ghost" size="sm" onClick={reset}>
                {t("reset")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t("transitionTip")}</p>
          </CardContent>
        </Card>
      </div>
      </div>
    </ToolShell>
  );
}
