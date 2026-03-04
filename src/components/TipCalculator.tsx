"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, RotateCcw, Minus, Plus, Receipt } from "lucide-react";
import { toast } from "sonner";

// ── Constants ─────────────────────────────────────────────────────────────────

const QUICK_TIP_PERCENTS = [10, 15, 18, 20, 25];

type RoundMode = "none" | "total" | "person";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function applyRounding(value: number, mode: RoundMode, context: "total" | "person"): number {
  if (mode === "total" && context === "total") return Math.ceil(value);
  if (mode === "person" && context === "person") return Math.ceil(value);
  return value;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TipCalculator() {
  const t = useTranslations("Tools.TipCalculator");
  const [billStr, setBillStr] = useState("");
  const [tipMode, setTipMode] = useState<"quick" | "custom">("quick");
  const [quickTip, setQuickTip] = useState(18);
  const [customTipStr, setCustomTipStr] = useState("");
  const [people, setPeople] = useState(1);
  const [roundMode, setRoundMode] = useState<RoundMode>("none");

  // Per-person custom amounts (optional section)
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [personAmounts, setPersonAmounts] = useState<string[]>(Array(1).fill(""));

  const tipPercent = tipMode === "quick" ? quickTip : parseFloat(customTipStr) || 0;
  const bill = parseFloat(billStr) || 0;

  const calc = useMemo(() => {
    if (bill <= 0) return null;

    const tipAmount = (bill * tipPercent) / 100;
    const total = bill + tipAmount;

    const rawTotalPerPerson = total / people;
    const rawBillPerPerson = bill / people;
    const rawTipPerPerson = tipAmount / people;

    const totalPerPerson = applyRounding(rawTotalPerPerson, roundMode, "person");
    const appliedTotal = applyRounding(total, roundMode, "total");
    const appliedTip = appliedTotal - bill;

    return {
      tipAmount: appliedTip,
      total: appliedTotal,
      billPerPerson: rawBillPerPerson,
      tipPerPerson: rawTipPerPerson,
      totalPerPerson,
    };
  }, [bill, tipPercent, people, roundMode]);

  const changePeople = useCallback(
    (delta: number) => {
      const next = Math.max(1, Math.min(20, people + delta));
      setPeople(next);
      setPersonAmounts((prev) => {
        const arr = [...prev];
        while (arr.length < next) arr.push("");
        return arr.slice(0, next);
      });
    },
    [people]
  );

  const handleCopySummary = useCallback(async () => {
    if (!calc) return;
    const lines = [
      `Bill: $${fmt(bill)}`,
      `Tip (${tipPercent}%): $${fmt(calc.tipAmount)}`,
      `Total: $${fmt(calc.total)}`,
      people > 1
        ? [
            `--- Per Person (${people} people) ---`,
            `Bill: $${fmt(calc.billPerPerson)}`,
            `Tip:  $${fmt(calc.tipPerPerson)}`,
            `Total: $${fmt(calc.totalPerPerson)}`,
          ].join("\n")
        : "",
    ]
      .filter(Boolean)
      .join("\n");
    try {
      await navigator.clipboard.writeText(lines);
      toast.success(t("summaryCopied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  }, [calc, bill, tipPercent, people]);

  const handleReset = useCallback(() => {
    setBillStr("");
    setTipMode("quick");
    setQuickTip(18);
    setCustomTipStr("");
    setPeople(1);
    setRoundMode("none");
    setSplitEnabled(false);
    setPersonAmounts([""]);
  }, []);

  // For the optional split section: each person pays their amount + proportional tip
  const splitCalc = useMemo(() => {
    if (!splitEnabled || !calc) return null;
    const amounts = personAmounts.map((s) => parseFloat(s) || 0);
    const totalEntered = amounts.reduce((s, v) => s + v, 0);
    if (totalEntered <= 0) return null;
    return amounts.map((amount) => {
      const proportion = totalEntered > 0 ? amount / totalEntered : 0;
      const tip = calc.tipAmount * proportion;
      return { amount, tip, total: amount + tip };
    });
  }, [splitEnabled, personAmounts, calc]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Receipt className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>

        {/* Bill amount */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("billAmount")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                $
              </span>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={billStr}
                onChange={(e) => setBillStr(e.target.value)}
                className="pl-7 text-lg font-medium"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tip percentage */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("tipPercentage")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {QUICK_TIP_PERCENTS.map((pct) => (
                <Button
                  key={pct}
                  size="sm"
                  variant={tipMode === "quick" && quickTip === pct ? "default" : "outline"}
                  onClick={() => {
                    setTipMode("quick");
                    setQuickTip(pct);
                  }}
                >
                  {pct}%
                </Button>
              ))}
              <Button
                size="sm"
                variant={tipMode === "custom" ? "default" : "outline"}
                onClick={() => setTipMode("custom")}
              >
                {t("custom")}
              </Button>
            </div>
            {tipMode === "custom" && (
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  placeholder="Enter %"
                  value={customTipStr}
                  onChange={(e) => setCustomTipStr(e.target.value)}
                  className="w-32"
                />
                <span className="text-muted-foreground">%</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Number of people */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("numberOfPeople")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="outline"
                onClick={() => changePeople(-1)}
                disabled={people <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-2xl font-bold w-8 text-center">{people}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => changePeople(1)}
                disabled={people >= 20}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                min="1"
                max="20"
                value={people}
                onChange={(e) =>
                  setPeople(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))
                }
                className="w-20 ml-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Rounding */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("rounding")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["none", t("roundingNone")],
                  ["total", t("roundingTotal")],
                  ["person", t("roundingPerson")],
                ] as [RoundMode, string][]
              ).map(([val, label]) => (
                <Button
                  key={val}
                  size="sm"
                  variant={roundMode === val ? "default" : "outline"}
                  onClick={() => setRoundMode(val)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {calc ? (
          <Card className="border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                {t("summary")}
                <Button size="sm" variant="ghost" onClick={handleCopySummary}>
                  <Copy className="w-4 h-4 mr-1.5" /> {t("copy")}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Overall totals */}
              <div className="grid grid-cols-3 gap-3 text-center" dir="ltr">
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground mb-1">{t("tip")} ({tipPercent}%)</div>
                  <div className="text-xl font-bold">${fmt(calc.tipAmount)}</div>
                </div>
                <div className="rounded-lg bg-primary text-primary-foreground p-3">
                  <div className="text-xs opacity-80 mb-1">{t("total")}</div>
                  <div className="text-xl font-bold">${fmt(calc.total)}</div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground mb-1">{t("bill")}</div>
                  <div className="text-xl font-bold">${fmt(bill)}</div>
                </div>
              </div>

              {/* Per person */}
              {people > 1 && (
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="text-sm font-medium flex items-center gap-2">
                    {t("perPerson")}
                    <Badge variant="secondary">{people} {t("people")}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-sm" dir="ltr">
                    <div>
                      <div className="text-muted-foreground text-xs">{t("bill")}</div>
                      <div className="font-semibold">${fmt(calc.billPerPerson)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">{t("tip")}</div>
                      <div className="font-semibold">${fmt(calc.tipPerPerson)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">{t("total")}</div>
                      <div className="font-bold text-base">${fmt(calc.totalPerPerson)}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground text-sm">
              {t("enterBillPrompt")}
            </CardContent>
          </Card>
        )}

        {/* Custom split section */}
        {people > 1 && calc && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                {t("customSplit")}
                <CardDescription className="text-xs mt-0">
                  {t("differentAmountsPerPerson")}
                </CardDescription>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                size="sm"
                variant={splitEnabled ? "default" : "outline"}
                onClick={() => setSplitEnabled((v) => !v)}
              >
                {splitEnabled ? t("disableCustomSplit") : t("enableCustomSplit")}
              </Button>

              {splitEnabled && (
                <div className="space-y-2">
                  {personAmounts.map((amt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Label className="w-20 text-sm flex-shrink-0">{t("person")} {idx + 1}</Label>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          $
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={amt}
                          onChange={(e) => {
                            const next = [...personAmounts];
                            next[idx] = e.target.value;
                            setPersonAmounts(next);
                          }}
                          className="pl-7"
                        />
                      </div>
                      {splitCalc && splitCalc[idx] && (
                        <div className="text-sm text-right min-w-[80px]">
                          <span className="text-muted-foreground">{t("pays")} </span>
                          <span className="font-semibold">${fmt(splitCalc[idx].total)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reset */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1.5" /> {t("reset")}
          </Button>
        </div>
      </div>
    </div>
  );
}
