"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Download, Trash2, Eye, EyeOff } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import JSZip from "jszip";
import { Config, removeBackground } from "@imgly/background-removal";

const config: Config = {
  device: "gpu",
};

export default function BgRemoval() {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: true,
  });

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

        // Remove background
        const resultBlob = await removeBackground(blob, config);

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
      const url = URL.createObjectURL(item.processedBlob);
      const link = document.createElement("a");
      link.href = url;

      const base = item.name.replace(/\.[^.]+$/, "");
      const safeName = base.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
      link.download = `${safeName}-no-bg.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      console.log(`Downloaded: ${link.download}`);
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
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;

      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `browserytools-${timestamp}.zip`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      console.log(`Download initiated: ${link.download}`);
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

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      {/* Header Controls */}
      <div className="flex justify-between items-center p-6 gap-2 flex-wrap bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
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
            {showAfter ? "Show Before" : "Show After"}
          </Button>
          {isProcessingAll && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleDownloadAll}
            disabled={
              items.filter((i) => i.processedBlob).length === 0 || isZipping
            }
            className="flex items-center gap-2"
          >
            {isZipping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparing Zip...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download All ({items.filter((i) => i.processedBlob).length})
              </>
            )}
          </Button>
          {items.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleClear}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Upload Area */}
          <Card className="min-h-[16rem] col-span-1 md:col-span-2">
            <div
              {...getRootProps()}
              className={`
                h-full rounded-lg border-2 border-dashed
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
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Drop your images here
                </h3>
                <p className="text-muted-foreground text-sm">
                  Supports PNG, JPG or JPEG files. Multiple files allowed.
                </p>
                {items.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {items.length} image{items.length !== 1 ? "s" : ""} loaded
                  </p>
                )}
              </motion.div>
            </div>
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

                          {/* Processing Overlay */}
                          {it.status === "processing" && (
                            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <Progress value={it.progress} className="w-3/4" />
                              <span className="text-xs text-muted-foreground">
                                Removing background...
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
                                Failed to process
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Image Info and Actions */}
                        <div className="mt-3 space-y-2">
                          <div className="text-xs truncate" title={it.name}>
                            {it.name}
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-xs text-muted-foreground">
                              {it.status === "done"
                                ? "Ready"
                                : it.status === "processing"
                                ? "Processing..."
                                : it.status === "error"
                                ? "Error"
                                : "Waiting"}
                            </div>
                            <div className="flex items-center gap-1">
                              {it.processedBlob && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleDownloadOne(it)}
                                  className="h-7 px-2"
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteOne(it.id)}
                                className="h-7 px-2"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
