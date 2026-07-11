"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";

type ShapeType = "polygon" | "circle" | "ellipse" | "inset";

interface Point {
  id: string;
  x: number; // percent 0..100
  y: number; // percent 0..100
}

interface CircleConfig {
  radius: number; // percent
  cx: number;
  cy: number;
}

interface EllipseConfig {
  rx: number;
  ry: number;
  cx: number;
  cy: number;
}

interface InsetConfig {
  top: number;
  right: number;
  bottom: number;
  left: number;
  round: number;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const POLYGON_PRESETS: { key: string; points: { x: number; y: number }[] }[] = [
  { key: "presetTriangle", points: [{ x: 50, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }] },
  { key: "presetRhombus", points: [{ x: 50, y: 0 }, { x: 100, y: 50 }, { x: 50, y: 100 }, { x: 0, y: 50 }] },
  { key: "presetPentagon", points: [{ x: 50, y: 0 }, { x: 100, y: 38 }, { x: 82, y: 100 }, { x: 18, y: 100 }, { x: 0, y: 38 }] },
  { key: "presetHexagon", points: [{ x: 25, y: 0 }, { x: 75, y: 0 }, { x: 100, y: 50 }, { x: 75, y: 100 }, { x: 25, y: 100 }, { x: 0, y: 50 }] },
  { key: "presetStar", points: [{ x: 50, y: 0 }, { x: 61, y: 35 }, { x: 98, y: 35 }, { x: 68, y: 57 }, { x: 79, y: 91 }, { x: 50, y: 70 }, { x: 21, y: 91 }, { x: 32, y: 57 }, { x: 2, y: 35 }, { x: 39, y: 35 }] },
  { key: "presetMessage", points: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 75 }, { x: 75, y: 75 }, { x: 75, y: 100 }, { x: 50, y: 75 }, { x: 0, y: 75 }] },
  { key: "presetArrow", points: [{ x: 40, y: 0 }, { x: 40, y: 20 }, { x: 100, y: 20 }, { x: 100, y: 80 }, { x: 40, y: 80 }, { x: 40, y: 100 }, { x: 0, y: 50 }] },
  { key: "presetChevron", points: [{ x: 75, y: 0 }, { x: 100, y: 50 }, { x: 75, y: 100 }, { x: 0, y: 100 }, { x: 25, y: 50 }, { x: 0, y: 0 }] },
];

function buildClipPath(
  shape: ShapeType,
  points: Point[],
  circle: CircleConfig,
  ellipse: EllipseConfig,
  inset: InsetConfig
): string {
  if (shape === "polygon") {
    const pts = points.map((p) => `${p.x}% ${p.y}%`).join(", ");
    return `polygon(${pts})`;
  }
  if (shape === "circle") {
    return `circle(${circle.radius}% at ${circle.cx}% ${circle.cy}%)`;
  }
  if (shape === "ellipse") {
    return `ellipse(${ellipse.rx}% ${ellipse.ry}% at ${ellipse.cx}% ${ellipse.cy}%)`;
  }
  // inset
  const { top, right, bottom, left, round } = inset;
  const base = `${top}% ${right}% ${bottom}% ${left}%`;
  return round > 0
    ? `inset(${base} round ${round}%)`
    : `inset(${base})`;
}

export default function ClipPathGenerator() {
  const t = useTranslations("Tools.ClipPathGenerator");
  const tc = useTranslations("ToolsConfig");
  // next-intl requires literal keys — map preset keys to translations explicitly.
  const presetLabel = (key: string): string => {
    switch (key) {
      case "presetTriangle": return t("presetTriangle");
      case "presetRhombus": return t("presetRhombus");
      case "presetPentagon": return t("presetPentagon");
      case "presetHexagon": return t("presetHexagon");
      case "presetStar": return t("presetStar");
      case "presetMessage": return t("presetMessage");
      case "presetArrow": return t("presetArrow");
      case "presetChevron": return t("presetChevron");
      default: return key;
    }
  };
  const [shape, setShape] = useState<ShapeType>("polygon");
  const [points, setPoints] = useState<Point[]>(
    POLYGON_PRESETS[0].points.map((p) => ({ id: uid(), ...p }))
  );
  const [circle, setCircle] = useState<CircleConfig>({ radius: 50, cx: 50, cy: 50 });
  const [ellipse, setEllipse] = useState<EllipseConfig>({ rx: 50, ry: 35, cx: 50, cy: 50 });
  const [inset, setInset] = useState<InsetConfig>({ top: 10, right: 10, bottom: 10, left: 10, round: 0 });

  const stageRef = useRef<HTMLDivElement>(null);
  const dragId = useRef<string | null>(null);

  const clipValue = useMemo(
    () => buildClipPath(shape, points, circle, ellipse, inset),
    [shape, points, circle, ellipse, inset]
  );
  const cssOutput = `clip-path: ${clipValue};\n-webkit-clip-path: ${clipValue};`;

  const updatePointFromEvent = useCallback((clientX: number, clientY: number) => {
    const id = dragId.current;
    const el = stageRef.current;
    if (!id || !el) return;
    const rect = el.getBoundingClientRect();
    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;
    x = Math.max(0, Math.min(100, Math.round(x)));
    y = Math.max(0, Math.min(100, Math.round(y)));
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)));
  }, []);

  const onPointerDown = useCallback((id: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    dragId.current = id;
    const move = (ev: PointerEvent) => updatePointFromEvent(ev.clientX, ev.clientY);
    const up = () => {
      dragId.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }, [updatePointFromEvent]);

  const addPoint = useCallback(() => {
    setPoints((prev) => {
      // insert a midpoint between last and first vertex
      const a = prev[prev.length - 1];
      const b = prev[0];
      const nx = Math.round((a.x + b.x) / 2);
      const ny = Math.round((a.y + b.y) / 2);
      return [...prev, { id: uid(), x: nx, y: ny }];
    });
  }, []);

  const removePoint = useCallback((id: string) => {
    setPoints((prev) => {
      if (prev.length <= 3) {
        toast.error(t("minPointsError"));
        return prev;
      }
      return prev.filter((p) => p.id !== id);
    });
  }, [t]);

  const loadPreset = useCallback((preset: (typeof POLYGON_PRESETS)[number]) => {
    setShape("polygon");
    setPoints(preset.points.map((p) => ({ id: uid(), ...p })));
    toast.success(t("presetLoaded"));
  }, [t]);

  const resetShape = useCallback(() => {
    setPoints(POLYGON_PRESETS[0].points.map((p) => ({ id: uid(), ...p })));
    setCircle({ radius: 50, cx: 50, cy: 50 });
    setEllipse({ rx: 50, ry: 35, cx: 50, cy: 50 });
    setInset({ top: 10, right: 10, bottom: 10, left: 10, round: 0 });
    toast.success(t("resetDone"));
  }, [t]);

  return (
    <ToolShell
      slug="clip-path-generator"
      title={tc("tools.clip-path-generator.name")}
      sub={tc("tools.clip-path-generator.description")}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="shadow-none">
          <CardContent className="space-y-6 pt-6">
            <Tabs value={shape} onValueChange={(v) => setShape(v as ShapeType)}>
              <TabsList className="w-full">
                <TabsTrigger value="polygon" className="flex-1">{t("polygon")}</TabsTrigger>
                <TabsTrigger value="circle" className="flex-1">{t("circle")}</TabsTrigger>
                <TabsTrigger value="ellipse" className="flex-1">{t("ellipse")}</TabsTrigger>
                <TabsTrigger value="inset" className="flex-1">{t("inset")}</TabsTrigger>
              </TabsList>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {/* Stage / preview */}
                <div className="space-y-2">
                  <Label>{t("preview")}</Label>
                  <div
                    ref={stageRef}
                    className="relative w-full rounded-lg border bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%),linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] select-none touch-none"
                    style={{ aspectRatio: "1 / 1" }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-pink-500"
                      style={{ clipPath: clipValue, WebkitClipPath: clipValue }}
                    />
                    {shape === "polygon" &&
                      points.map((p, i) => (
                        <button
                          key={p.id}
                          type="button"
                          aria-label={`${t("vertex")} ${i + 1}`}
                          data-testid={`vertex-${i}`}
                          onPointerDown={onPointerDown(p.id)}
                          className="absolute h-4 w-4 -ms-2 -mt-2 rounded-full border-2 border-white bg-indigo-600 shadow-md ring-1 ring-black/20 cursor-grab active:cursor-grabbing"
                          style={{ left: `${p.x}%`, top: `${p.y}%` }}
                        />
                      ))}
                  </div>
                </div>

                {/* Controls per shape */}
                <div className="space-y-4">
                  <TabsContent value="polygon" className="space-y-3 mt-0">
                    <div className="flex items-center justify-between">
                      <Label>{t("vertices")}</Label>
                      <Button variant="outline" size="sm" onClick={addPoint}>
                        <Plus className="w-4 h-4 me-1" />{t("addVertex")}
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-auto pe-1">
                      {points.map((p, i) => (
                        <div key={p.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center p-2 border rounded-lg bg-muted/30">
                          <span className="text-xs font-mono text-muted-foreground w-5 text-center">{i + 1}</span>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-muted-foreground"><span>X</span><span className="font-mono">{p.x}%</span></div>
                            <Slider min={0} max={100} step={1} value={[p.x]} onValueChange={([v]) => setPoints((prev) => prev.map((q) => q.id === p.id ? { ...q, x: v } : q))} />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-muted-foreground"><span>Y</span><span className="font-mono">{p.y}%</span></div>
                            <Slider min={0} max={100} step={1} value={[p.y]} onValueChange={([v]) => setPoints((prev) => prev.map((q) => q.id === p.id ? { ...q, y: v } : q))} />
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removePoint(p.id)} className="text-destructive hover:text-destructive h-8 w-8"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="circle" className="space-y-4 mt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between"><Label>{t("radius")}</Label><span className="text-sm font-mono text-muted-foreground">{circle.radius}%</span></div>
                      <Slider min={0} max={100} step={1} value={[circle.radius]} onValueChange={([v]) => setCircle((c) => ({ ...c, radius: v }))} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between"><Label>{t("centerX")}</Label><span className="text-sm font-mono text-muted-foreground">{circle.cx}%</span></div>
                      <Slider min={0} max={100} step={1} value={[circle.cx]} onValueChange={([v]) => setCircle((c) => ({ ...c, cx: v }))} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between"><Label>{t("centerY")}</Label><span className="text-sm font-mono text-muted-foreground">{circle.cy}%</span></div>
                      <Slider min={0} max={100} step={1} value={[circle.cy]} onValueChange={([v]) => setCircle((c) => ({ ...c, cy: v }))} />
                    </div>
                  </TabsContent>

                  <TabsContent value="ellipse" className="space-y-4 mt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between"><Label>{t("radiusX")}</Label><span className="text-sm font-mono text-muted-foreground">{ellipse.rx}%</span></div>
                      <Slider min={0} max={100} step={1} value={[ellipse.rx]} onValueChange={([v]) => setEllipse((c) => ({ ...c, rx: v }))} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between"><Label>{t("radiusY")}</Label><span className="text-sm font-mono text-muted-foreground">{ellipse.ry}%</span></div>
                      <Slider min={0} max={100} step={1} value={[ellipse.ry]} onValueChange={([v]) => setEllipse((c) => ({ ...c, ry: v }))} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between"><Label>{t("centerX")}</Label><span className="text-sm font-mono text-muted-foreground">{ellipse.cx}%</span></div>
                      <Slider min={0} max={100} step={1} value={[ellipse.cx]} onValueChange={([v]) => setEllipse((c) => ({ ...c, cx: v }))} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between"><Label>{t("centerY")}</Label><span className="text-sm font-mono text-muted-foreground">{ellipse.cy}%</span></div>
                      <Slider min={0} max={100} step={1} value={[ellipse.cy]} onValueChange={([v]) => setEllipse((c) => ({ ...c, cy: v }))} />
                    </div>
                  </TabsContent>

                  <TabsContent value="inset" className="space-y-4 mt-0">
                    {(["top", "right", "bottom", "left"] as const).map((side) => (
                      <div key={side} className="space-y-2">
                        <div className="flex justify-between"><Label>{t(side)}</Label><span className="text-sm font-mono text-muted-foreground">{inset[side]}%</span></div>
                        <Slider min={0} max={50} step={1} value={[inset[side]]} onValueChange={([v]) => setInset((c) => ({ ...c, [side]: v }))} />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <div className="flex justify-between"><Label>{t("cornerRadius")}</Label><span className="text-sm font-mono text-muted-foreground">{inset.round}%</span></div>
                      <Slider min={0} max={50} step={1} value={[inset.round]} onValueChange={([v]) => setInset((c) => ({ ...c, round: v }))} />
                    </div>
                  </TabsContent>

                  <Button variant="outline" size="sm" onClick={resetShape} className="w-full">
                    <RotateCcw className="w-4 h-4 me-2" />{t("reset")}
                  </Button>
                </div>
              </div>
            </Tabs>

            <div className="space-y-2">
              <Label>{t("generatedCSS")}</Label>
              <div className="flex gap-2 items-start">
                <pre dir="ltr" className="flex-1 text-xs bg-muted p-3 rounded-lg border overflow-x-auto whitespace-pre-wrap break-all font-mono text-left">{cssOutput}</pre>
                <CopyButton text={cssOutput} size="icon" successMessage={t("cssCopied")} errorMessage={t("copyFailed")} />
              </div>
            </div>

            <CopyButton text={cssOutput} label={t("copyCSS")} successMessage={t("cssCopied")} errorMessage={t("copyFailed")} />
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">{t("presetShapes")}</CardTitle>
            <CardDescription>{t("presetDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {POLYGON_PRESETS.map((preset) => {
                const cp = `polygon(${preset.points.map((p) => `${p.x}% ${p.y}%`).join(", ")})`;
                return (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => loadPreset(preset)}
                    className="group flex flex-col items-center gap-2 rounded-lg border p-3 hover:ring-2 hover:ring-primary transition-all"
                    title={presetLabel(preset.key)}
                  >
                    <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-pink-500" style={{ clipPath: cp, WebkitClipPath: cp }} />
                    <span className="text-xs text-muted-foreground text-center leading-tight">{presetLabel(preset.key)}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolShell>
  );
}
