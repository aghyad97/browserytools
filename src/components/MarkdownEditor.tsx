"use client";

import { useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
  FileText,
  AlignLeft,
  CodeSquare,
} from "lucide-react";
import { toast } from "sonner";

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

export default function MarkdownEditor() {
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
      toast.error("Nothing to copy");
      return;
    }
    navigator.clipboard.writeText(markdown);
    toast.success("Markdown copied to clipboard");
  };

  const handleCopyHtml = () => {
    if (!markdown.trim()) {
      toast.error("Nothing to copy");
      return;
    }
    const previewEl = document.getElementById("md-preview-content");
    if (previewEl) {
      navigator.clipboard.writeText(previewEl.innerHTML);
      toast.success("HTML copied to clipboard");
    } else {
      toast.error("Switch to Preview or Split view first, then copy HTML.");
    }
  };

  const handleDownload = () => {
    if (!markdown.trim()) {
      toast.error("Nothing to download");
      return;
    }
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded document.md");
  };

  const handleClear = () => {
    setMarkdown("");
    toast.success("Editor cleared");
  };

  const handleLoadSample = () => {
    setMarkdown(SAMPLE_MARKDOWN);
    toast.success("Sample content loaded");
  };

  const wordCount = countWords(markdown);
  const charCount = markdown.length;
  const lineCount = markdown.split("\n").length;

  const PreviewContent = () => (
    <div
      id="md-preview-content"
      className="md-preview prose prose-sm dark:prose-invert max-w-none p-4"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown || "*Nothing to preview yet. Start typing in the editor.*"}
      </ReactMarkdown>
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Markdown Editor
              </CardTitle>
              <CardDescription>
                Write and preview Markdown with GitHub Flavored Markdown support
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={handleCopyMarkdown}>
                <Copy className="w-4 h-4 mr-1" />
                Copy MD
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyHtml}>
                <AlignLeft className="w-4 h-4 mr-1" />
                Copy HTML
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-1" />
                Download .md
              </Button>
              <Button variant="outline" size="sm" onClick={handleLoadSample}>
                Load Sample
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-3 p-1 bg-muted/40 rounded-md">
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
        </CardHeader>

        <CardContent className="pt-0">
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
          >
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="split">Split</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="mt-3">
              <Textarea
                ref={textareaRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Start writing Markdown..."
                className="font-mono text-sm resize-none"
                style={{ minHeight: "520px" }}
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-3">
              <div
                className="border rounded-md overflow-auto"
                style={{ minHeight: "520px" }}
              >
                <PreviewContent />
              </div>
            </TabsContent>

            <TabsContent value="split" className="mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Editor
                  </p>
                  <Textarea
                    ref={splitTextareaRef}
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    placeholder="Start writing Markdown..."
                    className="font-mono text-sm resize-none"
                    style={{ minHeight: "520px" }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Preview
                  </p>
                  <div
                    className="border rounded-md overflow-auto"
                    style={{ minHeight: "520px" }}
                  >
                    <PreviewContent />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="mt-4" />
          <div className="flex items-center gap-4 pt-3 text-xs text-muted-foreground">
            <span>{charCount.toLocaleString()} characters</span>
            <span>{wordCount.toLocaleString()} words</span>
            <span>{lineCount.toLocaleString()} lines</span>
          </div>
        </CardContent>
      </Card>

      <style>{`
        .md-preview h1 { font-size: 1.875rem; font-weight: 700; margin: 1rem 0 0.5rem; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 0.3rem; }
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
    </div>
  );
}
