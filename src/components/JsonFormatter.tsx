"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Trash2, CheckCircle2, XCircle, AlignLeft, Minimize2, FlaskConical, FileJson } from "lucide-react";

const SAMPLE_JSON = JSON.stringify({
  name: "BrowseryTools",
  version: "1.0.0",
  features: ["JSON Formatter","YAML Converter","URL Encoder"],
  meta: { author: "Dev Team", license: "MIT", tags: ["tool","dev","browser"] },
  active: true,
  count: 42,
}, null, 2);

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
    if (!input.trim()) { toast.error("Please enter JSON input"); return; }
    try {
      let parsed = JSON.parse(input);
      if (sortKeys) parsed = sortKeysDeep(parsed);
      setOutput(JSON.stringify(parsed, null, parseInt(indentSize, 10)));
      setValidationState("valid"); setErrorMessage(""); setErrorLine(null);
      toast.success("JSON formatted successfully");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setOutput(""); setValidationState("invalid");
      setErrorMessage(msg); setErrorLine(findErrorLine(input, msg));
      toast.error("Invalid JSON");
    }
  };

  const handleMinify = () => {
    if (!input.trim()) { toast.error("Please enter JSON input"); return; }
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setValidationState("valid"); setErrorMessage(""); setErrorLine(null);
      toast.success("JSON minified");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setOutput(""); setValidationState("invalid");
      setErrorMessage(msg); setErrorLine(findErrorLine(input, msg));
      toast.error("Invalid JSON");
    }
  };

  const handleValidate = () => {
    if (!input.trim()) { toast.error("Please enter JSON input"); return; }
    try {
      JSON.parse(input);
      setValidationState("valid"); setErrorMessage(""); setErrorLine(null);
      toast.success("JSON is valid");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setValidationState("invalid");
      setErrorMessage(msg); setErrorLine(findErrorLine(input, msg));
      toast.error("Invalid JSON");
    }
  };

  const handleClear = () => { setInput(""); setOutput(""); resetError(); };

  const handleCopy = async () => {
    const text = output || input;
    if (!text) { toast.error("Nothing to copy"); return; }
    try { await navigator.clipboard.writeText(text); toast.success("Copied to clipboard"); }
    catch { toast.error("Failed to copy to clipboard"); }
  };

  const handleLoadSample = () => { setInput(SAMPLE_JSON); setOutput(""); resetError(); };
  const stats = getJsonStats(input);

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleFormat}><AlignLeft className="h-4 w-4 mr-2" />Format</Button>
            <Button variant="outline" onClick={handleMinify}><Minimize2 className="h-4 w-4 mr-2" />Minify</Button>
            <Button variant="outline" onClick={handleValidate}><FlaskConical className="h-4 w-4 mr-2" />Validate</Button>
            <Button variant="outline" onClick={handleCopy}><Copy className="h-4 w-4 mr-2" />Copy</Button>
            <Button variant="outline" onClick={handleLoadSample}><FileJson className="h-4 w-4 mr-2" />Load Sample</Button>
            <Button variant="ghost" onClick={handleClear}><Trash2 className="h-4 w-4 mr-2" />Clear</Button>
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              <Label htmlFor="indent-select" className="text-sm text-muted-foreground whitespace-nowrap">Indent:</Label>
              <Select value={indentSize} onValueChange={(v) => setIndentSize(v as IndentSize)}>
                <SelectTrigger id="indent-select" className="w-[100px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 spaces</SelectItem>
                  <SelectItem value="4">4 spaces</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Switch id="sort-keys" checked={sortKeys} onCheckedChange={setSortKeys} />
                <Label htmlFor="sort-keys" className="text-sm text-muted-foreground whitespace-nowrap">Sort keys</Label>
              </div>
            </div>
          </div>
          {validationState !== "idle" && (
            <div className={`flex items-start gap-2 rounded-md px-4 py-3 text-sm ${validationState === "valid" ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200" : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"}`}>
              {validationState === "valid"
                ? <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                : <XCircle className="h-4 w-4 mt-0.5 shrink-0" />}
              <div>
                {validationState === "valid" ? "JSON is valid" : (
                  <><span className="font-medium">Parse error: </span>{errorMessage}
                  {errorLine !== null && <span className="ml-1">(near line {errorLine})</span>}
                  </>
                )}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Input</span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {input && <span>{input.length} chars</span>}
                  {stats && <span>{stats.keys} keys</span>}
                </div>
              </div>
              <Textarea
                placeholder="Paste your JSON here..."
                className="min-h-[420px] font-mono text-sm resize-none"
                value={input}
                onChange={(e) => { setInput(e.target.value); resetError(); }}
              />
            </Card>
            <Card className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Output</span>
                {output && <span className="text-xs text-muted-foreground">{output.length} chars</span>}
              </div>
              <Textarea
                placeholder="Formatted output will appear here..."
                className="min-h-[420px] font-mono text-sm resize-none"
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
