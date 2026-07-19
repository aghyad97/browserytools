"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Loader2, Download, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { TwoPane } from "@/components/shared/TwoPane";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { downloadBlob } from "@/lib/download";
import { openPdf } from "@/lib/pdf/pdfjs-doc";
import { deskew, binarize, estimateSkew, toGrayscale } from "@/lib/ocr/preprocess";
import { loadImage, drawToCanvas } from "@/lib/image/canvas";

interface ImageInfo {
  url: string;
  name: string;
  /** "pdf" files are rendered page-by-page to canvases before OCR; "image"
   *  files keep the exact pre-existing behavior (recognize straight off the
   *  object URL) when preprocessing is off. */
  kind: "image" | "pdf";
  file: File;
}

/** Skew-correct + binarize a canvas before handing it to tesseract. Isolated
 *  so the component test can mock the whole `@/lib/ocr/preprocess` module
 *  and assert this pipeline runs, without doing real canvas pixel math. */
function applyPreprocessing(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const gray = toGrayscale(canvas);
  const skewDeg = estimateSkew(gray);
  return binarize(deskew(canvas, skewDeg));
}

const languageOptions = [
  { value: "eng", label: "English" },
  { value: "spa", label: "Español" },
  { value: "fra", label: "Français" },
  { value: "deu", label: "Deutsch" },
  { value: "ara", label: "العربية" },
];

export default function ImageToText() {
  const t = useTranslations("Tools.ImageToText");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [image, setImage] = useState<ImageInfo | null>(null);
  const [language, setLanguage] = useState("eng");
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [preprocess, setPreprocess] = useState(false);
  const [pdfPage, setPdfPage] = useState<{ current: number; total: number } | null>(null);

  const objectUrlRef = useRef<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 15 * 1024 * 1024) {
        toast.error(t("imageTooLarge"));
        return;
      }

      const kind: ImageInfo["kind"] =
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
          ? "pdf"
          : "image";

      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;

      setImage({ url, name: file.name, kind, file });
      setText("");
      setProgress(0);
      setPdfPage(null);
    },
    [t]
  );

  // Revoke any outstanding object URL when the component unmounts.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleRecognize = async () => {
    if (!image || isRecognizing) return;

    setIsRecognizing(true);
    setProgress(0);
    setText("");
    setPdfPage(null);

    // Tracked outside React state so the tesseract logger (set up once, below)
    // can fold per-page progress into one overall percentage without a stale
    // closure — these are read/written synchronously within this run.
    let currentPage = 1;
    let totalPages = 1;

    try {
      const { createWorker } = await import("tesseract.js");

      // Self-hosted engine: the worker + core WASM are copied into
      // public/tesseract/ by scripts/copy-tesseract.js. The language
      // traineddata still loads once from the official tessdata CDN.
      const worker = await createWorker(language, 1, {
        workerPath: "/tesseract/worker.min.js",
        corePath: "/tesseract/",
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            const overall = ((currentPage - 1 + m.progress) / totalPages) * 100;
            setProgress(Math.round(overall));
          }
        },
      });

      let recognized: string;

      if (image.kind === "pdf") {
        const bytes = new Uint8Array(await image.file.arrayBuffer());
        const doc = await openPdf(bytes);
        totalPages = doc.numPages;

        const pageTexts: string[] = [];
        for (let i = 1; i <= doc.numPages; i++) {
          currentPage = i;
          setPdfPage({ current: i, total: doc.numPages });

          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(viewport.width));
          canvas.height = Math.max(1, Math.round(viewport.height));
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("2D context unavailable");
          await page.render({ canvasContext: ctx, viewport }).promise;

          const source = preprocess ? applyPreprocessing(canvas) : canvas;
          const {
            data: { text: pageText },
          } = await worker.recognize(source);

          pageTexts.push(`${t("pdfPageSeparator", { number: i })}\n${pageText.trim()}`);
        }

        recognized = pageTexts.join("\n\n");
      } else {
        let source: string | HTMLCanvasElement = image.url;
        if (preprocess) {
          const img = await loadImage(image.file);
          const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight);
          source = applyPreprocessing(canvas);
        }

        const {
          data: { text: imageText },
        } = await worker.recognize(source);
        recognized = imageText;
      }

      await worker.terminate();

      setText(recognized.trim());
      setProgress(100);

      if (recognized.trim().length === 0) {
        toast.info(t("noTextFound"));
      } else {
        toast.success(t("recognizeSuccess"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("recognizeFailed"));
    } finally {
      setIsRecognizing(false);
      setPdfPage(null);
    }
  };

  const handleDownload = () => {
    if (!text) return;
    const base = (image?.name || "image").replace(/\.[^.]+$/, "");
    downloadBlob(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
      `${base}.txt`,
    );
    toast.success(t("downloaded"));
  };

  const handleClear = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImage(null);
    setText("");
    setProgress(0);
    setPdfPage(null);
  };

  return (
    <ToolShell
      slug="image-to-text"
      title={tc("tools.image-to-text.name")}
      sub={tc("tools.image-to-text.description")}
      controls={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!text}
            className="flex items-center gap-2"
            aria-label={t("downloadTxt")}
          >
            <Download className="w-4 h-4" />
            {t("downloadTxt")}
          </Button>
          {image && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex items-center gap-2"
              aria-label={t("clear")}
            >
              <Trash2 className="w-4 h-4" />
              {t("clear")}
            </Button>
          )}
        </>
      }
      primaryAction={{
        label: isRecognizing ? t("recognizing") : t("extractText"),
        onClick: handleRecognize,
        disabled: !image || isRecognizing,
      }}
    >
      <TwoPane
        start={
          <div className="space-y-4">
            <Card className="p-6 shadow-none">
              <FileDropzone
                onFiles={onDrop}
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif"],
                  "application/pdf": [".pdf"],
                }}
                className={({ isDragActive }) =>
                  `h-64 rounded-lg border-2 border-dashed flex flex-col items-center justify-center space-y-4 p-8 cursor-pointer transition-[border-color,background-color] duration-150 ${
                    isDragActive
                      ? "border-primary bg-primary/10 scale-[0.99]"
                      : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                  }`
                }
              >
                {image && image.kind === "image" ? (
                  <div className="w-full h-full relative">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : image ? (
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1 break-all px-2">
                      {image.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{t("pdfFile")}</p>
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

            <SettingsCard>
              <OptionRow label={t("language")}>
                <Select
                  value={language}
                  onValueChange={setLanguage}
                  disabled={isRecognizing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </OptionRow>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="ocr-preprocess"
                  data-testid="ocr-preprocess"
                  checked={preprocess}
                  onCheckedChange={(c) => setPreprocess(Boolean(c))}
                  disabled={isRecognizing}
                />
                <div>
                  <label htmlFor="ocr-preprocess" className="text-sm font-medium">
                    {t("preprocess")}
                  </label>
                  <p className="text-xs text-muted-foreground">{t("preprocessHint")}</p>
                </div>
              </div>

              {isRecognizing && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {pdfPage
                      ? t("pdfPageProgress", {
                          current: pdfPage.current,
                          total: pdfPage.total,
                        })
                      : t("recognizing")}
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </SettingsCard>

            {/* Privacy note — engine on-device, language model downloads once */}
            <SettingsCard description={t("privacyNote")} />
          </div>
        }
        end={
          <OutputPanel
            text={text}
            title={t("outputLabel")}
            copyLabel={tCommon("copy")}
            copySuccessMessage={t("copied")}
            copyErrorMessage={t("copyFailed")}
          >
            <Textarea
              dir="auto"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("outputPlaceholder")}
              className="min-h-[16rem] rounded-none border-0 bg-transparent font-mono text-sm focus-visible:ring-0"
              aria-label={t("outputLabel")}
            />
          </OutputPanel>
        }
      />
    </ToolShell>
  );
}
