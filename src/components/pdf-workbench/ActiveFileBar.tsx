"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OptionRow } from "@/components/shared/SettingsCard";
import { formatBytes } from "@/lib/format";
import type { PDFFile } from "@/components/pdf-workbench/ops";

const PDF_ACCEPT = "application/pdf,.pdf";

interface ActiveFileBarProps {
  /** Shared PDF state from the shell. */
  files: PDFFile[];
  /** Index of the file the panel currently operates on. */
  selectedIndex: number;
  /** Switch the active file (selector, or auto-select after a Change upload). */
  onSelect: (index: number) => void;
  /** Shell's PDF drop handler (uploaded files join the shared state). */
  onDropPdf: (files: File[]) => void;
}

/**
 * Compact "active file" row for the PDF workbench's single-PDF panels
 * (Compress / Rotate / Reorder / Watermark / Extract / Sign) — mirrors
 * CropImage's file-info + Change pattern so users are never stuck once a PDF
 * loads. Shows the active file's name + size and a Change button that reopens
 * a hidden file input; the picked file is routed through `onDropPdf` (joining
 * the shared `files` state the panels already read) and immediately
 * auto-selected. When more than one PDF is loaded, the file selector the
 * panels already had is rendered here instead, so there is a single source of
 * truth for which file is active.
 */
export function ActiveFileBar({
  files,
  selectedIndex,
  onSelect,
  onDropPdf,
}: ActiveFileBarProps) {
  const t = useTranslations("Tools.PDFTools");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const active = files[selectedIndex] ?? files[0] ?? null;
  if (!active) return null;

  return (
    <div className="space-y-3">
      <div
        className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border"
        data-testid="active-file-bar"
      >
        <FileText className="w-8 h-8 text-primary shrink-0" aria-hidden />
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{active.name}</p>
          <p className="text-sm text-muted-foreground" dir="ltr">
            {formatBytes(active.size)}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <RefreshCw className="w-4 h-4 me-1" />
          {t("change")}
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={PDF_ACCEPT}
        data-testid="active-file-bar-input"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          // onDropPdf is async (the shell validates + decodes before it lands
          // in the shared `files` array) — selecting the new file once it
          // actually arrives is the panel's job, via useActiveFileIndex.
          if (file) onDropPdf([file]);
          // Allow re-selecting the same file twice in a row.
          e.target.value = "";
        }}
      />

      {files.length > 1 && (
        <OptionRow label={t("selectedFile")} htmlFor="pdf-active-file-select">
          <Select
            value={String(selectedIndex)}
            onValueChange={(v) => onSelect(Number(v))}
          >
            <SelectTrigger
              id="pdf-active-file-select"
              aria-label={t("selectedFile")}
              data-testid="active-file-bar-select"
            >
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
    </div>
  );
}
