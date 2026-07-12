"use client";

import { useState, useCallback, useRef } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ToolShell } from "@/components/template/tool-shell";
import { ModePicker } from "@/components/shared/ModePicker";
import { TwoPane } from "@/components/shared/TwoPane";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  Italic,
  Link,
  Code,
  Heading1,
  List,
  Quote,
  Minus,
  Image,
  Copy,
  Download,
  RotateCcw,
  AlignLeft,
  CodeSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const SAMPLE_MARKDOWN = `# Welcome to the Markdown Editor

A **powerful**, _feature-rich_ Markdown editor that runs entirely in your browser.

## Features

- Live split-pane preview
- GitHub Flavored Markdown (GFM) support
- Code block syntax highlighting
- Export to \`.md\` or copy as HTML

## Code Example

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

## A Table

| Feature        | Supported |
| -------------- | --------- |
| Bold and Italic  | Yes     |
| Tables         | Yes       |
| Code Blocks    | Yes       |
| Task Lists     | Yes       |

## Task List

- [x] Create Markdown editor
- [x] Add live preview
- [ ] Add more themes
- [ ] Add image uploads

## Blockquote

> The best tools are the ones that get out of your way and let you focus on your work.

---

### Inline Elements

Here is some \`inline code\`, a [link to Google](https://google.com), and **bold with _nested italic_** text.
`;

type ViewMode = "editor" | "preview" | "split";

interface ToolbarAction {
  icon: React.ElementType;
  label: string;
  prefix: string;
  suffix: string;
  placeholder: string;
  block?: boolean;
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { icon: Bold, label: "Bold", prefix: "**", suffix: "**", placeholder: "bold text" },
  { icon: Italic, label: "Italic", prefix: "_", suffix: "_", placeholder: "italic text" },
  { icon: Link, label: "Link", prefix: "[", suffix: "](url)", placeholder: "link text" },
  { icon: Code, label: "Inline Code", prefix: "`", suffix: "`", placeholder: "code" },
  { icon: Heading1, label: "Heading", prefix: "## ", suffix: "", placeholder: "Heading", block: true },
  { icon: List, label: "List Item", prefix: "- ", suffix: "", placeholder: "List item", block: true },
  { icon: Quote, label: "Blockquote", prefix: "> ", suffix: "", placeholder: "Quote text", block: true },
  { icon: Minus, label: "Horizontal Rule", prefix: "\n\n---\n\n", suffix: "", placeholder: "", block: true },
  { icon: Image, label: "Image", prefix: "![", suffix: "](image-url)", placeholder: "alt text" },
  { icon: CodeSquare, label: "Code Block", prefix: "```\n", suffix: "\n```", placeholder: "code here", block: true },
];

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

// The preview renders user markdown; a leading `# ` would otherwise emit a real
// <h1>, colliding with the ToolShell page <h1> (breaks the exactly-one-h1 smoke
// gate). Render markdown top-level headings as a visually-identical <div> so the
// shell owns the page's only <h1>. Styling lives in `.md-preview .md-h1`.
const PREVIEW_COMPONENTS: Components = {
  h1: ({ node: _node, ...props }) => <div className="md-h1" {...props} />,
};

export default function MarkdownEditor() {
  const t = useTranslations("Tools.MarkdownEditor");
  const tc = useTranslations("ToolsConfig");
  const tCommon = useTranslations("Common");
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const splitTextareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = useCallback(
    (action: ToolbarAction) => {
      const textarea =
        viewMode === "split" ? splitTextareaRef.current : textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = markdown.slice(start, end);
      const textToInsert = selectedText || action.placeholder;

      let newText: string;
      let newCursorStart: number;
      let newCursorEnd: number;

      if (action.block && !selectedText) {
        const beforeCursor = markdown.slice(0, start);
        const afterCursor = markdown.slice(end);
        const needsNewline =
          beforeCursor.length > 0 && !beforeCursor.endsWith("\n");
        const prefix = needsNewline ? "\n" + action.prefix : action.prefix;
        newText =
          beforeCursor + prefix + textToInsert + action.suffix + afterCursor;
        newCursorStart = start + prefix.length;
        newCursorEnd = newCursorStart + textToInsert.length;
      } else {
        newText =
          markdown.slice(0, start) +
          action.prefix +
          textToInsert +
          action.suffix +
          markdown.slice(end);
        newCursorStart = start + action.prefix.length;
        newCursorEnd = newCursorStart + textToInsert.length;
      }

      setMarkdown(newText);

      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorStart, newCursorEnd);
      });
    },
    [markdown, viewMode]
  );

  const handleCopyMarkdown = () => {
    if (!markdown.trim()) {
      toast.error(t("nothingToCopy"));
      return;
    }
    navigator.clipboard.writeText(markdown);
    toast.success(t("markdownCopied"));
  };

  const handleCopyHtml = () => {
    if (!markdown.trim()) {
      toast.error(t("nothingToCopy"));
      return;
    }
    const previewEl = document.getElementById("md-preview-content");
    if (previewEl) {
      navigator.clipboard.writeText(previewEl.innerHTML);
      toast.success(t("htmlCopied"));
    } else {
      toast.error(t("switchToPreview"));
    }
  };

  const handleDownload = () => {
    if (!markdown.trim()) {
      toast.error(t("nothingToDownload"));
      return;
    }
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("downloadedMd"));
  };

  const handleClear = () => {
    setMarkdown("");
    toast.success(t("editorCleared"));
  };

  const handleLoadSample = () => {
    setMarkdown(SAMPLE_MARKDOWN);
    toast.success(t("sampleLoaded"));
  };

  const wordCount = countWords(markdown);
  const charCount = markdown.length;
  const lineCount = markdown.split("\n").length;

  const PreviewContent = () => (
    <div
      id="md-preview-content"
      className="md-preview prose prose-sm dark:prose-invert max-w-none p-4"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={PREVIEW_COMPONENTS}>
        {markdown || `*${t("nothingToPreview")}*`}
      </ReactMarkdown>
    </div>
  );

  const editorPane = (
    <Textarea
      ref={viewMode === "split" ? splitTextareaRef : textareaRef}
      value={markdown}
      onChange={(e) => setMarkdown(e.target.value)}
      placeholder={t("startWriting")}
      className="font-mono text-sm resize-none text-left rtl:text-left min-h-[520px]"
    />
  );

  const previewPane = (
    <div className="border rounded-md overflow-auto min-h-[520px]">
      <PreviewContent />
    </div>
  );

  return (
    <ToolShell
      slug="markdown-editor"
      title={tc("tools.markdown-editor.name")}
      sub={tc("tools.markdown-editor.description")}
      controls={
        <>
          <Button variant="outline" onClick={handleCopyMarkdown}>
            <Copy className="w-4 h-4 me-2" />
            {t("copyMd")}
          </Button>
          <Button variant="outline" onClick={handleCopyHtml}>
            <AlignLeft className="w-4 h-4 me-2" />
            {t("copyHtml")}
          </Button>
          <Button variant="outline" onClick={handleLoadSample}>
            {t("loadSample")}
          </Button>
          <Button variant="ghost" onClick={handleClear}>
            <RotateCcw className="w-4 h-4 me-2" />
            {tCommon("clear")}
          </Button>
        </>
      }
      primaryAction={{
        label: t("downloadMd"),
        onClick: handleDownload,
      }}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <ModePicker
            aria-label={t("previewLabel")}
            value={viewMode}
            onChange={(v) => setViewMode(v as ViewMode)}
            options={[
              { value: "editor", label: t("tabEditor") },
              { value: "preview", label: t("tabPreview") },
              { value: "split", label: t("tabSplit") },
            ]}
          />
          <div className="flex flex-wrap gap-1 p-1 bg-muted/40 rounded-md">
            {TOOLBAR_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="ghost"
                  size="sm"
                  title={action.label}
                  onClick={() => insertMarkdown(action)}
                  className="h-8 px-2 hover:bg-background"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>
        </div>

        {viewMode === "editor" && editorPane}
        {viewMode === "preview" && previewPane}
        {viewMode === "split" && (
          <TwoPane
            start={
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("editorLabel")}
                </p>
                {editorPane}
              </div>
            }
            end={
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("previewLabel")}
                </p>
                {previewPane}
              </div>
            }
          />
        )}

        <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
          <span>{charCount.toLocaleString()} {t("characters")}</span>
          <span>{wordCount.toLocaleString()} {t("words")}</span>
          <span>{lineCount.toLocaleString()} {t("lines")}</span>
        </div>
      </div>

      <style>{`
        .md-preview .md-h1 { font-size: 1.875rem; font-weight: 700; margin: 1rem 0 0.5rem; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 0.3rem; }
        .md-preview h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 0.2rem; }
        .md-preview h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
        .md-preview h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.4rem; }
        .md-preview p { margin: 0.5rem 0; line-height: 1.7; }
        .md-preview ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .md-preview ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .md-preview li { margin: 0.25rem 0; line-height: 1.6; }
        .md-preview pre { background-color: hsl(var(--muted)); border-radius: 6px; padding: 1rem; overflow-x: auto; font-size: 0.875rem; margin: 0.75rem 0; }
        .md-preview code:not(pre code) { background-color: hsl(var(--muted)); border-radius: 3px; padding: 0.1em 0.4em; font-size: 0.875em; font-family: monospace; }
        .md-preview table { border-collapse: collapse; width: 100%; margin: 0.75rem 0; font-size: 0.9rem; }
        .md-preview th, .md-preview td { border: 1px solid hsl(var(--border)); padding: 0.4rem 0.75rem; text-align: left; }
        .md-preview th { background-color: hsl(var(--muted)); font-weight: 600; }
        .md-preview blockquote { border-left: 4px solid hsl(var(--primary)/0.4); padding-left: 1rem; color: hsl(var(--muted-foreground)); font-style: italic; margin: 0.75rem 0; }
        .md-preview hr { border: none; border-top: 1px solid hsl(var(--border)); margin: 1.25rem 0; }
        .md-preview img { border-radius: 6px; max-width: 100%; height: auto; display: block; margin: 0.75rem 0; }
        .md-preview a { color: hsl(var(--primary)); text-decoration: underline; }
        .md-preview strong { font-weight: 700; }
        .md-preview em { font-style: italic; }
      `}</style>
    </ToolShell>
  );
}
