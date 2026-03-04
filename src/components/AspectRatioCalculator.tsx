"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RectangleHorizontal } from "lucide-react";

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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <RectangleHorizontal className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>

        <Tabs defaultValue="dimensions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dimensions">{t("dimensionsToRatio")}</TabsTrigger>
            <TabsTrigger value="scale">{t("ratioToScale")}</TabsTrigger>
          </TabsList>

          <TabsContent value="dimensions" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">{t("enterDimensions")}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{t("width")}</Label>
                    <Input type="number" value={dimW} onChange={(e) => setDimW(e.target.value)} placeholder="1920" dir="ltr" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("height")}</Label>
                    <Input type="number" value={dimH} onChange={(e) => setDimH(e.target.value)} placeholder="1080" dir="ltr" />
                  </div>
                </div>

                {dimResult && (
                  <div className="flex gap-3 flex-wrap pt-2 border-t" dir="ltr">
                    <div className="text-center p-3 rounded-lg bg-primary/10 flex-1">
                      <div className="text-xs text-muted-foreground mb-1">{t("simplifiedRatio")}</div>
                      <div className="text-2xl font-bold text-primary">{dimResult.ratio}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted flex-1">
                      <div className="text-xs text-muted-foreground mb-1">{t("decimal")}</div>
                      <div className="text-2xl font-bold">{dimResult.decimal}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Common ratios reference */}
            <Card>
              <CardHeader><CardTitle className="text-sm">{t("commonRatios")}</CardTitle></CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scale" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">{t("scaleToNewDimension")}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div className="space-y-1.5">
                    <Label>{t("ratioWidth")}</Label>
                    <Input type="number" value={ratioW} onChange={(e) => setRatioW(e.target.value)} placeholder="16" dir="ltr" />
                  </div>
                  <div className="flex items-end pb-2 justify-center text-muted-foreground font-bold">:</div>
                  <div className="space-y-1.5">
                    <Label>{t("ratioHeight")}</Label>
                    <Input type="number" value={ratioH} onChange={(e) => setRatioH(e.target.value)} placeholder="9" dir="ltr" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={solveFor === "h" ? "default" : "outline"}
                    onClick={() => setSolveFor("h")}
                  >
                    {t("knownWidthFindHeight")}
                  </Button>
                  <Button
                    size="sm"
                    variant={solveFor === "w" ? "default" : "outline"}
                    onClick={() => setSolveFor("w")}
                  >
                    {t("knownHeightFindWidth")}
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <Label>{solveFor === "h" ? t("width") : t("height")} (px)</Label>
                  <Input
                    type="number"
                    value={knownDim}
                    onChange={(e) => setKnownDim(e.target.value)}
                    placeholder="1280"
                    dir="ltr"
                  />
                </div>

                {scaleResult && (
                  <div className="pt-2 border-t">
                    <div className="text-center p-4 rounded-lg bg-primary/10">
                      <div className="text-xs text-muted-foreground mb-1">{scaleResult.label === "Height" ? t("height") : t("width")}</div>
                      <div className="text-3xl font-bold text-primary" dir="ltr">{scaleResult.value} px</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
