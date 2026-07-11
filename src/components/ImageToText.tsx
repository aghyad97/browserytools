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
import {
  Upload,
  Loader2,
  Download,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { CopyButton } from "@/components/shared/CopyButton";
import { downloadBlob } from "@/lib/download";

interface ImageInfo {
  url: string;
  name: string;
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

  const objectUrlRef = useRef<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 15 * 1024 * 1024) {
        toast.error(t("imageTooLarge"));
        return;
      }

      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;

      setImage({ url, name: file.name });
      setText("");
      setProgress(0);
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
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const {
        data: { text: recognized },
      } = await worker.recognize(image.url);

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
  };

  return (
    <ToolShell
      slug="image-to-text"
      title={tc("tools.image-to-text.name")}
      sub={tc("tools.image-to-text.description")}
      controls={
        <>
          <CopyButton
            text={text}
            label={tCommon("copy")}
            successMessage={t("copied")}
            errorMessage={t("copyFailed")}
            disabled={!text}
          />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: upload + controls */}
          <div className="space-y-4">
            <Card className="p-6 shadow-none">
              <FileDropzone
                onFiles={onDrop}
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif"],
                }}
                className={({ isDragActive }) =>
                  `h-64 rounded-lg border-2 border-dashed flex flex-col items-center justify-center space-y-4 p-8 cursor-pointer transition-all duration-200 ${
                    isDragActive
                      ? "border-primary bg-primary/10 scale-[0.99]"
                      : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                  }`
                }
              >
                {image ? (
                  <div className="w-full h-full relative">
                    <img
                      src={image.url}
                      alt={image.name}
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

            <Card className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("language")}</label>
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
              </div>

              {isRecognizing && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("recognizing")}
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </Card>

            {/* Privacy note — engine on-device, language model downloads once */}
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {t("privacyNote")}
                </p>
              </div>
            </Card>
          </div>

          {/* Right: output */}
          <div className="space-y-4">
            <Card className="p-4 space-y-4">
              <label className="text-sm font-medium">{t("outputLabel")}</label>
              <Textarea
                dir="auto"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("outputPlaceholder")}
                className="min-h-[16rem] font-mono text-sm"
                aria-label={t("outputLabel")}
              />
            </Card>
          </div>
      </div>
    </ToolShell>
  );
}
