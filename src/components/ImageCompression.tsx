"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { ToolShell } from "@/components/template/tool-shell";
import { ControlStat } from "@/components/template/controls-bar";
import { downloadDataUrl } from "@/lib/download";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SliderRow } from "@/components/shared/SliderRow";
import { OptionRow } from "@/components/shared/SettingsCard";
import { loadImage } from "@/lib/image/canvas";
import {
  compressToTargetSize,
  type TargetSizeFormat,
} from "@/lib/image/target-size";
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
  RefreshCw,
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

/**
 * Optional initial configuration supplied by SEO landing-page variants
 * (e.g. `compress-image-to-20kb`). All fields are optional and only seed the
 * initial UI state; the tool remains fully interactive afterwards.
 */
export interface ImageCompressionPreset {
  mode?: "auto" | "aggressive" | "custom" | "target";
  targetKb?: number;
  format?: string; // "original" | "image/jpeg" | "image/webp" | "image/png"
  lockFormat?: boolean;
}

const MIN_TARGET_KB = 5;
const MAX_TARGET_KB = 5120;
const clampKb = (n: number) =>
  Math.min(MAX_TARGET_KB, Math.max(MIN_TARGET_KB, Math.round(n)));

// Quick-set chips for the target-size input. 1024 KB is labelled "1 MB".
const TARGET_PRESETS = [
  { kb: 20, label: "20 KB" },
  { kb: 50, label: "50 KB" },
  { kb: 100, label: "100 KB" },
  { kb: 200, label: "200 KB" },
  { kb: 500, label: "500 KB" },
  { kb: 1024, label: "1 MB" },
];

// Target mode is lossy-only: PNG/original can't be size-targeted, so they are
// coerced to JPEG.
const isTargetable = (format: string) =>
  format === "image/jpeg" || format === "image/webp";

interface TargetMeta {
  width: number;
  height: number;
  quality: number;
  hitTarget: boolean;
}

export default function ImageCompression({
  slug = "image-compression",
  preset,
}: { slug?: string; preset?: ImageCompressionPreset } = {}) {
  const t = useTranslations("Tools.ImageCompression");
  const tc = useTranslations("ToolsConfig");
  const tCommon = useTranslations("Common");

  const compressionModes = [
    { value: "auto", label: t("modeAuto") },
    { value: "aggressive", label: t("modeAggressive") },
    { value: "custom", label: t("modeCustom") },
    { value: "target", label: t("modeTarget") },
  ];

  const targetFormats = [
    { value: "original", label: t("formatSameAsSource") },
    { value: "image/jpeg", label: "JPEG" },
    { value: "image/webp", label: t("formatWebPRecommended") },
    { value: "image/png", label: "PNG" },
  ];

  const initialFormat = preset?.format ?? "image/webp";
  const startCoerced =
    preset?.mode === "target" && !isTargetable(initialFormat);

  const [image, setImage] = useState<ImageInfo | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [targetMeta, setTargetMeta] = useState<TargetMeta | null>(null);
  const [mode, setMode] = useState(preset?.mode ?? "auto");
  const [quality, setQuality] = useState(80);
  const [targetKb, setTargetKb] = useState(clampKb(preset?.targetKb ?? 100));
  const [targetFormat, setTargetFormat] = useState(
    startCoerced ? "image/jpeg" : initialFormat,
  );
  const [coercedPng, setCoercedPng] = useState(startCoerced);
  const lockFormat = preset?.lockFormat ?? false;
  const [maxWidth, setMaxWidth] = useState(1920);
  const [loading, setLoading] = useState(false);
  const compareRef = useRef<HTMLDivElement>(null);
  const [comparing, setComparing] = useState(false);
  const [comparePosition, setComparePosition] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Bumped on every file swap. compressImage() is async (target mode awaits a
  // search loop); this lets an in-flight compression for the previous image
  // detect it's been superseded and discard its result instead of applying it
  // to the new image's state.
  const activeImageTokenRef = useRef(0);

  // Target mode is lossy-only: coerce a PNG/original selection to JPEG when the
  // user switches into it, and surface a one-line hint. Leaving target mode
  // clears the hint.
  useEffect(() => {
    if (mode === "target") {
      if (!isTargetable(targetFormat)) {
        setTargetFormat("image/jpeg");
        setCoercedPng(true);
      }
    } else if (coercedPng) {
      setCoercedPng(false);
    }
  }, [mode, targetFormat, coercedPng]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        // 25MB limit
        toast.error(t("imageTooLarge"));
        return;
      }

      // Invalidate any in-flight compression for the previous image so its
      // result can't land on the new image once it resolves.
      activeImageTokenRef.current += 1;

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
          // Swapping the file must clear every result derived from the
          // previous image — otherwise the compressed output / comparison
          // slider from the old file lingers over the new one.
          setCompressedImage(null);
          setCompressedSize(0);
          setTargetMeta(null);
          setComparing(false);
          setComparePosition(50);
          setLoading(false);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const compressImage = async () => {
    if (!image) return;
    const token = activeImageTokenRef.current;
    setLoading(true);

    try {
      // Target-size mode: delegate the quality/dimension search to the shared
      // engine, which fits the output under the byte budget.
      if (mode === "target") {
        const source = await loadImage(image.url);
        const format = (
          isTargetable(targetFormat) ? targetFormat : "image/jpeg"
        ) as TargetSizeFormat;
        const result = await compressToTargetSize({
          source,
          targetBytes: clampKb(targetKb) * 1024,
          format,
        });
        // The image may have been swapped while this search was running —
        // discard the result instead of showing the old file's compressed
        // output under the new file's info.
        if (token !== activeImageTokenRef.current) return;
        const url = URL.createObjectURL(result.blob);
        setCompressedImage(url);
        setCompressedSize(result.blob.size);
        setTargetMeta({
          width: result.width,
          height: result.height,
          quality: result.quality,
          hitTarget: result.hitTarget,
        });
        toast.success(t("compressedSuccess"));
        return;
      }

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

      // Same race guard as target mode: bail if the file was swapped mid-run.
      if (token !== activeImageTokenRef.current) return;

      setCompressedImage(compressed);
      setCompressedSize(compressedBytes);
      toast.success(t("compressedSuccess"));
    } catch (error) {
      console.error(error);
      if (token === activeImageTokenRef.current) {
        toast.error(t("compressFailed"));
      }
    } finally {
      if (token === activeImageTokenRef.current) {
        setLoading(false);
      }
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
      slug={slug}
      title={tc(`tools.${slug}.name` as never)}
      sub={tc(`tools.${slug}.description` as never)}
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
              <span className="text-2xl font-bold" style={{ color: "var(--bt-green)" }}>
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
          {image && (
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
              <ImageIcon className="w-8 h-8 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{image.name}</p>
                <p className="text-sm text-muted-foreground" dir="ltr">
                  {image.width}x{image.height}px | {formatBytes(image.size)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <RefreshCw className="w-4 h-4 me-1" />
                {t("change")}
              </Button>
            </div>
          )}
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onDrop([file]);
              e.target.value = "";
            }}
          />

          <Card className="p-4">
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">{t("tabBasic")}</TabsTrigger>
                <TabsTrigger value="advanced">{t("tabAdvanced")}</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <OptionRow label={t("compressionMode")} htmlFor="ic-mode">
                  <Select
                    value={mode}
                    onValueChange={(v) => setMode(v as typeof mode)}
                  >
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

                {mode === "target" && (
                  <OptionRow
                    label={t("targetSize")}
                    htmlFor="ic-target"
                    hint={t("targetSizeHint")}
                  >
                    <Input
                      id="ic-target"
                      type="number"
                      inputMode="numeric"
                      min={MIN_TARGET_KB}
                      max={MAX_TARGET_KB}
                      data-testid="target-size-input"
                      value={targetKb}
                      onChange={(e) =>
                        setTargetKb(Number(e.target.value) || 0)
                      }
                      onBlur={() => setTargetKb((v) => clampKb(v))}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {TARGET_PRESETS.map((p) => (
                        <Button
                          key={p.kb}
                          type="button"
                          size="sm"
                          variant={targetKb === p.kb ? "default" : "outline"}
                          aria-label={t("presetChipAria", { label: p.label })}
                          onClick={() => setTargetKb(p.kb)}
                        >
                          <span dir="ltr">{p.label}</span>
                        </Button>
                      ))}
                    </div>
                  </OptionRow>
                )}

                {!lockFormat && (
                  <OptionRow
                    label={t("outputFormat")}
                    htmlFor="ic-format"
                    hint={
                      mode === "target" && coercedPng
                        ? t("pngNotSupportedInTarget")
                        : undefined
                    }
                  >
                    <Select
                      value={targetFormat}
                      onValueChange={(v) => {
                        setTargetFormat(v);
                        setCoercedPng(false);
                      }}
                    >
                      <SelectTrigger id="ic-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(mode === "target"
                          ? targetFormats.filter((f) => isTargetable(f.value))
                          : targetFormats
                        ).map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </OptionRow>
                )}
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                {/* Target mode owns its own quality/dimension search, so the
                    manual quality + max-width controls are suppressed. */}
                {mode !== "target" && (
                  <>
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
                  </>
                )}
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

          {mode === "target" && compressedImage && targetMeta && (
            <div className="rounded-lg border p-3 text-sm space-y-1">
              <p className="text-muted-foreground">
                <span dir="ltr">
                  {targetMeta.width} x {targetMeta.height}
                </span>
                {" • "}
                {t("quality")}: {Math.round(targetMeta.quality * 100)}%
              </p>
              {targetMeta.hitTarget ? (
                <p className="font-medium" style={{ color: "var(--bt-green)" }}>
                  {t("targetReached")}
                </p>
              ) : (
                <p className="text-destructive font-medium">
                  {t("targetMissed")}
                </p>
              )}
            </div>
          )}

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
