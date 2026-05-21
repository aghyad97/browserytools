"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Upload,
  Image as ImageIcon,
  CopyIcon,
  InfoIcon,
  AccessibilityIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { getPipeline, type LoadProgress } from "@/lib/hf-pipeline";

const MODEL = "Xenova/vit-gpt2-image-captioning";

type Captioner = (
  input: string
) => Promise<{ generated_text: string }[]>;

export default function ImageCaptioner() {
  const t = useTranslations("Tools.ImageCaptioner");

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
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
      setImageUrl(url);
      setCaption(null);
    },
    [t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"] },
    multiple: false,
  });

  const generate = useCallback(async () => {
    if (!imageUrl) {
      toast.error(t("noImage"));
      return;
    }
    setBusy(true);
    setCaption(null);
    try {
      const captioner = await getPipeline<Captioner>(
        "image-to-text",
        MODEL,
        { device: "auto", onProgress: setProgress }
      );
      const out = await captioner(imageUrl);
      const text = out?.[0]?.generated_text?.trim();
      if (!text) throw new Error("Empty caption");
      setCaption(text);
    } catch (err) {
      console.error(err);
      toast.error(t("failed"));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [imageUrl, t]);

  const altSnippet = caption ? `alt="${caption}"` : "";

  const copy = useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value);
        toast.success(t("copied"));
      } catch {
        toast.error(t("copyFailed"));
      }
    },
    [t]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div>
            <h1 className="text-xl font-semibold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>

          <Card className="p-6 shadow-none">
            <div
              {...getRootProps()}
              className={`
                h-64 rounded-lg border-2 border-dashed
                flex flex-col items-center justify-center space-y-4 p-8
                cursor-pointer transition-all duration-200
                ${
                  isDragActive
                    ? "border-primary bg-primary/10 scale-[0.99]"
                    : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                }
              `}
            >
              <input {...getInputProps()} />
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={t("altPreview")}
                  className="max-h-full max-w-full object-contain"
                />
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
            </div>
          </Card>

          <Button onClick={generate} disabled={busy || !imageUrl}>
            {busy ? t("generating") : t("generate")}
          </Button>

          {busy && progress && progress.status === "progress" && (
            <div className="space-y-1">
              <Progress value={progress.percent} />
              <p className="text-xs text-muted-foreground">
                {t("loadingModel")} <span dir="ltr">{progress.percent}%</span>
              </p>
            </div>
          )}

          {caption && (
            <Card className="p-4 space-y-4" data-testid="caption-result">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium">{t("captionLabel")}</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copy(caption)}
                    aria-label={t("copyCaption")}
                  >
                    <CopyIcon className="h-4 w-4 me-2" />
                    {t("copy")}
                  </Button>
                </div>
                <p
                  dir="auto"
                  className="rounded-lg border bg-muted/40 p-3 text-sm leading-relaxed"
                >
                  {caption}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <AccessibilityIcon className="h-4 w-4 text-primary" />
                    {t("altLabel")}
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copy(altSnippet)}
                    aria-label={t("copyAlt")}
                  >
                    <CopyIcon className="h-4 w-4 me-2" />
                    {t("copy")}
                  </Button>
                </div>
                <pre
                  dir="ltr"
                  className="overflow-x-auto rounded-lg border bg-muted/40 p-3 text-xs"
                >
                  <code>{altSnippet}</code>
                </pre>
                <p className="text-xs text-muted-foreground">{t("altHint")}</p>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <div className="flex items-start gap-3">
              <InfoIcon className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">{t("modelNote")}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
