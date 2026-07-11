"use client";

import { useCallback, useState, type KeyboardEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { InfoIcon, XIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { getPipeline, type LoadProgress } from "@/lib/hf-pipeline";

const MODEL = "Xenova/nli-deberta-v3-xsmall";

type ZeroShotOutput = {
  sequence: string;
  labels: string[];
  scores: number[];
};

type ZeroShotClassifier = (
  text: string,
  labels: string[],
  options?: { multi_label?: boolean }
) => Promise<ZeroShotOutput>;

type Result = { label: string; score: number };

export default function ZeroShotClassifier() {
  const t = useTranslations("Tools.ZeroShotClassifier");
  const tc = useTranslations("ToolsConfig");

  const [text, setText] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  const [labelDraft, setLabelDraft] = useState("");
  const [multiLabel, setMultiLabel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);

  const commitLabels = useCallback(
    (raw: string) => {
      const parts = raw
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length === 0) return;
      setLabels((prev) => {
        const next = [...prev];
        for (const p of parts) {
          if (!next.some((l) => l.toLowerCase() === p.toLowerCase())) {
            next.push(p);
          }
        }
        return next;
      });
      setLabelDraft("");
    },
    []
  );

  const onLabelKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        commitLabels(labelDraft);
      } else if (e.key === "Backspace" && labelDraft === "") {
        setLabels((prev) => prev.slice(0, -1));
      }
    },
    [commitLabels, labelDraft]
  );

  const removeLabel = useCallback((label: string) => {
    setLabels((prev) => prev.filter((l) => l !== label));
  }, []);

  const classify = useCallback(async () => {
    const pending = labelDraft.trim();
    const allLabels = pending
      ? Array.from(
          new Set([
            ...labels,
            ...pending
              .split(",")
              .map((p) => p.trim())
              .filter(Boolean),
          ])
        )
      : labels;

    if (!text.trim()) {
      toast.error(t("enterText"));
      return;
    }
    if (allLabels.length === 0) {
      toast.error(t("enterLabels"));
      return;
    }

    setBusy(true);
    setResults(null);
    try {
      const classifier = await getPipeline<ZeroShotClassifier>(
        "zero-shot-classification",
        MODEL,
        { device: "wasm", onProgress: setProgress }
      );
      const out = await classifier(text, allLabels, {
        multi_label: multiLabel,
      });
      const ranked: Result[] = out.labels
        .map((label, i) => ({ label, score: out.scores[i] }))
        .sort((a, b) => b.score - a.score);
      setResults(ranked);
    } catch (err) {
      console.error(err);
      toast.error(t("failed"));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [text, labels, labelDraft, multiLabel, t]);

  return (
    <ToolShell
      slug="zero-shot-classifier"
      title={tc("tools.zero-shot-classifier.name")}
      sub={tc("tools.zero-shot-classifier.description")}
      controls={
        <div className="flex items-center gap-2">
          <Checkbox
            id="zsc-multi"
            checked={multiLabel}
            onCheckedChange={(c) => setMultiLabel(c === true)}
          />
          <label className="text-sm" htmlFor="zsc-multi">
            {t("multiLabel")}
          </label>
        </div>
      }
      primaryAction={{
        label: busy ? t("classifying") : t("classify"),
        onClick: classify,
        disabled: busy,
      }}
    >
      <div className="space-y-4">
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="zsc-input">
              {t("inputLabel")}
            </label>
            <Textarea
              id="zsc-input"
              dir="auto"
              className="min-h-[140px]"
              placeholder={t("inputPlaceholder")}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="zsc-labels">
              {t("labelsLabel")}
            </label>
            {labels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {labels.map((label) => (
                  <span
                    key={label}
                    dir="auto"
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                  >
                    {label}
                    <button
                      type="button"
                      aria-label={t("removeLabel")}
                      className="rounded-full p-0.5 hover:bg-background/60"
                      onClick={() => removeLabel(label)}
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input
                id="zsc-labels"
                dir="auto"
                placeholder={t("labelsPlaceholder")}
                value={labelDraft}
                onChange={(e) => setLabelDraft(e.target.value)}
                onKeyDown={onLabelKeyDown}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => commitLabels(labelDraft)}
              >
                <PlusIcon className="h-4 w-4 me-1" />
                {t("addLabel")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t("labelsHint")}</p>
          </div>

          {busy && progress && progress.status === "progress" && (
            <div className="space-y-1">
              <Progress value={progress.percent} />
              <p className="text-xs text-muted-foreground">
                {t("loadingModel")}{" "}
                <span dir="ltr">{progress.percent}%</span>
              </p>
            </div>
          )}

          {results && results.length > 0 && (
            <div className="space-y-2" data-testid="zsc-results">
              <p className="text-sm font-medium">{t("results")}</p>
              {results.map((r) => (
                <div key={r.label} className="space-y-1">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span dir="auto" className="truncate">
                      {r.label}
                    </span>
                    <span
                      className="text-muted-foreground tabular-nums"
                      dir="ltr"
                    >
                      {(r.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.round(r.score * 100)} />
                </div>
              ))}
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
    </ToolShell>
  );
}
