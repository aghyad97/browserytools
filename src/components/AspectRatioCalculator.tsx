"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { StatStrip } from "@/components/shared/StatStrip";
import { ModePicker } from "@/components/shared/ModePicker";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function simplifyRatio(w: number, h: number): [number, number] {
  const g = gcd(Math.round(w), Math.round(h));
  return [Math.round(w) / g, Math.round(h) / g];
}

const COMMON_RATIOS = [
  { label: "16:9 (Widescreen)", w: 16, h: 9 },
  { label: "4:3 (Standard)", w: 4, h: 3 },
  { label: "1:1 (Square)", w: 1, h: 1 },
  { label: "21:9 (Ultrawide)", w: 21, h: 9 },
  { label: "3:2 (DSLR)", w: 3, h: 2 },
  { label: "9:16 (Portrait)", w: 9, h: 16 },
  { label: "4:5 (Instagram)", w: 4, h: 5 },
  { label: "2.39:1 (Cinema)", w: 239, h: 100 },
];

export default function AspectRatioCalculator() {
  const t = useTranslations("Tools.AspectRatioCalculator");
  const tc = useTranslations("ToolsConfig");
  // Tab 1: Dimensions → Ratio
  const [dimW, setDimW] = useState("1920");
  const [dimH, setDimH] = useState("1080");

  // Tab 2: Ratio → New dimension
  const [ratioW, setRatioW] = useState("16");
  const [ratioH, setRatioH] = useState("9");
  const [knownDim, setKnownDim] = useState("1280");
  const [solveFor, setSolveFor] = useState<"w" | "h">("h");

  const dimResult = useMemo(() => {
    const w = parseFloat(dimW);
    const h = parseFloat(dimH);
    if (!w || !h) return null;
    const [rw, rh] = simplifyRatio(w, h);
    return { ratio: `${rw}:${rh}`, decimal: (w / h).toFixed(4) };
  }, [dimW, dimH]);

  const scaleResult = useMemo(() => {
    const rw = parseFloat(ratioW);
    const rh = parseFloat(ratioH);
    const known = parseFloat(knownDim);
    if (!rw || !rh || !known) return null;
    if (solveFor === "h") {
      return { label: "Height", value: ((known * rh) / rw).toFixed(2) };
    } else {
      return { label: "Width", value: ((known * rw) / rh).toFixed(2) };
    }
  }, [ratioW, ratioH, knownDim, solveFor]);

  return (
    <ToolShell
      slug="aspect-ratio"
      title={tc("tools.aspect-ratio.name")}
      sub={tc("tools.aspect-ratio.description")}
    >
      {/* Tabs kept bespoke: the two panels are structurally different (dimensions
          → ratio vs. ratio+known-dimension → scaled dimension), not a trivial
          mode switch over identical panel shape, so this doesn't qualify for
          the ModePicker swap. */}
      <Tabs defaultValue="dimensions">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dimensions">{t("dimensionsToRatio")}</TabsTrigger>
          <TabsTrigger value="scale">{t("ratioToScale")}</TabsTrigger>
        </TabsList>

        <TabsContent value="dimensions" className="space-y-4 mt-4">
          <SettingsCard title={t("enterDimensions")}>
            <OptionRow label={t("width")} htmlFor="dim-w">
              <Input id="dim-w" type="number" value={dimW} onChange={(e) => setDimW(e.target.value)} placeholder="1920" dir="ltr" />
            </OptionRow>
            <OptionRow label={t("height")} htmlFor="dim-h">
              <Input id="dim-h" type="number" value={dimH} onChange={(e) => setDimH(e.target.value)} placeholder="1080" dir="ltr" />
            </OptionRow>

            {dimResult && (
              <StatStrip
                items={[
                  { label: t("simplifiedRatio"), value: dimResult.ratio },
                  { label: t("decimal"), value: dimResult.decimal },
                ]}
              />
            )}
          </SettingsCard>

          {/* Preset grid: fire-once buttons that set values, not a persisted
              single-select mode — doesn't fit ModePicker's controlled-value
              API, so it stays a bespoke button grid inside the molecule card. */}
          <SettingsCard title={t("commonRatios")}>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_RATIOS.map((r) => (
                <button
                  key={r.label}
                  onClick={() => { setDimW(String(r.w * 100)); setDimH(String(r.h * 100)); }}
                  className="text-start p-2.5 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors text-sm"
                >
                  <span className="font-semibold">{r.w}:{r.h}</span>
                  <span className="text-muted-foreground ms-2 text-xs">{r.label.split(" ")[1]}</span>
                </button>
              ))}
            </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="scale" className="space-y-4 mt-4">
          <SettingsCard title={t("scaleToNewDimension")}>
            <OptionRow label={t("ratioWidth")} htmlFor="ratio-w">
              <Input id="ratio-w" type="number" value={ratioW} onChange={(e) => setRatioW(e.target.value)} placeholder="16" dir="ltr" />
            </OptionRow>
            <OptionRow label={t("ratioHeight")} htmlFor="ratio-h">
              <Input id="ratio-h" type="number" value={ratioH} onChange={(e) => setRatioH(e.target.value)} placeholder="9" dir="ltr" />
            </OptionRow>

            <ModePicker
              aria-label={t("scaleToNewDimension")}
              value={solveFor}
              onChange={setSolveFor}
              options={[
                { value: "h", label: t("knownWidthFindHeight") },
                { value: "w", label: t("knownHeightFindWidth") },
              ]}
            />

            <OptionRow label={`${solveFor === "h" ? t("width") : t("height")} (px)`} htmlFor="known-dim">
              <Input
                id="known-dim"
                type="number"
                value={knownDim}
                onChange={(e) => setKnownDim(e.target.value)}
                placeholder="1280"
                dir="ltr"
              />
            </OptionRow>

            {scaleResult && (
              <StatStrip
                items={[
                  {
                    label: scaleResult.label === "Height" ? t("height") : t("width"),
                    value: <span dir="ltr">{scaleResult.value} px</span>,
                  },
                ]}
              />
            )}
          </SettingsCard>
        </TabsContent>
      </Tabs>
    </ToolShell>
  );
}
