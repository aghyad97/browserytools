"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowRightLeft, Trash2, FileText } from "lucide-react";
import yaml from "js-yaml";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { TwoPane } from "@/components/shared/TwoPane";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { ModePicker } from "@/components/shared/ModePicker";

type Mode = "yaml-to-json" | "json-to-yaml";

export default function YamlJsonConverter() {
  const t = useTranslations("Tools.YamlJsonConverter");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");
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

  const handleLoadSample = () => {
    setInput(mode === "yaml-to-json" ? sampleYaml : sampleJson);
    setError("");
  };

  const modeLabel = mode === "yaml-to-json" ? t("yamlToJson") : t("jsonToYaml");
  const inputLabel = mode === "yaml-to-json" ? t("yamlInput") : t("jsonInput");
  const outputLabel = mode === "yaml-to-json" ? t("jsonOutput") : t("yamlOutput");

  return (
    <ToolShell
      slug="yaml-json"
      title={tc("tools.yaml-json.name")}
      sub={tc("tools.yaml-json.description")}
    >
      <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleConvert}><ArrowRightLeft className="h-4 w-4 me-2" />{modeLabel}</Button>
            <Button variant="outline" onClick={handleSwap}><ArrowRightLeft className="h-4 w-4 me-2" />{t("swap")}</Button>
            <Button variant="outline" onClick={handleLoadSample}><FileText className="h-4 w-4 me-2" />{t("loadSample")}</Button>
            <Button variant="ghost" onClick={handleClear}><Trash2 className="h-4 w-4 me-2" />{t("clear")}</Button>
            <ModePicker
              aria-label={modeLabel}
              className="ms-auto"
              value={mode}
              onChange={setMode}
              options={[
                { value: "yaml-to-json", label: t("yamlToJsonBtn") },
                { value: "json-to-yaml", label: t("jsonToYamlBtn") },
              ]}
            />
          </div>
          {error && (
            <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
              <span className="font-medium">{t("error")} </span>{error}
            </div>
          )}
          <TwoPane
            start={
              <Card className="p-4 flex flex-col gap-2">
                <span className="text-sm font-medium">{inputLabel}</span>
                <Textarea placeholder={t("inputPlaceholder")} className="min-h-[420px] font-mono text-sm resize-none" dir="ltr" value={input} onChange={(e) => setInput(e.target.value)} />
              </Card>
            }
            end={
              <OutputPanel
                text={output}
                title={
                  <>
                    {outputLabel}
                    {!error && output ? ` · ${t("valid")}` : ""}
                  </>
                }
                copySuccessMessage={t("copiedToClipboard")}
                copyErrorMessage={t("failedToCopy")}
              >
                <Textarea placeholder={t("outputPlaceholder")} className="min-h-[420px] rounded-none border-0 bg-transparent font-mono text-sm resize-none focus-visible:ring-0" dir="ltr" value={output} readOnly />
              </OutputPanel>
            }
          />
      </div>
    </ToolShell>
  );
}
