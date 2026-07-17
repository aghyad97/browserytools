"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolShell } from "@/components/template/tool-shell";
import { useDictionary } from "@/lib/word/useDictionary";
import { wordleMatches } from "@/lib/word/dictionary";
import { cn } from "@/lib/utils";

type TileColor = "gray" | "yellow" | "green";
type Tile = { letter: string; color: TileColor };

const TILE_COUNT = 5;
const NEXT_COLOR: Record<TileColor, TileColor> = {
  gray: "yellow",
  yellow: "green",
  green: "gray",
};
const COLOR_CLASS: Record<TileColor, string> = {
  gray: "bg-muted text-muted-foreground border-border",
  yellow: "bg-yellow-500 text-white border-yellow-600",
  green: "bg-green-600 text-white border-green-700",
};

function emptyTiles(): Tile[] {
  return Array.from({ length: TILE_COUNT }, () => ({ letter: "", color: "gray" as TileColor }));
}

function buildConstraints(tiles: Tile[]) {
  const greens: (string | null)[] = tiles.map((t) =>
    t.color === "green" && t.letter ? t.letter.toLowerCase() : null,
  );
  const yellows: { letter: string; pos: number }[] = [];
  const grays: string[] = [];
  tiles.forEach((t, i) => {
    if (!t.letter) return;
    if (t.color === "yellow") yellows.push({ letter: t.letter.toLowerCase(), pos: i });
    if (t.color === "gray") grays.push(t.letter.toLowerCase());
  });
  return { greens, yellows, grays };
}

export default function WordleSolver() {
  const t = useTranslations("Tools.WordleSolver");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const { status, dict, retry } = useDictionary();

  const [tiles, setTiles] = useState<Tile[]>(emptyTiles);
  const [results, setResults] = useState<string[] | null>(null);

  const hasAnyLetter = tiles.some((tile) => tile.letter);
  const canSolve = hasAnyLetter && status === "ready";

  const handleLetterChange = (index: number, value: string) => {
    const letter = value.replace(/[^a-zA-Z]/g, "").slice(-1).toUpperCase();
    setTiles((prev) => prev.map((tile, i) => (i === index ? { ...tile, letter } : tile)));
  };

  const handleCycle = (index: number) => {
    setTiles((prev) =>
      prev.map((tile, i) => (i === index ? { ...tile, color: NEXT_COLOR[tile.color] } : tile)),
    );
  };

  const handleSolve = () => {
    if (!dict || !canSolve) return;
    const constraints = buildConstraints(tiles);
    setResults(wordleMatches(dict, constraints));
  };

  const handleClear = () => {
    setTiles(emptyTiles());
    setResults(null);
  };

  const stateLabel = useMemo(
    () => ({ gray: t("stateGray"), yellow: t("stateYellow"), green: t("stateGreen") }),
    [t],
  );

  return (
    <ToolShell
      slug="wordle-solver"
      title={tc("tools.wordle-solver.name")}
      sub={tc("tools.wordle-solver.description")}
      controls={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!hasAnyLetter && !results}
          >
            {tCommon("clear")}
          </Button>
          <Button
            size="sm"
            onClick={handleSolve}
            disabled={!canSolve}
            className="flex items-center gap-2"
            data-testid="wordle-solve-button"
          >
            <SearchIcon className="w-4 h-4" />
            {t("solve")}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {status === "loading" && (
          <div className="text-sm text-muted-foreground" data-testid="wordle-loading">
            {t("loadingDictionary")}
          </div>
        )}

        {status === "error" && (
          <Card>
            <CardContent className="pt-6 space-y-4" data-testid="wordle-error">
              <p className="text-sm text-destructive">{t("errorMessage")}</p>
              <Button size="sm" onClick={retry} data-testid="wordle-retry">
                {t("retry")}
              </Button>
            </CardContent>
          </Card>
        )}

        {status === "ready" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{t("inputTitle")}</CardTitle>
                <CardDescription>{t("inputDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 sm:gap-3 max-w-md" data-testid="wordle-tiles">
                  {tiles.map((tile, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <Input
                        data-testid={`wordle-letter-input-${i}`}
                        value={tile.letter}
                        onChange={(e) => handleLetterChange(i, e.target.value)}
                        maxLength={1}
                        className="w-full h-12 text-center text-lg font-bold uppercase p-0"
                        aria-label={t("letterAriaLabel", { position: i + 1 })}
                      />
                      <button
                        type="button"
                        data-testid={`wordle-tile-${i}`}
                        onClick={() => handleCycle(i)}
                        className={cn(
                          "w-full h-8 rounded-md text-[11px] font-medium border transition-colors",
                          COLOR_CLASS[tile.color],
                        )}
                        aria-label={t("tileStateAriaLabel", {
                          position: i + 1,
                          state: stateLabel[tile.color],
                        })}
                      >
                        {stateLabel[tile.color]}
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {results && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("resultsTitle")}</CardTitle>
                  <CardDescription>{t("resultsDesc", { count: results.length })}</CardDescription>
                </CardHeader>
                <CardContent>
                  {results.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("noResults")}</p>
                  ) : (
                    <div className="flex flex-wrap gap-2" data-testid="wordle-results">
                      {results.map((w) => (
                        <span key={w} className="rounded-md border px-2 py-1 text-sm font-mono">
                          {w}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </ToolShell>
  );
}
