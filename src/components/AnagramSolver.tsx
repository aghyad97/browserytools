"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { PuzzleIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ToolShell } from "@/components/template/tool-shell";
import { useDictionary } from "@/lib/word/useDictionary";
import { anagramsOf } from "@/lib/word/dictionary";

/** Groups an already length-desc-sorted word list into [length, words][],
 * preserving descending order via Map insertion order. */
function groupByLength(words: string[]): [number, string[]][] {
  const map = new Map<number, string[]>();
  for (const w of words) {
    const arr = map.get(w.length) ?? [];
    arr.push(w);
    map.set(w.length, arr);
  }
  return [...map.entries()];
}

export default function AnagramSolver() {
  const t = useTranslations("Tools.AnagramSolver");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const { status, dict, retry } = useDictionary();

  const [letters, setLetters] = useState("");
  const [allowShorter, setAllowShorter] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);

  const canSolve = letters.trim().length > 0 && status === "ready";

  const handleSolve = () => {
    if (!dict || !canSolve) return;
    setResults(anagramsOf(letters, dict, { allowShorter }));
  };

  const handleClear = () => {
    setLetters("");
    setAllowShorter(false);
    setResults(null);
  };

  const grouped = useMemo(
    () => (results && allowShorter ? groupByLength(results) : null),
    [results, allowShorter],
  );

  return (
    <ToolShell
      slug="anagram-solver"
      title={tc("tools.anagram-solver.name")}
      sub={tc("tools.anagram-solver.description")}
      controls={
        <>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!letters && !results}>
            {tCommon("clear")}
          </Button>
          <Button
            size="sm"
            onClick={handleSolve}
            disabled={!canSolve}
            className="flex items-center gap-2"
            data-testid="anagram-solve-button"
          >
            <PuzzleIcon className="w-4 h-4" />
            {t("solve")}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {status === "loading" && (
          <div className="text-sm text-muted-foreground" data-testid="anagram-loading">
            {t("loadingDictionary")}
          </div>
        )}

        {status === "error" && (
          <Card>
            <CardContent className="pt-6 space-y-4" data-testid="anagram-error">
              <p className="text-sm text-destructive">{t("errorMessage")}</p>
              <Button size="sm" onClick={retry} data-testid="anagram-retry">
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
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="anagram-letters">{t("lettersLabel")}</Label>
                  <Input
                    id="anagram-letters"
                    data-testid="anagram-letters-input"
                    placeholder={t("inputPlaceholder")}
                    value={letters}
                    onChange={(e) => {
                      setLetters(e.target.value);
                      setResults(null);
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="anagram-allow-shorter"
                    data-testid="anagram-allow-shorter"
                    checked={allowShorter}
                    onCheckedChange={(checked) => {
                      setAllowShorter(checked);
                      setResults(null);
                    }}
                  />
                  <Label htmlFor="anagram-allow-shorter" className="cursor-pointer">
                    {t("allowShorterLabel")}
                  </Label>
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
                  ) : grouped ? (
                    <div className="space-y-4" data-testid="anagram-results">
                      {grouped.map(([length, words]) => (
                        <div key={length} data-testid="anagram-group">
                          <div className="font-semibold mb-2 text-sm">
                            {t("groupLabel", { length })}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {words.map((w) => (
                              <span
                                key={w}
                                className="rounded-md border px-2 py-1 text-sm font-mono"
                              >
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2" data-testid="anagram-results">
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
