"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Minimize2, Upload, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { ModePicker } from "@/components/shared/ModePicker";
import { StatStrip } from "@/components/shared/StatStrip";
import { ActiveFileBar } from "@/components/pdf-workbench/ActiveFileBar";
import { useActiveFileIndex } from "@/components/pdf-workbench/useActiveFileIndex";
import { downloadBlob } from "@/lib/download";
import { formatBytes, formatPercent } from "@/lib/format";
import {
  compressPdf,
  type CompressPreset,
  type CompressResult,
} from "@/lib/pdf/compress";
import type { PDFFile } from "@/components/pdf-workbench/ops";

const PDF_ACCEPT = { "application/pdf": [".pdf"] };

const PRESETS: readonly CompressPreset[] = ["high", "balanced", "small"];

interface CompressPanelProps {
  /** Shared PDF state from the shell. */
  files: PDFFile[];
  /** Shell's PDF drop handler (uploaded files join the shared state). */
  onDropPdf: (files: File[]) => void;
}

/**
 * Compress a single PDF via rasterize-and-re-encode presets. When multiple PDFs
 * are loaded the panel exposes a file selector (mirroring the Split tab) so the
 * single-PDF operation stays coherent; it defaults to the first file.
 */
export function CompressPanel({ files, onDropPdf }: CompressPanelProps) {
  const t = useTranslations("Tools.PDFTools");

  const [selectedIndex, setSelectedIndex] = useActiveFileIndex(files);
  const [preset, setPreset] = useState<CompressPreset>("balanced");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<CompressResult | null>(null);

  // Clear any stale result when the active file changes.
  useEffect(() => {
    setResult(null);
  }, [selectedIndex]);

  const active = files[selectedIndex] ?? null;

  const presetLabels: Record<CompressPreset, string> = useMemo(
    () => ({
      high: t("compressHigh"),
      balanced: t("compressBalanced"),
      small: t("compressSmall"),
    }),
    [t]
  );
  const presetHints: Record<CompressPreset, string> = useMemo(
    () => ({
      high: t("compressHighHint"),
      balanced: t("compressBalancedHint"),
      small: t("compressSmallHint"),
    }),
    [t]
  );

  const handleCompress = async () => {
    if (!active) return;
    setBusy(true);
    setResult(null);
    try {
      const res = await compressPdf(active.data, preset);
      setResult(res);
      const base = active.name.replace(/\.pdf$/i, "");
      downloadBlob(
        new Blob([res.bytes as BlobPart], { type: "application/pdf" }),
        `${base}_compressed.pdf`
      );
      const reduction = res.before > 0 ? (res.before - res.after) / res.before : 0;
      toast.success(
        t("compressedSuccess", {
          before: formatBytes(res.before),
          after: formatBytes(res.after),
          ratio: (reduction * 100).toFixed(0),
        })
      );
    } catch {
      toast.error(t("errorCompressing"));
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
          inputProps={{ "data-testid": "pdf-compress-input" }}
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

  const reduction =
    result && result.before > 0
      ? (result.before - result.after) / result.before
      : 0;

  return (
    <div className="space-y-6">
      <ActiveFileBar
        files={files}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        onDropPdf={onDropPdf}
      />
      <SettingsCard>
        <OptionRow label={t("compressLevel")} hint={presetHints[preset]}>
          <ModePicker
            aria-label={t("compressLevel")}
            value={preset}
            onChange={(v) => setPreset(v as CompressPreset)}
            options={PRESETS.map((p) => ({ value: p, label: presetLabels[p] }))}
            data-testid="compress-preset"
          />
        </OptionRow>

        {/* Rasterization honesty note — ALWAYS visible. */}
        <div
          className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground"
          role="note"
        >
          <Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
          <p>{t("compressRasterNote")}</p>
        </div>

        {result && (
          <StatStrip
            data-testid="compress-stats"
            items={[
              {
                label: t("compressBefore"),
                value: <span dir="ltr">{formatBytes(result.before)}</span>,
              },
              {
                label: t("compressAfter"),
                value: <span dir="ltr">{formatBytes(result.after)}</span>,
              },
              {
                label: t("compressReduction"),
                value: <span dir="ltr">{formatPercent(reduction, 0)}</span>,
              },
            ]}
          />
        )}

        <Button className="w-full" onClick={handleCompress} disabled={busy}>
          <Minimize2 className="w-4 h-4 me-2" />
          {busy ? t("compressing") : t("applyCompress")}
        </Button>
      </SettingsCard>
    </div>
  );
}
