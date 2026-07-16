"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Stamp, Upload, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { SliderRow } from "@/components/shared/SliderRow";
import { ModePicker } from "@/components/shared/ModePicker";
import { downloadBlob } from "@/lib/download";
import { watermarkPdf, type PdfWatermarkAnchor } from "@/lib/pdf/watermark";
import type { PDFFile } from "@/components/pdf-workbench/ops";

const PDF_ACCEPT = { "application/pdf": [".pdf"] };

const ANCHORS: readonly PdfWatermarkAnchor[] = [
  "diagonal",
  "center",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

/** "#3366cc" → { r: 0.2, g: 0.4, b: 0.8 } (pdf-lib rgb() 0..1 per channel). */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace(/^#/, "");
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}

interface WatermarkPanelProps {
  /** Shared PDF state from the shell. */
  files: PDFFile[];
  /** Shell's PDF drop handler (uploaded files join the shared state). */
  onDropPdf: (files: File[]) => void;
}

/**
 * Stamp a text watermark onto every page of a single PDF. The watermark is
 * applied on export (no live canvas preview this wave) — the note states that.
 * Apply is disabled when the text is empty/whitespace, which is the cheaper of
 * the two options for the engine's "empty-text" guard. When multiple PDFs are
 * loaded a file selector keeps the single-PDF op coherent.
 */
export function WatermarkPanel({ files, onDropPdf }: WatermarkPanelProps) {
  const t = useTranslations("Tools.PDFTools");

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [text, setText] = useState("DRAFT");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(30);
  const [anchor, setAnchor] = useState<PdfWatermarkAnchor>("diagonal");
  // content value: an arbitrary user-chosen fill color, not a UI token.
  const [color, setColor] = useState("#ff0000");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (selectedIndex > files.length - 1) setSelectedIndex(0);
  }, [files.length, selectedIndex]);

  const active = files[selectedIndex] ?? null;

  const anchorLabels: Record<PdfWatermarkAnchor, string> = useMemo(
    () => ({
      diagonal: t("anchorDiagonal"),
      center: t("anchorCenter"),
      "top-left": t("anchorTopLeft"),
      "top-right": t("anchorTopRight"),
      "bottom-left": t("anchorBottomLeft"),
      "bottom-right": t("anchorBottomRight"),
    }),
    [t]
  );

  const handleApply = async () => {
    if (!active || text.trim().length === 0) return;
    setBusy(true);
    try {
      const bytes = await watermarkPdf(active.data, {
        text,
        fontSize,
        opacity,
        anchor,
        color: hexToRgb(color),
      });
      const base = active.name.replace(/\.pdf$/i, "");
      downloadBlob(
        new Blob([bytes as BlobPart], { type: "application/pdf" }),
        `${base}_watermarked.pdf`
      );
      toast.success(t("watermarkApplied"));
    } catch {
      toast.error(t("errorWatermarking"));
    } finally {
      setBusy(false);
    }
  };

  if (!active) {
    return (
      <Card className="p-6">
        <FileDropzone
          onFiles={onDropPdf}
          accept={PDF_ACCEPT}
          inputProps={{ "data-testid": "pdf-watermark-input" }}
          className={({ isDragActive }) =>
            `h-48 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-4 p-8 cursor-pointer transition-[border-color,background-color] duration-150 ${
              isDragActive
                ? "border-primary bg-primary/10 scale-[0.99]"
                : "border-muted-foreground hover:border-primary hover:bg-primary/5"
            }`
          }
        >
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{t("dropHere")}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t("supportedFormats")}</p>
          </div>
        </FileDropzone>
      </Card>
    );
  }

  return (
    <SettingsCard>
      {files.length > 1 && (
        <OptionRow label={t("selectedFile")} htmlFor="pdf-watermark-file">
          <Select
            value={String(selectedIndex)}
            onValueChange={(v) => setSelectedIndex(Number(v))}
          >
            <SelectTrigger id="pdf-watermark-file" aria-label={t("selectedFile")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {files.map((file, index) => (
                <SelectItem key={file.name + index} value={String(index)}>
                  {file.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </OptionRow>
      )}

      <OptionRow label={t("watermarkTextLabel")} htmlFor="pdf-watermark-text">
        <Input
          id="pdf-watermark-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("watermarkTextPlaceholder")}
          maxLength={80}
        />
      </OptionRow>

      <SliderRow
        label={t("watermarkFontSize")}
        value={fontSize}
        display={<span dir="ltr">{fontSize}</span>}
        onChange={setFontSize}
        min={12}
        max={144}
        data-testid="watermark-font-size"
      />

      <SliderRow
        label={t("watermarkOpacity")}
        value={opacity}
        display={<span dir="ltr">{opacity}%</span>}
        onChange={setOpacity}
        min={0}
        max={100}
        data-testid="watermark-opacity"
      />

      <OptionRow label={t("watermarkPlacement")}>
        <ModePicker
          aria-label={t("watermarkPlacement")}
          value={anchor}
          onChange={(v) => setAnchor(v as PdfWatermarkAnchor)}
          options={ANCHORS.map((a) => ({ value: a, label: anchorLabels[a] }))}
          data-testid="watermark-anchor"
        />
      </OptionRow>

      <OptionRow label={t("watermarkColor")} htmlFor="pdf-watermark-color">
        {/* content color: the watermark fill the user picks, not a UI token. */}
        <Input
          id="pdf-watermark-color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-16 cursor-pointer p-1"
        />
      </OptionRow>

      <div
        className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground"
        role="note"
      >
        <Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
        <p>{t("watermarkAppliedOnExport")}</p>
      </div>

      <Button
        className="w-full"
        onClick={handleApply}
        disabled={busy || text.trim().length === 0}
      >
        <Stamp className="w-4 h-4 me-2" />
        {busy ? t("watermarking") : t("applyWatermark")}
      </Button>
    </SettingsCard>
  );
}
