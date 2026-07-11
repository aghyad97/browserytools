"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { ToolShell } from "@/components/template/tool-shell";
import { ControlStat } from "@/components/template/controls-bar";
import { downloadDataUrl } from "@/lib/download";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SliderRow } from "@/components/shared/SliderRow";
import { OptionRow } from "@/components/shared/SettingsCard";
import { formatBytes, formatPercent } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Image as ImageIcon,
  Maximize2,
  MinusSquare,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";

interface ImageInfo {
  url: string;
  size: number;
  width: number;
  height: number;
  type: string;
  name: string;
}


export default function ImageCompression() {
  const t = useTranslations("Tools.ImageCompression");
  const tc = useTranslations("ToolsConfig");
  const tCommon = useTranslations("Common");

  const compressionModes = [
    { value: "auto", label: t("modeAuto") },
    { value: "aggressive", label: t("modeAggressive") },
    { value: "custom", label: t("modeCustom") },
  ];

  const targetFormats = [
    { value: "original", label: t("formatSameAsSource") },
    { value: "image/jpeg", label: "JPEG" },
    { value: "image/webp", label: t("formatWebPRecommended") },
    { value: "image/png", label: "PNG" },
  ];

  const [image, setImage] = useState<ImageInfo | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [mode, setMode] = useState("auto");
  const [quality, setQuality] = useState(80);
  const [targetFormat, setTargetFormat] = useState("image/webp");
  const [maxWidth, setMaxWidth] = useState(1920);
  const [loading, setLoading] = useState(false);
  const compareRef = useRef<HTMLDivElement>(null);
  const [comparing, setComparing] = useState(false);
  const [comparePosition, setComparePosition] = useState(50);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        // 25MB limit
        toast.error(t("imageTooLarge"));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          setImage({
            url: reader.result as string,
            size: file.size,
            width: img.width,
            height: img.height,
            type: file.type,
            name: file.name,
          });
          setCompressedImage(null);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const compressImage = async () => {
    if (!image) return;
    setLoading(true);

    try {
      // Create image element
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = image.url;
      });

      // Calculate dimensions
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = Math.round(height * ratio);
      }

      // Create canvas for compression
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      // Determine quality based on mode
      let finalQuality = quality / 100;
      if (mode === "auto") {
        finalQuality = 0.8;
        if (image.size > 5 * 1024 * 1024) finalQuality = 0.7;
        if (image.size > 10 * 1024 * 1024) finalQuality = 0.6;
      } else if (mode === "aggressive") {
        finalQuality = 0.5;
      }

      // Use the target format or original format
      const format = targetFormat === "original" ? image.type : targetFormat;
      const compressed = canvas.toDataURL(format, finalQuality);

      // Calculate compressed size
      const base64str = compressed.split(",")[1];
      const compressedBytes = atob(base64str).length;

      setCompressedImage(compressed);
      setCompressedSize(compressedBytes);
      toast.success(t("compressedSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("compressFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedImage || !image) return;

    const format =
      targetFormat === "original"
        ? image.type.split("/")[1]
        : targetFormat.split("/")[1];

    const filename = `${image.name.split(".")[0]}_compressed.${format}`;
    downloadDataUrl(compressedImage, filename);
    toast.success(t("downloadedSuccess"));
  };

  const handleCompareMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!comparing || !compareRef.current) return;

    const rect = compareRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;
    setComparePosition(Math.max(0, Math.min(100, position)));
  };

  const compressionRatio =
    compressedSize && image
      ? formatPercent(1 - compressedSize / image.size, 1)
      : "0%";

  return (
    <ToolShell
      slug="image-compression"
      title={tc("tools.image-compression.name")}
      sub={tc("tools.image-compression.description")}
      controls={
        image && compressedImage ? (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setComparing(!comparing)}
            >
              {comparing ? (
                <MinusSquare className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <ControlStat label={t("sizeReduction")}>
              <span className="text-2xl font-bold text-green-500">
                {compressionRatio}
              </span>
            </ControlStat>
          </>
        ) : undefined
      }
      primaryAction={{
        label: tCommon("download"),
        onClick: handleDownload,
        disabled: !compressedImage,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-6">
            {!image ? (
              <FileDropzone
                onFiles={onDrop}
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".webp"],
                }}
                multiple={false}
                className={({ isDragActive }) => `
                    h-64 rounded-lg border-2 border-dashed
                    flex flex-col items-center justify-center space-y-4 p-8
                    cursor-pointer transition-[border-color,background-color] duration-150
                    ${
                      isDragActive
                        ? "border-primary bg-primary/10 scale-[0.99]"
                        : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                    }
                  `}
              >
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    {t("dropImageHere")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("uploadLimit")}
                  </p>
                </div>
              </FileDropzone>
            ) : comparing ? (
              <div
                ref={compareRef}
                className="relative h-64 cursor-col-resize"
                onMouseMove={handleCompareMove}
                onMouseDown={() => setComparing(true)}
                onMouseUp={() => setComparing(false)}
                onMouseLeave={() => setComparing(false)}
              >
                <div className="absolute inset-0">
                  <img
                    src={compressedImage || image.url}
                    alt="Compressed"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${comparePosition}%` }}
                >
                  <img
                    src={image.url}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-primary cursor-col-resize"
                  style={{ left: `${comparePosition}%` }}
                />
              </div>
            ) : (
              <div className="h-64 relative">
                <img
                  src={image.url}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
                {/* content value: fixed dark scrim + white text for legibility over an arbitrary image */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                  {image.width} x {image.height} • {formatBytes(image.size)}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-4">
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">{t("tabBasic")}</TabsTrigger>
                <TabsTrigger value="advanced">{t("tabAdvanced")}</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <OptionRow label={t("compressionMode")} htmlFor="ic-mode">
                  <Select value={mode} onValueChange={setMode}>
                    <SelectTrigger id="ic-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {compressionModes.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </OptionRow>

                <OptionRow label={t("outputFormat")} htmlFor="ic-format">
                  <Select
                    value={targetFormat}
                    onValueChange={setTargetFormat}
                  >
                    <SelectTrigger id="ic-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {targetFormats.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </OptionRow>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                {mode === "custom" && (
                  <SliderRow
                    label={t("quality")}
                    value={quality}
                    min={1}
                    max={100}
                    step={1}
                    onChange={setQuality}
                    display={`${quality}%`}
                  />
                )}

                <SliderRow
                  label={t("maxWidth")}
                  value={maxWidth}
                  min={320}
                  max={3840}
                  step={1}
                  onChange={setMaxWidth}
                  display={`${maxWidth}px`}
                />
              </TabsContent>
            </Tabs>

            <Button
              onClick={compressImage}
              className="w-full mt-4"
              disabled={!image || loading}
            >
              {t("compressImage")}
            </Button>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="h-64 rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center">
              {compressedImage ? (
                <div className="w-full h-full relative">
                  <img
                    src={compressedImage}
                    alt="Compressed"
                    className="w-full h-full object-contain"
                  />
                  {/* content value: fixed dark scrim + white text for legibility over an arbitrary image */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                    {formatBytes(compressedSize)}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {t("compressedImagePlaceholder")}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {compressedImage && (
            <Button
              onClick={() => window.open(compressedImage, "_blank")}
              className="w-full"
              variant="outline"
            >
              <FileDown className="w-4 h-4 me-2" />
              {t("previewFull")}
            </Button>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
