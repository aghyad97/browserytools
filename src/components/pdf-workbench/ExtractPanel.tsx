"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { FileText, Upload, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SettingsCard } from "@/components/shared/SettingsCard";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { ActiveFileBar } from "@/components/pdf-workbench/ActiveFileBar";
import { useActiveFileIndex } from "@/components/pdf-workbench/useActiveFileIndex";
import { extractPdfText } from "@/lib/pdf/extract-text";
import type { PDFFile } from "@/components/pdf-workbench/ops";

const PDF_ACCEPT = { "application/pdf": [".pdf"] };

interface ExtractPanelProps {
  /** Shared PDF state from the shell. */
  files: PDFFile[];
  /** Shell's PDF drop handler (uploaded files join the shared state). */
  onDropPdf: (files: File[]) => void;
}

/**
 * Pull the text layer out of a single PDF with pdf.js (`extractPdfText`) and
 * hand the joined result to the shared `OutputPanel` (copy + .txt download).
 * A scanned/image-only PDF has no text layer, so `isEmpty` swaps the output for
 * a notice pointing at the OCR tool (Image to Text). Single-PDF op: a file
 * selector appears only when several PDFs are loaded.
 */
export function ExtractPanel({ files, onDropPdf }: ExtractPanelProps) {
  const t = useTranslations("Tools.PDFTools");

  const [selectedIndex, setSelectedIndex] = useActiveFileIndex(files);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [empty, setEmpty] = useState(false);

  const active = files[selectedIndex] ?? null;

  // Reset stale output when the active file changes.
  useEffect(() => {
    setResult(null);
    setEmpty(false);
  }, [active?.name, active?.data, active?.size]);

  const handleExtract = async () => {
    if (!active) return;
    setBusy(true);
    try {
      const { full, isEmpty } = await extractPdfText(active.data);
      setEmpty(isEmpty);
      setResult(isEmpty ? null : full);
    } catch {
      toast.error(t("errorExtracting"));
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
          inputProps={{ "data-testid": "pdf-extract-input" }}
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

  const base = active.name.replace(/\.pdf$/i, "");

  return (
    <div className="space-y-6">
      <ActiveFileBar
        files={files}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        onDropPdf={onDropPdf}
      />
      <SettingsCard>
        <Button className="w-full" onClick={handleExtract} disabled={busy}>
          <FileText className="w-4 h-4 me-2" />
          {busy ? t("extracting") : t("extractAction")}
        </Button>
      </SettingsCard>

      {empty && (
        <div
          className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground"
          role="note"
        >
          <Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
          <p>
            {t("extractEmptyNotice")}{" "}
            <Link href="/tools/image-to-text" className="font-medium underline">
              {t("extractEmptyLink")}
            </Link>
          </p>
        </div>
      )}

      {result != null && (
        <OutputPanel
          data-testid="extract-output"
          title={t("extractResultTitle")}
          text={result}
          filename={`${base}.txt`}
        />
      )}
    </div>
  );
}
