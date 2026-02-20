"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, RotateCcw, ArrowLeftRight, FileCode2 } from "lucide-react";
import { toast } from "sonner";

const SAMPLE_CSS = `/* Main layout styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Navigation */
nav .menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: #333333;
  background-color: #ffffff;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

nav .menu-item:hover {
  background-color: #f5f5f5;
}

/* Typography */
h1, h2, h3 {
  font-family: "Inter", sans-serif;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 8px;
  }
}`;

// ── Minifier ──────────────────────────────────────────────────────────────────

function minifyCss(css: string): string {
  let result = "";
  let i = 0;
  const len = css.length;

  while (i < len) {
    // Multi-line comment
    if (css[i] === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      if (end === -1) {
        i = len;
      } else {
        i = end + 2;
      }
      continue;
    }

    // Single-line comment (not standard in CSS but often tolerated)
    if (css[i] === "/" && css[i + 1] === "/") {
      const nl = css.indexOf("\n", i + 2);
      i = nl === -1 ? len : nl + 1;
      continue;
    }

    // String literals — preserve content
    if (css[i] === '"' || css[i] === "'") {
      const quote = css[i];
      result += quote;
      i++;
      while (i < len && css[i] !== quote) {
        if (css[i] === "\\") {
          result += css[i];
          i++;
        }
        if (i < len) {
          result += css[i];
          i++;
        }
      }
      if (i < len) {
        result += css[i]; // closing quote
        i++;
      }
      continue;
    }

    // Whitespace collapsing
    if (/\s/.test(css[i])) {
      // Peek: if previous non-ws and next non-ws are chars that need a space between them, keep one
      const prev = result[result.length - 1];
      let j = i;
      while (j < len && /\s/.test(css[j])) j++;
      const next = css[j];
      // Remove space around structural chars
      const structural = new Set(["{", "}", ";", ":", ",", ">", "+", "~"]);
      if (prev && structural.has(prev)) {
        i = j;
        continue;
      }
      if (next && structural.has(next)) {
        i = j;
        continue;
      }
      // Otherwise keep a single space
      if (prev && next && prev !== " ") {
        result += " ";
      }
      i = j;
      continue;
    }

    // Remove space before structural chars already in result
    if (new Set(["{", "}", ";", ":", ","]).has(css[i])) {
      if (result.endsWith(" ")) {
        result = result.slice(0, -1);
      }
    }

    result += css[i];
    i++;
  }

  // Final cleanup
  result = result
    .replace(/\s*\{\s*/g, "{")
    .replace(/\s*\}\s*/g, "}")
    .replace(/\s*;\s*/g, ";")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s*,\s*/g, ",")
    .replace(/;;+/g, ";")
    .replace(/;}/g, "}")
    .trim();

  return result;
}

// ── Beautifier ────────────────────────────────────────────────────────────────

function beautifyCss(css: string): string {
  // First strip comments and collapse whitespace
  const stripped = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "")
    .replace(/\s+/g, " ")
    .trim();

  let result = "";
  let indent = 0;
  let i = 0;
  const len = stripped.length;

  const pad = () => "  ".repeat(indent);

  while (i < len) {
    // String literals
    if (stripped[i] === '"' || stripped[i] === "'") {
      const quote = stripped[i];
      let str = quote;
      i++;
      while (i < len && stripped[i] !== quote) {
        if (stripped[i] === "\\") {
          str += stripped[i];
          i++;
        }
        if (i < len) {
          str += stripped[i];
          i++;
        }
      }
      str += quote;
      i++;
      result += str;
      continue;
    }

    if (stripped[i] === "{") {
      result = result.trimEnd() + " {\n";
      indent++;
      i++;
      // skip whitespace after {
      while (i < len && stripped[i] === " ") i++;
      continue;
    }

    if (stripped[i] === "}") {
      indent = Math.max(0, indent - 1);
      result = result.trimEnd() + "\n" + pad() + "}\n\n";
      i++;
      while (i < len && stripped[i] === " ") i++;
      continue;
    }

    if (stripped[i] === ";") {
      result = result.trimEnd() + ";\n";
      i++;
      while (i < len && stripped[i] === " ") i++;
      if (i < len && stripped[i] !== "}") {
        result += pad();
      }
      continue;
    }

    if (stripped[i] === ",") {
      // Could be selector list or value list
      // Heuristic: if we're not inside {}, it's a selector separator
      result += ",\n" + pad();
      i++;
      while (i < len && stripped[i] === " ") i++;
      continue;
    }

    if (stripped[i] === " " && result.endsWith("\n")) {
      i++;
      continue;
    }

    // Start of a new declaration line
    if (!result || result.endsWith("\n")) {
      result += pad();
    }

    result += stripped[i];
    i++;
  }

  return result.replace(/\n{3,}/g, "\n\n").trim();
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CssMinifier() {
  const [tab, setTab] = useState<"minify" | "beautify">("minify");
  const [input, setInput] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedInput, setDebouncedInput] = useState("");

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedInput(input), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  const output = useMemo(() => {
    if (!debouncedInput.trim()) return "";
    try {
      return tab === "minify" ? minifyCss(debouncedInput) : beautifyCss(debouncedInput);
    } catch {
      return "";
    }
  }, [debouncedInput, tab]);

  const stats = useMemo(() => {
    if (!debouncedInput.trim() || !output) return null;
    const before = new Blob([debouncedInput]).size;
    const after = new Blob([output]).size;
    const reduction = before > 0 ? (((before - after) / before) * 100).toFixed(1) : "0";
    return { before, after, reduction: parseFloat(reduction) };
  }, [debouncedInput, output]);

  const lineCount = useMemo(() => input.split("\n").length, [input]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `styles-${tab}.css`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  }, [output, tab]);

  const handleSwap = useCallback(() => {
    if (!output) return;
    setInput(output);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput("");
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <FileCode2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">CSS Minifier / Beautifier</h1>
            <p className="text-sm text-muted-foreground">Minify or format your CSS code instantly</p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "minify" | "beautify")}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="minify">Minify</TabsTrigger>
              <TabsTrigger value="beautify">Beautify</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setInput(SAMPLE_CSS)}>
                Sample CSS
              </Button>
              <Button variant="outline" size="sm" onClick={handleSwap} disabled={!output}>
                <ArrowLeftRight className="w-4 h-4 mr-1.5" /> Swap
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <RotateCcw className="w-4 h-4 mr-1.5" /> Clear
              </Button>
            </div>
          </div>

          {/* Stats bar */}
          {stats && (
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="secondary">Before: {stats.before} bytes</Badge>
              <Badge variant="secondary">After: {stats.after} bytes</Badge>
              {tab === "minify" && (
                <Badge
                  className={
                    stats.reduction > 0
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {stats.reduction > 0 ? `-${stats.reduction}%` : "No reduction"}
                </Badge>
              )}
            </div>
          )}

          <TabsContent value="minify" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputPanel
                value={input}
                onChange={setInput}
                lineCount={lineCount}
                placeholder="Paste your CSS here..."
              />
              <OutputPanel
                value={output}
                onCopy={handleCopy}
                onDownload={handleDownload}
                label="Minified CSS"
                placeholder="Minified CSS will appear here..."
              />
            </div>
          </TabsContent>

          <TabsContent value="beautify" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputPanel
                value={input}
                onChange={setInput}
                lineCount={lineCount}
                placeholder="Paste your CSS here..."
              />
              <OutputPanel
                value={output}
                onCopy={handleCopy}
                onDownload={handleDownload}
                label="Beautified CSS"
                placeholder="Formatted CSS will appear here..."
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function InputPanel({
  value,
  onChange,
  lineCount,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  lineCount: number;
  placeholder: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          Input CSS
          <div className="flex gap-2">
            <Badge variant="secondary">{lineCount} lines</Badge>
            <Badge variant="secondary">{value.length} chars</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex">
          {/* Line numbers */}
          <div
            className="select-none text-right pr-3 pt-2 font-mono text-xs text-muted-foreground border-r mr-3 min-w-[2.5rem] leading-5"
            aria-hidden="true"
          >
            {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-h-[50vh] font-mono text-sm resize-none bg-transparent outline-none leading-5 pt-2"
            spellCheck={false}
            aria-label="CSS input"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function OutputPanel({
  value,
  onCopy,
  onDownload,
  label,
  placeholder,
}: {
  value: string;
  onCopy: () => void;
  onDownload: () => void;
  label: string;
  placeholder: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          {label}
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={onCopy}
              disabled={!value}
              aria-label="Copy"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={onDownload}
              disabled={!value}
              aria-label="Download"
            >
              <Download className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <textarea
          value={value}
          readOnly
          placeholder={placeholder}
          className="w-full min-h-[50vh] font-mono text-sm resize-none bg-transparent outline-none leading-5 pt-2"
          aria-label="CSS output"
        />
      </CardContent>
    </Card>
  );
}
