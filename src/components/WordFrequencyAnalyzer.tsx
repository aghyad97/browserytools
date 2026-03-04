"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "it", "in", "on", "at", "to", "for", "of", "and",
  "or", "but", "not", "be", "are", "was", "were", "has", "have", "had", "do",
  "does", "did", "this", "that", "these", "those", "with", "from", "by", "as",
  "so", "if", "he", "she", "they", "we", "you", "i", "me", "my", "your",
  "his", "her", "its", "our", "their", "will", "would", "could", "should",
  "may", "might", "can", "than", "then", "when", "where", "who", "what",
  "how", "just", "also", "more", "very", "too", "much", "many", "some",
  "any", "all", "no", "up", "out", "about",
]);

type WordEntry = {
  word: string;
  count: number;
  percent: number;
};

export default function WordFrequencyAnalyzer() {
  const t = useTranslations("Tools.WordFrequency");
  const tCommon = useTranslations("Common");
  const [input, setInput] = useState("");
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(true);
  const [minLength, setMinLength] = useState(2);
  const [showAll, setShowAll] = useState(false);

  const analysis = useMemo<{
    entries: WordEntry[];
    totalWords: number;
    uniqueWords: number;
  }>(() => {
    if (!input.trim()) {
      return { entries: [], totalWords: 0, uniqueWords: 0 };
    }

    const rawWords = input.match(/\b[a-zA-Z']+\b/g) ?? [];
    const totalWords = rawWords.length;

    const freq = new Map<string, number>();
    for (const rawWord of rawWords) {
      const word = caseInsensitive ? rawWord.toLowerCase() : rawWord;
      if (word.length < minLength) continue;
      if (removeStopWords && STOP_WORDS.has(word.toLowerCase())) continue;
      freq.set(word, (freq.get(word) ?? 0) + 1);
    }

    const entries: WordEntry[] = Array.from(freq.entries())
      .map(([word, count]) => ({
        word,
        count,
        percent: totalWords > 0 ? (count / totalWords) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return { entries, totalWords, uniqueWords: freq.size };
  }, [input, caseInsensitive, removeStopWords, minLength]);

  const displayed = useMemo(
    () => (showAll ? analysis.entries : analysis.entries.slice(0, 10)),
    [analysis.entries, showAll]
  );

  const maxCount = useMemo(
    () => (analysis.entries.length > 0 ? analysis.entries[0].count : 1),
    [analysis.entries]
  );

  const handleClear = useCallback(() => {
    setInput("");
    setShowAll(false);
  }, []);

  const handleExportCsv = useCallback(() => {
    if (analysis.entries.length === 0) {
      toast.error(t("noDataToExport"));
      return;
    }
    const header = "Rank,Word,Count,Percent\n";
    const rows = analysis.entries
      .map(
        (e, i) =>
          `${i + 1},"${e.word}",${e.count},${e.percent.toFixed(2)}%`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "word-frequency.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("exportedCsv"));
  }, [analysis.entries, t]);

  const ToggleOption = ({
    id,
    label,
    checked,
    onChange,
  }: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer select-none"
    >
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-9 h-5 rounded-full transition-colors ${
            checked ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        />
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
      <span className="text-sm">{label}</span>
    </label>
  );

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input + Options */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("inputTitle")}</CardTitle>
              <CardDescription>{t("inputDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={t("inputPlaceholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[220px] resize-none text-sm"
                rows={10}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="w-full flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {tCommon("clear")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("optionsTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleOption
                id="case-insensitive"
                label={t("caseInsensitive")}
                checked={caseInsensitive}
                onChange={setCaseInsensitive}
              />
              <ToggleOption
                id="stop-words"
                label={t("removeStopWords")}
                checked={removeStopWords}
                onChange={setRemoveStopWords}
              />
              <div className="space-y-1">
                <Label htmlFor="min-length" className="text-sm">
                  {t("minWordLength")}
                </Label>
                <Input
                  id="min-length"
                  type="number"
                  min={1}
                  max={20}
                  value={minLength}
                  onChange={(e) =>
                    setMinLength(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          {analysis.totalWords > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("summaryTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("totalWords")}</span>
                  <Badge variant="secondary">{analysis.totalWords}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("uniqueWords")}</span>
                  <Badge variant="secondary">{analysis.uniqueWords}</Badge>
                </div>
                {analysis.entries[0] && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("mostCommon")}</span>
                    <Badge>
                      &ldquo;{analysis.entries[0].word}&rdquo; &times;{" "}
                      {analysis.entries[0].count}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle>{t("resultsTitle")}</CardTitle>
                  <CardDescription>
                    {analysis.entries.length > 0
                      ? t("uniqueWordsFound", { count: analysis.entries.length })
                      : t("enterTextToAnalyze")}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  disabled={analysis.entries.length === 0}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {t("exportCsv")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {analysis.entries.length === 0 ? (
                <div className="text-center text-muted-foreground py-16">
                  <p className="text-sm">
                    {t("noWordsToDisplay")}
                  </p>
                </div>
              ) : (
                <>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left rtl:text-right py-2 pr-4 font-medium text-muted-foreground w-12">
                            {t("rank")}
                          </th>
                          <th className="text-left rtl:text-right py-2 pr-4 font-medium text-muted-foreground">
                            {t("word")}
                          </th>
                          <th className="text-right rtl:text-left py-2 pr-4 font-medium text-muted-foreground w-16">
                            {t("count")}
                          </th>
                          <th className="text-right rtl:text-left py-2 font-medium text-muted-foreground w-16">
                            {t("percent")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayed.map((entry, idx) => (
                          <tr key={entry.word} className="border-b border-border/50">
                            <td className="py-2 pr-4 text-muted-foreground">
                              {idx + 1}
                            </td>
                            <td className="py-2 pr-4">
                              <div className="space-y-1">
                                <span className="font-medium">{entry.word}</span>
                                <div className="w-full bg-muted rounded-full h-1.5">
                                  <div
                                    className="bg-primary h-1.5 rounded-full"
                                    style={{
                                      width: `${(entry.count / maxCount) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-2 pr-4 text-right font-mono">
                              {entry.count}
                            </td>
                            <td className="py-2 text-right text-muted-foreground font-mono">
                              {entry.percent.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {analysis.entries.length > 10 && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAll((v) => !v)}
                      >
                        {showAll
                          ? t("showTop10")
                          : t("showAll", { count: analysis.entries.length })}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
