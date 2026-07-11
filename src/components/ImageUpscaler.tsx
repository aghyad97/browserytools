"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { downloadUrl } from "@/lib/download";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, Image as ImageIcon, InfoIcon } from "lucide-react";
import { toast } from "sonner";
import { getPipeline, type LoadProgress } from "@/lib/hf-pipeline";

const MODEL = "Xenova/swin2SR-classical-sr-x2-64";

// The image-to-image super-resolution pipeline returns a RawImage-like object
// exposing pixel dimensions plus a toBlob() helper for export.
interface RawImageLike {
  width: number;
  height: number;
  toBlob: (type?: string) => Promise<Blob>;
}

type Upscaler = (input: string) => Promise<RawImageLike>;

interface SourceImage {
  url: string;
  name: string;
  width: number;
  height: number;
}

interface UpscaledImage {
  url: string;
  width: number;
  height: number;
}

export default function ImageUpscaler() {
  const t = useTranslations("Tools.ImageUpscaler");
  const tc = useTranslations("ToolsConfig");

  const [source, setSource] = useState<SourceImage | null>(null);
  const [output, setOutput] = useState<UpscaledImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<LoadProgress | null>(null);

  const objectUrlRef = useRef<string | null>(null);

  // Revoke any outstanding output object URL when unmounting.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (file.size > 8 * 1024 * 1024) {
        toast.error(t("imageTooLarge"));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        const img = new Image();
        img.onload = () => {
          setSource({
            url,
            name: file.name,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
          setOutput(null);
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    },
    [t]
  );

  const upscale = useCallback(async () => {
    if (!source) {
      toast.error(t("noImage"));
      return;
    }
    setBusy(true);
    setOutput(null);
    try {
      const upscaler = await getPipeline<Upscaler>("image-to-image", MODEL, {
        device: "auto",
        onProgress: setProgress,
      });
      const result = await upscaler(source.url);
      const blob = await result.toBlob("image/png");

      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;

      setOutput({ url, width: result.width, height: result.height });
    } catch (err) {
      console.error(err);
      toast.error(t("failed"));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [source, t]);

  const handleDownload = useCallback(() => {
    if (!output || !source) return;
    const base = source.name.replace(/\.[^.]+$/, "");
    downloadUrl(output.url, `${base}_upscaled.png`);
    toast.success(t("downloaded"));
  }, [output, source, t]);

  return (
    <ToolShell
      slug="image-upscaler"
      title={tc("tools.image-upscaler.name")}
      sub={tc("tools.image-upscaler.description")}
    >
      <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card className="p-6 shadow-none">
                <FileDropzone
                  onFiles={onDrop}
                  accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                  multiple={false}
                  className={({ isDragActive }) =>
                    `h-64 rounded-lg border-2 border-dashed flex flex-col items-center justify-center space-y-4 p-8 cursor-pointer transition-all duration-200 ${
                      isDragActive
                        ? "border-primary bg-primary/10 scale-[0.99]"
                        : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                    }`
                  }
                >
                  {source ? (
                    <div className="w-full h-full relative">
                      <img
                        src={source.url}
                        alt={t("original")}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white p-2 text-sm flex justify-between">
                        <span>{t("original")}</span>
                        <span dir="ltr" className="tabular-nums">
                          {source.width}×{source.height}
                        </span>
                      </div>
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

              <Card className="p-4 space-y-3">
                <Button
                  onClick={upscale}
                  className="w-full"
                  disabled={!source || busy}
                  data-testid="upscale-button"
                >
                  {busy ? t("upscaling") : t("upscale")}
                </Button>

                {busy && progress && progress.status === "progress" && (
                  <div className="space-y-1">
                    <Progress value={progress.percent} />
                    <p className="text-xs text-muted-foreground">
                      {t("loadingModel")}{" "}
                      <span dir="ltr">{progress.percent}%</span>
                    </p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {t("sizeWarning")}
                </p>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-6">
                <div className="h-64 rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center">
                  {output ? (
                    <div className="w-full h-full relative">
                      <img
                        src={output.url}
                        alt={t("upscaled")}
                        className="w-full h-full object-contain"
                        data-testid="upscaled-image"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white p-2 text-sm flex justify-between">
                        <span>{t("upscaled")}</span>
                        <span dir="ltr" className="tabular-nums">
                          {output.width}×{output.height}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {t("outputPlaceholder")}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <Button
                onClick={handleDownload}
                className="w-full"
                disabled={!output}
                variant="secondary"
                data-testid="download-button"
              >
                <Download className="w-4 h-4 me-2" />
                {t("download")}
              </Button>
            </div>
          </div>

          <Card className="p-4">
            <div className="flex items-start gap-3">
              <InfoIcon className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">{t("modelNote")}</p>
            </div>
          </Card>
      </div>
    </ToolShell>
  );
}
