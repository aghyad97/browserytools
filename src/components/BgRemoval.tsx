"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { downloadBlob } from "@/lib/download";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Download, Trash2, Eye, EyeOff, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import JSZip from "jszip";
import { Config, removeBackground } from "@imgly/background-removal";
import { useEstimatedModelSize } from "@/lib/use-model-size";
import { formatBytes } from "@/lib/format";

// The AI model + wasm are downloaded once from imgly's CDN. We pin publicPath to the
// installed package version so the assets can never drift from the API we ship against.
// Images themselves never leave the device — all processing runs locally in the browser.
const config: Config = {
  device: "gpu",
  publicPath:
    "https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/",
};

export default function BgRemoval() {
  const t = useTranslations("Tools.BgRemoval");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");
  const modelBytes = useEstimatedModelSize("bg-removal-isnet-fp16");

  type ImageItem = {
    id: string;
    name: string;
    original: string; // data URL
    processed: string | null; // object URL of processed image for display
    processedBlob: Blob | null; // actual processed blob for downloading
    status: "idle" | "processing" | "done" | "error";
    progress: number;
  };

  const [items, setItems] = useState<ImageItem[]>([]);
  const [showAfter, setShowAfter] = useState(true);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    const readers = acceptedFiles.map((file) => {
      return new Promise<ImageItem>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
              .toString(36)
              .slice(2)}`,
            name: file.name,
            original: reader.result as string,
            processed: null,
            processedBlob: null,
            status: "idle",
            progress: 0,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newItems) => {
      setItems((prev) => [...prev, ...newItems]);
    });
  }, []);

  const processOne = useCallback(
    async (itemId: string) => {
      console.log(`Starting processing for item: ${itemId}`);

      setItems((prev) =>
        prev.map((it) =>
          it.id === itemId ? { ...it, status: "processing", progress: 0 } : it
        )
      );

      const item = items.find((i) => i.id === itemId);
      if (!item) {
        console.error(`Item not found: ${itemId}`);
        return;
      }

      try {
        // Convert data URL to blob
        const response = await fetch(item.original);
        const blob = await response.blob();

        console.log(
          `Processing ${item.name}, original size: ${blob.size} bytes`
        );

        // @imgly/background-removal reports download progress per resource
        // (the model, plus the onnxruntime-web wasm runtime) as
        // `(key, current, total) => void` — see node_modules/@imgly/
        // background-removal/dist/src/resource.ts. Aggregate across whatever
        // resources are in flight into one overall percentage so `it.progress`
        // actually moves during the (first-use, cached after) download instead
        // of sitting at 0 and snapping to 100. Built fresh per call so
        // sequential images (processOne runs one at a time — see the
        // auto-process effect below) never share accumulator state.
        const resourceProgress: Record<string, { current: number; total: number }> = {};
        const callConfig: Config = {
          ...config,
          progress: (key, current, total) => {
            resourceProgress[key] = { current, total };
            const entries = Object.values(resourceProgress);
            const sumCurrent = entries.reduce((sum, r) => sum + r.current, 0);
            const sumTotal = entries.reduce((sum, r) => sum + r.total, 0);
            const percent = sumTotal > 0 ? Math.round((sumCurrent / sumTotal) * 100) : 0;
            setItems((prev) =>
              prev.map((it) => (it.id === itemId ? { ...it, progress: percent } : it))
            );
          },
        };

        // Remove background
        const resultBlob = await removeBackground(blob, callConfig);

        console.log(
          `Processed ${item.name}, result size: ${resultBlob.size} bytes`
        );

        // Create object URL for display
        const url = URL.createObjectURL(resultBlob);

        setItems((prev) =>
          prev.map((it) =>
            it.id === itemId
              ? {
                  ...it,
                  processed: url,
                  processedBlob: resultBlob, // Store the actual blob
                  status: "done",
                  progress: 100,
                }
              : it
          )
        );

        console.log(`Successfully processed: ${item.name}`);
      } catch (error) {
        console.error("Error processing image:", error);
        setItems((prev) =>
          prev.map((it) => (it.id === itemId ? { ...it, status: "error" } : it))
        );
      }
    },
    [items]
  );

  // Auto process newly added images sequentially
  const runRef = useRef(false);
  useEffect(() => {
    const pending = items.filter((i) => i.status === "idle" && !i.processed);
    if (pending.length === 0) return;
    if (runRef.current) return;

    runRef.current = true;

    const run = async () => {
      setIsProcessingAll(true);
      console.log(`Auto-processing ${pending.length} pending images`);

      for (const it of pending) {
        await processOne(it.id);
      }

      setIsProcessingAll(false);
      runRef.current = false;
      console.log("Auto-processing complete");
    };

    run();
  }, [items, processOne]);

  const handleDownloadOne = (item: ImageItem) => {
    if (!item.processedBlob) {
      console.error("No processed blob available for download");
      return;
    }

    try {
      const base = item.name.replace(/\.[^.]+$/, "");
      const safeName = base.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
      const filename = `${safeName}-no-bg.png`;

      downloadBlob(item.processedBlob, filename);

      console.log(`Downloaded: ${filename}`);
    } catch (error) {
      console.error("Error downloading single image:", error);
    }
  };

  const handleDownloadAll = async () => {
    const ready = items.filter((i) => i.processedBlob);
    if (ready.length === 0) {
      console.warn("No processed images available for download");
      return;
    }

    try {
      setIsZipping(true);
      console.log(`Starting zip creation with ${ready.length} images...`);

      const zip = new JSZip();
      let successCount = 0;

      // Add each processed image to zip using stored blobs
      for (const it of ready) {
        try {
          if (!it.processedBlob) {
            console.warn(`No blob available for ${it.name}, skipping`);
            continue;
          }

          // Create safe filename
          const base = it.name.replace(/\.[^.]+$/, "");
          const safeName = base.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
          const filename = `${safeName}-no-bg.png`;

          // Add to zip
          zip.file(filename, it.processedBlob);
          successCount++;

          console.log(
            `Added to zip: ${filename} (${it.processedBlob.size} bytes)`
          );
        } catch (error) {
          console.error(`Error adding ${it.name} to zip:`, error);
          // Continue with other images
        }
      }

      if (successCount === 0) {
        throw new Error("No images could be added to zip");
      }

      console.log(`Generating zip with ${successCount} images...`);

      // Generate zip file
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
        streamFiles: true, // Better for large files
      });

      console.log(`Zip generated successfully: ${zipBlob.size} bytes`);

      // Download the zip
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `browserytools-${timestamp}.zip`;
      downloadBlob(zipBlob, filename);

      console.log(`Download initiated: ${filename}`);
    } catch (error) {
      console.error("Failed to create zip:", error);

      // Show user-friendly error message
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to create zip file: ${errorMessage}`);
    } finally {
      setIsZipping(false);
    }
  };

  const handleClear = () => {
    // Clean up object URLs before clearing
    items.forEach((item) => {
      if (item.processed) {
        URL.revokeObjectURL(item.processed);
      }
    });

    setItems([]);
    console.log("Cleared all images");
  };

  const handleDeleteOne = (id: string) => {
    // Clean up object URL for the deleted item
    const item = items.find((i) => i.id === id);
    if (item?.processed) {
      URL.revokeObjectURL(item.processed);
    }

    setItems((prev) => prev.filter((i) => i.id !== id));
    console.log(`Deleted item: ${id}`);
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.processed) {
          URL.revokeObjectURL(item.processed);
        }
      });
    };
  }, []);

  const readyCount = items.filter((i) => i.processedBlob).length;

  return (
    <ToolShell
      slug="bg-removal"
      title={tc("tools.bg-removal.name")}
      sub={tc("tools.bg-removal.description")}
      controls={
        <>
          <Button
            variant="ghost"
            onClick={() => setShowAfter((v) => !v)}
            className="flex items-center gap-2"
          >
            {showAfter ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {showAfter ? t("showBefore") : t("showAfter")}
          </Button>
          {isProcessingAll && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("processing")}
            </div>
          )}
          {items.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleClear}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {t("clearAll")}
            </Button>
          )}
        </>
      }
      primaryAction={{
        label: isZipping
          ? t("preparingZip")
          : t("downloadAll", { count: readyCount }),
        onClick: handleDownloadAll,
        disabled: readyCount === 0 || isZipping,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card className="min-h-48 sm:min-h-[16rem] col-span-1 md:col-span-2">
          <FileDropzone
            onFiles={onDrop}
            accept={{
              "image/*": [".png", ".jpg", ".jpeg"],
            }}
            multiple
            className={({ isDragActive }) => `
              h-full rounded-lg border-2 border-dashed
              flex flex-col items-center justify-center space-y-4 p-8
              cursor-pointer transition-[border-color,background-color] duration-150
              ${
                isDragActive
                  ? "border-primary bg-primary/10 scale-[0.99]"
                  : "border-muted-foreground hover:border-primary hover:bg-primary/5"
              }
            `}
          >
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                {t("dropImagesHere")}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {t("supportedFormats")}
              </p>
              <p className="text-muted-foreground text-xs mt-1 sm:mt-2 max-w-md mx-auto">
                {t("privacyNote")}
              </p>
              {modelBytes !== null && (
                <p className="text-muted-foreground text-xs mt-1 max-w-md mx-auto">
                  {tCommon("modelDownloadSize", { size: formatBytes(modelBytes) })}
                </p>
              )}
              {items.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {items.length === 1
                    ? t("imagesLoaded", { count: items.length })
                    : t("imagesLoadedPlural", { count: items.length })}
                </p>
              )}
            </motion.div>
          </FileDropzone>
        </Card>

        {/* Image Grid */}
        <div className="col-span-1 md:col-span-2">
          {items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {items.map((it) => (
                    <motion.div
                      key={it.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="p-3">
                        <div className="relative w-full aspect-square rounded-md overflow-hidden bg-muted/50">
                          <img
                            src={
                              showAfter && it.processed
                                ? it.processed
                                : it.original
                            }
                            alt={it.name}
                            className="w-full h-full object-contain"
                          />

                          {/* Remove — an overlay on the thumbnail rather than a
                              third item in the caption row. The card is 184px
                              wide with 12px padding, so status + Download +
                              delete never fit on one line. Always visible, not
                              hover-gated: hiding an affordance this central
                              means most people never find it, and it would be
                              unreachable on touch. It stays quiet through
                              weight instead. */}
                          <button
                            type="button"
                            onClick={() => handleDeleteOne(it.id)}
                            aria-label={tCommon("remove")}
                            title={tCommon("remove")}
                            className="absolute top-1.5 end-1.5 grid h-7 w-7 place-items-center rounded-full
                                       bg-background/80 backdrop-blur-sm text-muted-foreground
                                       transition-colors duration-150 hover:text-destructive
                                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>

                          {/* Processing Overlay */}
                          {it.status === "processing" && (
                            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <Progress value={it.progress} className="w-3/4" />
                              <span className="text-xs text-muted-foreground">
                                {t("removingBackground")}
                              </span>
                            </div>
                          )}

                          {/* Error Overlay */}
                          {it.status === "error" && (
                            <div className="absolute inset-0 bg-destructive/20 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                                ✕
                              </div>
                              <span className="text-xs text-center px-2">
                                {t("failedToProcess")}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Caption + single action.
                            Two rows instead of one crowded row: the name line
                            carries state as a dot, and the foot carries exactly
                            one action. "Ready" is dropped from view once the
                            Download button exists — the button's presence
                            already says it — so the visible label only appears
                            while it still tells the user something. */}
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              aria-hidden
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                it.status === "done"
                                  ? "bg-[var(--bt-green)]"
                                  : it.status === "processing"
                                  ? "bg-[var(--bt-accent)] animate-pulse"
                                  : it.status === "error"
                                  ? "bg-destructive"
                                  : "bg-muted-foreground/40"
                              }`}
                            />
                            <span className="truncate text-xs" title={it.name}>
                              {it.name}
                            </span>
                            {/* Only when the status has no visible label below,
                                so "done" is still announced but the other
                                states are not read out twice. */}
                            {it.processedBlob && (
                              <span className="sr-only">{t("statusReady")}</span>
                            )}
                          </div>

                          {it.processedBlob ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDownloadOne(it)}
                              /* buttonVariants forces [&_svg]:size-4 on every
                                 button; at this 28px height a 16px glyph
                                 crowds the label, so the variant is overridden
                                 rather than the svg's own classes, which lose
                                 to the parent selector. */
                              className="h-7 w-full px-2 text-[11px] [&_svg]:size-3"
                            >
                              <Download className="me-1.5" />
                              {tCommon("download")}
                            </Button>
                          ) : (
                            <div className="text-[11px] text-muted-foreground">
                              {it.status === "processing"
                                ? t("statusProcessing")
                                : it.status === "error"
                                ? t("statusError")
                                : t("statusWaiting")}
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </ToolShell>
  );
}
