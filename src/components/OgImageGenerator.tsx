"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { downloadBlob } from "@/lib/download";

// Open Graph / social-share images are a fixed 1200x630 canvas.
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

type Align = "left" | "center" | "right";
type BackgroundKind = "solid" | "gradient" | "mesh";

interface TemplatePreset {
  id: string;
  background: BackgroundKind;
  bgColor: string;
  bgColor2: string;
  textColor: string;
  accentColor: string;
  align: Align;
}

// A few tasteful layout/colour presets. The preview always renders LTR because
// it is a fixed social card, regardless of the surrounding UI direction.
const TEMPLATES: TemplatePreset[] = [
  {
    id: "midnight",
    background: "gradient",
    bgColor: "#0f172a",
    bgColor2: "#1e3a8a",
    textColor: "#ffffff",
    accentColor: "#38bdf8",
    align: "left",
  },
  {
    id: "sunset",
    background: "gradient",
    bgColor: "#7c2d12",
    bgColor2: "#db2777",
    textColor: "#ffffff",
    accentColor: "#fde68a",
    align: "left",
  },
  {
    id: "mesh",
    background: "mesh",
    bgColor: "#1e1b4b",
    bgColor2: "#0ea5e9",
    textColor: "#ffffff",
    accentColor: "#a78bfa",
    align: "center",
  },
  {
    id: "minimal",
    background: "solid",
    bgColor: "#ffffff",
    bgColor2: "#ffffff",
    textColor: "#0f172a",
    accentColor: "#2563eb",
    align: "left",
  },
  {
    id: "forest",
    background: "gradient",
    bgColor: "#064e3b",
    bgColor2: "#065f46",
    textColor: "#ecfdf5",
    accentColor: "#6ee7b7",
    align: "center",
  },
];

// Wrap text to fit a max width, returning an array of lines.
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = candidate;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

export default function OgImageGenerator() {
  const t = useTranslations("Tools.OgImageGenerator");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [title, setTitle] = useState("Build social images in seconds");
  const [subtitle, setSubtitle] = useState(
    "Create perfect 1200x630 Open Graph images right in your browser."
  );
  const [author, setAuthor] = useState("browserytools.com");
  const [templateId, setTemplateId] = useState("midnight");
  const [background, setBackground] = useState<BackgroundKind>("gradient");
  const [bgColor, setBgColor] = useState("#0f172a");
  const [bgColor2, setBgColor2] = useState("#1e3a8a");
  const [textColor, setTextColor] = useState("#ffffff");
  const [accentColor, setAccentColor] = useState("#38bdf8");
  const [align, setAlign] = useState<Align>("left");
  const [fontSize, setFontSize] = useState(72);
  const [logo, setLogo] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  // Apply a template preset to all relevant fields.
  const applyTemplate = (id: string) => {
    const preset = TEMPLATES.find((tpl) => tpl.id === id);
    if (!preset) return;
    setTemplateId(id);
    setBackground(preset.background);
    setBgColor(preset.bgColor);
    setBgColor2(preset.bgColor2);
    setTextColor(preset.textColor);
    setAccentColor(preset.accentColor);
    setAlign(preset.align);
  };

  const handleLogoFiles = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("invalidLogo"));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        logoImgRef.current = img;
        setLogo(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
    logoImgRef.current = null;
  };

  // Draw the full 1200x630 card onto the canvas.
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, OG_WIDTH, OG_HEIGHT);

    // Background.
    if (background === "solid") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT);
    } else if (background === "gradient") {
      const grad = ctx.createLinearGradient(0, 0, OG_WIDTH, OG_HEIGHT);
      grad.addColorStop(0, bgColor);
      grad.addColorStop(1, bgColor2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT);
    } else {
      // mesh: base fill + a couple of soft radial blobs.
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT);
      const blob = (cx: number, cy: number, r: number, color: string) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT);
      };
      blob(200, 150, 500, bgColor2);
      blob(1000, 520, 520, accentColor);
    }

    const padding = 80;
    const contentWidth = OG_WIDTH - padding * 2;
    let x = padding;
    let textAlign: CanvasTextAlign = "left";
    if (align === "center") {
      x = OG_WIDTH / 2;
      textAlign = "center";
    } else if (align === "right") {
      x = OG_WIDTH - padding;
      textAlign = "right";
    }
    ctx.textAlign = textAlign;

    // Accent bar.
    ctx.fillStyle = accentColor;
    if (align === "center") {
      ctx.fillRect(OG_WIDTH / 2 - 40, 150, 80, 8);
    } else if (align === "right") {
      ctx.fillRect(OG_WIDTH - padding - 80, 150, 80, 8);
    } else {
      ctx.fillRect(padding, 150, 80, 8);
    }

    // Title.
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textBaseline = "top";
    const titleLines = wrapText(ctx, title || "", contentWidth, 3);
    let y = 200;
    const titleLineHeight = fontSize * 1.15;
    for (const line of titleLines) {
      ctx.fillText(line, x, y);
      y += titleLineHeight;
    }

    // Subtitle.
    if (subtitle) {
      y += 24;
      const subSize = Math.max(24, Math.round(fontSize * 0.42));
      ctx.font = `${subSize}px Arial, sans-serif`;
      ctx.globalAlpha = 0.85;
      const subLines = wrapText(ctx, subtitle, contentWidth, 2);
      for (const line of subLines) {
        ctx.fillText(line, x, y);
        y += subSize * 1.3;
      }
      ctx.globalAlpha = 1;
    }

    // Footer: logo + author.
    const footerY = OG_HEIGHT - padding - 40;
    let footerX = padding;
    if (logoImgRef.current) {
      const size = 56;
      const logoX = align === "right" ? OG_WIDTH - padding - size : padding;
      ctx.drawImage(logoImgRef.current, logoX, footerY - 8, size, size);
      footerX = logoX + size + 20;
    }
    if (author) {
      ctx.fillStyle = accentColor;
      ctx.font = `600 28px Arial, sans-serif`;
      ctx.textBaseline = "middle";
      if (align === "center") {
        ctx.textAlign = "center";
        ctx.fillText(author, OG_WIDTH / 2, footerY + 20);
      } else if (align === "right") {
        ctx.textAlign = "right";
        ctx.fillText(author, OG_WIDTH - padding, footerY + 20);
      } else {
        ctx.textAlign = "left";
        ctx.fillText(author, footerX, footerY + 20);
      }
    }
  }, [
    title,
    subtitle,
    author,
    background,
    bgColor,
    bgColor2,
    textColor,
    accentColor,
    align,
    fontSize,
    logo,
  ]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error(t("exportFailed"));
        return;
      }
      downloadBlob(blob, "og-image.png");
      toast.success(t("exported"));
    }, "image/png");
  };

  const metaSnippet = `<meta property="og:image" content="https://example.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://example.com/og-image.png" />`;

  const colorField = (
    label: string,
    value: string,
    onChange: (v: string) => void
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 rounded-md border border-input bg-background p-1"
          aria-label={label}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );

  return (
    <ToolShell
      slug="og-image-generator"
      title={tc("tools.og-image-generator.name")}
      sub={tc("tools.og-image-generator.description")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Controls */}
          <div className="space-y-4">
            <Card className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="og-title">
                  {t("title")}
                </label>
                <Input
                  id="og-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("titlePlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="og-subtitle">
                  {t("subtitle")}
                </label>
                <Textarea
                  id="og-subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder={t("subtitlePlaceholder")}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="og-author">
                  {t("author")}
                </label>
                <Input
                  id="og-author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder={t("authorPlaceholder")}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("template")}</label>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => applyTemplate(tpl.id)}
                      data-testid={`template-${tpl.id}`}
                      aria-pressed={templateId === tpl.id}
                      className={`h-10 w-16 rounded-md border-2 transition ${
                        templateId === tpl.id
                          ? "border-primary ring-2 ring-primary/40"
                          : "border-transparent"
                      }`}
                      style={{
                        background:
                          tpl.background === "solid"
                            ? tpl.bgColor
                            : `linear-gradient(135deg, ${tpl.bgColor}, ${tpl.bgColor2})`,
                      }}
                      title={t(
                        tpl.id === "midnight"
                          ? "templateMidnight"
                          : tpl.id === "sunset"
                            ? "templateSunset"
                            : tpl.id === "mesh"
                              ? "templateMesh"
                              : tpl.id === "minimal"
                                ? "templateMinimal"
                                : "templateForest"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("background")}
                </label>
                <Select
                  value={background}
                  onValueChange={(v) => setBackground(v as BackgroundKind)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">{t("bgSolid")}</SelectItem>
                    <SelectItem value="gradient">{t("bgGradient")}</SelectItem>
                    <SelectItem value="mesh">{t("bgMesh")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {colorField(t("bgColor"), bgColor, setBgColor)}
                {background !== "solid" &&
                  colorField(t("bgColor2"), bgColor2, setBgColor2)}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {colorField(t("textColor"), textColor, setTextColor)}
                {colorField(t("accentColor"), accentColor, setAccentColor)}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("alignment")}</label>
                <Select
                  value={align}
                  onValueChange={(v) => setAlign(v as Align)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">{t("alignLeft")}</SelectItem>
                    <SelectItem value="center">{t("alignCenter")}</SelectItem>
                    <SelectItem value="right">{t("alignRight")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    {t("fontSize")}
                  </label>
                  <span className="text-sm text-muted-foreground">
                    {fontSize}px
                  </span>
                </div>
                <Slider
                  value={[fontSize]}
                  onValueChange={([v]) => setFontSize(v)}
                  min={40}
                  max={100}
                  step={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("logo")}</label>
                {logo ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={logo}
                      alt={t("logoAlt")}
                      className="h-12 w-12 rounded-md object-contain border border-input"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeLogo}
                    >
                      <X className="h-4 w-4 me-1" />
                      {t("removeLogo")}
                    </Button>
                  </div>
                ) : (
                  <FileDropzone
                    onFiles={handleLogoFiles}
                    accept={{ "image/*": [] }}
                    multiple={false}
                    className={() =>
                      "flex items-center gap-2 cursor-pointer rounded-md border border-dashed border-input px-4 py-3 text-sm text-muted-foreground hover:border-primary"
                    }
                    inputProps={{ "data-testid": "logo-input" }}
                  >
                    <Upload className="h-4 w-4" />
                    {t("uploadLogo")}
                  </FileDropzone>
                )}
              </div>
            </Card>
          </div>

          {/* Preview + export */}
          <div className="space-y-4">
            <Card className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("previewLabel")}
              </p>
              {/* The card is a fixed LTR 1200x630 social image. */}
              <div className="w-full overflow-hidden rounded-lg border border-input" dir="ltr">
                <canvas
                  ref={canvasRef}
                  width={OG_WIDTH}
                  height={OG_HEIGHT}
                  className="w-full h-auto block"
                  data-testid="og-canvas"
                />
              </div>
              <Button onClick={handleDownload} className="w-full">
                <Download className="h-4 w-4 me-2" />
                {t("exportPng")}
              </Button>
            </Card>

            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t("metaTags")}</label>
                <CopyButton
                  text={metaSnippet}
                  label={tCommon("copy")}
                  successMessage={t("snippetCopied")}
                  errorMessage={t("copyFailed")}
                />
              </div>
              <Textarea
                readOnly
                value={metaSnippet}
                rows={5}
                className="font-mono text-xs"
                dir="ltr"
                data-testid="meta-snippet"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                {t("metaHint")}
              </p>
            </Card>
          </div>
        </div>
    </ToolShell>
  );
}
