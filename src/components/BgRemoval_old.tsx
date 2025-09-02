"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  Download,
  Trash2,
} from "lucide-react";
import { initializeModel, removeBackground } from "@/lib/bg-removal";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function BgRemoval() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await initializeModel();
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    };
    loadModel();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setProcessedImage(null);
        setProgress(0);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: false,
  });

  const handleRemoveBackground = async () => {
    if (!image) return;
    setLoading(true);
    setProgress(0);

    try {
      const result = await removeBackground(image);
      setProgress(100);
      setProcessedImage(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "processed-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setImage(null);
    setProcessedImage(null);
    setProgress(0);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-end items-center p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {(image || processedImage) && (
          <Button
            variant="ghost"
            onClick={handleClear}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full max-w-7xl mx-auto">
          <div className="space-y-4">
            <Card className="h-[calc(100%-10rem)]">
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
                <AnimatePresence mode="wait">
                  {image ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="w-full h-full relative rounded-md overflow-hidden bg-muted/50"
                    >
                      <img
                        src={image}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    </motion.div>
                  ) : (
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
                        Drop your image here
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Supports PNG, JPG or JPEG files
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            <Button
              onClick={handleRemoveBackground}
              disabled={!image || loading}
              className="w-full h-12 text-base"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Remove Background"
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <Card className="h-[calc(100%-10rem)]">
              <div className="h-full rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                  {processedImage ? (
                    <motion.div
                      key="processed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full rounded-md overflow-hidden bg-[url('/checkerboard.png')] bg-repeat"
                    >
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="w-full h-full object-contain"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Processed Image
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Your processed image will appear here
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {processedImage ? (
              <Button
                onClick={handleDownload}
                variant="secondary"
                className="w-full h-12 text-base"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Result
              </Button>
            ) : (
              <Button
                variant="secondary"
                disabled
                className="w-full h-12 text-base"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Result
              </Button>
            )}
          </div>
        </div>

        {loading && (
          <Card className="p-4 mt-6 max-w-7xl mx-auto">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm">Processing image...</p>
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
