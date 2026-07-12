"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Dices, Hash, Coins, ListChecks, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";

// ── Randomness ────────────────────────────────────────────────────────────────
// Cryptographically-decent integer in [min, max] inclusive, using rejection
// sampling over crypto.getRandomValues to avoid modulo bias. Falls back to
// Math.random where crypto is unavailable (e.g. some test envs).
function randomInt(min: number, max: number): number {
  const range = max - min + 1;
  if (range <= 0) return min;

  const cryptoObj =
    typeof globalThis !== "undefined"
      ? (globalThis.crypto as Crypto | undefined)
      : undefined;

  if (cryptoObj?.getRandomValues) {
    const maxUint = 0xffffffff;
    const limit = Math.floor((maxUint + 1) / range) * range;
    const buf = new Uint32Array(1);
    // Reject values that would bias the modulo; loop is bounded in practice.
    for (let i = 0; i < 64; i++) {
      cryptoObj.getRandomValues(buf);
      if (buf[0] < limit) return min + (buf[0] % range);
    }
    return min + (buf[0] % range);
  }

  return min + Math.floor(Math.random() * range);
}

type DieSize = 4 | 6 | 8 | 10 | 12 | 20;
const DIE_SIZES: DieSize[] = [4, 6, 8, 10, 12, 20];

export default function RandomPicker() {
  const t = useTranslations("Tools.RandomPicker");
  const tc = useTranslations("ToolsConfig");

  // ── Random Number state ───────────────────────────────────────────────────
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [numbers, setNumbers] = useState<number[]>([]);

  // ── Dice state ──────────────────────────────────────────────────────────────
  const [diceCount, setDiceCount] = useState("2");
  const [dieSides, setDieSides] = useState<DieSize>(6);
  const [diceResults, setDiceResults] = useState<number[]>([]);

  // ── Coin state ────────────────────────────────────────────────────────────
  const [coin, setCoin] = useState<"heads" | "tails" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [headsTally, setHeadsTally] = useState(0);
  const [tailsTally, setTailsTally] = useState(0);

  // ── List picker state ─────────────────────────────────────────────────────
  const [listText, setListText] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const [removeWinner, setRemoveWinner] = useState(false);
  const [spinning, setSpinning] = useState(false);

  // ── Random Number ──────────────────────────────────────────────────────────
  const generateNumbers = () => {
    const lo = Math.floor(Number(min));
    const hi = Math.floor(Number(max));
    const n = Math.floor(Number(count));

    if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
      toast.error(t("errorInvalidRange"));
      return;
    }
    if (lo > hi) {
      toast.error(t("errorMinGreaterMax"));
      return;
    }
    if (!Number.isFinite(n) || n < 1) {
      toast.error(t("errorInvalidCount"));
      return;
    }

    const rangeSize = hi - lo + 1;
    if (!allowDuplicates && n > rangeSize) {
      toast.error(t("errorCountTooLarge"));
      return;
    }

    const out: number[] = [];
    if (allowDuplicates) {
      for (let i = 0; i < n; i++) out.push(randomInt(lo, hi));
    } else {
      const pool = new Set<number>();
      while (pool.size < n) pool.add(randomInt(lo, hi));
      out.push(...pool);
    }
    setNumbers(out);
  };

  // ── Dice ──────────────────────────────────────────────────────────────────
  const rollDice = () => {
    const n = Math.floor(Number(diceCount));
    if (!Number.isFinite(n) || n < 1 || n > 100) {
      toast.error(t("errorInvalidDiceCount"));
      return;
    }
    const rolls: number[] = [];
    for (let i = 0; i < n; i++) rolls.push(randomInt(1, dieSides));
    setDiceResults(rolls);
  };

  const diceTotal = diceResults.reduce((a, b) => a + b, 0);

  // ── Coin ────────────────────────────────────────────────────────────────────
  const flipCoin = () => {
    if (flipping) return;
    setFlipping(true);
    const result = randomInt(0, 1) === 0 ? "heads" : "tails";
    // Brief animation window before revealing the result.
    window.setTimeout(() => {
      setCoin(result);
      if (result === "heads") setHeadsTally((h) => h + 1);
      else setTailsTally((tl) => tl + 1);
      setFlipping(false);
    }, 600);
  };

  const resetCoin = () => {
    setCoin(null);
    setHeadsTally(0);
    setTailsTally(0);
  };

  // ── List picker ─────────────────────────────────────────────────────────────
  const getListItems = () =>
    listText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

  const pickWinner = () => {
    const items = getListItems();
    if (items.length === 0) {
      toast.error(t("errorEmptyList"));
      return;
    }
    setSpinning(true);
    const idx = randomInt(0, items.length - 1);
    const chosen = items[idx];
    window.setTimeout(() => {
      setWinner(chosen);
      setSpinning(false);
      if (removeWinner) {
        const remaining = items.filter((_, i) => i !== idx);
        setListText(remaining.join("\n"));
      }
    }, 700);
  };

  // ── Copy helper ───────────────────────────────────────────────────────────
  const copyText = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  return (
    <ToolShell
      slug="random-picker"
      title={tc("tools.random-picker.name")}
      sub={tc("tools.random-picker.description")}
    >
      <div className="max-w-3xl mx-auto">
      <Tabs defaultValue="number" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="number">{t("tabNumber")}</TabsTrigger>
          <TabsTrigger value="dice">{t("tabDice")}</TabsTrigger>
          <TabsTrigger value="coin">{t("tabCoin")}</TabsTrigger>
          <TabsTrigger value="list">{t("tabList")}</TabsTrigger>
        </TabsList>

        {/* ── Random Number ── */}
        <TabsContent value="number" className="space-y-6">
          <SettingsCard
            title={
              <span className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                {t("numberTitle")}
              </span>
            }
            description={t("numberDesc")}
          >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <OptionRow label={t("minLabel")} htmlFor="rp-min">
                  <Input
                    id="rp-min"
                    type="number"
                    inputMode="numeric"
                    dir="ltr"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                  />
                </OptionRow>
                <OptionRow label={t("maxLabel")} htmlFor="rp-max">
                  <Input
                    id="rp-max"
                    type="number"
                    inputMode="numeric"
                    dir="ltr"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                  />
                </OptionRow>
                <OptionRow label={t("countLabel")} htmlFor="rp-count">
                  <Input
                    id="rp-count"
                    type="number"
                    inputMode="numeric"
                    dir="ltr"
                    min={1}
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
                </OptionRow>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="rp-dupes"
                  data-testid="rp-allow-duplicates"
                  checked={allowDuplicates}
                  onCheckedChange={(c) => setAllowDuplicates(Boolean(c))}
                />
                <Label htmlFor="rp-dupes" className="cursor-pointer">
                  {t("allowDuplicates")}
                </Label>
              </div>

              <Button onClick={generateNumbers} className="w-full">
                <RefreshCw className="h-4 w-4 me-2" />
                {t("generate")}
              </Button>

              {numbers.length > 0 && (
                <div className="space-y-3">
                  <div
                    className="flex flex-wrap gap-2 justify-center p-4 border rounded-lg bg-muted/40"
                    dir="ltr"
                    data-testid="rp-number-results"
                  >
                    {numbers.map((num, i) => (
                      <span
                        key={`${num}-${i}`}
                        className="text-2xl font-bold text-primary px-3 py-1"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => copyText(numbers.join(", "))}
                  >
                    <Copy className="h-4 w-4 me-2" />
                    {t("copyResult")}
                  </Button>
                </div>
              )}
          </SettingsCard>
        </TabsContent>

        {/* ── Dice ── */}
        <TabsContent value="dice" className="space-y-6">
          <SettingsCard
            title={
              <span className="flex items-center gap-2">
                <Dices className="h-4 w-4" />
                {t("diceTitle")}
              </span>
            }
            description={t("diceDesc")}
          >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <OptionRow label={t("diceCountLabel")} htmlFor="rp-dice-count">
                  <Input
                    id="rp-dice-count"
                    type="number"
                    inputMode="numeric"
                    dir="ltr"
                    min={1}
                    max={100}
                    value={diceCount}
                    onChange={(e) => setDiceCount(e.target.value)}
                  />
                </OptionRow>
                <OptionRow label={t("dieSidesLabel")}>
                  <div className="flex flex-wrap gap-2">
                    {DIE_SIZES.map((s) => (
                      <Button
                        key={s}
                        type="button"
                        size="sm"
                        variant={dieSides === s ? "default" : "outline"}
                        onClick={() => setDieSides(s)}
                      >
                        d{s}
                      </Button>
                    ))}
                  </div>
                </OptionRow>
              </div>

              <Button onClick={rollDice} className="w-full">
                <Dices className="h-4 w-4 me-2" />
                {t("roll")}
              </Button>

              {diceResults.length > 0 && (
                <div className="space-y-3">
                  <div
                    className="flex flex-wrap gap-3 justify-center p-4 border rounded-lg bg-muted/40"
                    dir="ltr"
                    data-testid="rp-dice-results"
                  >
                    {diceResults.map((d, i) => (
                      <span
                        key={`${d}-${i}`}
                        className="flex items-center justify-center h-12 w-12 rounded-lg border bg-background text-xl font-bold"
                        data-testid="rp-die"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  <div
                    className="text-center text-lg font-semibold"
                    dir="ltr"
                  >
                    {t("total")}:{" "}
                    <span className="text-primary" data-testid="rp-dice-total">
                      {diceTotal}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      copyText(
                        `${diceResults.join(", ")} (${t("total")}: ${diceTotal})`
                      )
                    }
                  >
                    <Copy className="h-4 w-4 me-2" />
                    {t("copyResult")}
                  </Button>
                </div>
              )}
          </SettingsCard>
        </TabsContent>

        {/* ── Coin ── */}
        <TabsContent value="coin" className="space-y-6">
          <SettingsCard
            title={
              <span className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                {t("coinTitle")}
              </span>
            }
            description={t("coinDesc")}
          >
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`flex items-center justify-center h-32 w-32 rounded-full border-4 border-primary/40 bg-muted text-2xl font-bold transition-transform duration-500 ${
                    flipping ? "animate-spin" : ""
                  }`}
                  data-testid="rp-coin"
                  aria-live="polite"
                >
                  {flipping
                    ? "…"
                    : coin === "heads"
                      ? t("heads")
                      : coin === "tails"
                        ? t("tails")
                        : t("coinPrompt")}
                </div>

                <Button
                  onClick={flipCoin}
                  disabled={flipping}
                  className="w-full"
                >
                  <Coins className="h-4 w-4 me-2" />
                  {t("flip")}
                </Button>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center p-3 border rounded-lg">
                    <div
                      className="text-2xl font-bold text-primary"
                      data-testid="rp-heads-tally"
                    >
                      {headsTally}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("heads")}
                    </div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div
                      className="text-2xl font-bold text-primary"
                      data-testid="rp-tails-tally"
                    >
                      {tailsTally}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("tails")}
                    </div>
                  </div>
                </div>

                {(headsTally > 0 || tailsTally > 0) && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={resetCoin}
                  >
                    <RefreshCw className="h-4 w-4 me-2" />
                    {t("resetTally")}
                  </Button>
                )}
              </div>
          </SettingsCard>
        </TabsContent>

        {/* ── List picker ── */}
        <TabsContent value="list" className="space-y-6">
          <SettingsCard
            title={
              <span className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                {t("listTitle")}
              </span>
            }
            description={t("listDesc")}
          >
              <OptionRow label={t("listLabel")} htmlFor="rp-list">
                <Textarea
                  id="rp-list"
                  className="min-h-[160px]"
                  placeholder={t("listPlaceholder")}
                  value={listText}
                  onChange={(e) => setListText(e.target.value)}
                />
              </OptionRow>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="rp-remove-winner"
                  data-testid="rp-remove-winner"
                  checked={removeWinner}
                  onCheckedChange={(c) => setRemoveWinner(Boolean(c))}
                />
                <Label htmlFor="rp-remove-winner" className="cursor-pointer">
                  {t("removeWinner")}
                </Label>
              </div>

              <Button onClick={pickWinner} disabled={spinning} className="w-full">
                <ListChecks className="h-4 w-4 me-2" />
                {t("pick")}
              </Button>

              {winner !== null && (
                <div className="space-y-3">
                  <div
                    className="text-center p-6 border rounded-lg bg-muted/40"
                    data-testid="rp-winner"
                  >
                    <div className="text-sm text-muted-foreground mb-2">
                      {t("winnerLabel")}
                    </div>
                    <div
                      className={`text-2xl font-bold text-primary ${
                        spinning ? "opacity-50 animate-pulse" : ""
                      }`}
                    >
                      {winner}
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-full justify-center py-1">
                    {getListItems().length} {t("itemsRemaining")}
                  </Badge>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => copyText(winner)}
                  >
                    <Copy className="h-4 w-4 me-2" />
                    {t("copyResult")}
                  </Button>
                </div>
              )}
          </SettingsCard>
        </TabsContent>
      </Tabs>
      </div>
    </ToolShell>
  );
}
