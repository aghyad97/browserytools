"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Upload,
  File,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  FilePlus,
  SplitSquareHorizontal,
  Image as ImageIcon,
  Download,
  X,
  Minimize2,
  RotateCw,
  ListOrdered,
  Stamp,
  FileText,
  PenLine,
} from "lucide-react";
import { toast } from "sonner";
import { PDFPreview } from "@/components/pdf-preview";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { downloadBlob } from "@/lib/download";
import { formatBytes } from "@/lib/format";
import { type WorkbenchOp } from "@/components/pdf-workbench/ops";
import { CompressPanel } from "@/components/pdf-workbench/CompressPanel";
import { RotatePanel } from "@/components/pdf-workbench/RotatePanel";
import { ReorderPanel } from "@/components/pdf-workbench/ReorderPanel";
import { WatermarkPanel } from "@/components/pdf-workbench/WatermarkPanel";
import { ExtractPanel } from "@/components/pdf-workbench/ExtractPanel";
import { SignPanel } from "@/components/pdf-workbench/SignPanel";
import * as pdfjsLib from "pdfjs-dist";

// Initialize PDF.js worker for thumbnails. Another agent self-hosts the worker
// from /public; we keep using GlobalWorkerOptions so whichever workerSrc is set
// (CDN or self-hosted file) is honored. Only set a default if none exists.
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

interface PDFFile {
  name: string;
  size: number;
  data: Uint8Array;
  pageCount?: number;
}

interface ImageFile {
  name: string;
  size: number;
  type: string;
  data: Uint8Array;
  url: string;
}

type PageSize = "a4" | "letter" | "fit";
type Orientation = "portrait" | "landscape";

// Page dimensions in PDF points (1pt = 1/72 inch).
const PAGE_DIMENSIONS: Record<string, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

function downloadPdfBytes(data: Uint8Array, filename: string) {
  downloadBlob(new Blob([data as BlobPart], { type: "application/pdf" }), filename);
}

export default function PDFTools({
  slug = "pdf",
  preset,
}: { slug?: string; preset?: { op?: WorkbenchOp } } = {}) {
  const t = useTranslations("Tools.PDFTools");
  const tc = useTranslations("ToolsConfig");

  // ── Shared PDF state (Merge + Split tabs) ──────────────────────────────────
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState<PDFFile | null>(null);
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});
  const [thumbnailLoading, setThumbnailLoading] = useState<{
    [key: string]: boolean;
  }>({});

  // ── Split tab state ────────────────────────────────────────────────────────
  const [splitFileIndex, setSplitFileIndex] = useState(0);
  const [splitMode, setSplitMode] = useState<"range" | "all">("range");
  const [pageRanges, setPageRanges] = useState("");

  // ── Images → PDF tab state ──────────────────────────────────────────────────
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState(24);

  const generateThumbnail = async (pdfData: Uint8Array, filename: string) => {
    try {
      setThumbnailLoading((prev) => ({ ...prev, [filename]: true }));
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) return;

      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      const pdfDoc = await loadingTask.promise;
      const page = await pdfDoc.getPage(1);
      const viewport = page.getViewport({ scale: 0.3 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport }).promise;
      setThumbnails((prev) => ({
        ...prev,
        [filename]: canvas.toDataURL("image/png"),
      }));
    } catch (error) {
      console.error("Error generating thumbnail:", error);
    } finally {
      setThumbnailLoading((prev) => ({ ...prev, [filename]: false }));
    }
  };

  // ── PDF upload ──────────────────────────────────────────────────────────────
  const onDropPdf = useCallback(async (acceptedFiles: File[]) => {
    try {
      setLoading(true);
      const newFiles = await Promise.all(
        acceptedFiles.map(async (file): Promise<PDFFile | null> => {
          const data = new Uint8Array(await file.arrayBuffer());
          try {
            const pdf = await PDFDocument.load(data);
            const pageCount = pdf.getPageCount();
            generateThumbnail(data, file.name);
            return { name: file.name, size: file.size, data, pageCount };
          } catch {
            toast.error(t("errorReadingFile", { name: file.name }));
            return null;
          }
        })
      );
      const validFiles = newFiles.filter((f): f is PDFFile => f !== null);
      setFiles((prev) => [...prev, ...validFiles]);
      if (validFiles.length > 0) {
        toast.success(t("addedPdfs", { count: validFiles.length }));
      }
    } catch {
      toast.error(t("errorLoadingPdfs"));
    } finally {
      setLoading(false);
    }
  }, []);

  const pdfAccept = { "application/pdf": [".pdf"] };

  // ── Image upload ──────────────────────────────────────────────────────────────
  const onDropImages = useCallback(async (acceptedFiles: File[]) => {
    const newImages = await Promise.all(
      acceptedFiles.map(async (file) => {
        const data = new Uint8Array(await file.arrayBuffer());
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          data,
          url: URL.createObjectURL(file),
        } as ImageFile;
      })
    );
    setImages((prev) => [...prev, ...newImages]);
    if (newImages.length > 0) {
      toast.success(t("addedImages", { count: newImages.length }));
    }
  }, []);

  const imageAccept = { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] };

  // ── Reorder / remove helpers ──────────────────────────────────────────────────
  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    setFiles(files.filter((_, i) => i !== index));
    setThumbnails((prev) => {
      const next = { ...prev };
      delete next[fileToRemove.name];
      return next;
    });
    if (splitFileIndex >= files.length - 1) setSplitFileIndex(0);
    toast.success(t("removedFile", { name: fileToRemove.name }));
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const next = [...images];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    setImages(next);
  };

  const removeImage = (index: number) => {
    const img = images[index];
    URL.revokeObjectURL(img.url);
    setImages(images.filter((_, i) => i !== index));
  };

  // ── Merge ──────────────────────────────────────────────────────────────────
  const mergePDFs = async () => {
    if (files.length < 2) {
      toast.error(t("needTwoPdfs"));
      return;
    }
    setLoading(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const pdf = await PDFDocument.load(file.data);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }
      const bytes = await merged.save();
      downloadPdfBytes(bytes, "merged.pdf");
      toast.success(t("mergedSuccess"));
    } catch {
      toast.error(t("errorMerging"));
    } finally {
      setLoading(false);
    }
  };

  // ── Split / Extract ───────────────────────────────────────────────────────────
  const splitPDF = async () => {
    const file = files[splitFileIndex];
    if (!file) return;
    setLoading(true);
    try {
      const pdf = await PDFDocument.load(file.data);
      const totalPages = pdf.getPageCount();
      const baseName = file.name.replace(/\.pdf$/i, "");

      if (splitMode === "all") {
        // One PDF per page → zip when more than one page.
        const outputs: { name: string; bytes: Uint8Array }[] = [];
        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(pdf, [i]);
          newPdf.addPage(page);
          outputs.push({
            name: `${baseName}_page_${i + 1}.pdf`,
            bytes: await newPdf.save(),
          });
        }
        if (outputs.length === 1) {
          downloadPdfBytes(outputs[0].bytes, outputs[0].name);
        } else {
          const zip = new JSZip();
          outputs.forEach((o) => zip.file(o.name, o.bytes as Uint8Array));
          const blob = await zip.generateAsync({ type: "blob" });
          downloadBlob(blob, `${baseName}_pages.zip`);
        }
        toast.success(t("splitSuccess", { count: outputs.length }));
        return;
      }

      // Range mode: parse "1-3,5,7-9".
      const ranges = pageRanges.split(",").map((range) => {
        const trimmed = range.trim();
        if (trimmed.includes("-")) {
          const [start, end] = trimmed.split("-").map(Number);
          if (isNaN(start) || isNaN(end)) throw new Error("invalid");
          return { start: start - 1, end: end - 1 };
        }
        const page = Number(trimmed);
        if (isNaN(page)) throw new Error("invalid");
        return { start: page - 1, end: page - 1 };
      });

      for (const range of ranges) {
        if (range.start < 0 || range.end >= totalPages || range.start > range.end) {
          throw new Error("range");
        }
      }

      const outputs: { name: string; bytes: Uint8Array }[] = [];
      for (const [index, range] of ranges.entries()) {
        const newPdf = await PDFDocument.create();
        const indices = Array.from(
          { length: range.end - range.start + 1 },
          (_, i) => range.start + i
        );
        const pages = await newPdf.copyPages(pdf, indices);
        pages.forEach((page) => newPdf.addPage(page));
        outputs.push({
          name:
            ranges.length === 1
              ? `${baseName}_extract.pdf`
              : `${baseName}_part_${index + 1}.pdf`,
          bytes: await newPdf.save(),
        });
      }

      if (outputs.length === 1) {
        downloadPdfBytes(outputs[0].bytes, outputs[0].name);
      } else {
        const zip = new JSZip();
        outputs.forEach((o) => zip.file(o.name, o.bytes as Uint8Array));
        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, `${baseName}_split.zip`);
      }
      toast.success(t("splitSuccess", { count: outputs.length }));
    } catch {
      toast.error(t("errorSplitting"));
    } finally {
      setLoading(false);
    }
  };

  // ── Images → PDF ──────────────────────────────────────────────────────────────
  const imagesToPDF = async () => {
    if (images.length === 0) {
      toast.error(t("needOneImage"));
      return;
    }
    setLoading(true);
    try {
      const pdf = await PDFDocument.create();
      for (const img of images) {
        const embedded =
          img.type === "image/png"
            ? await pdf.embedPng(img.data)
            : await pdf.embedJpg(img.data);

        let pageW: number;
        let pageH: number;
        if (pageSize === "fit") {
          pageW = embedded.width + margin * 2;
          pageH = embedded.height + margin * 2;
        } else {
          let [w, h] = PAGE_DIMENSIONS[pageSize];
          if (orientation === "landscape") [w, h] = [h, w];
          pageW = w;
          pageH = h;
        }

        const page = pdf.addPage([pageW, pageH]);
        const availW = pageW - margin * 2;
        const availH = pageH - margin * 2;
        const scale = Math.min(availW / embedded.width, availH / embedded.height, 1);
        const drawW = embedded.width * scale;
        const drawH = embedded.height * scale;
        page.drawImage(embedded, {
          x: (pageW - drawW) / 2,
          y: (pageH - drawH) / 2,
          width: drawW,
          height: drawH,
        });
      }
      const bytes = await pdf.save();
      downloadPdfBytes(bytes, "images.pdf");
      toast.success(t("imagesToPdfSuccess"));
    } catch {
      toast.error(t("errorImagesToPdf"));
    } finally {
      setLoading(false);
    }
  };

  const splitFile = files[splitFileIndex];

  return (
    <ToolShell
      slug={slug}
      title={tc(`tools.${slug}.name` as never)}
      sub={tc(`tools.${slug}.description` as never)}
    >
      <div className="space-y-6">
          <Tabs defaultValue={preset?.op ?? "images"} className="w-full">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="images">
                <ImageIcon className="w-4 h-4 me-2" />
                {t("tabImagesToPdf")}
              </TabsTrigger>
              <TabsTrigger value="merge">
                <FilePlus className="w-4 h-4 me-2" />
                {t("tabMerge")}
              </TabsTrigger>
              <TabsTrigger value="split">
                <SplitSquareHorizontal className="w-4 h-4 me-2" />
                {t("tabSplit")}
              </TabsTrigger>
              <TabsTrigger value="compress">
                <Minimize2 className="w-4 h-4 me-2" />
                {t("tabCompress")}
              </TabsTrigger>
              <TabsTrigger value="rotate">
                <RotateCw className="w-4 h-4 me-2" />
                {t("tabRotate")}
              </TabsTrigger>
              <TabsTrigger value="reorder">
                <ListOrdered className="w-4 h-4 me-2" />
                {t("tabReorder")}
              </TabsTrigger>
              <TabsTrigger value="watermark">
                <Stamp className="w-4 h-4 me-2" />
                {t("tabWatermark")}
              </TabsTrigger>
              <TabsTrigger value="extract">
                <FileText className="w-4 h-4 me-2" />
                {t("tabExtract")}
              </TabsTrigger>
              <TabsTrigger value="sign">
                <PenLine className="w-4 h-4 me-2" />
                {t("tabSign")}
              </TabsTrigger>
            </TabsList>

            {/* ── Images → PDF ─────────────────────────────────────────── */}
            <TabsContent value="images" className="space-y-6">
              <Card className="p-6">
                <FileDropzone
                  onFiles={onDropImages}
                  accept={imageAccept}
                  multiple
                  inputProps={{ "data-testid": "image-input" }}
                  className={({ isDragActive }) => `h-48 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-4 p-8 cursor-pointer transition-[border-color,background-color] duration-150 ${
                    isDragActive
                      ? "border-primary bg-primary/10 scale-[0.99]"
                      : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">{t("dropImagesHere")}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("supportedImageFormats")}
                    </p>
                  </div>
                </FileDropzone>
              </Card>

              {images.length > 0 && (
                <>
                  <SettingsCard>
                    <OptionRow label={t("pageSize")} htmlFor="pdf-page-size">
                      <Select
                        value={pageSize}
                        onValueChange={(v) => setPageSize(v as PageSize)}
                      >
                        <SelectTrigger id="pdf-page-size" aria-label={t("pageSize")}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a4">{t("sizeA4")}</SelectItem>
                          <SelectItem value="letter">{t("sizeLetter")}</SelectItem>
                          <SelectItem value="fit">{t("sizeFit")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </OptionRow>
                    <OptionRow label={t("orientation")} htmlFor="pdf-orientation">
                      <Select
                        value={orientation}
                        onValueChange={(v) => setOrientation(v as Orientation)}
                        disabled={pageSize === "fit"}
                      >
                        <SelectTrigger id="pdf-orientation" aria-label={t("orientation")}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portrait">{t("portrait")}</SelectItem>
                          <SelectItem value="landscape">{t("landscape")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </OptionRow>
                    <OptionRow label={t("marginLabel", { value: margin })} htmlFor="pdf-margin">
                      <Input
                        id="pdf-margin"
                        type="number"
                        min={0}
                        max={144}
                        value={margin}
                        onChange={(e) =>
                          setMargin(Math.max(0, Number(e.target.value) || 0))
                        }
                      />
                    </OptionRow>
                  </SettingsCard>

                  <Card className="p-4 space-y-2">
                    {images.map((img, index) => (
                      <div
                        key={img.url}
                        className="flex items-center gap-3 p-2 rounded-md bg-muted/40"
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-12 h-12 object-cover rounded-md border"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{img.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatBytes(img.size)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t("moveUp")}
                            onClick={() => moveImage(index, "up")}
                            disabled={index === 0}
                          >
                            <MoveUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t("moveDown")}
                            onClick={() => moveImage(index, "down")}
                            disabled={index === images.length - 1}
                          >
                            <MoveDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t("remove")}
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </Card>

                  <Button
                    className="w-full"
                    onClick={imagesToPDF}
                    disabled={loading || images.length === 0}
                  >
                    <Download className="w-4 h-4 me-2" />
                    {loading ? t("processing") : t("createPdf")}
                  </Button>
                </>
              )}
            </TabsContent>

            {/* ── Merge ─────────────────────────────────────────────────── */}
            <TabsContent value="merge" className="space-y-6">
              <Card className="p-6">
                <FileDropzone
                  onFiles={onDropPdf}
                  accept={pdfAccept}
                  multiple
                  inputProps={{ "data-testid": "pdf-input" }}
                  className={({ isDragActive }) => `h-48 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-4 p-8 cursor-pointer transition-[border-color,background-color] duration-150 ${
                    isDragActive
                      ? "border-primary bg-primary/10 scale-[0.99]"
                      : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">{t("dropHere")}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("supportedFormats")}
                    </p>
                  </div>
                </FileDropzone>
              </Card>

              {files.length > 0 && (
                <>
                  <Card className="p-4 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={file.name + index}
                        className="flex items-center gap-3 p-2 rounded-md bg-muted/40"
                      >
                        <div
                          className="w-12 h-14 border rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0 cursor-pointer"
                          onClick={() => setPreviewFile(file)}
                        >
                          {thumbnailLoading[file.name] ? (
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          ) : thumbnails[file.name] ? (
                            <img
                              src={thumbnails[file.name]}
                              alt={file.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <File className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatBytes(file.size)}
                            {file.pageCount != null
                              ? ` • ${t("pagesCount", { count: file.pageCount })}`
                              : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t("moveUp")}
                            onClick={() => moveFile(index, "up")}
                            disabled={index === 0}
                          >
                            <MoveUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t("moveDown")}
                            onClick={() => moveFile(index, "down")}
                            disabled={index === files.length - 1}
                          >
                            <MoveDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t("preview")}
                            onClick={() => setPreviewFile(file)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t("remove")}
                            onClick={() => removeFile(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </Card>

                  <Button
                    className="w-full"
                    onClick={mergePDFs}
                    disabled={loading || files.length < 2}
                  >
                    <FilePlus className="w-4 h-4 me-2" />
                    {loading ? t("processing") : t("mergePdfs")}
                  </Button>
                </>
              )}
            </TabsContent>

            {/* ── Split / Extract ──────────────────────────────────────── */}
            <TabsContent value="split" className="space-y-6">
              <Card className="p-6">
                <FileDropzone
                  onFiles={onDropPdf}
                  accept={pdfAccept}
                  multiple
                  inputProps={{ "data-testid": "pdf-split-input" }}
                  className={({ isDragActive }) => `h-48 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-4 p-8 cursor-pointer transition-[border-color,background-color] duration-150 ${
                    isDragActive
                      ? "border-primary bg-primary/10 scale-[0.99]"
                      : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">{t("dropHere")}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("supportedFormats")}
                    </p>
                  </div>
                </FileDropzone>
              </Card>

              {files.length > 0 && splitFile && (
                <SettingsCard>
                  <OptionRow label={t("selectedFile")} htmlFor="pdf-split-file">
                    <Select
                      value={String(splitFileIndex)}
                      onValueChange={(v) => setSplitFileIndex(Number(v))}
                    >
                      <SelectTrigger id="pdf-split-file" aria-label={t("selectedFile")}>
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

                  <OptionRow label={t("splitModeLabel")} htmlFor="pdf-split-mode">
                    <Select
                      value={splitMode}
                      onValueChange={(v) => setSplitMode(v as "range" | "all")}
                    >
                      <SelectTrigger id="pdf-split-mode" aria-label={t("splitModeLabel")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="range">{t("modeRange")}</SelectItem>
                        <SelectItem value="all">{t("modeAll")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </OptionRow>

                  {splitMode === "range" && (
                    <OptionRow label={t("pageRanges")} htmlFor="pdf-page-ranges">
                      <Input
                        id="pdf-page-ranges"
                        dir="ltr"
                        placeholder={t("pageRangesPlaceholder")}
                        value={pageRanges}
                        onChange={(e) => setPageRanges(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">{t("pageRangesHelp")}</p>
                    </OptionRow>
                  )}

                  <Button
                    className="w-full"
                    onClick={splitPDF}
                    disabled={loading || (splitMode === "range" && !pageRanges)}
                  >
                    <SplitSquareHorizontal className="w-4 h-4 me-2" />
                    {loading ? t("splitting") : t("splitAction")}
                  </Button>
                </SettingsCard>
              )}
            </TabsContent>

            {/* ── Compress ─────────────────────────────────────────────── */}
            <TabsContent value="compress" className="space-y-6">
              <CompressPanel files={files} onDropPdf={onDropPdf} />
            </TabsContent>

            {/* ── Rotate ───────────────────────────────────────────────── */}
            <TabsContent value="rotate" className="space-y-6">
              <RotatePanel files={files} onDropPdf={onDropPdf} />
            </TabsContent>

            {/* ── Reorder ──────────────────────────────────────────────── */}
            <TabsContent value="reorder" className="space-y-6">
              <ReorderPanel files={files} onDropPdf={onDropPdf} />
            </TabsContent>

            {/* ── Watermark ────────────────────────────────────────────── */}
            <TabsContent value="watermark" className="space-y-6">
              <WatermarkPanel files={files} onDropPdf={onDropPdf} />
            </TabsContent>

            {/* ── Extract text ─────────────────────────────────────────── */}
            <TabsContent value="extract" className="space-y-6">
              <ExtractPanel files={files} onDropPdf={onDropPdf} />
            </TabsContent>

            {/* ── Sign ─────────────────────────────────────────────────── */}
            <TabsContent value="sign" className="space-y-6">
              <SignPanel files={files} onDropPdf={onDropPdf} />
            </TabsContent>
          </Tabs>

          {previewFile && (
            <Card>
              <PDFPreview
                pdfData={previewFile.data}
                onClose={() => setPreviewFile(null)}
              />
            </Card>
          )}
      </div>
    </ToolShell>
  );
}
