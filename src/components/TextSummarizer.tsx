"use client";

import { useCallback, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { CopyIcon, InfoIcon, TextQuoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { getPipeline, type LoadProgress } from "@/lib/hf-pipeline";

const MODEL = "Xenova/distilbart-cnn-6-6";

type Summarizer = (
  text: string,
  options?: { max_length?: number; min_length?: number }
) => Promise<{ summary_text: string }[]>;

type Length = "short" | "medium" | "long";

const LENGTH_PARAMS: Record<Length, { max_length: number; min_length: number }> = {
  short: { max_length: 60, min_length: 15 },
  medium: { max_length: 130, min_length: 40 },
  long: { max_length: 230, min_length: 90 },
};

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export default function TextSummarizer() {
  const t = useTranslations("Tools.TextSummarizer");

  const [text, setText] = useState("");
  const [length, setLength] = useState<Length>("medium");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [summary, setSummary] = useState("");

  const inputWords = useMemo(() => countWords(text), [text]);
  const summaryWords = useMemo(() => countWords(summary), [summary]);

  const summarize = useCallback(async () => {
    if (!text.trim()) {
      toast.error(t("enterText"));
      return;
    }
    setBusy(true);
    setSummary("");
    try {
      const summarizer = await getPipeline<Summarizer>(
        "summarization",
        MODEL,
        { device: "wasm", onProgress: setProgress }
      );
      const out = await summarizer(text, LENGTH_PARAMS[length]);
      setSummary(out[0]?.summary_text?.trim() ?? "");
    } catch (err) {
      console.error(err);
      toast.error(t("failed"));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [text, length, t]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  }, [summary, t]);

  const lengths: Length[] = ["short", "medium", "long"];

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div>
            <h1 className="text-xl font-semibold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>

          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium" htmlFor="ts-input">
                {t("inputLabel")}
              </label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {t("words")}: <span dir="ltr">{inputWords}</span>
              </span>
            </div>
            <Textarea
              id="ts-input"
              dir="auto"
              className="min-h-[180px]"
              placeholder={t("inputPlaceholder")}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="space-y-2">
              <span className="text-sm font-medium">{t("lengthLabel")}</span>
              <div className="flex flex-wrap gap-2">
                {lengths.map((l) => (
                  <Button
                    key={l}
                    type="button"
                    size="sm"
                    variant={length === l ? "default" : "outline"}
                    aria-pressed={length === l}
                    onClick={() => setLength(l)}
                    data-testid={`length-${l}`}
                  >
                    {l === "short"
                      ? t("short")
                      : l === "medium"
                        ? t("medium")
                        : t("long")}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={summarize} disabled={busy}>
              {busy ? t("summarizing") : t("summarize")}
            </Button>

            {busy && progress && progress.status === "progress" && (
              <div className="space-y-1">
                <Progress value={progress.percent} />
                <p className="text-xs text-muted-foreground">
                  {t("loadingModel")} <span dir="ltr">{progress.percent}%</span>
                </p>
              </div>
            )}

            {summary && (
              <div className="rounded-lg border p-4 space-y-3" data-testid="summary-result">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <TextQuoteIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t("summaryLabel")}</span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={copy}
                    aria-label={t("copy")}
                  >
                    <CopyIcon className="h-4 w-4 me-1.5" />
                    {t("copy")}
                  </Button>
                </div>
                <p dir="auto" className="text-sm leading-relaxed whitespace-pre-wrap">
                  {summary}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {t("words")}: <span dir="ltr">{summaryWords}</span>
                </p>
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-start gap-3">
              <InfoIcon className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">{t("modelNote")}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
