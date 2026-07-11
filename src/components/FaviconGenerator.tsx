"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { CopyButton } from "@/components/shared/CopyButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { canvasToBlob } from "@/lib/image/canvas";
import { downloadBlob } from "@/lib/download";

// The standard PNG favicon set we emit.
const PNG_SIZES = [16, 32, 48, 180, 192, 512] as const;
// The sizes packed into favicon.ico (multi-image ICO: 16 + 32).
const ICO_SIZES = [16, 32] as const;

type Mode = "upload" | "letter";

interface GeneratedIcon {
  size: number;
  label: string;
  dataUrl: string;
  blob: Blob;
}

// Render a single square icon at `size` px. Either draws the uploaded image
// (object-fit: cover) or paints a background + centered letter/emoji.
function renderIconCanvas(
  size: number,
  source: HTMLImageElement | null,
  glyph: string,
  bgColor: string,
  fgColor: string
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  if (source) {
    // Cover fit: scale to fill the square, cropping overflow.
    const scale = Math.max(size / source.width, size / source.height);
    const w = source.width * scale;
    const h = source.height * scale;
    const x = (size - w) / 2;
    const y = (size - h) / 2;
    ctx.drawImage(source, x, y, w, h);
  } else {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = fgColor;
    ctx.font = `${Math.round(size * 0.62)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Slight vertical nudge so glyphs sit optically centered.
    ctx.fillText(glyph || "A", size / 2, size / 2 + size * 0.04);
  }
  return canvas;
}

// Encode one or more square PNG-source canvases into a single ICO file.
// ICO format: 6-byte header + 16-byte directory entry per image + PNG payloads.
// Modern browsers/OSes accept PNG-compressed ICO entries, so we embed the PNG
// bytes directly rather than building a BMP DIB.
async function encodeIco(canvases: HTMLCanvasElement[]): Promise<Blob> {
  const pngs = await Promise.all(
    canvases.map(async (c) => {
      const blob = await canvasToBlob(c);
      const buf = await blob!.arrayBuffer();
      return { size: c.width, bytes: new Uint8Array(buf) };
    })
  );

  const count = pngs.length;
  const headerSize = 6;
  const dirSize = 16 * count;
  let offset = headerSize + dirSize;

  const totalSize =
    offset + pngs.reduce((sum, p) => sum + p.bytes.length, 0);
  const out = new Uint8Array(totalSize);
  const view = new DataView(out.buffer);

  // ICONDIR header.
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type 1 = icon
  view.setUint16(4, count, true); // image count

  pngs.forEach((p, i) => {
    const entry = headerSize + i * 16;
    // 256px is stored as 0 in the single-byte width/height fields.
    out[entry + 0] = p.size >= 256 ? 0 : p.size; // width
    out[entry + 1] = p.size >= 256 ? 0 : p.size; // height
    out[entry + 2] = 0; // color palette
    out[entry + 3] = 0; // reserved
    view.setUint16(entry + 4, 1, true); // color planes
    view.setUint16(entry + 6, 32, true); // bits per pixel
    view.setUint32(entry + 8, p.bytes.length, true); // image data size
    view.setUint32(entry + 12, offset, true); // image data offset
    out.set(p.bytes, offset);
    offset += p.bytes.length;
  });

  return new Blob([out], { type: "image/x-icon" });
}

const HTML_SNIPPET = `<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />`;

const WEBMANIFEST = JSON.stringify(
  {
    name: "",
    short_name: "",
    icons: [
      { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
  },
  null,
  2
);

function fileNameFor(size: number): string {
  if (size === 180) return "apple-touch-icon.png";
  return `favicon-${size}x${size}.png`;
}

export default function FaviconGenerator() {
  const t = useTranslations("Tools.FaviconGenerator");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [mode, setMode] = useState<Mode>("upload");
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [glyph, setGlyph] = useState("B");
  const [bgColor, setBgColor] = useState("#4f46e5");
  const [fgColor, setFgColor] = useState("#ffffff");

  const [icons, setIcons] = useState<GeneratedIcon[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const objectUrls = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      objectUrls.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (file.size > 15 * 1024 * 1024) {
        toast.error(t("imageTooLarge"));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceUrl(reader.result as string);
        setIcons([]);
      };
      reader.readAsDataURL(file);
    },
    [t]
  );

  const handleGenerate = async () => {
    if (isGenerating) return;
    if (mode === "upload" && !sourceUrl) {
      toast.error(t("noImage"));
      return;
    }
    if (mode === "letter" && !glyph.trim()) {
      toast.error(t("noGlyph"));
      return;
    }

    setIsGenerating(true);
    try {
      let source: HTMLImageElement | null = null;
      if (mode === "upload" && sourceUrl) {
        source = new Image();
        source.src = sourceUrl;
        await new Promise((resolve, reject) => {
          source!.onload = resolve;
          source!.onerror = reject;
        });
      }

      // Revoke previous preview URLs.
      objectUrls.current.forEach((u) => URL.revokeObjectURL(u));
      objectUrls.current = [];

      const generated: GeneratedIcon[] = [];
      for (const size of PNG_SIZES) {
        const canvas = renderIconCanvas(
          size,
          source,
          glyph.trim(),
          bgColor,
          fgColor
        );
        const blob = await canvasToBlob(canvas);
        if (!blob) throw new Error("Canvas produced no output");
        const url = URL.createObjectURL(blob);
        objectUrls.current.push(url);
        generated.push({
          size,
          label: fileNameFor(size),
          dataUrl: url,
          blob,
        });
      }

      setIcons(generated);
      toast.success(t("generated"));
    } catch (error) {
      console.error(error);
      toast.error(t("generateFailed"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadZip = async () => {
    if (icons.length === 0) return;
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();

      // Add the PNG set.
      for (const icon of icons) {
        zip.file(icon.label, icon.blob);
      }

      // Build the favicon.ico from 16 + 32 (re-render to avoid relying on the
      // preview canvases, which may have been GC'd).
      let source: HTMLImageElement | null = null;
      if (mode === "upload" && sourceUrl) {
        source = new Image();
        source.src = sourceUrl;
        await new Promise((resolve, reject) => {
          source!.onload = resolve;
          source!.onerror = reject;
        });
      }
      const icoCanvases = ICO_SIZES.map((s) =>
        renderIconCanvas(s, source, glyph.trim(), bgColor, fgColor)
      );
      const icoBlob = await encodeIco(icoCanvases);
      zip.file("favicon.ico", icoBlob);

      // Site manifest + HTML snippet.
      zip.file("site.webmanifest", WEBMANIFEST);
      zip.file("favicon-snippet.html", HTML_SNIPPET);

      const content = await zip.generateAsync({ type: "blob" });
      downloadBlob(content, "favicons.zip");

      toast.success(t("downloaded"));
    } catch (error) {
      console.error(error);
      toast.error(t("generateFailed"));
    }
  };

  return (
    <ToolShell
      slug="favicon-generator"
      title={tc("tools.favicon-generator.name")}
      sub={tc("tools.favicon-generator.description")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Input column ── */}
        <div className="space-y-4">
            <Card className="p-6 shadow-none">
              <Tabs
                value={mode}
                onValueChange={(v) => {
                  setMode(v as Mode);
                  setIcons([]);
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">{t("modeUpload")}</TabsTrigger>
                  <TabsTrigger value="letter">{t("modeLetter")}</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-4">
                  <FileDropzone
                    onFiles={onDrop}
                    accept={{
                      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"],
                    }}
                    multiple={false}
                    className={({ isDragActive }) => `
                      h-56 rounded-lg border-2 border-dashed
                      flex flex-col items-center justify-center space-y-4 p-8
                      cursor-pointer transition-[border-color,background-color] duration-150
                      ${
                        isDragActive
                          ? "border-primary bg-primary/10 scale-[0.99]"
                          : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                      }
                    `}
                  >
                    {sourceUrl ? (
                      <img
                        src={sourceUrl}
                        alt={t("altSource")}
                        className="max-h-40 max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-base font-semibold mb-1">
                          {t("dropImageHere")}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t("supportedFormats")}
                        </p>
                      </div>
                    )}
                  </FileDropzone>
                </TabsContent>

                <TabsContent value="letter" className="mt-4 space-y-4">
                  <div
                    className="h-40 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: bgColor }}
                  >
                    <span
                      className="font-semibold select-none"
                      style={{ color: fgColor, fontSize: "5rem", lineHeight: 1 }}
                    >
                      {glyph.trim() || "A"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="glyph-input"
                      className="text-sm font-medium"
                    >
                      {t("glyphLabel")}
                    </label>
                    <Input
                      id="glyph-input"
                      data-testid="glyph-input"
                      value={glyph}
                      maxLength={4}
                      onChange={(e) => {
                        setGlyph(e.target.value);
                        setIcons([]);
                      }}
                      placeholder={t("glyphPlaceholder")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="bg-color"
                        className="text-sm font-medium"
                      >
                        {t("background")}
                      </label>
                      <Input
                        id="bg-color"
                        type="color"
                        value={bgColor}
                        onChange={(e) => {
                          setBgColor(e.target.value);
                          setIcons([]);
                        }}
                        className="h-10 p-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="fg-color"
                        className="text-sm font-medium"
                      >
                        {t("foreground")}
                      </label>
                      <Input
                        id="fg-color"
                        type="color"
                        value={fgColor}
                        onChange={(e) => {
                          setFgColor(e.target.value);
                          setIcons([]);
                        }}
                        className="h-10 p-1"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleGenerate}
                className="w-full mt-4"
                disabled={isGenerating}
              >
                <Sparkles className="w-4 h-4 me-2" />
                {isGenerating ? t("generating") : t("generate")}
              </Button>
            </Card>

            {/* HTML snippet */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t("htmlSnippet")}</label>
                <CopyButton
                  text={HTML_SNIPPET}
                  label={tCommon("copy")}
                  successMessage={t("snippetCopied")}
                  errorMessage={t("copyFailed")}
                />
              </div>
              <pre
                dir="ltr"
                className="text-xs bg-muted rounded-md p-3 overflow-x-auto whitespace-pre"
              >
                <code>{HTML_SNIPPET}</code>
              </pre>
            </Card>
          </div>

          {/* ── Output column ── */}
          <div className="space-y-4">
            <Card className="p-6">
              {icons.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-end gap-6 justify-center">
                    {icons.map((icon) => (
                      <div
                        key={icon.size}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="rounded-md border bg-card p-2 flex items-center justify-center">
                          <img
                            src={icon.dataUrl}
                            alt={`${icon.size}x${icon.size}`}
                            width={Math.min(icon.size, 64)}
                            height={Math.min(icon.size, 64)}
                            style={{
                              width: Math.min(icon.size, 64),
                              height: Math.min(icon.size, 64),
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {icon.size}×{icon.size}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    {t("zipContents")}
                  </p>
                </div>
              ) : (
                <div className="h-56 flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground">
                  <div className="text-center">
                    <Sparkles className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{t("outputPlaceholder")}</p>
                  </div>
                </div>
              )}
            </Card>

            <Button
              onClick={handleDownloadZip}
              className="w-full"
              disabled={icons.length === 0}
              variant="secondary"
            >
              <Download className="w-4 h-4 me-2" />
              {t("downloadZip")}
            </Button>
          </div>
        </div>
    </ToolShell>
  );
}
