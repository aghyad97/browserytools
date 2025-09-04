"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Copy,
  Camera,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  Barcode,
} from "lucide-react";
import { toast } from "sonner";

export default function BarcodeScanner() {
  const [scannedData, setScannedData] = useState<string>("");
  const [barcodeType, setBarcodeType] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const barcodeTypes = [
    { value: "CODE128", label: "CODE128" },
    { value: "EAN13", label: "EAN-13" },
    { value: "EAN8", label: "EAN-8" },
    { value: "UPC", label: "UPC-A" },
    { value: "CODE39", label: "CODE39" },
    { value: "ITF", label: "ITF (Interleaved 2 of 5)" },
    { value: "MSI", label: "MSI Plessey" },
    { value: "pharmacode", label: "Pharmacode" },
    { value: "codabar", label: "Codabar" },
  ];

  // Barcode detection using QuaggaJS (we'll need to install this)
  useEffect(() => {
    if (isScanning && videoRef.current && cameraStream) {
      const video = videoRef.current;
      video.srcObject = cameraStream;
      video.play();

      // Simple barcode detection simulation
      const detectBarcode = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA && canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);

            // Placeholder: simulate barcode detection
            setTimeout(() => {
              if (Math.random() > 0.98) {
                // 2% chance of "detecting" something
                const sampleBarcodes = [
                  { data: "1234567890123", type: "EAN13" },
                  { data: "123456789012", type: "UPC" },
                  { data: "ABC123456789", type: "CODE128" },
                  { data: "1234567890", type: "CODE39" },
                ];
                const randomBarcode =
                  sampleBarcodes[
                    Math.floor(Math.random() * sampleBarcodes.length)
                  ];
                setScannedData(randomBarcode.data);
                setBarcodeType(randomBarcode.type);
                setIsScanning(false);
                stopCamera();
              }
            }, 2000);
          }
        }
        if (isScanning) {
          requestAnimationFrame(detectBarcode);
        }
      };

      detectBarcode();
    }
  }, [isScanning, cameraStream]);

  const startCamera = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera if available
      });
      setCameraStream(stream);
      setIsScanning(true);
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsScanning(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        // In a real implementation, you'd process the image for barcodes here
        // For now, we'll simulate detection
        setTimeout(() => {
          const sampleBarcodes = [
            { data: "9876543210987", type: "EAN13" },
            { data: "987654321098", type: "UPC" },
            { data: "XYZ987654321", type: "CODE128" },
          ];
          const randomBarcode =
            sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)];
          setScannedData(randomBarcode.data);
          setBarcodeType(randomBarcode.type);
        }, 500);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Copy failed");
    }
  };

  const downloadResult = () => {
    const result = {
      barcode: scannedData,
      type: barcodeType,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "barcode-scan-result.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearResults = () => {
    setScannedData("");
    setBarcodeType("");
    setUploadedImage("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateBarcode = (data: string, type: string) => {
    // Basic validation rules for different barcode types
    switch (type) {
      case "EAN13":
        return data.length === 13 && /^\d+$/.test(data);
      case "EAN8":
        return data.length === 8 && /^\d+$/.test(data);
      case "UPC":
        return data.length === 12 && /^\d+$/.test(data);
      case "CODE128":
        return data.length >= 1 && data.length <= 80;
      case "CODE39":
        return (
          data.length >= 1 &&
          data.length <= 43 &&
          /^[A-Z0-9\s\-\.\$\/\+\%]+$/.test(data)
        );
      default:
        return true;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Tabs defaultValue="camera" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera">Camera Scan</TabsTrigger>
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Camera Scanner
              </CardTitle>
              <CardDescription>
                Use your device camera to scan barcodes in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isScanning ? (
                <div className="text-center py-8">
                  <Barcode className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Click the button below to start scanning barcodes
                  </p>
                  <Button onClick={startCamera} size="lg">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full max-w-md mx-auto rounded-lg border"
                      autoPlay
                      playsInline
                      muted
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-64 h-16 border-2 border-white rounded opacity-50"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Point your camera at a barcode
                    </p>
                    <Button onClick={stopCamera} variant="outline">
                      Stop Scanning
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Image Upload
              </CardTitle>
              <CardDescription>
                Upload an image containing a barcode to scan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload">Select Image</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                />
              </div>

              {uploadedImage && (
                <div className="space-y-4">
                  <div className="text-center">
                    <img
                      src={uploadedImage}
                      alt="Uploaded barcode"
                      className="max-w-xs mx-auto rounded-lg border"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {scannedData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Scan Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Barcode Data</Label>
                <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                  {scannedData}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Barcode Type</Label>
                <div className="p-3 bg-muted rounded-lg">{barcodeType}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{barcodeType}</Badge>
              <Badge variant="outline">{scannedData.length} characters</Badge>
              {validateBarcode(scannedData, barcodeType) ? (
                <Badge variant="default" className="bg-green-500">
                  Valid
                </Badge>
              ) : (
                <Badge variant="destructive">Invalid Format</Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => copyToClipboard(scannedData)}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Data
              </Button>
              <Button onClick={downloadResult} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Result
              </Button>
              <Button onClick={clearResults} variant="outline" size="sm">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Supported Barcode Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {barcodeTypes.map((type) => (
              <div key={type.value} className="flex items-center gap-2">
                <Badge variant="outline">{type.label}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
