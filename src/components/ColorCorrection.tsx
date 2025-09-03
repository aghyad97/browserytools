"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, Undo, Redo } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Adjustment {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
  vibrance: number;
  exposure: number;
  highlights: number;
  shadows: number;
}

const defaultAdjustments: Adjustment = {
  brightness: 100,
  contrast: 0,
  saturation: 100,
  temperature: 0,
  tint: 0,
  vibrance: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
};

export default function ColorCorrection() {
  const [image, setImage] = useState<string | null>(null);
  const [adjustments, setAdjustments] =
    useState<Adjustment>(defaultAdjustments);
  const [history, setHistory] = useState<Adjustment[]>([defaultAdjustments]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAdjustments(defaultAdjustments);
        setHistory([defaultAdjustments]);
        setHistoryIndex(0);
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

  const applyAdjustments = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Reset transform and clear
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Apply adjustments
      for (let i = 0; i < data.length; i += 4) {
        // RGB values
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Brightness
        r *= adjustments.brightness / 100;
        g *= adjustments.brightness / 100;
        b *= adjustments.brightness / 100;

        // Contrast
        const factor =
          (259 * (adjustments.contrast + 255)) /
          (255 * (259 - adjustments.contrast));
        r = factor * (r - 128) + 128;
        g = factor * (g - 128) + 128;
        b = factor * (b - 128) + 128;

        // Saturation
        const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
        r = gray + (r - gray) * (adjustments.saturation / 100);
        g = gray + (g - gray) * (adjustments.saturation / 100);
        b = gray + (b - gray) * (adjustments.saturation / 100);

        // Temperature
        r += adjustments.temperature;
        b -= adjustments.temperature;

        // Tint
        g += adjustments.tint;

        // Clamp values
        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
      }

      // Put the modified data back
      ctx.putImageData(imageData, 0, 0);
    };
    img.src = image;
  }, [image, adjustments]);

  useEffect(() => {
    applyAdjustments();
  }, [applyAdjustments]);

  const handleAdjustmentChange = (key: keyof Adjustment, value: number) => {
    const newAdjustments = { ...adjustments, [key]: value };
    setAdjustments(newAdjustments);

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newAdjustments);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAdjustments(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAdjustments(history[historyIndex + 1]);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "corrected-image.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const adjustmentControls = [
    { key: "brightness", label: "Brightness", min: 0, max: 200, step: 1 },
    { key: "contrast", label: "Contrast", min: -100, max: 100, step: 1 },
    { key: "saturation", label: "Saturation", min: 0, max: 200, step: 1 },
    { key: "temperature", label: "Temperature", min: -100, max: 100, step: 1 },
    { key: "tint", label: "Tint", min: -100, max: 100, step: 1 },
    { key: "vibrance", label: "Vibrance", min: -100, max: 100, step: 1 },
    { key: "exposure", label: "Exposure", min: -100, max: 100, step: 1 },
    { key: "highlights", label: "Highlights", min: -100, max: 100, step: 1 },
    { key: "shadows", label: "Shadows", min: -100, max: 100, step: 1 },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 gap-6 p-6 overflow-hidden">
        <div className="flex-1 min-w-0">
          <Card className="h-full">
            {!image ? (
              <div
                {...getRootProps()}
                className={`
                  h-full rounded-lg border-2 border-dashed
                  flex flex-col items-center justify-center space-y-4 p-8
                  cursor-pointer transition-colors
                  ${
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : "border-muted-foreground"
                  }
                `}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-1">
                    Drop your image here
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Supports PNG, JPG or JPEG files
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative h-full overflow-hidden rounded-lg">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </Card>
        </div>

        <Card className="w-80 p-4 overflow-y-auto">
          <div className="flex gap-2 items-center mb-4 justify-center">
            <Button
              variant="outline"
              onClick={handleUndo}
              disabled={historyIndex === 0}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
          <Tabs defaultValue="basic">
            <TabsList className="w-full">
              <TabsTrigger value="basic" className="flex-1">
                Basic
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex-1">
                Advanced
              </TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4">
              {adjustmentControls.slice(0, 5).map((control) => (
                <div key={control.key} className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      {control.label}
                    </label>
                    <span className="text-sm text-muted-foreground">
                      {adjustments[control.key as keyof Adjustment]}
                    </span>
                  </div>
                  <Slider
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={[adjustments[control.key as keyof Adjustment]]}
                    onValueChange={([value]) =>
                      handleAdjustmentChange(
                        control.key as keyof Adjustment,
                        value
                      )
                    }
                  />
                </div>
              ))}
            </TabsContent>
            <TabsContent value="advanced" className="space-y-4">
              {adjustmentControls.slice(5).map((control) => (
                <div key={control.key} className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      {control.label}
                    </label>
                    <span className="text-sm text-muted-foreground">
                      {adjustments[control.key as keyof Adjustment]}
                    </span>
                  </div>
                  <Slider
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={[adjustments[control.key as keyof Adjustment]]}
                    onValueChange={([value]) =>
                      handleAdjustmentChange(
                        control.key as keyof Adjustment,
                        value
                      )
                    }
                  />
                </div>
              ))}
            </TabsContent>
          </Tabs>

          {image && (
            <Button onClick={handleDownload} className="w-full mt-4" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
