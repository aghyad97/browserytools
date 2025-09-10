"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

function hexToRgb(hex: string) {
  const m = hex.trim().replace(/^#/, "");
  if (![3, 6].includes(m.length)) return null;
  const v =
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m;
  const num = parseInt(v, 16);
  if (Number.isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
  ).toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s = clamp(s / 100);
  l = clamp(l / 100);
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = h / 360;
  const t = [hk + 1 / 3, hk, hk - 1 / 3].map((x) => (x + 1) % 1);
  const rgb = t
    .map((tc) => {
      if (tc < 1 / 6) return p + (q - p) * 6 * tc;
      if (tc < 1 / 2) return q;
      if (tc < 2 / 3) return p + (q - p) * (2 / 3 - tc) * 6;
      return p;
    })
    .map((c) => Math.round(c * 255));
  return { r: rgb[0], g: rgb[1], b: rgb[2] };
}

function getReadableTextColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#000000";
  const srgb = [rgb.r, rgb.g, rgb.b]
    .map((v) => v / 255)
    .map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
  const luminance = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  return luminance > 0.179 ? "#000000" : "#FFFFFF";
}

export default function ColorConverter() {
  const [hex, setHex] = useState<string>("");
  const [rgb, setRgb] = useState<{ r: string; g: string; b: string }>({
    r: "",
    g: "",
    b: "",
  });
  const [hsl, setHsl] = useState<{ h: string; s: string; l: string }>({
    h: "",
    s: "",
    l: "",
  });

  const updateFromHex = (v: string) => {
    setHex(v);
    const c = hexToRgb(v);
    if (!c) return;
    setRgb({ r: String(c.r), g: String(c.g), b: String(c.b) });
    const h = rgbToHsl(c.r, c.g, c.b);
    setHsl({ h: String(h.h), s: String(h.s), l: String(h.l) });
  };

  const updateFromRgb = (rStr: string, gStr: string, bStr: string) => {
    setRgb({ r: rStr, g: gStr, b: bStr });
    const r = Number(rStr),
      g = Number(gStr),
      b = Number(bStr);
    if ([r, g, b].some((n) => !Number.isFinite(n))) return;
    if ([r, g, b].some((n) => n < 0 || n > 255)) return;
    setHex(rgbToHex(r, g, b));
    const h = rgbToHsl(r, g, b);
    setHsl({ h: String(h.h), s: String(h.s), l: String(h.l) });
  };

  const updateFromHsl = (hStr: string, sStr: string, lStr: string) => {
    setHsl({ h: hStr, s: sStr, l: lStr });
    const h = Number(hStr),
      s = Number(sStr),
      l = Number(lStr);
    if (![h, s, l].every((n) => Number.isFinite(n))) return;
    const c = hslToRgb(h, s, l);
    setRgb({ r: String(c.r), g: String(c.g), b: String(c.b) });
    setHex(rgbToHex(c.r, c.g, c.b));
  };

  const preview = useMemo(() => ({ backgroundColor: hex || "#ffffff" }), [hex]);

  const rgbValid = useMemo(() => {
    const r = Number(rgb.r),
      g = Number(rgb.g),
      b = Number(rgb.b);
    return [r, g, b].every((n) => Number.isFinite(n) && n >= 0 && n <= 255);
  }, [rgb]);

  const hslValid = useMemo(() => {
    const h = Number(hsl.h),
      s = Number(hsl.s),
      l = Number(hsl.l);
    return [h, s, l].every((n) => Number.isFinite(n));
  }, [hsl]);

  const rgbString = rgbValid
    ? `rgb(${Number(rgb.r)}, ${Number(rgb.g)}, ${Number(rgb.b)})`
    : "";
  const hslString = hslValid
    ? `hsl(${Number(hsl.h)}, ${Number(hsl.s)}%, ${Number(hsl.l)}%)`
    : "";

  const copy = async (text: string, label: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Copy failed");
    }
  };

  const cssVars = useMemo(() => {
    if (!hex || !rgbValid || !hslValid) return "";
    return `--color-hex: ${hex};\n--color-rgb: ${Number(rgb.r)}, ${Number(
      rgb.g
    )}, ${Number(rgb.b)};\n--color-hsl: ${Number(hsl.h)} ${Number(
      hsl.s
    )}% ${Number(hsl.l)}%;`;
  }, [hex, rgbValid, hslValid, rgb, hsl]);

  const palette = useMemo(() => {
    if (!hslValid) return [] as { label: string; hex: string }[];
    const baseH = Number(hsl.h);
    const baseS = Number(hsl.s);
    const baseL = Number(hsl.l);
    const steps = [-30, -15, 0, 15, 30];
    return steps.map((dL) => {
      const { r, g, b } = hslToRgb(baseH, baseS, clamp(baseL + dL, 0, 100));
      return {
        label: dL === 0 ? "Base" : dL > 0 ? `+${dL}` : String(dL),
        hex: rgbToHex(r, g, b),
      };
    });
  }, [hslValid, hsl]);

  const complementary = useMemo(() => {
    if (!hslValid) return "";
    const { r, g, b } = hslToRgb(
      (Number(hsl.h) + 180) % 360,
      Number(hsl.s),
      Number(hsl.l)
    );
    return rgbToHex(r, g, b);
  }, [hslValid, hsl]);

  const clearAll = () => {
    setHex("");
    setRgb({ r: "", g: "", b: "" });
    setHsl({ h: "", s: "", l: "" });
  };

  return (
    <div className="container mx-auto max-w-5xl flex flex-col h-[calc(100vh-theme(spacing.16))] shadow-none">
      <div className="flex-1 overflow-auto p-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Color Converter</CardTitle>
            <CardDescription>Convert between HEX, RGB, and HSL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hex">HEX</Label>
              <div className="flex gap-2">
                <Input
                  id="hex"
                  placeholder="#3366FF or 36F"
                  value={hex}
                  onChange={(e) => updateFromHex(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => copy(hex, "HEX")}
                  disabled={!hex}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div className="space-y-2">
                <Label>R</Label>
                <Input
                  value={rgb.r}
                  onChange={(e) => updateFromRgb(e.target.value, rgb.g, rgb.b)}
                />
              </div>
              <div className="space-y-2">
                <Label>G</Label>
                <Input
                  value={rgb.g}
                  onChange={(e) => updateFromRgb(rgb.r, e.target.value, rgb.b)}
                />
              </div>
              <div className="space-y-2">
                <Label>B</Label>
                <Input
                  value={rgb.b}
                  onChange={(e) => updateFromRgb(rgb.r, rgb.g, e.target.value)}
                />
              </div>
              <div className="md:self-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => copy(rgbString, "RGB")}
                  disabled={!rgbString}
                >
                  Copy RGB
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div className="space-y-2">
                <Label>H</Label>
                <Input
                  value={hsl.h}
                  onChange={(e) => updateFromHsl(e.target.value, hsl.s, hsl.l)}
                />
              </div>
              <div className="space-y-2">
                <Label>S</Label>
                <Input
                  value={hsl.s}
                  onChange={(e) => updateFromHsl(hsl.h, e.target.value, hsl.l)}
                />
              </div>
              <div className="space-y-2">
                <Label>L</Label>
                <Input
                  value={hsl.l}
                  onChange={(e) => updateFromHsl(hsl.h, hsl.s, e.target.value)}
                />
              </div>
              <div className="md:self-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => copy(hslString, "HSL")}
                  disabled={!hslString}
                >
                  Copy HSL
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500">Preview color:</p>
            <div className="h-16 rounded border" style={preview} />
            {cssVars && (
              <div className="space-y-2">
                <Label>CSS Variables</Label>
                <div className="flex items-center gap-2">
                  <pre className="flex-1 whitespace-pre-wrap text-xs p-2 border rounded bg-muted overflow-auto">
                    {cssVars}
                  </pre>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => copy(cssVars, "CSS variables")}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}
            {palette.length > 0 && (
              <div className="space-y-2">
                <Label>Shades & Tints</Label>
                <div className="grid grid-cols-5 gap-2">
                  {palette.map((p) => (
                    <button
                      key={p.label}
                      className="h-10 rounded border text-[10px] flex items-center justify-center"
                      style={{
                        backgroundColor: p.hex,
                        color: getReadableTextColor(p.hex),
                      }}
                      onClick={() => {
                        updateFromHex(p.hex);
                      }}
                      title={p.hex}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {complementary && (
              <div className="space-y-2">
                <Label>Complementary</Label>
                <div className="flex gap-2">
                  <div
                    className="h-10 flex-1 rounded border"
                    style={{ backgroundColor: hex }}
                  />
                  <div
                    className="h-10 flex-1 rounded border"
                    style={{ backgroundColor: complementary }}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => copy(complementary, "Complementary HEX")}
                  >
                    Copy Complementary HEX
                  </Button>
                </div>
              </div>
            )}
            <Button variant="outline" className="w-full" onClick={clearAll}>
              Clear
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
