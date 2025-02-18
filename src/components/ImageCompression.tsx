"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Download,
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

const compressionModes = [
  { value: "auto", label: "Auto (Recommended)" },
  { value: "aggressive", label: "Aggressive" },
  { value: "custom", label: "Custom" },
];

const targetFormats = [
  { value: "original", label: "Same as Source" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/webp", label: "WebP (Recommended)" },
  { value: "image/png", label: "PNG" },
];

export default function ImageCompression() {
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
        toast.error("Image size should be less than 25MB");
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    multiple: false,
  });

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
      toast.success("Image compressed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to compress image. Please try again.");
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
    const link = document.createElement("a");
    link.href = compressedImage;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
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
      ? ((1 - compressedSize / image.size) * 100).toFixed(1)
      : 0;

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-between items-center p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div>
          <h1 className="text-3xl font-bold">Image Compression</h1>
          <p className="text-muted-foreground mt-1">
            Compress images without losing quality
          </p>
        </div>
        {image && compressedImage && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">Size Reduction</p>
              <p className="text-2xl font-bold text-green-500">
                {compressionRatio}%
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setComparing(!comparing)}
            >
              {comparing ? <MinusSquare /> : <Maximize2 />}
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <div className="space-y-4">
            <Card className="p-6">
              {!image ? (
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
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      Drop your image here
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Up to 25MB - PNG, JPG or WebP
                    </p>
                  </div>
                </div>
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
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                    {image.width} x {image.height} •{" "}
                    {(image.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-4">
              <Tabs defaultValue="basic" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Compression Mode
                    </label>
                    <Select value={mode} onValueChange={setMode}>
                      <SelectTrigger>
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
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Output Format</label>
                    <Select
                      value={targetFormat}
                      onValueChange={setTargetFormat}
                    >
                      <SelectTrigger>
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
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  {mode === "custom" && (
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

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Max Width</label>
                      <span className="text-sm text-muted-foreground">
                        {maxWidth}px
                      </span>
                    </div>
                    <Slider
                      value={[maxWidth]}
                      onValueChange={([value]) => setMaxWidth(value)}
                      min={320}
                      max={3840}
                      step={1}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={compressImage}
                className="w-full mt-4"
                disabled={!image || loading}
              >
                Compress Image
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
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                      {(compressedSize / 1024).toFixed(1)} KB
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Compressed image will appear here
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {compressedImage && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleDownload}
                  className="w-full"
                  variant="secondary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => window.open(compressedImage, "_blank")}
                  className="w-full"
                  variant="outline"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Preview Full
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
