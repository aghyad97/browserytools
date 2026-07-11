"use client";

import { useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";
import { toast } from "sonner";
import { Trash2, CheckCircle2, XCircle, Minimize2, FlaskConical, FileJson } from "lucide-react";
import { useTranslations } from "next-intl";

type ValidationState = "idle" | "valid" | "invalid";
type IndentSize = "2" | "4";

function sortKeysDeep(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortKeysDeep);
  if (obj !== null && typeof obj === "object") {
    const rec = obj as {[k:string]:unknown};
    return Object.keys(rec).sort().reduce((acc:{[k:string]:unknown},key)=>{
      acc[key] = sortKeysDeep(rec[key]); return acc;
    }, {});
  }
  return obj;
}

function getJsonStats(input: string): { chars: number; keys: number } | null {
  try {
    const parsed = JSON.parse(input);
    let keys = 0;
    const countKeys = (v: unknown) => {
      if (Array.isArray(v)) v.forEach(countKeys);
      else if (v !== null && typeof v === "object") {
        const e = Object.entries(v as object);
        keys += e.length;
        e.forEach(([,val]) => countKeys(val));
      }
    };
    countKeys(parsed);
    return { chars: input.length, keys };
  } catch { return null; }
}

function findErrorLine(input: string, msg: string): number | null {
  const m1 = msg.match(/position (\d+)/i);
  if (m1) { const pos = parseInt(m1[1],10); return input.substring(0,pos).split("\n").length; }
  const m2 = msg.match(/line (\d+)/i);
  if (m2) return parseInt(m2[1],10);
  return null;
}

export default function JsonFormatter() {
  const t = useTranslations("Tools.JsonFormatter");
  const tc = useTranslations("ToolsConfig");
  const tCommon = useTranslations("Common");
  const sampleJson = useMemo(() => JSON.stringify({
    name: tCommon("siteName"),
    version: "1.0.0",
    features: ["JSON Formatter","YAML Converter","URL Encoder"],
    meta: { author: "Dev Team", license: "MIT", tags: ["tool","dev","browser"] },
    active: true,
    count: 42,
  }, null, 2), [tCommon]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState("2" as IndentSize);
  const [sortKeys, setSortKeys] = useState(false);
  const [validationState, setValidationState] = useState("idle" as ValidationState);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorLine, setErrorLine] = useState(null as number|null);

  const resetError = useCallback(() => {
    setValidationState("idle"); setErrorMessage(""); setErrorLine(null);
  }, []);

  const handleFormat = () => {
    if (!input.trim()) { toast.error(t("enterJsonInput")); return; }
    try {
      let parsed = JSON.parse(input);
      if (sortKeys) parsed = sortKeysDeep(parsed);
      setOutput(JSON.stringify(parsed, null, parseInt(indentSize, 10)));
      setValidationState("valid"); setErrorMessage(""); setErrorLine(null);
      toast.success(t("formattedSuccess"));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setOutput(""); setValidationState("invalid");
      setErrorMessage(msg); setErrorLine(findErrorLine(input, msg));
      toast.error(t("invalidJson"));
    }
  };

  const handleMinify = () => {
    if (!input.trim()) { toast.error(t("enterJsonInput")); return; }
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setValidationState("valid"); setErrorMessage(""); setErrorLine(null);
      toast.success(t("minifiedSuccess"));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setOutput(""); setValidationState("invalid");
      setErrorMessage(msg); setErrorLine(findErrorLine(input, msg));
      toast.error(t("invalidJson"));
    }
  };

  const handleValidate = () => {
    if (!input.trim()) { toast.error(t("enterJsonInput")); return; }
    try {
      JSON.parse(input);
      setValidationState("valid"); setErrorMessage(""); setErrorLine(null);
      toast.success(t("isValid"));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setValidationState("invalid");
      setErrorMessage(msg); setErrorLine(findErrorLine(input, msg));
      toast.error(t("invalidJson"));
    }
  };

  const handleClear = () => { setInput(""); setOutput(""); resetError(); };

  const handleLoadSample = () => { setInput(sampleJson); setOutput(""); resetError(); };
  const stats = getJsonStats(input);
  const copyText = output || input;

  return (
    <ToolShell
      slug="json-formatter"
      title={tc("tools.json-formatter.name")}
      sub={tc("tools.json-formatter.description")}
      controls={
        <>
          <Button variant="outline" onClick={handleMinify}><Minimize2 className="h-4 w-4 me-2" />{t("minify")}</Button>
          <Button variant="outline" onClick={handleValidate}><FlaskConical className="h-4 w-4 me-2" />{t("validate")}</Button>
          {/* Persistent affordance, inert while there is nothing to copy.
              (Tools.JsonFormatter.nothingToCopy is now unused — cleanup.) */}
          <CopyButton
            text={copyText}
            label={t("copy")}
            successMessage={t("copiedToClipboard")}
            errorMessage={t("failedToCopy")}
            disabled={!copyText}
          />
          <Button variant="outline" onClick={handleLoadSample}><FileJson className="h-4 w-4 me-2" />{t("loadSample")}</Button>
          <Button variant="ghost" onClick={handleClear}><Trash2 className="h-4 w-4 me-2" />{t("clear")}</Button>
          <div className="flex items-center gap-2 flex-wrap">
            <Label htmlFor="indent-select" className="text-sm text-muted-foreground whitespace-nowrap">{t("indent")}</Label>
            <Select value={indentSize} onValueChange={(v) => setIndentSize(v as IndentSize)}>
              <SelectTrigger id="indent-select" className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Switch id="sort-keys" checked={sortKeys} onCheckedChange={setSortKeys} />
              <Label htmlFor="sort-keys" className="text-sm text-muted-foreground whitespace-nowrap">{t("sortKeys")}</Label>
            </div>
          </div>
        </>
      }
      primaryAction={{ label: t("format"), onClick: handleFormat }}
    >
      <div className="space-y-4">
        {validationState !== "idle" && (
          <div className={`flex items-start gap-2 rounded-md px-4 py-3 text-sm ${validationState === "valid" ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200" : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"}`}>
            {validationState === "valid"
              ? <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              : <XCircle className="h-4 w-4 mt-0.5 shrink-0" />}
            <div>
              {validationState === "valid" ? t("validJson") : (
                <><span className="font-medium">{t("parseError")} </span>{errorMessage}
                {errorLine !== null && <span className="ms-1">{t("nearLine", { line: errorLine })}</span>}
                </>
              )}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("input")}</span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {input && <span>{input.length} {t("chars")}</span>}
                {stats && <span>{stats.keys} {t("keys")}</span>}
              </div>
            </div>
            <Textarea
              placeholder={t("inputPlaceholder")}
              className="min-h-[420px] font-mono text-sm resize-none text-left"
              dir="ltr"
              value={input}
              onChange={(e) => { setInput(e.target.value); resetError(); }}
            />
          </Card>
          <Card className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("output")}</span>
              {output && <span className="text-xs text-muted-foreground">{output.length} {t("chars")}</span>}
            </div>
            <Textarea
              placeholder={t("outputPlaceholder")}
              className="min-h-[420px] font-mono text-sm resize-none text-left"
              dir="ltr"
              value={output}
              readOnly
            />
          </Card>
        </div>
      </div>
    </ToolShell>
  );
}
