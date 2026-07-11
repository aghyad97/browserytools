"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { downloadBlob } from "@/lib/download";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Copy, Download, Image as ImageIcon, FileImage } from "lucide-react";
import { toast } from "sonner";

interface SourceImage {
  url: string;
  name: string;
}

// Character ramps ordered from darkest (high luminance coverage) to lightest.
// Index 0 maps to the densest character.
const RAMP_PRESETS: Record<string, string> = {
  standard: "@%#*+=-:. ",
  detailed:
    "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
  blocks: "█▓▒░ ",
  binary: "10 ",
};

const RAMP_OPTIONS = [
  { value: "standard", labelKey: "rampStandard" as const },
  { value: "detailed", labelKey: "rampDetailed" as const },
  { value: "blocks", labelKey: "rampBlocks" as const },
  { value: "binary", labelKey: "rampBinary" as const },
];

interface AsciiCell {
  char: string;
  color: string;
}

export default function AsciiArt() {
  const t = useTranslations("Tools.AsciiArt");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [source, setSource] = useState<SourceImage | null>(null);
  const [columns, setColumns] = useState(100);
  const [ramp, setRamp] = useState<string>("standard");
  const [invert, setInvert] = useState(false);
  const [colored, setColored] = useState(false);

  // Plain text output (for <pre>, copy, .txt download).
  const [asciiText, setAsciiText] = useState("");
  // Per-cell color grid, only populated when `colored` is on.
  const [asciiGrid, setAsciiGrid] = useState<AsciiCell[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const preRef = useRef<HTMLPreElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast.error(t("imageTooLarge"));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSource({ url: reader.result as string, name: file.name });
      setAsciiText("");
      setAsciiGrid([]);
    };
    reader.readAsDataURL(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generate = useCallback(async () => {
    if (!source || isProcessing) return;
    setIsProcessing(true);
    try {
      const img = new Image();
      img.src = source.url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const cols = Math.max(10, Math.min(400, columns));
      // Characters are roughly twice as tall as wide; compensate so the
      // output keeps the image's aspect ratio.
      const aspect = (img.height || 1) / (img.width || 1);
      const rows = Math.max(1, Math.round(cols * aspect * 0.5));

      const canvas = document.createElement("canvas");
      canvas.width = cols;
      canvas.height = rows;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no ctx");
      ctx.drawImage(img, 0, 0, cols, rows);

      const { data } = ctx.getImageData(0, 0, cols, rows);
      const chars = RAMP_PRESETS[ramp] ?? RAMP_PRESETS.standard;
      const lastIndex = chars.length - 1;

      const lines: string[] = [];
      const grid: AsciiCell[][] = [];

      for (let y = 0; y < rows; y++) {
        let line = "";
        const gridRow: AsciiCell[] = [];
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const r = data[i] ?? 0;
          const g = data[i + 1] ?? 0;
          const b = data[i + 2] ?? 0;
          const a = data[i + 3] ?? 255;

          // Perceived luminance (Rec. 601), normalized 0..1.
          let lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          // Treat transparent pixels as the lightest (empty) value.
          if (a < 16) lum = 1;
          if (invert) lum = 1 - lum;

          // lum 0 (dark) -> densest char (index 0); lum 1 -> space.
          const idx = Math.min(lastIndex, Math.round((1 - lum) * lastIndex));
          const ch = chars[idx];
          line += ch;
          if (colored) {
            gridRow.push({
              char: ch === " " ? " " : ch,
              color: `rgb(${r},${g},${b})`,
            });
          }
        }
        lines.push(line);
        if (colored) grid.push(gridRow);
      }

      setAsciiText(lines.join("\n"));
      setAsciiGrid(colored ? grid : []);
      toast.success(t("generated"));
    } catch (e) {
      console.error(e);
      toast.error(t("generateFailed"));
    } finally {
      setIsProcessing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, columns, ramp, invert, colored, isProcessing]);

  const handleCopy = async () => {
    if (!asciiText) return;
    try {
      await navigator.clipboard.writeText(asciiText);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  const handleDownloadTxt = () => {
    if (!asciiText) return;
    const blob = new Blob([asciiText], { type: "text/plain" });
    const base = source?.name.split(".")[0] || "ascii-art";
    downloadBlob(blob, `${base}.txt`);
    toast.success(t("downloadedTxt"));
  };

  const handleDownloadPng = () => {
    if (!asciiText) return;
    try {
      const lines = asciiText.split("\n");
      const fontSize = 10;
      const charW = fontSize * 0.6;
      const lineH = fontSize * 1.0;
      const maxCols = lines.reduce((m, l) => Math.max(m, l.length), 0);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.ceil(maxCols * charW));
      canvas.height = Math.max(1, Math.ceil(lines.length * lineH));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no ctx");
      ctx.fillStyle = invert ? "#000000" : "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = "top";

      if (colored && asciiGrid.length) {
        for (let y = 0; y < asciiGrid.length; y++) {
          const row = asciiGrid[y];
          for (let x = 0; x < row.length; x++) {
            const cell = row[x];
            if (cell.char === " " || cell.char === " ") continue;
            ctx.fillStyle = cell.color;
            ctx.fillText(cell.char, x * charW, y * lineH);
          }
        }
      } else {
        ctx.fillStyle = invert ? "#ffffff" : "#000000";
        for (let y = 0; y < lines.length; y++) {
          ctx.fillText(lines[y], 0, y * lineH);
        }
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error(t("generateFailed"));
          return;
        }
        const base = source?.name.split(".")[0] || "ascii-art";
        downloadBlob(blob, `${base}-ascii.png`);
        toast.success(t("downloadedPng"));
      }, "image/png");
    } catch (e) {
      console.error(e);
      toast.error(t("generateFailed"));
    }
  };

  // Auto-regenerate when settings change after a first generation exists.
  useEffect(() => {
    if (source && asciiText) {
      const id = setTimeout(() => {
        void generate();
      }, 150);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, ramp, invert, colored]);

  return (
    <ToolShell
      slug="ascii-art"
      title={tc("tools.ascii-art.name")}
      sub={tc("tools.ascii-art.description")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls column */}
          <div className="space-y-4">
            <Card className="p-6 shadow-none">
              <FileDropzone
                onFiles={onDrop}
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"],
                }}
                multiple={false}
                inputProps={{ "data-testid": "ascii-file-input" }}
                className={({ isDragActive }) =>
                  `h-56 rounded-lg border-2 border-dashed flex flex-col items-center justify-center space-y-4 p-8 cursor-pointer transition-all duration-200 ${
                    isDragActive
                      ? "border-primary bg-primary/10 scale-[0.99]"
                      : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                  }`
                }
              >
                {source ? (
                  <div className="w-full h-full relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={source.url}
                      alt={t("altOriginal")}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      {t("dropImageHere")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("supportedFormats")}
                    </p>
                  </div>
                )}
              </FileDropzone>
            </Card>

            <Card className="p-4 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">{t("width")}</label>
                  <span className="text-sm text-muted-foreground">
                    {columns}
                  </span>
                </div>
                <Slider
                  value={[columns]}
                  onValueChange={([v]) => setColumns(v)}
                  min={20}
                  max={300}
                  step={5}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("charset")}</label>
                <Select value={ramp} onValueChange={setRamp}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RAMP_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.value === "standard"
                          ? t("rampStandard")
                          : opt.value === "detailed"
                          ? t("rampDetailed")
                          : opt.value === "blocks"
                          ? t("rampBlocks")
                          : t("rampBinary")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="ascii-invert"
                  data-testid="ascii-invert"
                  checked={invert}
                  onCheckedChange={(c) => setInvert(Boolean(c))}
                />
                <label htmlFor="ascii-invert" className="text-sm font-medium">
                  {t("invert")}
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="ascii-colored"
                  data-testid="ascii-colored"
                  checked={colored}
                  onCheckedChange={(c) => setColored(Boolean(c))}
                />
                <label htmlFor="ascii-colored" className="text-sm font-medium">
                  {t("colored")}
                </label>
              </div>

              <Button
                onClick={generate}
                className="w-full"
                disabled={!source || isProcessing}
                data-testid="ascii-generate"
              >
                {isProcessing ? t("processing") : t("generate")}
              </Button>
            </Card>
          </div>

          {/* Output column */}
          <div className="space-y-4">
            <Card className="p-4">
              <div className="h-[28rem] overflow-auto rounded-lg bg-muted/40 p-3">
                {asciiText ? (
                  <pre
                    ref={preRef}
                    dir="ltr"
                    data-testid="ascii-output"
                    className="font-mono leading-none whitespace-pre text-[6px] sm:text-[7px] md:text-[8px]"
                  >
                    {colored && asciiGrid.length
                      ? asciiGrid.map((row, y) => (
                          <div key={y}>
                            {row.map((cell, x) => (
                              <span key={x} style={{ color: cell.color }}>
                                {cell.char}
                              </span>
                            ))}
                          </div>
                        ))
                      : asciiText}
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {t("outputPlaceholder")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button
                onClick={handleCopy}
                disabled={!asciiText}
                variant="secondary"
                data-testid="ascii-copy"
              >
                <Copy className="w-4 h-4 me-2" />
                {tCommon("copy")}
              </Button>
              <Button
                onClick={handleDownloadTxt}
                disabled={!asciiText}
                variant="secondary"
                data-testid="ascii-download-txt"
              >
                <Download className="w-4 h-4 me-2" />
                {t("downloadTxt")}
              </Button>
              <Button
                onClick={handleDownloadPng}
                disabled={!asciiText}
                variant="secondary"
                data-testid="ascii-download-png"
              >
                <FileImage className="w-4 h-4 me-2" />
                {t("downloadPng")}
              </Button>
            </div>
          </div>
      </div>
    </ToolShell>
  );
}
