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
import { Badge } from "@/components/ui/badge";
import { Copy, Download, RotateCcw, Eye, Code, FileText } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

// ─── Markdown Parser ────────────────────────────────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseInline(text: string): string {
  return (
    text
      // Code spans (before other inline to avoid double-processing)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      // Bold + italic (order: longest first)
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/___(.+?)___/g, "<strong><em>$1</em></strong>")
      // Bold
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
      // Strikethrough
      .replace(/~~(.+?)~~/g, "<del>$1</del>")
      // Images (before links)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  );
}

function parseMarkdown(md: string): string {
  const lines = md.split("\n");
  const output: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code blocks
    if (/^```/.test(line)) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        codeLines.push(escapeHtml(lines[i]));
        i++;
      }
      const langAttr = lang ? ` class="language-${lang}"` : "";
      output.push(`<pre><code${langAttr}>${codeLines.join("\n")}</code></pre>`);
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      output.push(`<h${level}>${parseInline(headingMatch[2])}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      output.push("<hr />");
      i++;
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      output.push(`<blockquote>${parseMarkdown(quoteLines.join("\n"))}</blockquote>`);
      continue;
    }

    // Unordered list
    if (/^[-*+]\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        listItems.push(
          `<li>${parseInline(lines[i].replace(/^[-*+]\s/, ""))}</li>`
        );
        i++;
      }
      output.push(`<ul>${listItems.join("")}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(
          `<li>${parseInline(lines[i].replace(/^\d+\.\s/, ""))}</li>`
        );
        i++;
      }
      output.push(`<ol>${listItems.join("")}</ol>`);
      continue;
    }

    // Table
    if (line.includes("|") && i + 1 < lines.length && /^\|?[-| :]+\|?$/.test(lines[i + 1])) {
      const headerCells = line
        .split("|")
        .map((c) => c.trim())
        .filter((c, idx, arr) => idx > 0 || c !== "")
        .filter((c, idx, arr) => idx < arr.length - 1 || c !== "");
      i += 2; // skip header and separator
      const bodyRows: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        const cells = lines[i]
          .split("|")
          .map((c) => c.trim())
          .filter((c, idx, arr) => idx > 0 || c !== "")
          .filter((c, idx, arr) => idx < arr.length - 1 || c !== "");
        bodyRows.push(
          `<tr>${cells.map((c) => `<td>${parseInline(c)}</td>`).join("")}</tr>`
        );
        i++;
      }
      const thead = `<thead><tr>${headerCells.map((c) => `<th>${parseInline(c)}</th>`).join("")}</tr></thead>`;
      const tbody = bodyRows.length > 0 ? `<tbody>${bodyRows.join("")}</tbody>` : "";
      output.push(`<table>${thead}${tbody}</table>`);
      continue;
    }

    // Empty line — paragraph break
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph: collect consecutive non-special lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^[-*+]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      output.push(`<p>${parseInline(paraLines.join(" "))}</p>`);
    }
  }

  return output.join("\n");
}

// ─── Sample Markdown ────────────────────────────────────────────────────────

const SAMPLE_MARKDOWN = `# Welcome to Markdown to HTML

## Features

This converter supports **bold**, *italic*, ~~strikethrough~~, and \`inline code\`.

### Links and Images

[Visit BrowseryTools](https://browserytools.com) — your favorite browser toolbox.

### Lists

- Item one
- Item two
- Item three

1. First step
2. Second step
3. Third step

### Blockquotes

> "The best tools are the ones you don't have to think about."

### Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Table

| Name     | Role      | Status  |
|----------|-----------|---------|
| Alice    | Developer | Active  |
| Bob      | Designer  | Active  |
| Charlie  | Manager   | Away    |

---

Paragraphs are separated by blank lines and rendered correctly.
`;

// ─── Component ───────────────────────────────────────────────────────────────

export default function MarkdownToHtml() {
  const t = useTranslations("Tools.MarkdownToHtml");
  const tCommon = useTranslations("Common");
  const [markdown, setMarkdown] = useState("");
  const [viewMode, setViewMode] = useState<"preview" | "source">("preview");

  const html = useMemo(() => parseMarkdown(markdown), [markdown]);

  const charCount = markdown.length;
  const wordCount = markdown.trim()
    ? markdown.trim().split(/\s+/).length
    : 0;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const handleCopyHtml = useCallback(() => {
    if (!html.trim()) {
      toast.error(t("nothingToCopy"));
      return;
    }
    navigator.clipboard.writeText(html);
    toast.success(t("htmlCopied"));
  }, [html, t]);

  const handleDownload = useCallback(() => {
    if (!html.trim()) {
      toast.error(t("nothingToDownload"));
      return;
    }
    const fullHtml = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Converted Document</title>\n</head>\n<body>\n${html}\n</body>\n</html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("downloadedHtml"));
  }, [html, t]);

  const handleClear = useCallback(() => setMarkdown(""), []);

  const handleLoadSample = useCallback(
    () => setMarkdown(SAMPLE_MARKDOWN),
    []
  );

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadSample}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {t("loadSample")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {tCommon("clear")}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyHtml}
            disabled={!html.trim()}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {t("copyHtml")}
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={!html.trim()}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t("downloadHtml")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Markdown Input */}
        <Card>
          <CardHeader>
            <CardTitle>{t("markdownInputTitle")}</CardTitle>
            <CardDescription>
              {t("markdownInputDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t("markdownPlaceholder")}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[480px] resize-none font-mono text-sm text-left rtl:text-left"
              rows={22}
            />
            <div className="flex gap-3 mt-3 flex-wrap">
              <Badge variant="secondary">{charCount} {t("chars")}</Badge>
              <Badge variant="secondary">{wordCount} {t("words")}</Badge>
              <Badge variant="secondary">~{readingTimeMin} {t("minRead")}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* HTML Output */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("outputTitle")}</CardTitle>
                <CardDescription>
                  {viewMode === "preview" ? t("outputRendered") : t("outputRawHtml")}
                </CardDescription>
              </div>
              <div className="flex gap-1 border rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
                    viewMode === "preview"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {t("previewButton")}
                </button>
                <button
                  onClick={() => setViewMode("source")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
                    viewMode === "source"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  {t("htmlButton")}
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "preview" ? (
              <div
                className="min-h-[480px] border rounded-md p-4 bg-background prose prose-sm dark:prose-invert max-w-none overflow-auto text-sm
                  [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-4
                  [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-4
                  [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-3
                  [&_h4]:font-semibold [&_h4]:mb-1 [&_h4]:mt-2
                  [&_p]:mb-3 [&_p]:leading-relaxed
                  [&_ul]:mb-3 [&_ul]:pl-5 [&_ul]:list-disc
                  [&_ol]:mb-3 [&_ol]:pl-5 [&_ol]:list-decimal
                  [&_li]:mb-1
                  [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-3
                  [&_pre]:bg-muted [&_pre]:rounded [&_pre]:p-3 [&_pre]:overflow-x-auto [&_pre]:mb-3 [&_pre]:text-xs
                  [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono
                  [&_pre_code]:bg-transparent [&_pre_code]:p-0
                  [&_table]:w-full [&_table]:border-collapse [&_table]:mb-3
                  [&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:bg-muted [&_th]:font-semibold [&_th]:text-left
                  [&_td]:border [&_td]:border-border [&_td]:p-2
                  [&_hr]:border-border [&_hr]:my-4
                  [&_a]:text-primary [&_a]:underline
                  [&_strong]:font-bold
                  [&_em]:italic
                  [&_del]:line-through [&_del]:text-muted-foreground
                  [&_img]:max-w-full [&_img]:rounded"
                dangerouslySetInnerHTML={{ __html: html || "<p class='text-muted-foreground text-sm'>Preview will appear here...</p>" }}
              />
            ) : (
              <Textarea
                value={html}
                readOnly
                placeholder={t("htmlOutputPlaceholder")}
                className="min-h-[480px] resize-none font-mono text-xs bg-muted text-left rtl:text-left"
                rows={22}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
