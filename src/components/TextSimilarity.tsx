"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\W+/).filter(t => t.length > 1);
}

function computeTfIdfVectors(docs: string[][]): number[][] {
  const allTerms = [...new Set(docs.flat())];
  return docs.map(doc => {
    const termCounts = new Map<string, number>();
    doc.forEach(t => termCounts.set(t, (termCounts.get(t) ?? 0) + 1));
    return allTerms.map(term => {
      const tf = (termCounts.get(term) ?? 0) / (doc.length || 1);
      const docsWithTerm = docs.filter(d => d.includes(term)).length;
      const idf = docsWithTerm > 0 ? Math.log(docs.length / docsWithTerm) : 0;
      return tf * idf;
    });
  });
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((s, bi) => s + bi * bi, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

interface TextEntry { id: string; value: string; }

export default function TextSimilarity() {
  const t = useTranslations("Tools.TextSimilarity");
  const [texts, setTexts] = useState<TextEntry[]>([
    { id: crypto.randomUUID(), value: "" },
    { id: crypto.randomUUID(), value: "" },
  ]);
  const [results, setResults] = useState<Array<{ i: number; j: number; score: number }>>([]);
  const [calculated, setCalculated] = useState(false);

  const updateText = (id: string, value: string) => {
    setTexts(prev => prev.map(entry => entry.id === id ? { ...entry, value } : entry));
    setCalculated(false);
  };

  const addText = () => {
    if (texts.length >= 5) return;
    setTexts(prev => [...prev, { id: crypto.randomUUID(), value: "" }]);
    setCalculated(false);
  };

  const removeText = (id: string) => {
    if (texts.length <= 2) return;
    setTexts(prev => prev.filter(entry => entry.id !== id));
    setCalculated(false);
  };

  const handleCalculate = () => {
    const nonEmpty = texts.filter(entry => entry.value.trim());
    if (nonEmpty.length < 2) return;
    const tokenized = nonEmpty.map(entry => tokenize(entry.value));
    const vectors = computeTfIdfVectors(tokenized);
    const pairs: Array<{ i: number; j: number; score: number }> = [];
    for (let i = 0; i < nonEmpty.length; i++) {
      for (let j = i + 1; j < nonEmpty.length; j++) {
        pairs.push({ i, j, score: cosineSimilarity(vectors[i], vectors[j]) });
      }
    }
    setResults(pairs);
    setCalculated(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return "text-green-600 dark:text-green-400";
    if (score >= 0.4) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.7) return t("highSimilarity");
    if (score >= 0.4) return t("mediumSimilarity");
    return t("lowSimilarity");
  };

  const getScoreBg = (score: number) => {
    if (score >= 0.7) return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800";
    if (score >= 0.4) return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800";
    return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800";
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {texts.map((entry, idx) => (
            <div key={entry.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>{idx === 0 ? t("text1Label") : idx === 1 ? t("text2Label") : `${t("pairLabel")} ${idx + 1}`}</Label>
                {texts.length > 2 && (
                  <Button variant="ghost" size="sm" onClick={() => removeText(entry.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <Textarea
                dir="auto"
                value={entry.value}
                onChange={e => updateText(entry.id, e.target.value)}
                placeholder={idx === 0 ? t("text1Placeholder") : t("text2Placeholder")}
                rows={3}
                className="resize-y"
              />
            </div>
          ))}
          <div className="flex gap-2 flex-wrap">
            {texts.length < 5 && (
              <Button variant="outline" size="sm" onClick={addText}>
                <Plus className="h-4 w-4 mr-1" />{t("addComparison")}
              </Button>
            )}
            <Button size="sm" onClick={handleCalculate} disabled={texts.filter(entry => entry.value.trim()).length < 2}>
              {t("calculate")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setTexts([{ id: crypto.randomUUID(), value: "" }, { id: crypto.randomUUID(), value: "" }]); setResults([]); setCalculated(false); }}>
              {t("clearAll")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {calculated && results.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {results.map((r, idx) => (
            <div key={idx} className={`rounded-lg border p-4 ${getScoreBg(r.score)}`}>
              <p className="text-sm text-muted-foreground mb-1">{t("pairLabel")} {r.i + 1} &#8596; {r.j + 1}</p>
              <p className={`text-3xl font-bold tabular-nums ${getScoreColor(r.score)}`}>
                {(r.score * 100).toFixed(1)}%
              </p>
              <p className={`text-sm font-medium mt-1 ${getScoreColor(r.score)}`}>{getScoreLabel(r.score)}</p>
            </div>
          ))}
        </div>
      )}

      {calculated && results.length === 0 && (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground text-sm">{t("noInput")}</CardContent>
        </Card>
      )}
    </div>
  );
}
