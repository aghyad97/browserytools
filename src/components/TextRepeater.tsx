"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard } from "@/components/shared/SettingsCard";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { downloadBlob } from "@/lib/download";

const MAX_OUTPUT_CHARS = 1_000_000;

type SeparatorPreset = "newline" | "space" | "comma" | "pipe" | "none" | "custom";

export default function TextRepeater() {
  const t = useTranslations("Tools.TextRepeater");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const SEPARATOR_PRESETS: { labelKey: string; key: SeparatorPreset; value: string }[] = [
    { labelKey: "sepNewline", key: "newline", value: "\n" },
    { labelKey: "sepSpace", key: "space", value: " " },
    { labelKey: "sepComma", key: "comma", value: ", " },
    { labelKey: "sepPipe", key: "pipe", value: " | " },
    { labelKey: "sepNone", key: "none", value: "" },
  ];

  const [text, setText] = useState("");
  const [count, setCount] = useState(5);
  const [separatorPreset, setSeparatorPreset] = useState<SeparatorPreset>("newline");
  const [customSeparator, setCustomSeparator] = useState("");

  const separator = useMemo(() => {
    if (separatorPreset === "custom") return customSeparator;
    return SEPARATOR_PRESETS.find((p) => p.key === separatorPreset)?.value ?? "\n";
  }, [separatorPreset, customSeparator]);

  const { output, overLimit } = useMemo(() => {
    if (!text || count < 1) return { output: "", overLimit: false };
    const sep = separator;
    const estimatedLength = text.length * count + sep.length * (count - 1);
    if (estimatedLength > MAX_OUTPUT_CHARS) {
      return { output: "", overLimit: true };
    }
    const repeated = Array(count).fill(text).join(sep);
    return { output: repeated, overLimit: false };
  }, [text, count, separator]);

  const outputLines = useMemo(
    () => (output ? output.split("\n").length : 0),
    [output]
  );

  const handleCountChange = useCallback((raw: string) => {
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n >= 1 && n <= 10000) {
      setCount(n);
    } else if (raw === "") {
      setCount(1);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (!output) {
      toast.error(t("nothingToDownload"));
      return;
    }
    downloadBlob(new Blob([output], { type: "text/plain" }), "repeated-text.txt");
    toast.success(t("downloaded"));
  }, [output, t]);

  const handleClear = useCallback(() => {
    setText("");
    setCount(5);
    setSeparatorPreset("newline");
    setCustomSeparator("");
  }, []);

  return (
    <ToolShell
      slug="text-repeater"
      title={tc("tools.text-repeater.name")}
      sub={tc("tools.text-repeater.description")}
      primaryAction={{
        label: tCommon("download"),
        onClick: handleDownload,
        disabled: !output || overLimit,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <SettingsCard title={t("textToRepeatTitle")} description={t("textToRepeatDesc")}>
            <Textarea
              placeholder={t("textPlaceholder")}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[140px] resize-none"
              rows={6}
            />
            <div>
              <Badge variant="secondary">{text.length} {t("chars")}</Badge>
            </div>
          </SettingsCard>

          <SettingsCard title={t("repeatCountTitle")} description={t("repeatCountDesc")}>
            <Input
              type="number"
              min={1}
              max={10000}
              value={count}
              onChange={(e) => handleCountChange(e.target.value)}
              className="text-lg h-11"
            />
          </SettingsCard>

          <SettingsCard title={t("separatorTitle")} description={t("separatorDesc")}>
            <div className="flex flex-wrap gap-2">
              {SEPARATOR_PRESETS.map((p) => (
                <Button
                  key={p.key}
                  size="sm"
                  variant={separatorPreset === p.key ? "default" : "outline"}
                  onClick={() => setSeparatorPreset(p.key)}
                >
                  {t(p.labelKey as any)}
                </Button>
              ))}
              <Button
                size="sm"
                variant={separatorPreset === "custom" ? "default" : "outline"}
                onClick={() => setSeparatorPreset("custom")}
              >
                {t("customBtn")}
              </Button>
            </div>

            {separatorPreset === "custom" && (
              <div className="space-y-1.5">
                <Label htmlFor="custom-sep" className="text-sm">
                  {t("customSeparatorLabel")}
                </Label>
                <Input
                  id="custom-sep"
                  value={customSeparator}
                  onChange={(e) => setCustomSeparator(e.target.value)}
                  placeholder={t("customSeparatorPlaceholder")}
                  className="font-mono"
                />
              </div>
            )}
          </SettingsCard>

          <Button
            variant="outline"
            onClick={handleClear}
            className="w-full flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {t("clearAll")}
          </Button>
        </div>

        {/* Output */}
        <div className="lg:col-span-2">
          <OutputPanel
            text={overLimit ? "" : output}
            title={t("outputTitle")}
            copySuccessMessage={t("copiedToClipboard")}
            className="h-full"
          >
            <p className="text-sm text-muted-foreground px-1 pt-1">
              {overLimit
                ? t("outputTooLarge")
                : output
                ? t("repeatedCount", { count })
                : t("resultPlaceholder")}
            </p>
            {overLimit ? (
              <div className="min-h-[400px] flex items-center justify-center rounded-md bg-destructive/5 border border-destructive/20 m-1">
                <div className="text-center p-6 space-y-2">
                  <p className="font-semibold text-destructive">
                    {t("outputTooLargeTitle")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("outputTooLargeDesc")}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Textarea
                  value={output}
                  readOnly
                  placeholder={t("outputPlaceholder")}
                  className="min-h-[400px] resize-none rounded-none border-0 bg-transparent font-mono text-sm focus-visible:ring-0"
                  rows={18}
                />
                <div className="flex gap-3 px-1 pb-1 flex-wrap">
                  <Badge variant="secondary">{output.length} {t("chars")}</Badge>
                  <Badge variant="secondary">{outputLines} {t("lines")}</Badge>
                </div>
              </>
            )}
          </OutputPanel>
        </div>
      </div>
    </ToolShell>
  );
}
