"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Download, RotateCcw } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { SliderRow } from "@/components/shared/SliderRow";
import { downloadDataUrl } from "@/lib/download";

// Barcode types supported by JsBarcode
const BARCODE_TYPES = [
  {
    value: "CODE128",
    label: "CODE128",
    description: "Most common barcode format",
  },
  { value: "CODE39", label: "CODE39", description: "Alphanumeric barcode" },
  { value: "EAN13", label: "EAN-13", description: "13-digit product barcode" },
  { value: "EAN8", label: "EAN-8", description: "8-digit product barcode" },
  { value: "UPC", label: "UPC-A", description: "12-digit product barcode" },
  { value: "ITF14", label: "ITF-14", description: "14-digit shipping barcode" },
  { value: "MSI", label: "MSI", description: "Inventory management" },
  {
    value: "pharmacode",
    label: "Pharmacode",
    description: "Pharmaceutical packaging",
  },
  {
    value: "codabar",
    label: "Codabar",
    description: "Library and blood banks",
  },
  {
    value: "CODE93",
    label: "CODE93",
    description: "Enhanced version of CODE39",
  },
];

// Sample data for different barcode types
const SAMPLE_DATA = {
  CODE128: "123456789012",
  CODE39: "HELLO123",
  EAN13: "1234567890123",
  EAN8: "12345678",
  UPC: "123456789012",
  ITF14: "12345678901234",
  MSI: "1234567890",
  pharmacode: "1234",
  codabar: "A123456789A",
  CODE93: "HELLO123",
};

export default function BarcodeGenerator() {
  const t = useTranslations("Tools.BarcodeGenerator");
  const tc = useTranslations("ToolsConfig");
  const [inputText, setInputText] = useState("");
  const [barcodeType, setBarcodeType] = useState("CODE128");
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [fontSize, setFontSize] = useState(20);
  const [margin, setMargin] = useState(10);
  const [fileName, setFileName] = useState("barcode");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateBarcode = async () => {
    if (!inputText.trim()) {
      toast.error(t("noTextToEncode"));
      return;
    }

    try {
      // Dynamically import JsBarcode to avoid SSR issues
      const JsBarcode = (await import("jsbarcode")).default;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const options = {
        format: barcodeType,
        width: width,
        height: height,
        displayValue: displayValue,
        fontSize: fontSize,
        margin: margin,
        // content value: barcodes must render black-on-white regardless of UI theme (JsBarcode render options, not chrome)
        background: "#ffffff",
        lineColor: "#000000",
      };

      JsBarcode(canvas, inputText, options);
    } catch (error) {
      console.error("Error generating barcode:", error);
      toast.error(t("errorGenerating"));
    }
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error(t("noBarcodeToDownload"));
      return;
    }

    try {
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ]);
          toast.success(t("copiedToClipboard"));
        }
      });
    } catch (error) {
      toast.error(t("copyFailed"));
    }
  };

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error(t("noBarcodeToDownload"));
      return;
    }

    try {
      downloadDataUrl(canvas.toDataURL(), `${fileName}.png`);

      toast.success(t("downloadStarted"));
    } catch (error) {
      toast.error(t("downloadFailed"));
    }
  };

  const handleClear = () => {
    setInputText("");
    setFileName("barcode");
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleSampleData = (type: string) => {
    const sample = SAMPLE_DATA[type as keyof typeof SAMPLE_DATA];
    if (sample) {
      setInputText(sample);
    }
  };

  // Auto-generate when input changes
  useEffect(() => {
    if (inputText.trim()) {
      generateBarcode();
    }
  }, [inputText, barcodeType, width, height, displayValue, fontSize, margin]);

  return (
    <ToolShell
      slug="barcode-generator"
      title={tc("tools.barcode-generator.name")}
      sub={tc("tools.barcode-generator.description")}
    >
      <div className="flex flex-col lg:flex-row gap-4 h-screen lg:h-[calc(100vh-2rem)]">
        {/* Input Section - Sticky Sidebar */}
        <div className="w-full lg:w-1/3 overflow-y-auto space-y-4 pe-4 scrollbar-hide">
          <SettingsCard title={t("inputTitle")} description={t("inputDesc")}>
            <OptionRow label={t("barcodeType")} htmlFor="barcode-type">
              <Select value={barcodeType} onValueChange={setBarcodeType}>
                <SelectTrigger id="barcode-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BARCODE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {type.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </OptionRow>

            <OptionRow label={t("dataToEncode")} htmlFor="input-text">
              <Input
                id="input-text"
                placeholder={t("dataPlaceholder")}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                dir="ltr"
              />
            </OptionRow>

            <OptionRow label={t("sampleData")}>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => handleSampleData("CODE128")}>CODE128</Button>
                <Button variant="outline" size="sm" onClick={() => handleSampleData("EAN13")}>EAN-13</Button>
                <Button variant="outline" size="sm" onClick={() => handleSampleData("UPC")}>UPC-A</Button>
                <Button variant="outline" size="sm" onClick={() => handleSampleData("CODE39")}>CODE39</Button>
              </div>
            </OptionRow>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClear}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </SettingsCard>

          {/* Settings */}
          <SettingsCard title={t("settingsTitle")} description={t("settingsDesc")}>
            <SliderRow
              label={t("barWidth")}
              value={width}
              min={1}
              max={5}
              step={0.5}
              onChange={setWidth}
              display={<NumberFlow value={width} />}
            />
            <SliderRow
              label={t("height")}
              value={height}
              min={50}
              max={200}
              step={10}
              onChange={setHeight}
              display={<><NumberFlow value={height} />px</>}
            />
            <SliderRow
              label={t("fontSize")}
              value={fontSize}
              min={10}
              max={30}
              step={2}
              onChange={setFontSize}
              display={<><NumberFlow value={fontSize} />px</>}
            />
            <SliderRow
              label={t("margin")}
              value={margin}
              min={0}
              max={30}
              step={2}
              onChange={setMargin}
              display={<><NumberFlow value={margin} />px</>}
            />

            <OptionRow label={t("downloadFilename")} htmlFor="filename">
              <Input
                id="filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="barcode"
                dir="ltr"
              />
            </OptionRow>
          </SettingsCard>
        </div>

        {/* Output Section - Sticky Content */}
        <div className="w-full lg:w-2/3 lg:sticky lg:top-4 lg:h-fit space-y-4">
          <SettingsCard title={t("barcodeTitle")} description={t("barcodeDesc")}>
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto"
                    style={{ maxWidth: "100%" }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopy}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {t("copy")}
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {t("downloadPng")}
                  </Button>
                </div>
              </div>
          </SettingsCard>

          {/* Info */}
          <SettingsCard title={t("barcodeTypesTitle")}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
              {BARCODE_TYPES.map((type) => (
                <div key={type.value}>
                  <p className="font-medium mb-1">{type.label}</p>
                  <p>{type.description}</p>
                </div>
              ))}
            </div>
          </SettingsCard>
        </div>
      </div>
    </ToolShell>
  );
}
