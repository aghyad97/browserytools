"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Hash } from "lucide-react";
import { toast } from "sonner";

// ── Conversion tables ─────────────────────────────────────────────────────────

const ROMAN_TABLE: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

const ROMAN_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

// ── Reference table data ──────────────────────────────────────────────────────

const REFERENCE_ROWS: { symbol: string; value: number }[] = [
  { symbol: "I", value: 1 },
  { symbol: "IV", value: 4 },
  { symbol: "V", value: 5 },
  { symbol: "IX", value: 9 },
  { symbol: "X", value: 10 },
  { symbol: "XL", value: 40 },
  { symbol: "L", value: 50 },
  { symbol: "XC", value: 90 },
  { symbol: "C", value: 100 },
  { symbol: "CD", value: 400 },
  { symbol: "D", value: 500 },
  { symbol: "CM", value: 900 },
  { symbol: "M", value: 1000 },
];

// ── Number → Roman ────────────────────────────────────────────────────────────

interface NumberToRomanStep {
  symbol: string;
  value: number;
  remaining: number;
}

function numberToRoman(num: number): { roman: string; steps: NumberToRomanStep[] } | null {
  if (!Number.isInteger(num) || num < 1 || num > 3999) return null;

  const steps: NumberToRomanStep[] = [];
  let remaining = num;
  let roman = "";

  for (const [val, sym] of ROMAN_TABLE) {
    while (remaining >= val) {
      roman += sym;
      remaining -= val;
      steps.push({ symbol: sym, value: val, remaining });
    }
  }

  return { roman, steps };
}

// ── Roman → Number ────────────────────────────────────────────────────────────

interface RomanToNumberStep {
  symbol: string;
  value: number;
  operation: "add" | "subtract";
  runningTotal: number;
}

function romanToNumber(
  roman: string
): { value: number; steps: RomanToNumberStep[]; errorKey?: string } | null {
  if (!roman) return null;

  const upper = roman.toUpperCase().trim();
  if (!upper) return null;

  // Validate characters
  if (/[^IVXLCDM]/.test(upper)) {
    return { value: 0, steps: [], errorKey: "errorInvalidChars" };
  }

  // Validate Roman numeral rules (basic)
  const validPattern =
    /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
  if (!validPattern.test(upper)) {
    return { value: 0, steps: [], errorKey: "errorInvalidFormat" };
  }

  const steps: RomanToNumberStep[] = [];
  let total = 0;

  for (let i = 0; i < upper.length; i++) {
    const curr = ROMAN_VALUES[upper[i]];
    const next = ROMAN_VALUES[upper[i + 1]] ?? 0;

    if (curr < next) {
      // Subtractive notation
      const combined = next - curr;
      total += combined;
      steps.push({
        symbol: upper[i] + upper[i + 1],
        value: combined,
        operation: "add",
        runningTotal: total,
      });
      i++; // skip next char
    } else if (i + 1 < upper.length && curr === ROMAN_VALUES[upper[i + 1]] && curr === ROMAN_VALUES[upper[i + 2]]) {
      // Additive run — group same symbols for readability
      let count = 1;
      while (
        i + count < upper.length &&
        ROMAN_VALUES[upper[i + count]] === curr
      ) count++;
      const groupVal = curr * count;
      total += groupVal;
      steps.push({
        symbol: upper.slice(i, i + count),
        value: groupVal,
        operation: "add",
        runningTotal: total,
      });
      i += count - 1;
    } else {
      total += curr;
      steps.push({
        symbol: upper[i],
        value: curr,
        operation: "add",
        runningTotal: total,
      });
    }
  }

  return { value: total, steps };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RomanNumeralConverter() {
  const t = useTranslations("Tools.RomanNumeralConverter");
  const [tab, setTab] = useState<"toRoman" | "toNumber">("toRoman");

  // Number → Roman state
  const [numberInput, setNumberInput] = useState("");

  // Roman → Number state
  const [romanInput, setRomanInput] = useState("");

  // ── Derived results ──────────────────────────────────────────────────────────

  const toRomanResult = useMemo(() => {
    const n = parseInt(numberInput, 10);
    if (!numberInput.trim() || isNaN(n)) return null;
    if (n < 1 || n > 3999) return { errorKey: "errorOutOfRange" };
    return numberToRoman(n);
  }, [numberInput]);

  const toNumberResult = useMemo(() => {
    if (!romanInput.trim()) return null;
    return romanToNumber(romanInput);
  }, [romanInput]);

  const handleCopyRoman = useCallback(async () => {
    const val = toRomanResult && !("errorKey" in toRomanResult) ? toRomanResult.roman : "";
    if (!val) return;
    try {
      await navigator.clipboard.writeText(val);
      toast.success(t("copiedToClipboard"));
    } catch {
      toast.error(t("failedToCopy"));
    }
  }, [toRomanResult, t]);

  const handleCopyNumber = useCallback(async () => {
    const val = toNumberResult && !toNumberResult.errorKey ? String(toNumberResult.value) : "";
    if (!val) return;
    try {
      await navigator.clipboard.writeText(val);
      toast.success(t("copiedToClipboard"));
    } catch {
      toast.error(t("failedToCopy"));
    }
  }, [toNumberResult, t]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Hash className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "toRoman" | "toNumber")}>
          <TabsList className="w-full">
            <TabsTrigger value="toRoman" className="flex-1">
              {t("numberToRoman")}
            </TabsTrigger>
            <TabsTrigger value="toNumber" className="flex-1">
              {t("romanToNumber")}
            </TabsTrigger>
          </TabsList>

          {/* ── Number to Roman ── */}
          <TabsContent value="toRoman" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t("enterNumber")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  min="1"
                  max="3999"
                  placeholder="e.g. 2024"
                  value={numberInput}
                  onChange={(e) => setNumberInput(e.target.value)}
                  className="text-lg font-mono"
                />
              </CardContent>
            </Card>

            {toRomanResult && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    {t("result")}
                    {"roman" in toRomanResult && (
                      <Button size="sm" variant="ghost" onClick={handleCopyRoman}>
                        <Copy className="w-4 h-4 mr-1.5" /> {t("copy")}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {"errorKey" in toRomanResult ? (
                    <p className="text-destructive text-sm">{t(toRomanResult.errorKey as Parameters<typeof t>[0])}</p>
                  ) : (
                    <>
                      <div className="text-4xl font-bold font-mono tracking-wider text-center py-2">
                        {toRomanResult.roman}
                      </div>

                      {/* Step-by-step breakdown */}
                      <div>
                        <p className="text-sm font-medium mb-2">{t("stepByStep")}</p>
                        <div className="space-y-1.5" dir="ltr">
                          {toRomanResult.steps.map((step, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm rounded-md bg-muted px-3 py-2"
                            >
                              <Badge variant="secondary" className="font-mono min-w-[3rem] justify-center">
                                {step.symbol}
                              </Badge>
                              <span className="text-muted-foreground">=</span>
                              <span className="font-medium">{step.value.toLocaleString()}</span>
                              <span className="text-muted-foreground ml-auto text-xs">
                                {t("remaining")}: {step.remaining.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Equation */}
                        <div className="mt-3 text-sm text-muted-foreground text-center">
                          {numberInput} ={" "}
                          {toRomanResult.steps
                            .map((s) => `${s.symbol}(${s.value.toLocaleString()})`)
                            .join(" + ")}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── Roman to Number ── */}
          <TabsContent value="toNumber" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t("enterRoman")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="e.g. MMXXIV"
                  value={romanInput}
                  onChange={(e) => setRomanInput(e.target.value.toUpperCase())}
                  className="text-lg font-mono tracking-wider"
                  maxLength={20}
                />
              </CardContent>
            </Card>

            {toNumberResult && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    {t("result")}
                    {!toNumberResult.errorKey && (
                      <Button size="sm" variant="ghost" onClick={handleCopyNumber}>
                        <Copy className="w-4 h-4 mr-1.5" /> {t("copy")}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {toNumberResult.errorKey ? (
                    <p className="text-destructive text-sm">{t(toNumberResult.errorKey as Parameters<typeof t>[0])}</p>
                  ) : (
                    <>
                      <div className="text-4xl font-bold tabular-nums text-center py-2">
                        {toNumberResult.value.toLocaleString()}
                      </div>

                      {/* Step-by-step breakdown */}
                      <div>
                        <p className="text-sm font-medium mb-2">{t("stepByStep")}</p>
                        <div className="space-y-1.5" dir="ltr">
                          {toNumberResult.steps.map((step, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm rounded-md bg-muted px-3 py-2"
                            >
                              <Badge
                                variant="secondary"
                                className="font-mono min-w-[3rem] justify-center"
                              >
                                {step.symbol}
                              </Badge>
                              <span
                                className={
                                  step.operation === "subtract"
                                    ? "text-destructive font-medium"
                                    : "text-green-600 dark:text-green-400 font-medium"
                                }
                              >
                                {step.operation === "subtract" ? "−" : "+"}{step.value}
                              </span>
                              <span className="text-muted-foreground ml-auto text-xs">
                                {t("runningTotal")}: {step.runningTotal}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Equation */}
                        <div className="mt-3 text-sm text-muted-foreground text-center">
                          {romanInput.toUpperCase()} ={" "}
                          {toNumberResult.steps.map((s, i) => (
                            <span key={i}>
                              {i > 0 && " + "}
                              <span className="font-mono">{s.symbol}</span>({s.value})
                            </span>
                          ))}{" "}
                          = {toNumberResult.value}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Reference table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("referenceTable")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {REFERENCE_ROWS.map(({ symbol, value }) => (
                <div
                  key={symbol}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <span className="font-mono font-bold">{symbol}</span>
                  <span className="text-muted-foreground">{value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
