"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ShuffleIcon } from "lucide-react";
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
import { ToolShell } from "@/components/template/tool-shell";
import { useDictionary } from "@/lib/word/useDictionary";
import { unscramble } from "@/lib/word/dictionary";

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

export default function WordUnscrambler() {
  const t = useTranslations("Tools.WordUnscrambler");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const { status, dict, retry } = useDictionary();

  const [letters, setLetters] = useState("");
  const [minLength, setMinLength] = useState("");
  const [contains, setContains] = useState("");
  const [results, setResults] = useState<string[] | null>(null);

  const canSolve = letters.trim().length > 0 && status === "ready";

  const handleSolve = () => {
    if (!dict || !canSolve) return;
    const parsedMinLength = Math.trunc(Number(minLength));
    const opts = {
      minLength: parsedMinLength > 0 ? parsedMinLength : undefined,
      contains: contains.trim() ? contains.trim()[0] : undefined,
    };
    setResults(unscramble(letters, dict, opts));
  };

  const handleClear = () => {
    setLetters("");
    setMinLength("");
    setContains("");
    setResults(null);
  };

  const grouped = useMemo(() => (results ? groupByLength(results) : null), [results]);

  return (
    <ToolShell
      slug="word-unscrambler"
      title={tc("tools.word-unscrambler.name")}
      sub={tc("tools.word-unscrambler.description")}
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
            data-testid="unscramble-solve-button"
          >
            <ShuffleIcon className="w-4 h-4" />
            {t("solve")}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {status === "loading" && (
          <div className="text-sm text-muted-foreground" data-testid="unscramble-loading">
            {t("loadingDictionary")}
          </div>
        )}

        {status === "error" && (
          <Card>
            <CardContent className="pt-6 space-y-4" data-testid="unscramble-error">
              <p className="text-sm text-destructive">{t("errorMessage")}</p>
              <Button size="sm" onClick={retry} data-testid="unscramble-retry">
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
                  <Label htmlFor="unscramble-letters">{t("lettersLabel")}</Label>
                  <Input
                    id="unscramble-letters"
                    data-testid="unscramble-letters-input"
                    placeholder={t("inputPlaceholder")}
                    value={letters}
                    onChange={(e) => setLetters(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unscramble-min-length">{t("minLengthLabel")}</Label>
                    <Input
                      id="unscramble-min-length"
                      type="number"
                      min={1}
                      data-testid="unscramble-min-length-input"
                      value={minLength}
                      onChange={(e) => setMinLength(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unscramble-contains">{t("containsLabel")}</Label>
                    <Input
                      id="unscramble-contains"
                      maxLength={1}
                      data-testid="unscramble-contains-input"
                      value={contains}
                      onChange={(e) => setContains(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {grouped && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("resultsTitle")}</CardTitle>
                  <CardDescription>{t("resultsDesc", { count: results?.length ?? 0 })}</CardDescription>
                </CardHeader>
                <CardContent>
                  {grouped.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("noResults")}</p>
                  ) : (
                    <div className="space-y-4" data-testid="unscramble-results">
                      {grouped.map(([length, words]) => (
                        <div key={length} data-testid="unscramble-group">
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
