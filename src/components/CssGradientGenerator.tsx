"use client";

import { useState, useCallback, useRef } from "react";
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
import {
  Copy,
  Plus,
  Trash2,
  Download,
  ArrowRight,
  ArrowDown,
  ArrowDownRight,
  ArrowDownLeft,
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  ArrowUpLeft,
} from "lucide-react";

interface ColorStop {
  id: string;
  color: string;
  opacity: number;
  position: number;
}

type GradientType = "linear" | "radial" | "conic";

interface RadialConfig {
  shape: "circle" | "ellipse";
  position: string;
}

interface ConicConfig {
  startAngle: number;
  position: string;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  if (opacity >= 1) return hex;
  return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
}

const PRESETS = [
  { name: "Ocean Breeze", type: "linear" as GradientType, angle: 135, stops: [{ id: "a", color: "#667eea", opacity: 1, position: 0 }, { id: "b", color: "#764ba2", opacity: 1, position: 100 }] },
  { name: "Sunset", type: "linear" as GradientType, angle: 90, stops: [{ id: "a", color: "#f093fb", opacity: 1, position: 0 }, { id: "b", color: "#f5576c", opacity: 1, position: 100 }] },
  { name: "Emerald", type: "linear" as GradientType, angle: 120, stops: [{ id: "a", color: "#0fd850", opacity: 1, position: 0 }, { id: "b", color: "#f9f047", opacity: 1, position: 100 }] },
  { name: "Deep Space", type: "linear" as GradientType, angle: 180, stops: [{ id: "a", color: "#0c0c0c", opacity: 1, position: 0 }, { id: "b", color: "#1a1a2e", opacity: 1, position: 50 }, { id: "c", color: "#16213e", opacity: 1, position: 100 }] },
  { name: "Cotton Candy", type: "linear" as GradientType, angle: 45, stops: [{ id: "a", color: "#fddb92", opacity: 1, position: 0 }, { id: "b", color: "#d1fdff", opacity: 1, position: 100 }] },
  { name: "Mango", type: "linear" as GradientType, angle: 160, stops: [{ id: "a", color: "#ffe259", opacity: 1, position: 0 }, { id: "b", color: "#ffa751", opacity: 1, position: 100 }] },
  { name: "Aurora", type: "linear" as GradientType, angle: 100, stops: [{ id: "a", color: "#1de9b6", opacity: 1, position: 0 }, { id: "b", color: "#1dc4e9", opacity: 1, position: 50 }, { id: "c", color: "#9c27b0", opacity: 1, position: 100 }] },
  { name: "Cherry Blossom", type: "radial" as GradientType, angle: 0, stops: [{ id: "a", color: "#ffc0cb", opacity: 1, position: 0 }, { id: "b", color: "#ff6b9d", opacity: 1, position: 100 }] },
  { name: "Midnight", type: "linear" as GradientType, angle: 225, stops: [{ id: "a", color: "#2c3e50", opacity: 1, position: 0 }, { id: "b", color: "#4ca1af", opacity: 1, position: 100 }] },
  { name: "Lava", type: "radial" as GradientType, angle: 0, stops: [{ id: "a", color: "#ff4500", opacity: 1, position: 0 }, { id: "b", color: "#ff8c00", opacity: 1, position: 50 }, { id: "c", color: "#ffd700", opacity: 1, position: 100 }] },
  { name: "Rainbow", type: "conic" as GradientType, angle: 0, stops: [{ id: "a", color: "#ff0000", opacity: 1, position: 0 }, { id: "b", color: "#ffff00", opacity: 1, position: 17 }, { id: "c", color: "#00ff00", opacity: 1, position: 33 }, { id: "d", color: "#00ffff", opacity: 1, position: 50 }, { id: "e", color: "#0000ff", opacity: 1, position: 67 }, { id: "f", color: "#ff00ff", opacity: 1, position: 83 }, { id: "g", color: "#ff0000", opacity: 1, position: 100 }] },
  { name: "Forest", type: "linear" as GradientType, angle: 135, stops: [{ id: "a", color: "#134e5e", opacity: 1, position: 0 }, { id: "b", color: "#71b280", opacity: 1, position: 100 }] },
];

const DIRECTION_PRESETS = [
  { icon: ArrowUp, key: "dirUp" as const, angle: 0 },
  { icon: ArrowUpRight, key: "dirUpRight" as const, angle: 45 },
  { icon: ArrowRight, key: "dirRight" as const, angle: 90 },
  { icon: ArrowDownRight, key: "dirDownRight" as const, angle: 135 },
  { icon: ArrowDown, key: "dirDown" as const, angle: 180 },
  { icon: ArrowDownLeft, key: "dirDownLeft" as const, angle: 225 },
  { icon: ArrowLeft, key: "dirLeft" as const, angle: 270 },
  { icon: ArrowUpLeft, key: "dirUpLeft" as const, angle: 315 },
];

const POSITION_OPTIONS = [
  "center", "top", "bottom", "left", "right",
  "top left", "top right", "bottom left", "bottom right",
];

function buildGradientCSS(
  type: GradientType,
  stops: ColorStop[],
  angle: number,
  radial: RadialConfig,
  conic: ConicConfig
): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopsStr = sorted
    .map((s) => `${hexToRgba(s.color, s.opacity)} ${s.position}%`)
    .join(", ");
  if (type === "linear") {
    return `linear-gradient(${angle}deg, ${stopsStr})`;
  } else if (type === "radial") {
    return `radial-gradient(${radial.shape} at ${radial.position}, ${stopsStr})`;
  } else {
    return `conic-gradient(from ${conic.startAngle}deg at ${conic.position}, ${stopsStr})`;
  }
}

export default function CssGradientGenerator() {
  const t = useTranslations("Tools.CssGradientGenerator");
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: uid(), color: "#667eea", opacity: 1, position: 0 },
    { id: uid(), color: "#764ba2", opacity: 1, position: 100 },
  ]);
  const [radial, setRadial] = useState<RadialConfig>({ shape: "circle", position: "center" });
  const [conic, setConic] = useState<ConicConfig>({ startAngle: 0, position: "center" });
  const previewRef = useRef<HTMLDivElement>(null);

  const gradientValue = buildGradientCSS(gradientType, stops, angle, radial, conic);
  const cssOutput = `background: ${gradientValue};`;

  const addStop = useCallback(() => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    let newPos = 50;
    if (sorted.length >= 2) {
      const mid = Math.floor(sorted.length / 2);
      newPos = Math.round((sorted[mid - 1].position + sorted[mid].position) / 2);
    }
    setStops((prev) => [...prev, { id: uid(), color: "#ffffff", opacity: 1, position: newPos }]);
  }, [stops]);

  const removeStop = useCallback((id: string) => {
    setStops((prev) => {
      if (prev.length <= 2) { toast.error(t("minStopsError")); return prev; }
      return prev.filter((s) => s.id !== id);
    });
  }, [t]);

  const updateStop = useCallback((id: string, field: keyof ColorStop, value: string | number) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }, []);

  const copyCSS = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      toast.success(t("cssCopied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  }, [cssOutput, t]);

  const exportPNG = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    if (gradientType === "linear") {
      const rad = ((angle - 90) * Math.PI) / 180;
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const diag = Math.sqrt(cx * cx + cy * cy);
      const grad = ctx.createLinearGradient(
        cx - Math.cos(rad) * diag, cy - Math.sin(rad) * diag,
        cx + Math.cos(rad) * diag, cy + Math.sin(rad) * diag
      );
      sorted.forEach((s) => grad.addColorStop(s.position / 100, hexToRgba(s.color, s.opacity)));
      ctx.fillStyle = grad;
    } else if (gradientType === "radial") {
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const r = Math.max(canvas.width, canvas.height) / 2;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      sorted.forEach((s) => grad.addColorStop(s.position / 100, hexToRgba(s.color, s.opacity)));
      ctx.fillStyle = grad;
    } else {
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const grad = ctx.createConicGradient((conic.startAngle * Math.PI) / 180, cx, cy);
      sorted.forEach((s) => grad.addColorStop(s.position / 100, hexToRgba(s.color, s.opacity)));
      ctx.fillStyle = grad;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "gradient.png"; a.click();
      URL.revokeObjectURL(url);
      toast.success(t("exportedPNG"));
    }, "image/png");
  }, [stops, gradientType, angle, conic.startAngle, t]);

  const loadPreset = useCallback((preset: (typeof PRESETS)[0]) => {
    setGradientType(preset.type);
    setAngle(preset.angle);
    setStops(preset.stops.map((s) => ({ ...s, id: uid() })));
    toast.success(`${t("loaded")}: ${preset.name}`);
  }, [t]);

  return (
    <div className="container mx-auto max-w-5xl flex flex-col h-[calc(100vh-theme(spacing.16))] shadow-none">
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={gradientType} onValueChange={(v) => setGradientType(v as GradientType)}>
              <TabsList className="w-full">
                <TabsTrigger value="linear" className="flex-1">{t("linear")}</TabsTrigger>
                <TabsTrigger value="radial" className="flex-1">{t("radial")}</TabsTrigger>
                <TabsTrigger value="conic" className="flex-1">{t("conic")}</TabsTrigger>
              </TabsList>

              <TabsContent value="linear" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{t("angle")}</Label>
                    <span className="text-sm text-muted-foreground font-mono">{angle}deg</span>
                  </div>
                  <Slider min={0} max={360} step={1} value={[angle]} onValueChange={([v]) => setAngle(v)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("directionPresets")}</Label>
                  <div className="flex flex-wrap gap-2">
                    {DIRECTION_PRESETS.map((p) => {
                      const Icon = p.icon;
                      return (
                        <Button key={p.angle} variant={angle === p.angle ? "default" : "outline"} size="sm" onClick={() => setAngle(p.angle)} title={t(p.key)}>
                          <Icon className="w-4 h-4" />
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="radial" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("shape")}</Label>
                    <Select value={radial.shape} onValueChange={(v) => setRadial((r) => ({ ...r, shape: v as "circle" | "ellipse" }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circle">{t("circle")}</SelectItem>
                        <SelectItem value="ellipse">{t("ellipse")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("position")}</Label>
                    <Select value={radial.position} onValueChange={(v) => setRadial((r) => ({ ...r, position: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{POSITION_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="conic" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{t("startAngle")}</Label>
                    <span className="text-sm text-muted-foreground font-mono">{conic.startAngle}deg</span>
                  </div>
                  <Slider min={0} max={360} step={1} value={[conic.startAngle]} onValueChange={([v]) => setConic((c) => ({ ...c, startAngle: v }))} />
                </div>
                <div className="space-y-2">
                  <Label>{t("position")}</Label>
                  <Select value={conic.position} onValueChange={(v) => setConic((c) => ({ ...c, position: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{POSITION_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label>{t("preview")}</Label>
              <div ref={previewRef} className="w-full rounded-lg border" style={{ height: 200, background: gradientValue }} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>{t("colorStops")}</Label>
                <Button variant="outline" size="sm" onClick={addStop}><Plus className="w-4 h-4 me-1" />{t("addStop")}</Button>
              </div>
              <div className="space-y-2">
                {[...stops].sort((a, b) => a.position - b.position).map((stop) => (
                  <div key={stop.id} className="grid grid-cols-[44px_1fr_1fr_36px] gap-3 items-center p-3 border rounded-lg bg-muted/30">
                    <input type="color" value={stop.color} onChange={(e) => updateStop(stop.id, "color", e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0.5" title={t("pickColor")} />
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground"><span>{t("stopPosition")}</span><span className="font-mono">{stop.position}%</span></div>
                      <Slider min={0} max={100} step={1} value={[stop.position]} onValueChange={([v]) => updateStop(stop.id, "position", v)} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground"><span>{t("stopOpacity")}</span><span className="font-mono">{Math.round(stop.opacity * 100)}%</span></div>
                      <Slider min={0} max={1} step={0.01} value={[stop.opacity]} onValueChange={([v]) => updateStop(stop.id, "opacity", v)} />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeStop(stop.id)} className="text-destructive hover:text-destructive h-8 w-8"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("generatedCSS")}</Label>
              <div className="flex gap-2 items-start">
                <pre className="flex-1 text-xs bg-muted p-3 rounded-lg border overflow-x-auto whitespace-pre-wrap break-all font-mono">{cssOutput}</pre>
                <Button variant="outline" size="icon" onClick={copyCSS} className="shrink-0"><Copy className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={copyCSS} className="flex-1"><Copy className="w-4 h-4 me-2" />{t("copyCSS")}</Button>
              <Button variant="outline" onClick={exportPNG}><Download className="w-4 h-4 me-2" />{t("exportPNG")}</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">{t("presetGradients")}</CardTitle>
            <CardDescription>{t("presetDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {PRESETS.map((preset) => {
                const sorted = [...preset.stops].sort((a, b) => a.position - b.position);
                const stopStr = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
                const bg = preset.type === "linear"
                  ? `linear-gradient(${preset.angle}deg, ${stopStr})`
                  : preset.type === "radial"
                  ? `radial-gradient(circle at center, ${stopStr})`
                  : `conic-gradient(from 0deg at center, ${stopStr})`;
                return (
                  <button key={preset.name} onClick={() => loadPreset(preset)} className="group relative h-20 rounded-lg border overflow-hidden hover:ring-2 hover:ring-primary transition-all" style={{ background: bg }} title={preset.name}>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium text-center px-2 leading-tight">{preset.name}</span>
                    </div>
                    <span className="sr-only">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
