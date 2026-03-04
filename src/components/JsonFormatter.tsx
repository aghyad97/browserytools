"use client";

import { useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Trash2, CheckCircle2, XCircle, AlignLeft, Minimize2, FlaskConical, FileJson } from "lucide-react";
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

  const handleCopy = async () => {
    const text = output || input;
    if (!text) { toast.error(t("nothingToCopy")); return; }
    try { await navigator.clipboard.writeText(text); toast.success(t("copiedToClipboard")); }
    catch { toast.error(t("failedToCopy")); }
  };

  const handleLoadSample = () => { setInput(sampleJson); setOutput(""); resetError(); };
  const stats = getJsonStats(input);

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleFormat}><AlignLeft className="h-4 w-4 me-2" />{t("format")}</Button>
            <Button variant="outline" onClick={handleMinify}><Minimize2 className="h-4 w-4 me-2" />{t("minify")}</Button>
            <Button variant="outline" onClick={handleValidate}><FlaskConical className="h-4 w-4 me-2" />{t("validate")}</Button>
            <Button variant="outline" onClick={handleCopy}><Copy className="h-4 w-4 me-2" />{t("copy")}</Button>
            <Button variant="outline" onClick={handleLoadSample}><FileJson className="h-4 w-4 me-2" />{t("loadSample")}</Button>
            <Button variant="ghost" onClick={handleClear}><Trash2 className="h-4 w-4 me-2" />{t("clear")}</Button>
            <div className="flex items-center gap-2 ms-auto flex-wrap">
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
          </div>
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
      </div>
    </div>
  );
}
