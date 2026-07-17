"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ListOrdered, Upload, File as FileIcon, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SettingsCard } from "@/components/shared/SettingsCard";
import { ActiveFileBar } from "@/components/pdf-workbench/ActiveFileBar";
import { useActiveFileIndex } from "@/components/pdf-workbench/useActiveFileIndex";
import { downloadBlob } from "@/lib/download";
import { reorderPdf } from "@/lib/pdf/reorder";
import { usePageThumbnails } from "@/components/pdf-workbench/usePageThumbnails";
import type { PDFFile } from "@/components/pdf-workbench/ops";

const PDF_ACCEPT = { "application/pdf": [".pdf"] };

interface ReorderPanelProps {
  /** Shared PDF state from the shell. */
  files: PDFFile[];
  /** Shell's PDF drop handler (uploaded files join the shared state). */
  onDropPdf: (files: File[]) => void;
}

/**
 * Reorder and delete pages of a single PDF. Every source page is rendered as a
 * thumbnail (via `usePageThumbnails`); `order` holds the SOURCE page indices in
 * their current display order. Native HTML5 drag (mirroring PhotoCollage) moves
 * a slot; the ✕ button removes one. Position badges show each page's CURRENT
 * 1-based slot. Apply hands `reorderPdf` the `order` array — pages missing from
 * it are dropped from the output — so deleting all pages disables Apply. When
 * multiple PDFs are loaded a file selector keeps the single-PDF op coherent.
 */
export function ReorderPanel({ files, onDropPdf }: ReorderPanelProps) {
  const t = useTranslations("Tools.PDFTools");

  const [selectedIndex, setSelectedIndex] = useActiveFileIndex(files);
  const [order, setOrder] = useState<number[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const active = files[selectedIndex] ?? null;
  const { pageCount, rendering, thumbFor } = usePageThumbnails(active, selectedIndex);

  // Reset the working order to identity whenever the active file (or its page
  // count) changes. Drag/delete mutate `order` only; they never change pageCount.
  useEffect(() => {
    setOrder(Array.from({ length: pageCount }, (_, i) => i));
  }, [pageCount, active?.name, active?.size, selectedIndex]);

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    setOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const deleteAt = (position: number) => {
    setOrder((prev) => prev.filter((_, i) => i !== position));
  };

  const handleApply = async () => {
    if (!active || order.length === 0) return;
    setBusy(true);
    try {
      const bytes = await reorderPdf(active.data, order);
      const base = active.name.replace(/\.pdf$/i, "");
      downloadBlob(
        new Blob([bytes as BlobPart], { type: "application/pdf" }),
        `${base}_reordered.pdf`
      );
      toast.success(t("reorderApplied", { count: order.length }));
    } catch {
      toast.error(t("errorReordering"));
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
          inputProps={{ "data-testid": "pdf-reorder-input" }}
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
    <div className="space-y-6">
      <ActiveFileBar
        files={files}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        onDropPdf={onDropPdf}
      />
      <SettingsCard>
        <p className="text-sm text-muted-foreground">{t("dragToReorderPages")}</p>

        {rendering && (
          <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
            {t("renderingPages")}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {order.map((pageIndex, position) => {
            const src = thumbFor(pageIndex);
            return (
              <div
                key={pageIndex}
                draggable
                data-testid={`reorder-thumb-${position}`}
                onDragStart={() => setDragIndex(position)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null) reorder(dragIndex, position);
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
                className="group relative flex aspect-[3/4] cursor-grab items-center justify-center overflow-hidden rounded-md border bg-muted/40 p-2 transition-colors hover:border-primary active:cursor-grabbing"
              >
                {src ? (
                  <img
                    src={src}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    draggable={false}
                  />
                ) : (
                  <FileIcon className="w-6 h-6 text-muted-foreground" aria-hidden />
                )}
                {/* content value: bg-black/60 text-white — the delete affordance sits
                    on top of arbitrary rendered pages, so it keeps a fixed dark scrim
                    independent of theme. */}
                <button
                  type="button"
                  aria-label={t("deletePage", { number: position + 1 })}
                  onClick={() => deleteAt(position)}
                  className="absolute end-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
                <span
                  dir="ltr"
                  className="absolute bottom-1 start-1 rounded bg-background/80 px-1.5 py-0.5 text-xs text-muted-foreground"
                >
                  {position + 1}
                </span>
              </div>
            );
          })}
        </div>

        <Button
          className="w-full"
          onClick={handleApply}
          disabled={busy || rendering || order.length === 0}
        >
          <ListOrdered className="w-4 h-4 me-2" />
          {busy ? t("reordering") : t("applyReorder")}
        </Button>
      </SettingsCard>
    </div>
  );
}
