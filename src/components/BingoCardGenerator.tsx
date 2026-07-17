"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Grid3x3Icon, PrinterIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolShell } from "@/components/template/tool-shell";
import { ModePicker } from "@/components/shared/ModePicker";
import { numberCard, wordCard, makeCards, type NumberCell } from "@/lib/bingo";
import s from "./BingoCardGenerator.module.css";

const BINGO_LETTERS = ["B", "I", "N", "G", "O"];
const NUMBER_CARD_SIZE = 5;
const DEFAULT_WORD_SIZE = 5;

type BingoMode = "number" | "word";
type GeneratedCards =
  | { mode: "number"; cards: NumberCell[][][] }
  | { mode: "word"; cards: string[][][] };

/** One word per line; blank/whitespace-only lines dropped, duplicates
 * collapsed so a card never renders the same word twice from a sloppy
 * paste. */
function parseWords(raw: string): string[] {
  const seen = new Set<string>();
  const words: string[] = [];
  for (const line of raw.split("\n")) {
    const word = line.trim();
    if (!word || seen.has(word)) continue;
    seen.add(word);
    words.push(word);
  }
  return words;
}

export interface BingoCardGeneratorProps {
  /** Injectable RNG forwarded to the generators; defaults to Math.random.
   * Exists so tests can force a deterministic deal. */
  rng?: () => number;
}

export default function BingoCardGenerator({ rng }: BingoCardGeneratorProps = {}) {
  const t = useTranslations("Tools.BingoCardGenerator");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [mode, setMode] = useState<BingoMode>("number");
  const [countValue, setCountValue] = useState("1");
  const [wordPoolRaw, setWordPoolRaw] = useState("");
  const [sizeValue, setSizeValue] = useState(String(DEFAULT_WORD_SIZE));
  const [result, setResult] = useState<GeneratedCards | null>(null);

  const words = useMemo(() => parseWords(wordPoolRaw), [wordPoolRaw]);

  const parsedCount = Math.max(0, Math.trunc(Number(countValue)) || 0);
  const parsedSize = Math.max(0, Math.trunc(Number(sizeValue)) || 0);
  const cardCount = Math.max(1, parsedCount);
  const cardSize = Math.max(1, parsedSize);

  const canGenerate =
    parsedCount > 0 &&
    (mode === "number" || (parsedSize > 0 && words.length >= parsedSize * parsedSize));

  const handleGenerate = () => {
    if (!canGenerate) return;
    if (mode === "number") {
      setResult({ mode: "number", cards: makeCards(cardCount, numberCard, rng) });
      return;
    }
    try {
      setResult({
        mode: "word",
        cards: makeCards(cardCount, (r) => wordCard(words, cardSize, r), rng),
      });
    } catch {
      toast.error(t("errorPoolTooSmall"));
    }
  };

  const handleClear = () => {
    setWordPoolRaw("");
    setResult(null);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <ToolShell
      slug="bingo-card-generator"
      title={tc("tools.bingo-card-generator.name")}
      sub={tc("tools.bingo-card-generator.description")}
      controls={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!wordPoolRaw && mode === "word"}
          >
            {tCommon("clear")}
          </Button>
          <Button
            size="sm"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="flex items-center gap-2"
            data-testid="generate-bingo"
          >
            <Grid3x3Icon className="w-4 h-4" />
            {t("generate")}
          </Button>
        </>
      }
    >
      <div className="space-y-6 print:space-y-0">
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>{t("inputTitle")}</CardTitle>
            <CardDescription>{t("inputDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ModePicker
              aria-label={t("modeLabel")}
              data-testid="bingo-mode-picker"
              value={mode}
              onChange={(next) => {
                setMode(next);
                setResult(null);
              }}
              options={[
                { value: "number", label: t("numberMode") },
                { value: "word", label: t("wordMode") },
              ]}
            />

            <label className="flex items-center gap-3 text-sm">
              {t("cardCountLabel")}
              <Input
                type="number"
                min={1}
                data-testid="bingo-card-count"
                value={countValue}
                onChange={(e) => setCountValue(e.target.value)}
                className="w-24"
              />
            </label>

            {mode === "word" && (
              <>
                <Textarea
                  data-testid="bingo-word-pool"
                  placeholder={t("wordPoolPlaceholder")}
                  value={wordPoolRaw}
                  onChange={(e) => setWordPoolRaw(e.target.value)}
                  className="min-h-[160px] resize-none"
                />
                <div className="text-sm text-muted-foreground" data-testid="bingo-word-count">
                  {t("wordsCount", { count: words.length })}
                </div>
                <label className="flex items-center gap-3 text-sm">
                  {t("cardSizeLabel")}
                  <Input
                    type="number"
                    min={2}
                    data-testid="bingo-card-size"
                    value={sizeValue}
                    onChange={(e) => setSizeValue(e.target.value)}
                    className="w-24"
                  />
                </label>
              </>
            )}
          </CardContent>
        </Card>

        {result && result.cards.length > 0 && (
          <Card className="print:border-0 print:shadow-none">
            <CardHeader className="print:hidden">
              <CardTitle className="flex items-center justify-between gap-2">
                {t("resultsTitle")}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="flex items-center gap-2"
                >
                  <PrinterIcon className="w-4 h-4" />
                  {t("print")}
                </Button>
              </CardTitle>
              <CardDescription>{t("resultsDesc", { count: result.cards.length })}</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                data-testid="bingo-cards"
                className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-0"
              >
                {result.mode === "number"
                  ? result.cards.map((card, index) => (
                      <div
                        key={index}
                        data-testid="bingo-card"
                        className={`rounded-md border p-3 print:border-0 print:break-inside-avoid ${s.printCard}`}
                      >
                        <div
                          className="grid gap-1"
                          style={{ gridTemplateColumns: `repeat(${NUMBER_CARD_SIZE}, 1fr)` }}
                        >
                          {BINGO_LETTERS.map((letter) => (
                            <div
                              key={letter}
                              className="text-center font-bold text-sm py-1"
                              aria-hidden
                            >
                              {letter}
                            </div>
                          ))}
                          {card.map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                data-testid="bingo-cell"
                                className="aspect-square flex items-center justify-center border rounded-sm text-sm font-medium"
                              >
                                {cell}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))
                  : result.cards.map((card, index) => (
                      <div
                        key={index}
                        data-testid="bingo-card"
                        className={`rounded-md border p-3 print:border-0 print:break-inside-avoid ${s.printCard}`}
                      >
                        <div
                          className="grid gap-1"
                          style={{ gridTemplateColumns: `repeat(${cardSize}, 1fr)` }}
                        >
                          {card.map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                data-testid="bingo-cell"
                                className="aspect-square flex items-center justify-center border rounded-sm text-xs font-medium p-1 text-center"
                              >
                                {cell}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolShell>
  );
}
