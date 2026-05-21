"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import hljs from "highlight.js";
import { Download, Code2, Copy } from "lucide-react";
import { useTranslations } from "next-intl";

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "tsx", label: "TSX / JSX" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "yaml", label: "YAML" },
  { value: "plaintext", label: "Plain Text" },
];

// Curated languages first (nice labels), then every other language registered
// by highlight.js (the full build supports ~190). Lets users pick any language.
const CURATED_LABELS: Record<string, string> = Object.fromEntries(
  LANGUAGE_OPTIONS.map((o) => [o.value, o.label])
);
const CURATED_VALUES = new Set(LANGUAGE_OPTIONS.map((o) => o.value));
const ALL_LANGUAGE_OPTIONS: { value: string; label: string }[] = [
  ...LANGUAGE_OPTIONS,
  ...hljs
    .listLanguages()
    .filter((l) => !CURATED_VALUES.has(l))
    .sort()
    .map((l) => ({ value: l, label: CURATED_LABELS[l] ?? l })),
];

// Self-contained themes: token colors are mapped to hljs class names so the
// exported image is fully inline-styled (no external CSS needed).
interface Theme {
  id: string;
  label: string;
  bg: string; // editor background
  fg: string; // default text color
  colors: Record<string, string>; // hljs token color map
}

const THEMES: Theme[] = [
  {
    id: "midnight",
    label: "Midnight",
    bg: "#0d1117",
    fg: "#e6edf3",
    colors: {
      comment: "#8b949e",
      keyword: "#ff7b72",
      string: "#a5d6ff",
      number: "#79c0ff",
      title: "#d2a8ff",
      function: "#d2a8ff",
      attr: "#79c0ff",
      builtin: "#ffa657",
      type: "#ffa657",
      literal: "#79c0ff",
      meta: "#8b949e",
      tag: "#7ee787",
      symbol: "#79c0ff",
    },
  },
  {
    id: "dracula",
    label: "Dracula",
    bg: "#282a36",
    fg: "#f8f8f2",
    colors: {
      comment: "#6272a4",
      keyword: "#ff79c6",
      string: "#f1fa8c",
      number: "#bd93f9",
      title: "#50fa7b",
      function: "#50fa7b",
      attr: "#50fa7b",
      builtin: "#8be9fd",
      type: "#8be9fd",
      literal: "#bd93f9",
      meta: "#6272a4",
      tag: "#ff79c6",
      symbol: "#bd93f9",
    },
  },
  {
    id: "solarized",
    label: "Solarized Light",
    bg: "#fdf6e3",
    fg: "#586e75",
    colors: {
      comment: "#93a1a1",
      keyword: "#859900",
      string: "#2aa198",
      number: "#d33682",
      title: "#268bd2",
      function: "#268bd2",
      attr: "#268bd2",
      builtin: "#b58900",
      type: "#b58900",
      literal: "#d33682",
      meta: "#93a1a1",
      tag: "#268bd2",
      symbol: "#d33682",
    },
  },
  {
    id: "monokai",
    label: "Monokai",
    bg: "#272822",
    fg: "#f8f8f2",
    colors: {
      comment: "#75715e",
      keyword: "#f92672",
      string: "#e6db74",
      number: "#ae81ff",
      title: "#a6e22e",
      function: "#a6e22e",
      attr: "#a6e22e",
      builtin: "#66d9ef",
      type: "#66d9ef",
      literal: "#ae81ff",
      meta: "#75715e",
      tag: "#f92672",
      symbol: "#ae81ff",
    },
  },
];

const BACKGROUNDS = [
  { id: "candy", label: "Candy", value: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)" },
  { id: "ocean", label: "Ocean", value: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)" },
  { id: "sunset", label: "Sunset", value: "linear-gradient(135deg, #ff512f 0%, #f09819 100%)" },
  { id: "purple", label: "Purple", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { id: "mint", label: "Mint", value: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
  { id: "slate", label: "Slate", value: "#1e293b" },
  { id: "white", label: "White", value: "#ffffff" },
  { id: "transparent", label: "Transparent", value: "transparent" },
];

const SAMPLE_CODE = `function greet(name) {
  // A friendly greeting
  const message = \`Hello, \${name}!\`;
  return message;
}

console.log(greet("World"));`;

const FONT_FAMILY =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// Map a single hljs token class to a color from the theme map.
function colorForClass(cls: string, theme: Theme): string | null {
  const tokens = cls.split(/\s+/).filter(Boolean);
  for (const tok of tokens) {
    const key = tok.replace(/^hljs-/, "").replace(/_+$/, "");
    if (theme.colors[key]) return theme.colors[key];
  }
  return null;
}

// Walk hljs HTML and produce inline-styled spans so the export carries colors.
function inlineHighlight(html: string, theme: Theme): string {
  if (typeof document === "undefined") return html;
  const container = document.createElement("div");
  // Trusted content: produced by highlight.js from the user's own code, used
  // only for client-side rendering and image export (never persisted/sent).
  container.innerHTML = html;
  container.querySelectorAll("span").forEach((span) => {
    const color = colorForClass(span.className, theme);
    if (color) span.setAttribute("style", `color:${color}`);
    span.removeAttribute("class");
  });
  return container.innerHTML;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function CodeScreenshot() {
  const t = useTranslations("Tools.CodeScreenshot");
  const [code, setCode] = useState(SAMPLE_CODE);
  const [language, setLanguage] = useState("javascript");
  const [themeId, setThemeId] = useState("midnight");
  const [bgId, setBgId] = useState("purple");
  const [windowStyle, setWindowStyle] = useState<"mac" | "plain">("mac");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [padding, setPadding] = useState(48);
  const [radius, setRadius] = useState(12);
  const [fontSize, setFontSize] = useState(14);
  const [exporting, setExporting] = useState(false);

  const theme = useMemo(
    () => THEMES.find((th) => th.id === themeId) ?? THEMES[0],
    [themeId],
  );
  const background = useMemo(
    () => BACKGROUNDS.find((b) => b.id === bgId) ?? BACKGROUNDS[0],
    [bgId],
  );

  const highlightedHtml = useMemo(() => {
    if (!code) return "";
    try {
      const raw =
        language === "plaintext"
          ? escapeHtml(code)
          : hljs.highlight(code, { language }).value;
      return inlineHighlight(raw, theme);
    } catch {
      return escapeHtml(code);
    }
  }, [code, language, theme]);

  const lineCount = useMemo(() => code.split("\n").length, [code]);
  const lineHeight = fontSize * 1.6;

  const previewRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);

  // Inject highlighted markup into the preview (avoids dangerouslySetInnerHTML).
  useEffect(() => {
    if (codeRef.current) codeRef.current.innerHTML = highlightedHtml;
  }, [highlightedHtml]);

  // Build the SVG markup for the code "window" so it can be rasterized.
  const buildWindowSvg = (width: number, height: number): string => {
    const lineNumbersHtml = showLineNumbers
      ? `<div style="user-select:none;text-align:right;padding-right:16px;color:${theme.fg};opacity:0.4;flex:none">${Array.from(
          { length: lineCount },
          (_, i) =>
            `<div style="height:${lineHeight}px;line-height:${lineHeight}px">${i + 1}</div>`,
        ).join("")}</div>`
      : "";

    const trafficLights =
      windowStyle === "mac"
        ? `<div style="display:flex;gap:8px;padding-bottom:16px"><span style="width:12px;height:12px;border-radius:50%;background:#ff5f56;display:inline-block"></span><span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e;display:inline-block"></span><span style="width:12px;height:12px;border-radius:50%;background:#27c93f;display:inline-block"></span></div>`
        : "";

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <foreignObject x="0" y="0" width="${width}" height="${height}">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;box-sizing:border-box;padding:${padding}px;background:${background.value};display:flex;align-items:center;justify-content:center">
          <div style="width:100%;background:${theme.bg};border-radius:${radius}px;padding:20px;box-shadow:0 20px 50px rgba(0,0,0,0.35);box-sizing:border-box">
            ${trafficLights}
            <div style="display:flex;font-family:${FONT_FAMILY};font-size:${fontSize}px;line-height:${lineHeight}px;color:${theme.fg};white-space:pre">
              ${lineNumbersHtml}
              <div style="flex:1;white-space:pre;overflow:visible">${highlightedHtml}</div>
            </div>
          </div>
        </div>
      </foreignObject>
    </svg>`;
  };

  const measure = () => {
    const node = previewRef.current;
    const width = node?.offsetWidth && node.offsetWidth > 0 ? node.offsetWidth : 720;
    const height = node?.offsetHeight && node.offsetHeight > 0 ? node.offsetHeight : 480;
    return { width: Math.round(width), height: Math.round(height) };
  };

  const rasterize = async (): Promise<HTMLCanvasElement> => {
    const { width, height } = measure();
    const scale = 2; // retina export
    const svg = buildWindowSvg(width, height);
    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("image load failed"));
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no canvas context");
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, width, height);
      return canvas;
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const handleExport = async () => {
    if (!code.trim()) {
      toast.error(t("emptyCode"));
      return;
    }
    setExporting(true);
    try {
      const canvas = await rasterize();
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "code-screenshot.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success(t("exported"));
    } catch {
      toast.error(t("exportFailed"));
    } finally {
      setExporting(false);
    }
  };

  const handleCopyImage = async () => {
    if (!code.trim()) {
      toast.error(t("emptyCode"));
      return;
    }
    setExporting(true);
    try {
      const canvas = await rasterize();
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png"),
      );
      if (!blob) throw new Error("no blob");
      if (
        typeof ClipboardItem !== "undefined" &&
        navigator.clipboard &&
        "write" in navigator.clipboard
      ) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        toast.success(t("copiedImage"));
      } else {
        toast.error(t("copyUnsupported"));
      }
    } catch {
      toast.error(t("copyUnsupported"));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">{t("title")}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
            {/* Controls + code input */}
            <div className="space-y-4">
              <Card className="p-4 space-y-3">
                <div className="text-sm font-medium">{t("codeLabel")}</div>
                <Textarea
                  data-testid="code-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t("codePlaceholder")}
                  dir="ltr"
                  className="min-h-[200px] font-mono text-sm resize-y text-left"
                />
              </Card>

              <Card className="p-4 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">{t("language")}</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger data-testid="language-select">
                      <SelectValue placeholder={t("language")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {ALL_LANGUAGE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">{t("theme")}</label>
                  <Select value={themeId} onValueChange={setThemeId}>
                    <SelectTrigger data-testid="theme-select">
                      <SelectValue placeholder={t("theme")} />
                    </SelectTrigger>
                    <SelectContent>
                      {THEMES.map((th) => (
                        <SelectItem key={th.id} value={th.id}>
                          {th.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">{t("background")}</label>
                  <Select value={bgId} onValueChange={setBgId}>
                    <SelectTrigger data-testid="bg-select">
                      <SelectValue placeholder={t("background")} />
                    </SelectTrigger>
                    <SelectContent>
                      {BACKGROUNDS.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">{t("windowStyle")}</label>
                  <Select
                    value={windowStyle}
                    onValueChange={(v) => setWindowStyle(v as "mac" | "plain")}
                  >
                    <SelectTrigger data-testid="window-select">
                      <SelectValue placeholder={t("windowStyle")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mac">{t("macStyle")}</SelectItem>
                      <SelectItem value="plain">{t("plainStyle")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              <Card className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("padding")}</span>
                    <span>{padding}px</span>
                  </div>
                  <Slider
                    aria-label={t("padding")}
                    value={[padding]}
                    min={0}
                    max={128}
                    step={4}
                    onValueChange={([v]) => setPadding(v)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("cornerRadius")}</span>
                    <span>{radius}px</span>
                  </div>
                  <Slider
                    aria-label={t("cornerRadius")}
                    value={[radius]}
                    min={0}
                    max={32}
                    step={2}
                    onValueChange={([v]) => setRadius(v)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("fontSize")}</span>
                    <span>{fontSize}px</span>
                  </div>
                  <Slider
                    aria-label={t("fontSize")}
                    value={[fontSize]}
                    min={10}
                    max={24}
                    step={1}
                    onValueChange={([v]) => setFontSize(v)}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    data-testid="line-numbers-toggle"
                    checked={showLineNumbers}
                    onChange={(e) => setShowLineNumbers(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  {t("lineNumbers")}
                </label>
              </Card>

              <div className="flex gap-2">
                <Button
                  onClick={handleExport}
                  disabled={exporting}
                  data-testid="export-btn"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 me-2" />
                  {t("downloadPng")}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyImage}
                  disabled={exporting}
                  data-testid="copy-btn"
                  aria-label={t("copyImage")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Live preview — always LTR */}
            <Card className="p-4 flex items-start justify-center overflow-auto">
              <div
                ref={previewRef}
                dir="ltr"
                data-testid="code-preview"
                style={{
                  padding: `${padding}px`,
                  background: background.value,
                  display: "inline-block",
                  maxWidth: "100%",
                }}
              >
                <div
                  style={{
                    background: theme.bg,
                    borderRadius: `${radius}px`,
                    padding: "20px",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
                    minWidth: "320px",
                  }}
                >
                  {windowStyle === "mac" && (
                    <div style={{ display: "flex", gap: 8, paddingBottom: 16 }}>
                      <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
                      <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
                      <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      fontFamily: FONT_FAMILY,
                      fontSize: `${fontSize}px`,
                      lineHeight: `${lineHeight}px`,
                      color: theme.fg,
                    }}
                  >
                    {showLineNumbers && (
                      <div
                        style={{
                          userSelect: "none",
                          textAlign: "right",
                          paddingRight: 16,
                          opacity: 0.4,
                          flex: "none",
                        }}
                      >
                        {Array.from({ length: lineCount }, (_, i) => (
                          <div key={i} style={{ height: lineHeight, lineHeight: `${lineHeight}px` }}>
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    )}
                    <pre
                      ref={codeRef}
                      style={{ margin: 0, flex: 1, whiteSpace: "pre", overflow: "visible" }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
