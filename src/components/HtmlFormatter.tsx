"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy, Download, RotateCcw, Code2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const SAMPLE_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Sample</title></head><body><h1>Hello World</h1><p>This is a <strong>sample</strong> HTML document.</p><ul><li>Item 1</li><li>Item 2</li></ul></body></html>`;

function formatHtml(html: string, indent: number): string {
  const voidElements = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
  ]);
  const inlineElements = new Set([
    "a", "abbr", "acronym", "b", "bdo", "big", "br", "button", "cite",
    "code", "dfn", "em", "i", "img", "input", "kbd", "label", "map",
    "object", "output", "q", "s", "samp", "select", "small", "span",
    "strong", "sub", "sup", "textarea", "time", "tt", "u", "var",
  ]);

  const pad = " ".repeat(indent);
  let result = "";
  let level = 0;

  // Simple tokenizer
  const tokens = html
    .replace(/>\s*</g, "><")
    .replace(/<!--[\s\S]*?-->/g, (m) => m.trim())
    .split(/(<[^>]+>)/g)
    .filter(Boolean);

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("</")) {
      // Closing tag
      const tagName = trimmed.slice(2, trimmed.indexOf(">")).toLowerCase();
      if (!inlineElements.has(tagName)) level = Math.max(0, level - 1);
      result += pad.repeat(level) + trimmed + "\n";
    } else if (trimmed.startsWith("<")) {
      // Opening or self-closing tag
      const match = trimmed.match(/^<([a-zA-Z0-9-]+)/);
      const tagName = match ? match[1].toLowerCase() : "";
      const isSelfClosing = trimmed.endsWith("/>") || voidElements.has(tagName);
      const isInline = inlineElements.has(tagName);

      result += pad.repeat(level) + trimmed + "\n";
      if (!isSelfClosing && !isInline) level++;
    } else {
      // Text node
      result += pad.repeat(level) + trimmed + "\n";
    }
  }

  return result.trimEnd();
}

function minifyHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .replace(/\s+>/g, ">")
    .replace(/<\s+/g, "<")
    .trim();
}

export default function HtmlFormatter() {
  const t = useTranslations("Tools.HtmlFormatter");
  const tCommon = useTranslations("Common");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [error, setError] = useState("");

  const handleProcess = () => {
    if (!input.trim()) {
      toast.error(t("enterHtmlToProcess"));
      return;
    }
    setError("");
    try {
      const result = mode === "format"
        ? formatHtml(input, indentSize)
        : minifyHtml(input);
      setOutput(result);
      toast.success(mode === "format" ? t("htmlFormatted") : t("htmlMinified"));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Processing failed";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success(t("copiedToClipboard"));
    } catch {
      toast.error(t("failedToCopy"));
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formatted-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("downloaded"));
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            <Button
              variant={mode === "format" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("format")}
            >
              {t("formatButton")}
            </Button>
            <Button
              variant={mode === "minify" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("minify")}
            >
              {t("minifyButton")}
            </Button>
          </div>

          {mode === "format" && (
            <div className="flex items-center gap-2">
              <Label className="text-sm">{t("indentSize")}</Label>
              <Input
                type="number"
                min={1}
                max={8}
                value={indentSize}
                onChange={(e) => setIndentSize(Math.max(1, Math.min(8, Number(e.target.value))))}
                className="w-20 h-8"
              />
            </div>
          )}

          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setInput(SAMPLE_HTML)}>
              {t("loadSample")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              <RotateCcw className="w-4 h-4 me-1.5" /> {tCommon("clear")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {t("inputHtml")}
                <Badge variant="secondary">{input.length} chars</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("htmlInputPlaceholder")}
                className="min-h-[50vh] font-mono text-sm resize-none text-left rtl:text-left"
                aria-label="HTML input"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {t("outputLabel")}
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCopy} disabled={!output} aria-label="Copy">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleDownload} disabled={!output} aria-label="Download">
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-destructive text-sm p-3 rounded bg-destructive/10">{error}</div>
              ) : (
                <Textarea
                  value={output}
                  readOnly
                  placeholder={t("htmlOutputPlaceholder")}
                  className="min-h-[50vh] font-mono text-sm resize-none text-left rtl:text-left"
                  aria-label="HTML output"
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleProcess} disabled={!input.trim()} size="lg">
            {mode === "format" ? t("formatHtml") : t("minifyHtml")}
          </Button>
        </div>
      </div>
    </div>
  );
}
