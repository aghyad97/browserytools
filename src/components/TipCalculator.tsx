"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Minus, Plus } from "lucide-react";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard } from "@/components/shared/SettingsCard";
import { ModePicker } from "@/components/shared/ModePicker";
import { StatStrip } from "@/components/shared/StatStrip";
import { OutputPanel } from "@/components/shared/OutputPanel";

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
  const tc = useTranslations("ToolsConfig");
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

  const summaryText = useMemo(() => {
    if (!calc) return "";
    return [
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
    <ToolShell
      slug="tip-calculator"
      title={tc("tools.tip-calculator.name")}
      sub={tc("tools.tip-calculator.description")}
      controls={
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 me-1.5" /> {t("reset")}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Bill amount — single-field card; title already serves as the
            field's label (matches original, which had no <Label> here either). */}
        <SettingsCard title={t("billAmount")}>
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
        </SettingsCard>

        {/* Tip percentage — hand-rolled exclusive button group replaced by
            ModePicker (quick presets + "custom" as one more segment; the
            optional custom-% row below is content, not a structurally
            different per-tab panel). */}
        <SettingsCard title={t("tipPercentage")}>
          <ModePicker
            aria-label={t("tipPercentage")}
            value={tipMode === "custom" ? "custom" : String(quickTip)}
            onChange={(v) => {
              if (v === "custom") {
                setTipMode("custom");
              } else {
                setTipMode("quick");
                setQuickTip(parseInt(v, 10));
              }
            }}
            options={[
              ...QUICK_TIP_PERCENTS.map((pct) => ({
                value: String(pct),
                label: `${pct}%`,
              })),
              { value: "custom", label: t("custom") },
            ]}
          />
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
        </SettingsCard>

        {/* Number of people */}
        <SettingsCard title={t("numberOfPeople")}>
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
              className="w-20 ms-2"
            />
          </div>
        </SettingsCard>

        {/* Rounding — another hand-rolled exclusive button group → ModePicker. */}
        <SettingsCard title={t("rounding")}>
          <ModePicker
            aria-label={t("rounding")}
            value={roundMode}
            onChange={(v) => setRoundMode(v as RoundMode)}
            options={[
              { value: "none", label: t("roundingNone") },
              { value: "total", label: t("roundingTotal") },
              { value: "person", label: t("roundingPerson") },
            ]}
          />
        </SettingsCard>

        {/* Results — OutputPanel owns the copy affordance (dedupes the old
            header CopyButton via copySuccessMessage, exact string preserved);
            the two fixed computed-number sets become StatStrip. */}
        {calc ? (
          <OutputPanel
            text={summaryText}
            title={t("summary")}
            copySuccessMessage={t("summaryCopied")}
          >
            <div className="space-y-4">
              <div dir="ltr">
                <StatStrip
                  items={[
                    { label: `${t("tip")} (${tipPercent}%)`, value: `$${fmt(calc.tipAmount)}` },
                    { label: t("total"), value: `$${fmt(calc.total)}` },
                    { label: t("bill"), value: `$${fmt(bill)}` },
                  ]}
                />
              </div>

              {/* Per person */}
              {people > 1 && (
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="text-sm font-medium flex items-center gap-2">
                    {t("perPerson")}
                    <Badge variant="secondary">{people} {t("people")}</Badge>
                  </div>
                  <div dir="ltr">
                    <StatStrip
                      items={[
                        { label: t("bill"), value: `$${fmt(calc.billPerPerson)}` },
                        { label: t("tip"), value: `$${fmt(calc.tipPerPerson)}` },
                        { label: t("total"), value: `$${fmt(calc.totalPerPerson)}` },
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
          </OutputPanel>
        ) : (
          <SettingsCard>
            <div className="py-2 text-center text-muted-foreground text-sm">
              {t("enterBillPrompt")}
            </div>
          </SettingsCard>
        )}

        {/* Custom split section — variable-length (up to 20) input list with
            a per-row computed "pays" amount; stays bespoke as a data-entry
            list. The enable/disable toggle maps to SettingsCard's action slot. */}
        {people > 1 && calc && (
          <SettingsCard
            title={t("customSplit")}
            description={t("differentAmountsPerPerson")}
            action={
              <Button
                size="sm"
                variant={splitEnabled ? "default" : "outline"}
                onClick={() => setSplitEnabled((v) => !v)}
              >
                {splitEnabled ? t("disableCustomSplit") : t("enableCustomSplit")}
              </Button>
            }
          >
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
                      <div className="text-sm text-end min-w-[80px]">
                        <span className="text-muted-foreground">{t("pays")} </span>
                        <span className="font-semibold">${fmt(splitCalc[idx].total)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SettingsCard>
        )}
      </div>
    </ToolShell>
  );
}
