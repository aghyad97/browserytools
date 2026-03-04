"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Eye, ImageIcon } from "lucide-react";
import { toast } from "sonner";

type SimType = "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia";

const SIM_INFO: Record<SimType, { label: string; description: string; detail: string }> = {
  deuteranopia: {
    label: "Deuteranopia",
    description: "Green-blind",
    detail: "Deuteranopia is a form of red-green color blindness where the eye lacks functioning green cone cells. Affects ~1% of males. Red and green hues are difficult to distinguish.",
  },
  protanopia: {
    label: "Protanopia",
    description: "Red-blind",
    detail: "Protanopia is a type of red-green color blindness caused by the absence of red cone cells. Reds appear dark and dull. Affects ~1% of males.",
  },
  tritanopia: {
    label: "Tritanopia",
    description: "Blue-blind",
    detail: "Tritanopia is a rare form of color blindness affecting blue-yellow perception, caused by missing blue cone cells. Blues appear green and yellows appear violet. Affects ~0.01% of people.",
  },
  achromatopsia: {
    label: "Achromatopsia",
    description: "Total color blindness",
    detail: "Achromatopsia (monochromacy) is the inability to see any color at all. The world appears in shades of gray. A very rare condition affecting roughly 1 in 30,000 people.",
  },
};

function applySimulation(imageData: ImageData, type: SimType): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    let nr: number, ng: number, nb: number;

    switch (type) {
      case "deuteranopia":
        nr = 0.625 * r + 0.375 * g + 0 * b;
        ng = 0.700 * r + 0.300 * g + 0 * b;
        nb = 0.000 * r + 0.300 * g + 0.700 * b;
        break;
      case "protanopia":
        nr = 0.567 * r + 0.433 * g + 0 * b;
        ng = 0.558 * r + 0.442 * g + 0 * b;
        nb = 0.000 * r + 0.242 * g + 0.758 * b;
        break;
      case "tritanopia":
        nr = 0.950 * r + 0.050 * g + 0 * b;
        ng = 0.000 * r + 0.433 * g + 0.567 * b;
        nb = 0.000 * r + 0.475 * g + 0.525 * b;
        break;
      case "achromatopsia": {
        const y = 0.299 * r + 0.587 * g + 0.114 * b;
        nr = ng = nb = y;
        break;
      }
    }

    data[i] = Math.min(255, Math.max(0, Math.round(nr)));
    data[i + 1] = Math.min(255, Math.max(0, Math.round(ng)));
    data[i + 2] = Math.min(255, Math.max(0, Math.round(nb)));
  }

  return new ImageData(data, imageData.width, imageData.height);
}

export default function ColorBlindnessSimulator() {
  const t = useTranslations("Tools.ColorBlindnessSimulator");
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [simSrc, setSimSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SimType>("deuteranopia");
  const [processing, setProcessing] = useState(false);
  const [imageDims, setImageDims] = useState<{ w: number; h: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const processImage = useCallback(async (src: string, type: SimType) => {
    setProcessing(true);
    try {
      const img = new Image();
      img.src = src;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Image load failed"));
      });

      const canvas = offscreenCanvasRef.current ?? document.createElement("canvas");
      offscreenCanvasRef.current = canvas;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const simulated = applySimulation(imageData, type);
      ctx.putImageData(simulated, 0, 0);

      setSimSrc(canvas.toDataURL("image/png"));
      setImageDims({ w: img.naturalWidth, h: img.naturalHeight });
    } catch (err) {
      toast.error(t("processError"));
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error(t("uploadError"));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setOriginalSrc(src);
        setSimSrc(null);
        processImage(src, activeTab);
      };
      reader.readAsDataURL(file);
    },
    [activeTab, processImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  useEffect(() => {
    if (originalSrc) {
      processImage(originalSrc, activeTab);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const downloadSim = () => {
    if (!simSrc) return;
    const a = document.createElement("a");
    a.href = simSrc;
    a.download = `${activeTab}-simulation.png`;
    a.click();
    toast.success(t("downloaded"));
  };

  const info = SIM_INFO[activeTab];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Eye className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
        </div>

        {/* Upload Area */}
        {!originalSrc && (
          <Card
            className="border-dashed border-2 cursor-pointer hover:border-primary transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="pt-12 pb-12 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{t("dropImage")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("supportedFormats")}</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </CardContent>
          </Card>
        )}

        {originalSrc && (
          <>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                {imageDims && (
                  <Badge variant="outline">
                    {imageDims.w} × {imageDims.h}px
                  </Badge>
                )}
                {processing && <Badge variant="outline" className="animate-pulse">{t("processing")}</Badge>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {t("changeImage")}
                </Button>
                <Button variant="outline" onClick={downloadSim} disabled={!simSrc}>
                  <Download className="w-4 h-4 mr-2" />
                  {t("download")}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SimType)}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="deuteranopia">{t("tabGreenBlind")}</TabsTrigger>
                <TabsTrigger value="protanopia">{t("tabRedBlind")}</TabsTrigger>
                <TabsTrigger value="tritanopia">{t("tabBlueBlind")}</TabsTrigger>
                <TabsTrigger value="achromatopsia">{t("tabNoColor")}</TabsTrigger>
              </TabsList>

              {(["deuteranopia", "protanopia", "tritanopia", "achromatopsia"] as SimType[]).map((type) => (
                <TabsContent key={type} value={type} className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        {t(`${type}Label` as any)}
                        <Badge variant="secondary">{t(`${type}Desc` as any)}</Badge>
                      </CardTitle>
                      <CardDescription className="text-sm">{t(`${type}Detail` as any)}</CardDescription>
                    </CardHeader>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">{t("original")}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={originalSrc} alt="Original" className="w-full rounded-md object-contain max-h-64" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">{SIM_INFO[type].label} {t("simulation")}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        {simSrc && !processing ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={simSrc} alt={`${type} simulation`} className="w-full rounded-md object-contain max-h-64" />
                        ) : (
                          <div className="w-full h-40 bg-muted rounded-md flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">{processing ? t("processing") : t("simulationAppears")}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
