"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { canvasToBlob } from "@/lib/image/canvas";
import { downloadUrl } from "@/lib/download";

interface ImageInfo {
  url: string;
  size: number;
  type: string;
  name: string;
}

const formatOptions = [
  { value: "image/png", label: "PNG", quality: false },
  { value: "image/jpeg", label: "JPEG", quality: true },
  { value: "image/webp", label: "WebP", quality: true },
  { value: "image/avif", label: "AVIF", quality: true },
];

// Encode a canvas to AVIF using the @jsquash/avif WASM encoder.
// Browsers cannot encode AVIF via canvas.toBlob/toDataURL (they silently fall
// back to PNG), so a real encoder is required to produce valid AVIF output.
async function encodeAvif(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  quality: number
): Promise<Blob> {
  const { default: encode } = await import("@jsquash/avif/encode");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const buffer = await encode(imageData, { quality });
  return new Blob([buffer], { type: "image/avif" });
}

export default function ImageConverter() {
  const t = useTranslations("Tools.ImageConverter");
  const tc = useTranslations("ToolsConfig");
  const tCommon = useTranslations("Common");

  const [image, setImage] = useState<ImageInfo | null>(null);
  const [targetFormat, setTargetFormat] = useState("image/png");
  const [quality, setQuality] = useState(85);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [isConverting, setIsConverting] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        // 15MB limit
        toast.error(t("imageTooLarge"));
        return;
      }

      const isHeic = /\.heic$/i.test(file.name) || file.type === "image/heic";
      if (isHeic) {
        try {
          const { default: heic2any } = await import("heic2any");
          const blob = (await heic2any({
            blob: file,
            toType: "image/jpeg",
          })) as Blob;
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage({
              url: reader.result as string,
              size: blob.size,
              type: "image/jpeg",
              name: file.name.replace(/\.heic$/i, ".jpg"),
            });
            setConvertedImage(null);
            toast.success(t("heicConverted"));
          };
          reader.readAsDataURL(blob);
          return;
        } catch (e) {
          toast.error(t("heicFailed"));
          return;
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          url: reader.result as string,
          size: file.size,
          type: file.type,
          name: file.name,
        });
        setConvertedImage(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const objectUrlRef = useRef<string | null>(null);

  // Revoke any outstanding object URL when the component unmounts.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleConvert = async () => {
    if (!image || isConverting) return;

    setIsConverting(true);
    try {
      // Create image element from source
      const img = new Image();
      img.src = image.url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Create canvas and draw image
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      ctx.drawImage(img, 0, 0);

      // Produce the converted file as a Blob.
      let blob: Blob | null;
      if (targetFormat === "image/avif") {
        // Canvas cannot encode AVIF — use the WASM encoder for real output.
        blob = await encodeAvif(canvas, ctx, quality);
      } else {
        blob = await canvasToBlob(canvas, targetFormat, quality / 100);
        // If the browser can't encode the requested format it silently falls
        // back to PNG. Detect the mismatch instead of producing a mislabeled file.
        if (blob && blob.type !== targetFormat) {
          throw new Error(
            `Browser does not support encoding ${targetFormat} (got ${blob.type})`
          );
        }
      }

      if (!blob) throw new Error("Conversion produced no output");

      // Swap object URLs, revoking the previous one to avoid leaks.
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;

      setConvertedImage(url);
      setConvertedSize(blob.size);

      toast.success(t("convertedSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("convertFailed"));
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedImage || !image) return;

    const extension =
      formatOptions
        .find((f) => f.value === targetFormat)
        ?.label.toLowerCase() || "png";
    const filename = `${image.name.split(".")[0]}_converted.${extension}`;

    downloadUrl(convertedImage, filename);
    toast.success(t("downloadedSuccess"));
  };

  const formatOption = formatOptions.find((f) => f.value === targetFormat);

  return (
    <ToolShell
      slug="image-converter"
      title={tc("tools.image-converter.name")}
      sub={tc("tools.image-converter.description")}
      primaryAction={{
        label: tCommon("download"),
        onClick: handleDownload,
        disabled: !convertedImage,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card className="p-6 shadow-none">
              <FileDropzone
                onFiles={onDrop}
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".webp", ".avif", ".heic"],
                  "image/heic": [".heic"],
                }}
                multiple={false}
                className={({ isDragActive }) => `
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
                {image ? (
                  <div className="w-full h-full relative">
                    <img
                      src={image.url}
                      alt={t("altOriginal")}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                      {t("size")}: {(image.size / 1024).toFixed(2)} KB
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

            <Card className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("targetFormat")}</label>
                <Select value={targetFormat} onValueChange={setTargetFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formatOption?.quality && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">{t("quality")}</label>
                    <span className="text-sm text-muted-foreground">
                      {quality}%
                    </span>
                  </div>
                  <Slider
                    value={[quality]}
                    onValueChange={([value]) => setQuality(value)}
                    min={1}
                    max={100}
                    step={1}
                  />
                </div>
              )}

              <Button
                onClick={handleConvert}
                className="w-full"
                disabled={!image || isConverting}
              >
                {isConverting ? t("converting") : tCommon("convert")}
              </Button>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6">
              <div className="h-64 rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center">
                {convertedImage ? (
                  <div className="w-full h-full relative">
                    <img
                      src={convertedImage}
                      alt={t("altConverted")}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                      {t("size")}: {(convertedSize / 1024).toFixed(2)} KB
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {t("convertedImagePlaceholder")}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
    </ToolShell>
  );
}
