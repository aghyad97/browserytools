"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { RotateCw, RotateCcw, Upload, File as FileIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { downloadBlob } from "@/lib/download";
import { rotatePdf } from "@/lib/pdf/rotate";
import { openPdf } from "@/lib/pdf/pdfjs-doc";
import type { PDFFile } from "@/components/pdf-workbench/ops";

const PDF_ACCEPT = { "application/pdf": [".pdf"] };
const THUMB_SCALE = 0.3;

interface RotatePanelProps {
  /** Shared PDF state from the shell. */
  files: PDFFile[];
  /** Shell's PDF drop handler (uploaded files join the shared state). */
  onDropPdf: (files: File[]) => void;
}

/**
 * Persisted per-page rotation. Renders every page as a thumbnail (pdf.js at
 * scale 0.3, cached per file+page across selections), clicking a page adds 90°
 * cumulatively, and the preview shows the absolute angle via CSS transform.
 * Apply hands `rotatePdf` an ABSOLUTE map that includes only the pages the user
 * actually turned. When multiple PDFs are loaded a file selector keeps the
 * single-PDF operation coherent; it defaults to the first file.
 */
export function RotatePanel({ files, onDropPdf }: RotatePanelProps) {
  const t = useTranslations("Tools.PDFTools");

  const [selectedIndex, setSelectedIndex] = useState(0);
  // Absolute target angle (0/90/180/270) per 0-based page index.
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [pageCount, setPageCount] = useState(0);
  const [rendering, setRendering] = useState(false);
  const [busy, setBusy] = useState(false);
  // Thumbnail cache keyed `${name}#${pageIndex}` — persists across file switches.
  const cacheRef = useRef<Record<string, string>>({});
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (selectedIndex > files.length - 1) setSelectedIndex(0);
  }, [files.length, selectedIndex]);

  const active = files[selectedIndex] ?? null;

  // Render (or reuse cached) thumbnails whenever the active file changes.
  useEffect(() => {
    if (!active) {
      setPageCount(0);
      return;
    }
    let cancelled = false;
    setRotations({});
    setRendering(true);
    (async () => {
      try {
        const doc = await openPdf(active.data);
        if (cancelled) return;
        setPageCount(doc.numPages);
        for (let i = 0; i < doc.numPages; i++) {
          const key = `${active.name}#${i}`;
          if (cacheRef.current[key]) continue;
          const page = await doc.getPage(i + 1);
          const viewport = page.getViewport({ scale: THUMB_SCALE });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          canvas.width = Math.max(1, Math.round(viewport.width));
          canvas.height = Math.max(1, Math.round(viewport.height));
          await page.render({ canvasContext: ctx, viewport }).promise;
          if (cancelled) return;
          cacheRef.current[key] = canvas.toDataURL("image/png");
          forceTick((n) => n + 1);
        }
      } catch {
        if (!cancelled) toast.error(t("errorRotating"));
      } finally {
        if (!cancelled) setRendering(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [active?.name, active?.data, t]);

  const bump = (index: number, delta: number) => {
    setRotations((prev) => ({
      ...prev,
      [index]: (((prev[index] ?? 0) + delta) % 360 + 360) % 360,
    }));
  };

  const rotateAll = (delta: number) => {
    setRotations((prev) => {
      const next: Record<number, number> = { ...prev };
      for (let i = 0; i < pageCount; i++) {
        next[i] = (((prev[i] ?? 0) + delta) % 360 + 360) % 360;
      }
      return next;
    });
  };

  // Absolute map of ONLY the pages the user actually turned.
  const changed = useMemo(() => {
    const map: Record<number, number> = {};
    for (const [k, v] of Object.entries(rotations)) {
      if (v % 360 !== 0) map[Number(k)] = v;
    }
    return map;
  }, [rotations]);

  const handleApply = async () => {
    if (!active) return;
    if (Object.keys(changed).length === 0) {
      toast.info(t("noChangesToApply"));
      return;
    }
    setBusy(true);
    try {
      const bytes = await rotatePdf(active.data, changed);
      const base = active.name.replace(/\.pdf$/i, "");
      downloadBlob(
        new Blob([bytes as BlobPart], { type: "application/pdf" }),
        `${base}_rotated.pdf`
      );
      toast.success(t("rotateApplied", { count: Object.keys(changed).length }));
    } catch {
      toast.error(t("errorRotating"));
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
          inputProps={{ "data-testid": "pdf-rotate-input" }}
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
        <OptionRow label={t("selectedFile")} htmlFor="pdf-rotate-file">
          <Select
            value={String(selectedIndex)}
            onValueChange={(v) => setSelectedIndex(Number(v))}
          >
            <SelectTrigger id="pdf-rotate-file" aria-label={t("selectedFile")}>
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{t("rotateHint")}</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            aria-label={t("rotateAllCcw")}
            onClick={() => rotateAll(-90)}
          >
            <RotateCcw className="w-4 h-4 me-2" />
            {t("rotateAllCcw")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-label={t("rotateAllCw")}
            onClick={() => rotateAll(90)}
          >
            <RotateCw className="w-4 h-4 me-2" />
            {t("rotateAllCw")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: pageCount }, (_, i) => {
          const angle = rotations[i] ?? 0;
          const src = cacheRef.current[`${active.name}#${i}`];
          return (
            <button
              key={i}
              type="button"
              data-testid={`rotate-thumb-${i}`}
              aria-label={t("rotatePage", { number: i + 1 })}
              onClick={() => bump(i, 90)}
              className="group relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md border bg-muted/40 p-2 transition-colors hover:border-primary"
            >
              {src ? (
                <img
                  src={src}
                  alt=""
                  className="max-h-full max-w-full object-contain transition-transform"
                  style={{ transform: `rotate(${angle}deg)` }}
                />
              ) : (
                <FileIcon className="w-6 h-6 text-muted-foreground" aria-hidden />
              )}
              {angle !== 0 && (
                <span
                  dir="ltr"
                  className="absolute end-1 top-1 rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground"
                >
                  {t("rotatedBadge", { degrees: angle })}
                </span>
              )}
              <span
                dir="ltr"
                className="absolute bottom-1 start-1 rounded bg-background/80 px-1.5 py-0.5 text-xs text-muted-foreground"
              >
                {i + 1}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        className="w-full"
        onClick={handleApply}
        disabled={busy || rendering || Object.keys(changed).length === 0}
      >
        <RotateCw className="w-4 h-4 me-2" />
        {busy ? t("rotating") : t("applyRotate")}
      </Button>
    </SettingsCard>
  );
}
