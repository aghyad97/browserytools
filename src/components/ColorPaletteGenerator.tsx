"use client";

import { useState, useCallback } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, RefreshCw, Download, Lock, LockOpen, Palette } from "lucide-react";

// Color math helpers
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;
  s /= 100; l /= 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = h / 360;
  const t = [hk + 1 / 3, hk, hk - 1 / 3].map((x) => (x + 1) % 1);
  const [r, g, b] = t.map((tc) => {
    if (tc < 1 / 6) return p + (q - p) * 6 * tc;
    if (tc < 1 / 2) return q;
    if (tc < 2 / 3) return p + (q - p) * (2 / 3 - tc) * 6;
    return p;
  }).map((c) => Math.round(c * 255));
  return { r, g, b };
}

function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

function getReadableTextColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b].map((v) => v / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  const luminance = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  return luminance > 0.179 ? "#000000" : "#FFFFFF";
}

// Types
interface PaletteColor {
  hex: string;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
  locked: boolean;
}

type SchemeType =
  | "complementary"
  | "triadic"
  | "analogous"
  | "split-complementary"
  | "tetradic"
  | "shades"
  | "monochromatic";

function generatePalette(baseHex: string, scheme: SchemeType): string[] {
  const { r, g, b } = hexToRgb(baseHex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  switch (scheme) {
    case "complementary":
      return [baseHex, hslToHex((h + 180) % 360, s, l)];

    case "triadic":
      return [
        baseHex,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l),
      ];

    case "analogous":
      return [
        hslToHex((h - 40) % 360, s, l),
        hslToHex((h - 20) % 360, s, l),
        baseHex,
        hslToHex((h + 20) % 360, s, l),
        hslToHex((h + 40) % 360, s, l),
      ];

    case "split-complementary":
      return [
        baseHex,
        hslToHex((h + 150) % 360, s, l),
        hslToHex((h + 210) % 360, s, l),
      ];

    case "tetradic":
      return [
        baseHex,
        hslToHex((h + 90) % 360, s, l),
        hslToHex((h + 180) % 360, s, l),
        hslToHex((h + 270) % 360, s, l),
      ];

    case "shades":
      return Array.from({ length: 10 }, (_, i) =>
        hslToHex(h, s, clamp(5 + i * 10))
      );

    case "monochromatic":
      return Array.from({ length: 10 }, (_, i) =>
        hslToHex(h, clamp(10 + i * 10), l)
      );

    default:
      return [baseHex];
  }
}

function randomHex(): string {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
}

function makePaletteColors(hexes: string[], existing: PaletteColor[] = []): PaletteColor[] {
  return hexes.map((hex, i) => {
    const existingLocked = existing[i]?.locked;
    const effectiveHex = existingLocked ? existing[i].hex : hex;
    const { r, g, b } = hexToRgb(effectiveHex);
    const { h, s, l } = rgbToHsl(r, g, b);
    return { hex: effectiveHex, r, g, b, h, s, l, locked: existingLocked ?? false };
  });
}

const SCHEME_OPTIONS = [
  { value: "complementary", label: "Complementary (2 colors)" },
  { value: "triadic", label: "Triadic (3 colors)" },
  { value: "analogous", label: "Analogous (5 colors)" },
  { value: "split-complementary", label: "Split-Complementary (3 colors)" },
  { value: "tetradic", label: "Tetradic/Square (4 colors)" },
  { value: "shades", label: "Shades (10 variations)" },
  { value: "monochromatic", label: "Monochromatic (10 variations)" },
];

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#667eea");
  const [scheme, setScheme] = useState<SchemeType>("complementary");
  const [paletteName, setPaletteName] = useState("My Palette");
  const [colors, setColors] = useState<PaletteColor[]>(() => {
    const hexes = generatePalette("#667eea", "complementary");
    return makePaletteColors(hexes);
  });

  const regenerate = useCallback((base: string, schemeKey: SchemeType) => {
    const hexes = generatePalette(base, schemeKey);
    setColors((prev) => makePaletteColors(hexes, prev));
  }, []);

  const handleBaseChange = useCallback((v: string) => {
    setBaseColor(v);
    regenerate(v, scheme);
  }, [scheme, regenerate]);

  const handleSchemeChange = useCallback((v: string) => {
    const s = v as SchemeType;
    setScheme(s);
    regenerate(baseColor, s);
  }, [baseColor, regenerate]);

  const toggleLock = useCallback((index: number) => {
    setColors((prev) => prev.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c)));
  }, []);

  const randomize = useCallback(() => {
    const newBase = randomHex();
    setBaseColor(newBase);
    regenerate(newBase, scheme);
    toast.success("Random palette generated");
  }, [scheme, regenerate]);

  const copyColor = useCallback(async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Failed to copy");
    }
  }, []);

  const copyAsCSSVars = useCallback(async () => {
    const text = colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success("CSS variables copied");
    } catch {
      toast.error("Failed to copy");
    }
  }, [colors]);

  const copyAsJSON = useCallback(async () => {
    const data = colors.map((c) => ({
      hex: c.hex,
      rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
      hsl: `hsl(${c.h}, ${c.s}%, ${c.l}%)`,
    }));
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast.success("JSON copied");
    } catch {
      toast.error("Failed to copy");
    }
  }, [colors]);

  const exportPNG = useCallback(() => {
    const cols = Math.min(colors.length, 10);
    const sw = 200, sh = 200;
    const canvas = document.createElement("canvas");
    canvas.width = cols * sw;
    canvas.height = sh + 60;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    colors.forEach((color, i) => {
      ctx.fillStyle = color.hex;
      ctx.fillRect(i * sw, 0, sw, sh);
      ctx.fillStyle = getReadableTextColor(color.hex);
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(color.hex.toUpperCase(), i * sw + sw / 2, sh + 20);
      ctx.fillText(
        `rgb(${color.r},${color.g},${color.b})`,
        i * sw + sw / 2, sh + 40
      );
    });
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "palette.png"; a.click();
      URL.revokeObjectURL(url);
      toast.success("Palette exported as PNG");
    }, "image/png");
  }, [colors]);

  return (
    <div className="container mx-auto max-w-5xl flex flex-col h-[calc(100vh-theme(spacing.16))] shadow-none">
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Color Palette Generator</CardTitle>
            <CardDescription>Generate beautiful color palettes from any base color</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Palette Name</Label>
                <Input value={paletteName} onChange={(e) => setPaletteName(e.target.value)} placeholder="My Palette" />
              </div>
              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <Select value={scheme} onValueChange={handleSchemeChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SCHEME_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 items-center flex-wrap">
              <div className="flex items-center gap-2">
                <Label>Base Color</Label>
                <input type="color" value={baseColor} onChange={(e) => handleBaseChange(e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0.5" />
              </div>
              <Button variant="outline" onClick={randomize}><RefreshCw className="w-4 h-4 mr-2" />Random Palette</Button>
              <Button variant="outline" onClick={copyAsCSSVars}><Copy className="w-4 h-4 mr-2" />CSS Variables</Button>
              <Button variant="outline" onClick={copyAsJSON}><Copy className="w-4 h-4 mr-2" />Copy JSON</Button>
              <Button variant="outline" onClick={exportPNG}><Download className="w-4 h-4 mr-2" />Export PNG</Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {colors.map((color, index) => {
                const textColor = getReadableTextColor(color.hex);
                return (
                  <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                    <div
                      className="h-24 w-full relative"
                      style={{ backgroundColor: color.hex }}
                    >
                      <button
                        className="absolute top-1 right-1 p-1 rounded bg-white/20 hover:bg-white/40 transition-colors"
                        onClick={() => toggleLock(index)}
                        title={color.locked ? "Unlock color" : "Lock color"}
                      >
                        {color.locked ? (
                          <Lock className="w-3 h-3" style={{ color: textColor }} />
                        ) : (
                          <LockOpen className="w-3 h-3" style={{ color: textColor }} />
                        )}
                      </button>
                    </div>
                    <div className="p-2 space-y-1 bg-background">
                      <button
                        className="text-xs font-mono truncate w-full text-left hover:text-primary transition-colors"
                        onClick={() => copyColor(color.hex.toUpperCase(), "HEX")}
                        title="Copy HEX"
                      >
                        {color.hex.toUpperCase()}
                      </button>
                      <button
                        className="text-[9px] text-muted-foreground truncate w-full text-left hover:text-primary transition-colors"
                        onClick={() => copyColor(`rgb(${color.r}, ${color.g}, ${color.b})`, "RGB")}
                        title="Copy RGB"
                      >
                        rgb({color.r},{color.g},{color.b})
                      </button>
                      <button
                        className="text-[9px] text-muted-foreground truncate w-full text-left hover:text-primary transition-colors"
                        onClick={() => copyColor(`hsl(${color.h}, ${color.s}%, ${color.l}%)`, "HSL")}
                        title="Copy HSL"
                      >
                        hsl({color.h},{color.s}%,{color.l}%)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
