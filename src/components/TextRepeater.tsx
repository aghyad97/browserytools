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

const MAX_OUTPUT_CHARS = 1_000_000;

type SeparatorPreset = "newline" | "space" | "comma" | "pipe" | "none" | "custom";

export default function TextRepeater() {
  const t = useTranslations("Tools.TextRepeater");
  const tCommon = useTranslations("Common");

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

  const handleCopy = useCallback(() => {
    if (!output) {
      toast.error(t("nothingToCopy"));
      return;
    }
    navigator.clipboard.writeText(output);
    toast.success(t("copiedToClipboard"));
  }, [output, t]);

  const handleDownload = useCallback(() => {
    if (!output) {
      toast.error(t("nothingToDownload"));
      return;
    }
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "repeated-text.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("downloaded"));
  }, [output, t]);

  const handleClear = useCallback(() => {
    setText("");
    setCount(5);
    setSeparatorPreset("newline");
    setCustomSeparator("");
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("textToRepeatTitle")}</CardTitle>
              <CardDescription>{t("textToRepeatDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t("textPlaceholder")}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[140px] resize-none"
                rows={6}
              />
              <div className="mt-2">
                <Badge variant="secondary">{text.length} {t("chars")}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("repeatCountTitle")}</CardTitle>
              <CardDescription>{t("repeatCountDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                min={1}
                max={10000}
                value={count}
                onChange={(e) => handleCountChange(e.target.value)}
                className="text-lg h-11"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("separatorTitle")}</CardTitle>
              <CardDescription>{t("separatorDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
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
            </CardContent>
          </Card>

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
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle>{t("outputTitle")}</CardTitle>
                  <CardDescription>
                    {overLimit
                      ? t("outputTooLarge")
                      : output
                      ? t("repeatedCount", { count })
                      : t("resultPlaceholder")}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!output || overLimit}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {tCommon("download")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCopy}
                    disabled={!output || overLimit}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {tCommon("copy")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {overLimit ? (
                <div className="min-h-[400px] flex items-center justify-center border rounded-md bg-destructive/5 border-destructive/20">
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
                <Textarea
                  value={output}
                  readOnly
                  placeholder={t("outputPlaceholder")}
                  className="min-h-[400px] resize-none font-mono text-sm bg-muted"
                  rows={18}
                />
              )}

              {!overLimit && (
                <div className="flex gap-3 mt-3 flex-wrap">
                  <Badge variant="secondary">{output.length} {t("chars")}</Badge>
                  <Badge variant="secondary">{outputLines} {t("lines")}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
