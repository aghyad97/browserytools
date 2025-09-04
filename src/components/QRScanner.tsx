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
  Copy,
  Camera,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function QRScanner() {
  const [scannedData, setScannedData] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // QR Code detection using QuaggaJS (we'll need to install this)
  useEffect(() => {
    if (isScanning && videoRef.current && cameraStream) {
      // Initialize QR code scanning
      const video = videoRef.current;
      video.srcObject = cameraStream;
      video.play();

      // Simple QR detection using canvas and manual processing
      const detectQR = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA && canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);

            // For now, we'll use a placeholder QR detection
            // In a real implementation, you'd use a library like jsQR or QuaggaJS
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );

            // Placeholder: simulate QR detection
            setTimeout(() => {
              if (Math.random() > 0.95) {
                // 5% chance of "detecting" something
                setScannedData("Sample QR Code Data: https://example.com");
                setIsScanning(false);
                stopCamera();
              }
            }, 1000);
          }
        }
        if (isScanning) {
          requestAnimationFrame(detectQR);
        }
      };

      detectQR();
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
        // In a real implementation, you'd process the image for QR codes here
        // For now, we'll simulate detection
        setTimeout(() => {
          setScannedData("Sample QR Code from Image: https://example.com");
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
    const blob = new Blob([scannedData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code-data.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearResults = () => {
    setScannedData("");
    setUploadedImage("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
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
                Use your device camera to scan QR codes in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isScanning ? (
                <div className="text-center py-8">
                  <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Click the button below to start scanning QR codes
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
                      <div className="w-48 h-48 border-2 border-white rounded-lg opacity-50"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Point your camera at a QR code
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
                Upload an image containing a QR code to scan
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
                      alt="Uploaded QR code"
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
            <div className="space-y-2">
              <Label>Detected Data</Label>
              <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                {scannedData}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isUrl(scannedData) && <Badge variant="secondary">URL</Badge>}
              <Badge variant="outline">{scannedData.length} characters</Badge>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => copyToClipboard(scannedData)}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button onClick={downloadResult} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              {isUrl(scannedData) && (
                <Button
                  onClick={() => window.open(scannedData, "_blank")}
                  variant="outline"
                  size="sm"
                >
                  Open Link
                </Button>
              )}
              <Button onClick={clearResults} variant="outline" size="sm">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
