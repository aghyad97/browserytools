"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowRightLeft, Copy, Trash2, FileText } from "lucide-react";
import yaml from "js-yaml";
import { useTranslations } from "next-intl";

type Mode = "yaml-to-json" | "json-to-yaml";

export default function YamlJsonConverter() {
  const t = useTranslations("Tools.YamlJsonConverter");
  const tCommon = useTranslations("Common");
  const sampleYaml = useMemo(() => {
    const n = tCommon("siteName");
    return [`name: ${n}`,"version: 1.0.0","features:","  - JSON Formatter","  - YAML Converter","meta:","  author: Dev Team","active: true","count: 42"].join("\n");
  }, [tCommon]);
  const sampleJson = useMemo(() => JSON.stringify({ name: tCommon("siteName"), version: "1.0.0", features: ["JSON Formatter","YAML Converter","URL Encoder"], meta: { author: "Dev Team", license: "MIT", tags: ["tool","dev","browser"] }, active: true, count: 42 }, null, 2), [tCommon]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("yaml-to-json" as Mode);
  const [error, setError] = useState("");
  const debounceRef = useRef(null as ReturnType<typeof setTimeout>|null);

  const convert = (text: string, m: Mode): { result: string; error: string } => {
    if (!text.trim()) return { result: "", error: "" };
    try {
      if (m === "yaml-to-json") {
        const parsed = yaml.load(text);
        return { result: JSON.stringify(parsed, null, 2), error: "" };
      } else {
        const parsed = JSON.parse(text);
        return { result: yaml.dump(parsed, { indent: 2, lineWidth: -1 }), error: "" };
      }
    } catch (e) {
      return { result: "", error: e instanceof Error ? e.message : String(e) };
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const { result, error: err } = convert(input, mode);
      setOutput(result);
      setError(err);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, mode]);

  const handleConvert = () => {
    const { result, error: err } = convert(input, mode);
    setOutput(result); setError(err);
    if (err) toast.error(t("conversionFailed"));
    else toast.success(t("convertedSuccessfully"));
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
    setMode(mode === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json");
    setError("");
  };

  const handleClear = () => { setInput(""); setOutput(""); setError(""); };

  const handleCopy = async () => {
    if (!output) { toast.error(t("nothingToCopy")); return; }
    try { await navigator.clipboard.writeText(output); toast.success(t("copiedToClipboard")); }
    catch { toast.error(t("failedToCopy")); }
  };

  const handleLoadSample = () => {
    setInput(mode === "yaml-to-json" ? sampleYaml : sampleJson);
    setError("");
  };

  const modeLabel = mode === "yaml-to-json" ? t("yamlToJson") : t("jsonToYaml");
  const inputLabel = mode === "yaml-to-json" ? t("yamlInput") : t("jsonInput");
  const outputLabel = mode === "yaml-to-json" ? t("jsonOutput") : t("yamlOutput");

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleConvert}><ArrowRightLeft className="h-4 w-4 me-2" />{modeLabel}</Button>
            <Button variant="outline" onClick={handleSwap}><ArrowRightLeft className="h-4 w-4 me-2" />{t("swap")}</Button>
            <Button variant="outline" onClick={handleCopy}><Copy className="h-4 w-4 me-2" />{t("copyOutput")}</Button>
            <Button variant="outline" onClick={handleLoadSample}><FileText className="h-4 w-4 me-2" />{t("loadSample")}</Button>
            <Button variant="ghost" onClick={handleClear}><Trash2 className="h-4 w-4 me-2" />{t("clear")}</Button>
            <div className="ms-auto flex gap-2">
              <Button variant={mode === "yaml-to-json" ? "default" : "outline"} onClick={() => setMode("yaml-to-json")}>{t("yamlToJsonBtn")}</Button>
              <Button variant={mode === "json-to-yaml" ? "default" : "outline"} onClick={() => setMode("json-to-yaml")}>{t("jsonToYamlBtn")}</Button>
            </div>
          </div>
          {error && (
            <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
              <span className="font-medium">{t("error")} </span>{error}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 flex flex-col gap-2">
              <span className="text-sm font-medium">{inputLabel}</span>
              <Textarea placeholder={t("inputPlaceholder")} className="min-h-[420px] font-mono text-sm resize-none" dir="ltr" value={input} onChange={(e) => setInput(e.target.value)} />
            </Card>
            <Card className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{outputLabel}</span>
                {!error && output && <span className="text-xs text-green-600 dark:text-green-400">{t("valid")}</span>}
              </div>
              <Textarea placeholder={t("outputPlaceholder")} className="min-h-[420px] font-mono text-sm resize-none" dir="ltr" value={output} readOnly />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
