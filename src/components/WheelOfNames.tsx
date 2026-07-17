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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ToolShell } from "@/components/template/tool-shell";
import { SpinWheel } from "@/components/shared/SpinWheel";

/** One name per line; blank/whitespace-only lines are dropped. */
function parseNames(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/** Removes the first line whose trimmed text matches `name`, preserving the
 * rest of the raw text (including any blank lines the user left in). */
function removeFirstMatch(raw: string, name: string): string {
  let removed = false;
  return raw
    .split("\n")
    .filter((line) => {
      if (!removed && line.trim() === name) {
        removed = true;
        return false;
      }
      return true;
    })
    .join("\n");
}

export interface WheelOfNamesProps {
  /** Injectable RNG forwarded to SpinWheel; defaults to Math.random. Exists
   * so tests can force a deterministic winner. */
  rng?: () => number;
}

export default function WheelOfNames({ rng }: WheelOfNamesProps = {}) {
  const t = useTranslations("Tools.WheelOfNames");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [rawText, setRawText] = useState("");
  const [removeWinner, setRemoveWinner] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const names = useMemo(() => parseNames(rawText), [rawText]);

  const handleResult = (index: number) => {
    const picked = names[index];
    if (picked === undefined) return;
    setWinner(picked);
    if (removeWinner) {
      setRawText((prev) => removeFirstMatch(prev, picked));
    }
  };

  const handleShuffle = () => {
    setRawText(shuffle(names).join("\n"));
  };

  const handleClear = () => {
    setRawText("");
    setWinner(null);
  };

  return (
    <ToolShell
      slug="wheel-of-names"
      title={tc("tools.wheel-of-names.name")}
      sub={tc("tools.wheel-of-names.description")}
      controls={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShuffle}
            disabled={names.length < 2}
            className="flex items-center gap-2"
            data-testid="shuffle-names"
          >
            <ShuffleIcon className="w-4 h-4" />
            {t("shuffle")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!rawText}
          >
            {tCommon("clear")}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("inputTitle")}</CardTitle>
            <CardDescription>{t("inputDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              data-testid="wheel-names-input"
              placeholder={t("inputPlaceholder")}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="min-h-[160px] resize-none"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <span data-testid="wheel-names-count">
                {t("namesCount", { count: names.length })}
              </span>
              <label className="flex items-center gap-2">
                <Checkbox
                  id="remove-winner"
                  checked={removeWinner}
                  onCheckedChange={setRemoveWinner}
                  data-testid="remove-winner-checkbox"
                />
                {t("removeWinnerAfterSpin")}
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("wheelTitle")}</CardTitle>
            <CardDescription>{t("wheelDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <SpinWheel
              labels={names}
              onResult={handleResult}
              rng={rng}
              spinLabel={t("spin")}
            />
            {winner && (
              <div
                data-testid="wheel-winner"
                className="text-lg font-semibold"
              >
                {t("winnerLabel", { name: winner })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolShell>
  );
}
