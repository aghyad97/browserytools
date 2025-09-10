"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export default function SvgPngConverter() {
  const [svgText, setSvgText] = useState<string>("");
  const [scale, setScale] = useState<number>(2);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".svg")) {
      toast.error("Please upload an SVG file");
      return;
    }
    const text = await file.text();
    setSvgText(text);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/svg+xml": [".svg"] },
    multiple: false,
  });

  const exportPng = async (mult: number) => {
    if (!svgText) return;
    try {
      const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.src = url;
      await new Promise((res, rej) => {
        img.onload = () => res(null);
        img.onerror = rej;
      });
      const width = img.width * mult;
      const height = img.height * mult;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context error");
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `export-${mult}x.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error("Export failed");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>SVG ↔ PNG Converter</CardTitle>
          <CardDescription>
            Upload or paste SVG and export PNG at 1x/2x/3x
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            {...getRootProps()}
            className={`h-48 rounded-lg border-2 border-dashed flex items-center justify-center p-6 cursor-pointer ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-muted-foreground hover:border-primary"
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="font-medium">
                Drop SVG here or click to select
              </div>
            </div>
          </div>
          <textarea
            value={svgText}
            onChange={(e) => setSvgText(e.target.value)}
            placeholder="Paste SVG markup here..."
            className="w-full min-h-[200px] border rounded p-3 font-mono text-sm"
          />
          <div className="grid grid-cols-3 gap-3">
            <Button onClick={() => exportPng(1)} disabled={!svgText}>
              Export 1x
            </Button>
            <Button
              onClick={() => exportPng(2)}
              disabled={!svgText}
              variant="secondary"
            >
              Export 2x
            </Button>
            <Button
              onClick={() => exportPng(3)}
              disabled={!svgText}
              variant="secondary"
            >
              Export 3x
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
