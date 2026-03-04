"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Scale } from "lucide-react";

// ── BMI Categories ─────────────────────────────────────────────────────────────

interface BmiCategory {
  labelKey: string;
  min: number;
  max: number;
  color: string;
  bgColor: string;
  textColor: string;
  badgeClass: string;
}

const CATEGORIES: BmiCategory[] = [
  {
    labelKey: "categoryUnderweight",
    min: 0,
    max: 18.5,
    color: "#3b82f6",
    bgColor: "bg-blue-500",
    textColor: "text-blue-700 dark:text-blue-400",
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    labelKey: "categoryNormal",
    min: 18.5,
    max: 25,
    color: "#22c55e",
    bgColor: "bg-green-500",
    textColor: "text-green-700 dark:text-green-400",
    badgeClass: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  {
    labelKey: "categoryOverweight",
    min: 25,
    max: 30,
    color: "#f59e0b",
    bgColor: "bg-amber-500",
    textColor: "text-amber-700 dark:text-amber-400",
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
  {
    labelKey: "categoryObeseI",
    min: 30,
    max: 35,
    color: "#f97316",
    bgColor: "bg-orange-500",
    textColor: "text-orange-700 dark:text-orange-400",
    badgeClass: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  {
    labelKey: "categoryObeseII",
    min: 35,
    max: 40,
    color: "#ef4444",
    bgColor: "bg-red-500",
    textColor: "text-red-700 dark:text-red-400",
    badgeClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  {
    labelKey: "categoryObeseIII",
    min: 40,
    max: 60,
    color: "#7f1d1d",
    bgColor: "bg-red-900",
    textColor: "text-red-900 dark:text-red-300",
    badgeClass: "bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-300",
  },
];

const GAUGE_MIN = 10;
const GAUGE_MAX = 50;

function getBmiCategory(bmi: number): BmiCategory {
  return CATEGORIES.find((c) => bmi >= c.min && bmi < c.max) ?? CATEGORIES[CATEGORIES.length - 1];
}

function bmiToGaugePercent(bmi: number): number {
  const pct = ((bmi - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 100;
  return Math.max(0, Math.min(100, pct));
}

// ── Gauge segments (for the colour bar) ──────────────────────────────────────

const SEGMENTS = CATEGORIES.map((c) => {
  const start = Math.max(c.min, GAUGE_MIN);
  const end = Math.min(c.max, GAUGE_MAX);
  const width = ((end - start) / (GAUGE_MAX - GAUGE_MIN)) * 100;
  return { ...c, width: Math.max(0, width) };
});

// ── Component ─────────────────────────────────────────────────────────────────

type UnitSystem = "metric" | "imperial";

export default function BmiCalculator() {
  const t = useTranslations("Tools.BmiCalculator");
  const [unit, setUnit] = useState<UnitSystem>("metric");

  // Metric
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");

  // Imperial
  const [weightLbs, setWeightLbs] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const handleClear = useCallback(() => {
    setWeightKg("");
    setHeightCm("");
    setWeightLbs("");
    setHeightFt("");
    setHeightIn("");
  }, []);

  const result = useMemo(() => {
    let kg = 0;
    let heightM = 0;

    if (unit === "metric") {
      kg = parseFloat(weightKg);
      heightM = parseFloat(heightCm) / 100;
    } else {
      kg = parseFloat(weightLbs) * 0.453592;
      const totalInches = parseFloat(heightFt || "0") * 12 + parseFloat(heightIn || "0");
      heightM = totalInches * 0.0254;
    }

    if (!kg || !heightM || kg <= 0 || heightM <= 0) return null;

    const bmi = kg / (heightM * heightM);
    const category = getBmiCategory(bmi);
    const gaugePos = bmiToGaugePercent(bmi);

    // Healthy weight range (BMI 18.5–24.9) for this height
    const minHealthyKg = 18.5 * heightM * heightM;
    const maxHealthyKg = 24.9 * heightM * heightM;

    const healthyMin =
      unit === "metric"
        ? `${minHealthyKg.toFixed(1)} kg`
        : `${(minHealthyKg / 0.453592).toFixed(1)} lbs`;
    const healthyMax =
      unit === "metric"
        ? `${maxHealthyKg.toFixed(1)} kg`
        : `${(maxHealthyKg / 0.453592).toFixed(1)} lbs`;

    return { bmi, category, gaugePos, healthyMin, healthyMax };
  }, [unit, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>

        {/* Unit toggle */}
        <div className="flex gap-2">
          <Button
            variant={unit === "metric" ? "default" : "outline"}
            size="sm"
            onClick={() => setUnit("metric")}
          >
            {t("metric")}
          </Button>
          <Button
            variant={unit === "imperial" ? "default" : "outline"}
            size="sm"
            onClick={() => setUnit("imperial")}
          >
            {t("imperial")}
          </Button>
          <Button variant="ghost" size="sm" className="ms-auto" onClick={handleClear}>
            <RotateCcw className="w-4 h-4 me-1.5" /> {t("reset")}
          </Button>
        </div>

        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("enterMeasurements")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {unit === "metric" ? (
              <>
                <div className="space-y-1.5">
                  <Label>{t("weightKg")}</Label>
                  <Input
                    type="number"
                    min="1"
                    max="500"
                    step="0.1"
                    placeholder="e.g. 70"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("heightCm")}</Label>
                  <Input
                    type="number"
                    min="50"
                    max="300"
                    step="0.1"
                    placeholder="e.g. 175"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    dir="ltr"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label>{t("weightLbs")}</Label>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    step="0.1"
                    placeholder="e.g. 154"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("height")}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      placeholder={t("feet")}
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      dir="ltr"
                    />
                    <Input
                      type="number"
                      min="0"
                      max="11"
                      placeholder={t("inches")}
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Result */}
        {result ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t("yourBmiResult")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* BMI number + category */}
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold tabular-nums">{result.bmi.toFixed(1)}</div>
                <div>
                  <Badge className={result.category.badgeClass + " text-sm px-3 py-1"}>
                    {t(result.category.labelKey as Parameters<typeof t>[0])}
                  </Badge>
                </div>
              </div>

              {/* Gauge bar */}
              <div className="space-y-1">
                <div className="relative h-5 rounded-full overflow-hidden flex">
                  {SEGMENTS.map((seg, idx) => (
                    <div
                      key={idx}
                      className={seg.bgColor}
                      style={{ width: `${seg.width}%` }}
                    />
                  ))}
                  {/* Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md transition-all duration-500"
                    style={{ left: `${result.gaugePos}%` }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full border-2 border-gray-700 shadow" />
                  </div>
                </div>
                {/* Gauge labels */}
                <div className="flex justify-between text-xs text-muted-foreground px-0.5">
                  <span>{GAUGE_MIN}</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>35</span>
                  <span>40</span>
                  <span>{GAUGE_MAX}+</span>
                </div>
              </div>

              {/* Category legend */}
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.labelKey}
                    className={`flex items-center gap-1.5 text-xs rounded-md px-2 py-1 ${
                      cat.labelKey === result.category.labelKey ? cat.badgeClass : "text-muted-foreground"
                    }`}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-medium">{t(cat.labelKey as Parameters<typeof t>[0])}</span>
                    <span className="ms-auto opacity-70">
                      {cat.min}
                      {cat.max < 60 ? `–${cat.max}` : "+"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Healthy weight range */}
              <div className="rounded-lg bg-muted px-4 py-3 space-y-1">
                <p className="text-sm font-medium">{t("healthyWeightRange")}</p>
                <p className="text-sm text-muted-foreground" dir="ltr">
                  {result.healthyMin} &ndash; {result.healthyMax}
                  <span className="ml-2 text-xs">(BMI 18.5 &ndash; 24.9)</span>
                </p>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-muted-foreground border-t pt-3">
                {t("disclaimer")}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {t("enterWeightHeight")}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
