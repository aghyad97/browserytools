"use client";

import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowRightLeft, InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { TwoPane } from "@/components/shared/TwoPane";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { getPipeline, type LoadProgress } from "@/lib/hf-pipeline";

const MODEL = "Xenova/m2m100_418M";

// m2m100 language codes. Labels are shown in the UI; codes are passed to the model.
const LANGUAGES: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "hi", label: "हिन्दी" },
  { code: "tr", label: "Türkçe" },
  { code: "nl", label: "Nederlands" },
  { code: "fa", label: "فارسی" },
];

type TranslatorPipe = (
  text: string,
  options: { src_lang: string; tgt_lang: string }
) => Promise<{ translation_text: string }[]>;

export default function Translator() {
  const t = useTranslations("Tools.Translator");
  const tc = useTranslations("ToolsConfig");

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [source, setSource] = useState("en");
  const [target, setTarget] = useState("ar");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<LoadProgress | null>(null);

  const swap = useCallback(() => {
    setSource(target);
    setTarget(source);
    setInput(output);
    setOutput(input);
  }, [source, target, input, output]);

  const translate = useCallback(async () => {
    if (!input.trim()) {
      toast.error(t("enterText"));
      return;
    }
    if (source === target) {
      toast.error(t("sameLanguage"));
      return;
    }
    setBusy(true);
    setOutput("");
    try {
      const translator = await getPipeline<TranslatorPipe>(
        "translation",
        MODEL,
        // q8 quantization keeps the ~400M-param model within browser memory
        // (full precision triggers std::bad_alloc / OOM, esp. on WebGPU).
        { device: "auto", dtype: "q8", onProgress: setProgress }
      );
      const out = await translator(input, {
        src_lang: source,
        tgt_lang: target,
      });
      setOutput(out[0]?.translation_text ?? "");
    } catch (err) {
      console.error(err);
      toast.error(t("failed"));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [input, source, target, t]);

  return (
    <ToolShell
      slug="translator"
      title={tc("tools.translator.name")}
      sub={tc("tools.translator.description")}
      primaryAction={{
        label: busy ? t("translating") : t("translate"),
        onClick: translate,
        disabled: busy,
      }}
    >
      <div className="space-y-4">
        <Card className="p-4 space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium" htmlFor="tr-source">
                {t("from")}
              </label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger id="tr-source" aria-label={t("from")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={swap}
              aria-label={t("swap")}
              title={t("swap")}
              className="mb-0.5"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium" htmlFor="tr-target">
                {t("to")}
              </label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger id="tr-target" aria-label={t("to")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TwoPane
            start={
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="tr-input">
                  {t("inputLabel")}
                </label>
                <Textarea
                  id="tr-input"
                  dir="auto"
                  className="min-h-[200px]"
                  placeholder={t("inputPlaceholder")}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            }
            end={
              <OutputPanel
                text={output}
                title={t("outputLabel")}
                copyLabel={t("copy")}
                copySuccessMessage={t("copied")}
                copyErrorMessage={t("copyFailed")}
              >
                <Textarea
                  id="tr-output"
                  dir="auto"
                  className="min-h-[200px] rounded-none border-0 bg-transparent focus-visible:ring-0"
                  placeholder={t("outputPlaceholder")}
                  value={output}
                  readOnly
                  data-testid="translator-output"
                />
              </OutputPanel>
            }
          />

          {busy && progress && progress.status === "progress" && (
            <div className="space-y-1">
              <Progress value={progress.percent} />
              <p className="text-xs text-muted-foreground">
                {t("loadingModel")}{" "}
                <span dir="ltr">{progress.percent}%</span>
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
    </ToolShell>
  );
}
