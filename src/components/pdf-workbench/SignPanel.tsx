"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PenLine, Upload } from "lucide-react";
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
import { ModePicker } from "@/components/shared/ModePicker";
import {
  SignaturePad,
  type Stroke,
  type SignaturePadHandle,
} from "@/components/shared/SignaturePad";
import { openPdf } from "@/lib/pdf/pdfjs-doc";
import { signPdf, type SignPlacement } from "@/lib/pdf/sign";
import { moveRect, resizeRect, type CropRect } from "@/lib/image/crop-rect";
import { downloadBlob } from "@/lib/download";
import type { PDFFile } from "@/components/pdf-workbench/ops";

const PDF_ACCEPT = { "application/pdf": [".pdf"] };
const PNG_ACCEPT = { "image/png": [".png"] };

/** pdf.js render scale for the placement preview (fits typical panel width). */
const PREVIEW_SCALE = 0.8;

/** Sensible starting box — lower-right, ~sig-line sized (normalized top-left). */
const DEFAULT_RECT: CropRect = { x: 0.55, y: 0.75, w: 0.3, h: 0.12 };

type SignSource = "draw" | "upload";

interface SignPanelProps {
  /** Shared PDF state from the shell. */
  files: PDFFile[];
  /** Shell's PDF drop handler (uploaded files join the shared state). */
  onDropPdf: (files: File[]) => void;
}

/** Convert a Blob to a Uint8Array (signature PNG → engine input). */
async function blobToBytes(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer());
}

/**
 * Place a signature (drawn on the shared SignaturePad, or an uploaded PNG) onto
 * a chosen page of a PDF. The page is rendered with pdf.js to a preview canvas;
 * a draggable/resizable box (normalized TOP-LEFT rect, reusing crop-rect math)
 * picks the target region. Apply calls `signPdf`, which y-flips the rect into
 * pdf-lib space exactly once. The preview + box live in a `dir="ltr"` island —
 * they map physical document space, which never mirrors under RTL.
 */
export function SignPanel({ files, onDropPdf }: SignPanelProps) {
  const t = useTranslations("Tools.PDFTools");

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [source, setSource] = useState<SignSource>("draw");
  const [busy, setBusy] = useState(false);

  // Draw source: strokes lifted here (parent owns them per the pad's contract).
  const padRef = useRef<SignaturePadHandle>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  // Upload source: the raw PNG bytes.
  const [uploadedPng, setUploadedPng] = useState<Uint8Array | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);

  // Page selection (1-based in the UI) + preview render state.
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  // The rendered page's /Rotate (0/90/180/270). The preview shows the page
  // upright; this records the viewer-space rotation so the engine maps the
  // placement back onto the unrotated MediaBox.
  const [pageRotation, setPageRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Placement box, normalized TOP-LEFT (fractions of the page).
  const [rect, setRect] = useState<CropRect>(DEFAULT_RECT);

  useEffect(() => {
    if (selectedIndex > files.length - 1) setSelectedIndex(0);
  }, [files.length, selectedIndex]);

  const active = files[selectedIndex] ?? null;

  // Reset per-file state when the active PDF changes.
  useEffect(() => {
    setPageNumber(1);
    setRect(DEFAULT_RECT);
    // openPdf is a stable module import; intentionally NOT a dep (OOM lesson).
  }, [active?.name, active?.data, active?.size]);

  // Render the chosen page to the preview canvas, and learn the page count.
  useEffect(() => {
    if (!active) {
      setPageCount(0);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const doc = await openPdf(active.data);
        if (cancelled) return;
        setPageCount(doc.numPages);
        const clampedPage = Math.min(Math.max(1, pageNumber), doc.numPages);
        const page = await doc.getPage(clampedPage);
        if (cancelled) return;
        // Record the page's /Rotate; the viewport (and thus the box we drag)
        // is captured in this rotated, upright-looking space.
        setPageRotation((((page.rotate ?? 0) % 360) + 360) % 360);
        const viewport = page.getViewport({ scale: PREVIEW_SCALE });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = Math.max(1, Math.round(viewport.width));
        canvas.height = Math.max(1, Math.round(viewport.height));
        await page.render({ canvasContext: ctx, viewport }).promise;
      } catch {
        // A render failure leaves the last frame; placement still works on the
        // normalized rect (it never reads pixels).
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [active?.name, active?.data, active?.size, pageNumber]);

  // ── Placement box drag / resize (normalized rect; crop-rect math) ──────────
  const startDrag = useCallback(
    (e: React.PointerEvent, mode: "move" | "resize") => {
      e.preventDefault();
      e.stopPropagation();
      const cont = containerRef.current?.getBoundingClientRect();
      if (!cont || cont.width === 0 || cont.height === 0) return;
      const startX = e.clientX;
      const startY = e.clientY;
      const startRect = rect;
      const onMove = (ev: PointerEvent) => {
        const dx = (ev.clientX - startX) / cont.width;
        const dy = (ev.clientY - startY) / cont.height;
        setRect(
          mode === "move"
            ? moveRect(startRect, dx, dy)
            : resizeRect(startRect, dx, dy, null, 1, 1),
        );
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [rect],
  );

  const handlePageInput = (value: string) => {
    const n = Number(value);
    if (!Number.isFinite(n)) {
      setPageNumber(1);
      return;
    }
    const max = pageCount || 1;
    setPageNumber(Math.min(Math.max(1, Math.round(n)), max));
  };

  const onUploadPng = useCallback(async (accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    const bytes = new Uint8Array(await file.arrayBuffer());
    setUploadedPng(bytes);
    setUploadedName(file.name);
  }, []);

  const hasSignature = source === "draw" ? strokes.length > 0 : uploadedPng !== null;

  const handleApply = async () => {
    if (!active || !hasSignature) return;
    setBusy(true);
    try {
      let png: Uint8Array;
      if (source === "draw") {
        const blob = await padRef.current?.getBlob();
        if (!blob) {
          toast.error(t("errorSigning"));
          return;
        }
        png = await blobToBytes(blob);
      } else {
        png = uploadedPng!;
      }

      const placement: SignPlacement = {
        pageIndex: Math.min(Math.max(1, pageNumber), pageCount || 1) - 1,
        x: rect.x,
        y: rect.y,
        w: rect.w,
        h: rect.h,
        pageRotation,
      };
      const out = await signPdf(active.data, png, placement);
      const base = active.name.replace(/\.pdf$/i, "");
      downloadBlob(
        new Blob([out as BlobPart], { type: "application/pdf" }),
        `${base}_signed.pdf`,
      );
      toast.success(t("signApplied"));
    } catch {
      toast.error(t("errorSigning"));
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
          inputProps={{ "data-testid": "pdf-sign-input" }}
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
        <OptionRow label={t("selectedFile")} htmlFor="pdf-sign-file">
          <Select
            value={String(selectedIndex)}
            onValueChange={(v) => setSelectedIndex(Number(v))}
          >
            <SelectTrigger id="pdf-sign-file" aria-label={t("selectedFile")}>
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

      <OptionRow label={t("signSourceLabel")}>
        <ModePicker
          aria-label={t("signSourceLabel")}
          value={source}
          onChange={(v) => setSource(v as SignSource)}
          options={[
            { value: "draw", label: t("signSourceDraw") },
            { value: "upload", label: t("signSourceUpload") },
          ]}
          data-testid="sign-source"
        />
      </OptionRow>

      {source === "draw" ? (
        <div
          className="rounded-lg border-2 border-dashed border-muted-foreground/40"
          // content value: fixed neutral checkerboard = "transparent background"
          // indicator (same convention as the Signature Maker), theme-independent.
          style={{
            backgroundImage:
              "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          }}
        >
          <SignaturePad
            ref={padRef}
            mode="draw"
            strokes={strokes}
            onStrokesChange={setStrokes}
          />
        </div>
      ) : (
        <FileDropzone
          onFiles={onUploadPng}
          accept={PNG_ACCEPT}
          inputProps={{ "data-testid": "sign-upload-input" }}
          className={({ isDragActive }) =>
            `rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 p-6 cursor-pointer transition-[border-color,background-color] duration-150 ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-muted-foreground hover:border-primary hover:bg-primary/5"
            }`
          }
        >
          <Upload className="w-6 h-6 text-primary" />
          <p className="text-sm font-medium">
            {uploadedName ?? t("signUploadHint")}
          </p>
        </FileDropzone>
      )}

      <OptionRow label={t("signPageLabel")} htmlFor="pdf-sign-page">
        <Input
          id="pdf-sign-page"
          type="number"
          dir="ltr"
          min={1}
          max={pageCount || 1}
          value={pageNumber}
          onChange={(e) => handlePageInput(e.target.value)}
          className="w-24"
        />
        {pageCount > 0 && (
          <span className="text-sm text-muted-foreground" dir="ltr">
            {t("pageOf", { current: pageNumber, total: pageCount })}
          </span>
        )}
      </OptionRow>

      {/* Physical document space: keep LTR so the box never mirrors under RTL. */}
      <div
        ref={containerRef}
        dir="ltr"
        className="relative mx-auto w-fit max-w-full touch-none select-none"
        data-testid="sign-preview"
      >
        <canvas ref={canvasRef} className="block max-w-full h-auto rounded-md border" />
        <div
          role="button"
          tabIndex={0}
          aria-label={t("signBoxLabel")}
          onPointerDown={(e) => startDrag(e, "move")}
          className="absolute cursor-move rounded-sm border-2 border-primary bg-primary/15"
          style={{
            left: `${rect.x * 100}%`,
            top: `${rect.y * 100}%`,
            width: `${rect.w * 100}%`,
            height: `${rect.h * 100}%`,
          }}
        >
          <span
            onPointerDown={(e) => startDrag(e, "resize")}
            className="absolute -bottom-1.5 -end-1.5 h-3 w-3 cursor-se-resize rounded-full border-2 border-primary bg-background"
            aria-hidden
          />
        </div>
      </div>

      <Button
        className="w-full"
        onClick={handleApply}
        disabled={busy || !hasSignature}
      >
        <PenLine className="w-4 h-4 me-2" />
        {busy ? t("signing") : t("applySign")}
      </Button>
    </SettingsCard>
  );
}
