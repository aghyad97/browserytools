"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Copy, CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function linearize(val: number): number {
  const c = val / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function ensureHash(hex: string): string {
  const clean = hex.trim().replace(/^#/, "");
  return "#" + clean;
}

const PRESETS = [
  { label: "White on Black", fg: "#FFFFFF", bg: "#000000" },
  { label: "Black on White", fg: "#000000", bg: "#FFFFFF" },
  { label: "Navy on White", fg: "#003087", bg: "#FFFFFF" },
  { label: "Yellow on Black", fg: "#FFD700", bg: "#000000" },
  { label: "Gray on White", fg: "#6B7280", bg: "#FFFFFF" },
  { label: "Blue on Light", fg: "#1D4ED8", bg: "#EFF6FF" },
];

export default function ContrastChecker() {
  const t = useTranslations("Tools.ContrastChecker");
  const [fg, setFg] = useState("#1D4ED8");
  const [bg, setBg] = useState("#FFFFFF");
  const [fgInput, setFgInput] = useState("#1D4ED8");
  const [bgInput, setBgInput] = useState("#FFFFFF");

  const handleFgInput = (val: string) => {
    setFgInput(val);
    const rgb = hexToRgb(val);
    if (rgb) setFg(ensureHash(val));
  };

  const handleBgInput = (val: string) => {
    setBgInput(val);
    const rgb = hexToRgb(val);
    if (rgb) setBg(ensureHash(val));
  };

  const handleFgPicker = (val: string) => {
    setFg(val);
    setFgInput(val);
  };

  const handleBgPicker = (val: string) => {
    setBg(val);
    setBgInput(val);
  };

  const swap = () => {
    setFg(bg);
    setBg(fg);
    setFgInput(bg);
    setBgInput(fg);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setFg(preset.fg);
    setBg(preset.bg);
    setFgInput(preset.fg);
    setBgInput(preset.bg);
  };

  const ratio = useMemo(() => {
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    if (!fgRgb || !bgRgb) return null;
    const lFg = relativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const lBg = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    return contrastRatio(lFg, lBg);
  }, [fg, bg]);

  const ratioStr = ratio !== null ? `${ratio.toFixed(2)}:1` : "—";

  const copyRatio = useCallback(async () => {
    if (ratio === null) return;
    try {
      await navigator.clipboard.writeText(ratioStr);
      toast.success(t("ratioCopied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  }, [ratio, ratioStr]);

  const checks = useMemo(() => {
    if (ratio === null) return null;
    return {
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaaNormal: ratio >= 7,
      aaaLarge: ratio >= 4.5,
    };
  }, [ratio]);

  const PassBadge = ({ pass }: { pass: boolean }) =>
    pass ? (
      <Badge className="bg-green-500 text-white gap-1"><CheckCircle className="w-3 h-3" />{t("pass")}</Badge>
    ) : (
      <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />{t("fail")}</Badge>
    );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Eye className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
        </div>

        {/* Color Inputs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("colors")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("foregroundColor")}</Label>
                <div className="flex gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={fg}
                      onChange={(e) => handleFgPicker(e.target.value)}
                      className="w-10 h-10 rounded border cursor-pointer p-0.5"
                    />
                  </div>
                  <Input
                    value={fgInput}
                    onChange={(e) => handleFgInput(e.target.value)}
                    placeholder="#000000"
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("backgroundColor")}</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bg}
                    onChange={(e) => handleBgPicker(e.target.value)}
                    className="w-10 h-10 rounded border cursor-pointer p-0.5"
                  />
                  <Input
                    value={bgInput}
                    onChange={(e) => handleBgInput(e.target.value)}
                    placeholder="#FFFFFF"
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={swap} className="w-full">
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              {t("swapColors")}
            </Button>
          </CardContent>
        </Card>

        {/* Contrast Ratio */}
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("contrastRatio")}</p>
                <p className="text-5xl font-bold font-mono tracking-tight">{ratioStr}</p>
              </div>
              <Button variant="outline" onClick={copyRatio} disabled={ratio === null}>
                <Copy className="w-4 h-4 mr-2" />
                {t("copy")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* WCAG Results */}
        {checks && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("wcagCompliance")}</CardTitle>
              <CardDescription>{t("wcagDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: t("aaNormal"), sublabel: t("aaNormalSub"), pass: checks.aaNormal },
                  { label: t("aaLarge"), sublabel: t("aaLargeSub"), pass: checks.aaLarge },
                  { label: t("aaaNormal"), sublabel: t("aaaNormalSub"), pass: checks.aaaNormal },
                  { label: t("aaaLarge"), sublabel: t("aaaLargeSub"), pass: checks.aaaLarge },
                ].map(({ label, sublabel, pass }) => (
                  <div key={label} className={`p-3 rounded-lg border ${pass ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{label}</span>
                      <PassBadge pass={pass} />
                    </div>
                    <p className="text-xs text-muted-foreground">{sublabel}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Preview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("preview")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden border" style={{ backgroundColor: bg, color: fg }}>
              <div className="p-6 space-y-4">
                <p style={{ fontSize: "16px", fontWeight: "normal" }}>
                  {t("previewNormalText")}
                </p>
                <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                  {t("previewLargeText")}
                </p>
                <div>
                  <button
                    style={{
                      backgroundColor: fg,
                      color: bg,
                      padding: "8px 20px",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "default",
                    }}
                  >
                    {t("previewButton")}
                  </button>
                </div>
                <div
                  style={{
                    border: `2px solid ${fg}`,
                    borderRadius: "6px",
                    padding: "8px 12px",
                    fontSize: "14px",
                    display: "inline-block",
                  }}
                >
                  {t("previewUI")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Presets */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("presets")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className="flex items-center gap-2 p-2 rounded-lg border hover:border-primary hover:bg-muted/30 transition-all text-left"
                >
                  <div className="flex flex-shrink-0">
                    <div className="w-5 h-5 rounded-l border" style={{ backgroundColor: p.fg }} />
                    <div className="w-5 h-5 rounded-r border-t border-r border-b" style={{ backgroundColor: p.bg }} />
                  </div>
                  <span className="text-xs font-medium truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
