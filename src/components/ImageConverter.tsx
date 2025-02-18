"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
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
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

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

export default function ImageConverter() {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [targetFormat, setTargetFormat] = useState("image/png");
  const [quality, setQuality] = useState(85);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        // 15MB limit
        toast.error("Image size should be less than 15MB");
        return;
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".avif"],
    },
    multiple: false,
  });

  const handleConvert = async () => {
    if (!image) return;

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

      // Convert to new format
      const convertedUrl = canvas.toDataURL(targetFormat, quality / 100);
      setConvertedImage(convertedUrl);

      // Calculate converted size
      const base64str = convertedUrl.split(",")[1];
      const decodedStr = atob(base64str);
      setConvertedSize(decodedStr.length);

      toast.success("Image converted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to convert image. Please try again.");
    }
  };

  const handleDownload = () => {
    if (!convertedImage || !image) return;

    const extension =
      formatOptions
        .find((f) => f.value === targetFormat)
        ?.label.toLowerCase() || "png";
    const filename = `${image.name.split(".")[0]}_converted.${extension}`;

    const link = document.createElement("a");
    link.href = convertedImage;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  const formatOption = formatOptions.find((f) => f.value === targetFormat);

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-between items-center p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div>
          <h1 className="text-3xl font-bold">Format Converter</h1>
          <p className="text-muted-foreground mt-1">
            Convert images between different formats
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <div className="space-y-4">
            <Card className="p-6">
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
                {image ? (
                  <div className="w-full h-full relative">
                    <img
                      src={image.url}
                      alt="Original"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                      Size: {(image.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      Drop your image here
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Supports PNG, JPG, WebP or AVIF files
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Format</label>
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
                    <label className="text-sm font-medium">Quality</label>
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
                disabled={!image}
              >
                Convert
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
                      alt="Converted"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                      Size: {(convertedSize / 1024).toFixed(2)} KB
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Converted image will appear here
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Button
              onClick={handleDownload}
              className="w-full"
              disabled={!convertedImage}
              variant="secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
