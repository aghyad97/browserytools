"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Copy, Download, RotateCcw, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NumberFlow from "@number-flow/react";

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
  const [inputText, setInputText] = useState("");
  const [barcodeType, setBarcodeType] = useState("CODE128");
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [fontSize, setFontSize] = useState(20);
  const [margin, setMargin] = useState(10);
  const [fileName, setFileName] = useState("barcode");
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateBarcode = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to encode",
        description: "Please enter some text to generate a barcode.",
        variant: "destructive",
      });
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
        background: "#ffffff",
        lineColor: "#000000",
      };

      JsBarcode(canvas, inputText, options);
    } catch (error) {
      console.error("Error generating barcode:", error);
      toast({
        title: "Error generating barcode",
        description:
          "There was an error generating the barcode. Please check your input and try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast({
        title: "No barcode to copy",
        description: "Please generate a barcode first.",
        variant: "destructive",
      });
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
          toast({
            title: "Copied to clipboard",
            description: "The barcode has been copied to your clipboard.",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy the barcode to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast({
        title: "No barcode to download",
        description: "Please generate a barcode first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = document.createElement("a");
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download started",
        description: "The barcode has been downloaded as PNG.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the barcode.",
        variant: "destructive",
      });
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
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>
                Enter the data you want to encode as a barcode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="barcode-type">Barcode Type</Label>
                <Select value={barcodeType} onValueChange={setBarcodeType}>
                  <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-text">Data to Encode</Label>
                <Input
                  id="input-text"
                  placeholder="Enter data to encode..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Sample Data</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleData("CODE128")}
                  >
                    CODE128
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleData("EAN13")}
                  >
                    EAN-13
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleData("UPC")}
                  >
                    UPC-A
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleData("CODE39")}
                  >
                    CODE39
                  </Button>
                </div>
              </div>

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
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Customize your barcode appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="width">
                  Bar Width: <NumberFlow value={width} />
                </Label>
                <Slider
                  id="width"
                  min={1}
                  max={5}
                  step={0.5}
                  value={[width]}
                  onValueChange={(value) => setWidth(value[0])}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">
                  Height: <NumberFlow value={height} />
                  px
                </Label>
                <Slider
                  id="height"
                  min={50}
                  max={200}
                  step={10}
                  value={[height]}
                  onValueChange={(value) => setHeight(value[0])}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">
                  Font Size: <NumberFlow value={fontSize} />
                  px
                </Label>
                <Slider
                  id="font-size"
                  min={10}
                  max={30}
                  step={2}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="margin">
                  Margin: <NumberFlow value={margin} />
                  px
                </Label>
                <Slider
                  id="margin"
                  min={0}
                  max={30}
                  step={2}
                  value={[margin]}
                  onValueChange={(value) => setMargin(value[0])}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filename">Download Filename</Label>
                <Input
                  id="filename"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="barcode"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Barcode</CardTitle>
            <CardDescription>Your generated barcode</CardDescription>
          </CardHeader>
          <CardContent>
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
                  Copy
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Barcode Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
            {BARCODE_TYPES.map((type) => (
              <div key={type.value}>
                <p className="font-medium mb-1">{type.label}</p>
                <p>{type.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
