"use client";

import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { SmileIcon, FrownIcon, InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { getPipeline, type LoadProgress } from "@/lib/hf-pipeline";

const MODEL = "Xenova/distilbert-base-uncased-finetuned-sst-2-english";

type Classifier = (
  text: string
) => Promise<{ label: string; score: number }[]>;

type Result = { label: string; score: number };

export default function SentimentAnalyzer() {
  const t = useTranslations("Tools.SentimentAnalyzer");

  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const analyze = useCallback(async () => {
    if (!text.trim()) {
      toast.error(t("enterText"));
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const classifier = await getPipeline<Classifier>(
        "text-classification",
        MODEL,
        { device: "wasm", onProgress: setProgress }
      );
      const out = await classifier(text);
      setResult(out[0]);
    } catch (err) {
      console.error(err);
      toast.error(t("failed"));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [text, t]);

  const positive = result?.label?.toUpperCase() === "POSITIVE";

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div>
            <h1 className="text-xl font-semibold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>

          <Card className="p-4 space-y-3">
            <label className="text-sm font-medium" htmlFor="sa-input">
              {t("inputLabel")}
            </label>
            <Textarea
              id="sa-input"
              dir="auto"
              className="min-h-[140px]"
              placeholder={t("inputPlaceholder")}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button onClick={analyze} disabled={busy}>
              {busy ? t("analyzing") : t("analyze")}
            </Button>

            {busy && progress && progress.status === "progress" && (
              <div className="space-y-1">
                <Progress value={progress.percent} />
                <p className="text-xs text-muted-foreground">
                  {t("loadingModel")} <span dir="ltr">{progress.percent}%</span>
                </p>
              </div>
            )}

            {result && (
              <div
                className="flex items-center justify-between rounded-lg border p-4"
                data-testid="sentiment-result"
              >
                <div className="flex items-center gap-3">
                  {positive ? (
                    <SmileIcon className="h-6 w-6 text-green-600" />
                  ) : (
                    <FrownIcon className="h-6 w-6 text-rose-600" />
                  )}
                  <span className="font-semibold">
                    {positive ? t("positive") : t("negative")}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground tabular-nums" dir="ltr">
                  {(result.score * 100).toFixed(1)}%
                </span>
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
