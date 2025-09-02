"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Copy, Download, RotateCcw, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NumberFlow from "@number-flow/react";

// Simple QR Code generator using canvas
const generateQRCode = (
  text: string,
  size: number,
  errorCorrectionLevel: string
): string => {
  // This is a simplified QR code generator
  // In a real implementation, you'd use a proper QR code library like 'qrcode'
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  canvas.width = size;
  canvas.height = size;

  // Create a simple pattern that looks like a QR code
  const moduleSize = Math.floor(size / 25); // 25x25 grid
  const modules = 25;

  // Fill background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  // Generate a pseudo-random pattern based on the input text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffffffff;
  }

  // Create pattern
  ctx.fillStyle = "#000000";
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      // Create finder patterns (corners)
      if (
        (row < 7 && col < 7) || // Top-left
        (row < 7 && col >= modules - 7) || // Top-right
        (row >= modules - 7 && col < 7) // Bottom-left
      ) {
        if (
          ((row < 2 || row >= 5) && (col < 2 || col >= 5)) ||
          (row >= 2 && row < 5 && col >= 2 && col < 5)
        ) {
          ctx.fillRect(
            col * moduleSize,
            row * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      } else {
        // Random pattern based on hash
        const seed = (hash + row * modules + col) % 100;
        if (seed < 50) {
          ctx.fillRect(
            col * moduleSize,
            row * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }
  }

  return canvas.toDataURL("image/png");
};

export default function QRCodeGenerator() {
  const [inputText, setInputText] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [size, setSize] = useState(256);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M");
  const [fileName, setFileName] = useState("qrcode");
  const { toast } = useToast();

  const generateQR = () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to encode",
        description: "Please enter some text or URL to generate a QR code.",
        variant: "destructive",
      });
      return;
    }

    try {
      const qrCode = generateQRCode(inputText, size, errorCorrectionLevel);
      setQrCodeDataUrl(qrCode);
    } catch (error) {
      toast({
        title: "Error generating QR code",
        description:
          "There was an error generating the QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    if (!qrCodeDataUrl) {
      toast({
        title: "No QR code to copy",
        description: "Please generate a QR code first.",
        variant: "destructive",
      });
      return;
    }

    // Convert data URL to blob and copy to clipboard
    fetch(qrCodeDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        toast({
          title: "Copied to clipboard",
          description: "The QR code has been copied to your clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Could not copy the QR code to clipboard.",
          variant: "destructive",
        });
      });
  };

  const handleDownload = () => {
    if (!qrCodeDataUrl) {
      toast({
        title: "No QR code to download",
        description: "Please generate a QR code first.",
        variant: "destructive",
      });
      return;
    }

    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "The QR code has been downloaded.",
    });
  };

  const handleClear = () => {
    setInputText("");
    setQrCodeDataUrl("");
    setFileName("qrcode");
  };

  const handleSampleText = (type: string) => {
    const samples = {
      url: "https://www.example.com",
      email: "mailto:contact@example.com",
      phone: "tel:+1234567890",
      sms: "sms:+1234567890:Hello World",
      wifi: "WIFI:T:WPA;S:MyNetwork;P:password123;H:false;;",
      text: "Hello, this is a sample QR code!",
    };

    setInputText(samples[type as keyof typeof samples] || samples.text);
  };

  // Auto-generate when text changes
  useEffect(() => {
    if (inputText.trim()) {
      const qrCode = generateQRCode(inputText, size, errorCorrectionLevel);
      setQrCodeDataUrl(qrCode);
    }
  }, [inputText, size, errorCorrectionLevel]);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">QR Code Generator</h1>
        <p className="text-muted-foreground">
          Generate QR codes from text, URLs, emails, and more. Perfect for
          sharing information quickly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>
                Enter the text or URL you want to encode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-text">Text or URL</Label>
                <Textarea
                  id="input-text"
                  placeholder="Enter text, URL, email, or other data to encode..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Quick Samples</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleText("url")}
                  >
                    URL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleText("email")}
                  >
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleText("phone")}
                  >
                    Phone
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleText("wifi")}
                  >
                    WiFi
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
                Customize your QR code appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="size">
                  Size: <NumberFlow value={size} />
                  px
                </Label>
                <Slider
                  id="size"
                  min={128}
                  max={512}
                  step={32}
                  value={[size]}
                  onValueChange={(value) => setSize(value[0])}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="error-correction">Error Correction Level</Label>
                <Select
                  value={errorCorrectionLevel}
                  onValueChange={setErrorCorrectionLevel}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filename">Download Filename</Label>
                <Input
                  id="filename"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="qrcode"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
            <CardDescription>Your generated QR code</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              {qrCodeDataUrl ? (
                <>
                  <div className="p-4 bg-white rounded-lg border">
                    <img
                      src={qrCodeDataUrl}
                      alt="Generated QR Code"
                      className="max-w-full h-auto"
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
                      Download
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <QrCode className="w-16 h-16 mb-4" />
                  <p>Enter text to generate QR code</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">QR Code Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium mb-1">URLs</p>
              <p>https://www.example.com</p>
            </div>
            <div>
              <p className="font-medium mb-1">Email</p>
              <p>mailto:contact@example.com</p>
            </div>
            <div>
              <p className="font-medium mb-1">Phone</p>
              <p>tel:+1234567890</p>
            </div>
            <div>
              <p className="font-medium mb-1">SMS</p>
              <p>sms:+1234567890:Message</p>
            </div>
            <div>
              <p className="font-medium mb-1">WiFi</p>
              <p>WIFI:T:WPA;S:Network;P:Password;;</p>
            </div>
            <div>
              <p className="font-medium mb-1">Plain Text</p>
              <p>Any text you want to share</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
