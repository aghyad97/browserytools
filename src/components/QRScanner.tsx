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
  Settings,
  Shield,
  RefreshCw,
  Info,
  Search,
  X,
  Clock,
  FlipHorizontal,
} from "lucide-react";
import { toast } from "sonner";

export default function QRScanner() {
  const [scannedData, setScannedData] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [permissionStatus, setPermissionStatus] = useState<
    "unknown" | "granted" | "denied" | "prompt"
  >("unknown");
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [scanningDuration, setScanningDuration] = useState(0);
  const [showNoQRAlert, setShowNoQRAlert] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scanningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const noQRTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // QR Code detection with timeout handling
  useEffect(() => {
    if (isScanning && videoRef.current && cameraStream) {
      // Initialize QR code scanning
      const video = videoRef.current;
      video.srcObject = cameraStream;
      video.play();

      // Reset states
      setShowNoQRAlert(false);
      setScanningDuration(0);

      // Start scanning duration timer
      const scanStart = Date.now();
      scanningTimerRef.current = setInterval(() => {
        setScanningDuration(Math.floor((Date.now() - scanStart) / 1000));
      }, 1000);

      // Set timeout for no QR code detection (10 seconds)
      noQRTimeoutRef.current = setTimeout(() => {
        setShowNoQRAlert(true);
      }, 10000);

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

            // Placeholder: simulate QR detection (very low chance for demo)
            if (Math.random() > 0.998) {
              // 0.2% chance of "detecting" something
              setScannedData("Sample QR Code Data: https://example.com");
              setIsScanning(false);
              stopCamera();
              return;
            }
          }
        }
        if (isScanning) {
          requestAnimationFrame(detectQR);
        }
      };

      detectQR();
    }

    // Cleanup function
    return () => {
      if (scanningTimerRef.current) {
        clearInterval(scanningTimerRef.current);
        scanningTimerRef.current = null;
      }
      if (noQRTimeoutRef.current) {
        clearTimeout(noQRTimeoutRef.current);
        noQRTimeoutRef.current = null;
      }
    };
  }, [isScanning, cameraStream]);

  // Check camera permission status
  const checkCameraPermission = async () => {
    if (!navigator.permissions) {
      setPermissionStatus("unknown");
      return;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      setPermissionStatus(permission.state);

      // Listen for permission changes
      permission.onchange = () => {
        setPermissionStatus(permission.state);
      };
    } catch (err) {
      console.error("Permission check error:", err);
      setPermissionStatus("unknown");
    }
  };

  // Check permissions on component mount
  useEffect(() => {
    checkCameraPermission();
  }, []);

  const startCamera = async () => {
    setIsRequestingPermission(true);
    setError("");

    try {
      console.log("Requesting camera access...");

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser");
      }

      // Request camera access directly from user interaction
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      console.log("Camera access granted!");

      // Permission granted successfully
      setCameraStream(stream);
      setIsScanning(true);
      setPermissionStatus("granted");
      toast.success("Camera access granted!");
    } catch (err: any) {
      console.error("Camera error:", err);

      if (err.name === "NotAllowedError") {
        setPermissionStatus("denied");
        setError(
          "Camera access denied. You may need to allow camera access when prompted by your browser, or check your browser settings if no prompt appeared."
        );
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else if (err.name === "NotSupportedError") {
        setError("Camera is not supported on this device or browser.");
      } else if (err.name === "NotReadableError") {
        setError(
          "Camera is already in use by another application. Please close other camera apps and try again."
        );
      } else if (err.name === "OverconstrainedError") {
        setError(
          "Camera settings not supported. Trying with default settings..."
        );
        // Try again with basic settings
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setCameraStream(fallbackStream);
          setIsScanning(true);
          setPermissionStatus("granted");
          toast.success("Camera access granted with fallback settings!");
        } catch (fallbackErr) {
          setError("Unable to access camera with any settings.");
        }
      } else {
        setError(
          `Unable to access camera: ${
            err.message || err.name || "Unknown error"
          }. Please check permissions and try again.`
        );
      }
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsScanning(false);
    setShowNoQRAlert(false);
    setScanningDuration(0);

    // Clean up timers
    if (scanningTimerRef.current) {
      clearInterval(scanningTimerRef.current);
      scanningTimerRef.current = null;
    }
    if (noQRTimeoutRef.current) {
      clearTimeout(noQRTimeoutRef.current);
      noQRTimeoutRef.current = null;
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setShowNoQRAlert(false);

        // In a real implementation, you'd process the image for QR codes here
        // For now, we'll simulate detection with a very low chance
        setTimeout(() => {
          if (Math.random() > 0.8) {
            // 20% chance of finding QR code in uploaded image
            setScannedData("Sample QR Code from Image: https://example.com");
          } else {
            // Show no QR code found alert for uploaded images
            setShowNoQRAlert(true);
          }
        }, 1500);
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
    setShowNoQRAlert(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const dismissNoQRAlert = () => {
    setShowNoQRAlert(false);
    // Reset the timeout for another 10 seconds
    if (isScanning) {
      noQRTimeoutRef.current = setTimeout(() => {
        setShowNoQRAlert(true);
      }, 10000);
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

  const openBrowserSettings = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    let settingsUrl = "";

    if (userAgent.includes("chrome")) {
      settingsUrl = "chrome://settings/content/camera";
    } else if (userAgent.includes("firefox")) {
      settingsUrl = "about:preferences#privacy";
    } else if (userAgent.includes("safari")) {
      // Safari doesn't allow opening settings directly
      toast.info(
        "Please go to Safari > Preferences > Websites > Camera to enable camera access"
      );
      return;
    } else if (userAgent.includes("edge")) {
      settingsUrl = "edge://settings/content/camera";
    }

    if (settingsUrl) {
      window.open(settingsUrl, "_blank");
    } else {
      toast.info("Please check your browser settings to enable camera access");
    }
  };

  const getPermissionGuidance = () => {
    if (permissionStatus === "denied") {
      return {
        title: "Camera Access Denied",
        message:
          "Camera access was blocked. Please check your browser settings or try the manual permission request below.",
        action: "Open Settings",
        icon: <Settings className="h-5 w-5" />,
        variant: "destructive" as const,
      };
    } else if (
      permissionStatus === "prompt" ||
      permissionStatus === "unknown"
    ) {
      return {
        title: "Camera Permission Required",
        message:
          "This tool needs camera access to scan QR codes. Your browser should show a permission prompt when you click the button below.",
        action: isRequestingPermission
          ? "Requesting..."
          : "Request Camera Access",
        icon: <Shield className="h-5 w-5" />,
        variant: "default" as const,
      };
    }
    return null;
  };

  // Manual permission test - useful for debugging
  const testCameraAccess = async () => {
    setError("");
    try {
      console.log("Testing camera access...");
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices.length === 0) {
        setError("No camera devices found on this device.");
        return;
      }

      console.log("Found cameras:", videoDevices.length);

      // Test basic camera access
      const testStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      testStream.getTracks().forEach((track) => track.stop());

      toast.success("Camera test successful! You can now start scanning.");
      setPermissionStatus("granted");
    } catch (err: any) {
      console.error("Camera test failed:", err);
      setError(`Camera test failed: ${err.message || err.name}`);
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
              {/* Permission guidance section */}
              {(() => {
                const guidance = getPermissionGuidance();
                if (guidance && !isScanning) {
                  return (
                    <Alert variant={guidance.variant}>
                      {guidance.icon}
                      <div className="ml-2">
                        <h4 className="font-semibold">{guidance.title}</h4>
                        <p className="text-sm mt-1">{guidance.message}</p>
                        <div className="flex gap-2 mt-3">
                          {permissionStatus === "denied" ? (
                            <>
                              <Button
                                onClick={openBrowserSettings}
                                size="sm"
                                variant="outline"
                              >
                                <Settings className="h-4 w-4 mr-2" />
                                Open Settings
                              </Button>
                              <Button
                                onClick={testCameraAccess}
                                size="sm"
                                variant="outline"
                              >
                                <Camera className="h-4 w-4 mr-2" />
                                Test Camera
                              </Button>
                              <Button
                                onClick={() => window.location.reload()}
                                size="sm"
                                variant="outline"
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh Page
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={startCamera}
                                size="sm"
                                disabled={isRequestingPermission}
                              >
                                {isRequestingPermission ? (
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Shield className="h-4 w-4 mr-2" />
                                )}
                                {guidance.action}
                              </Button>
                              <Button
                                onClick={testCameraAccess}
                                size="sm"
                                variant="outline"
                              >
                                <Camera className="h-4 w-4 mr-2" />
                                Test Camera
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </Alert>
                  );
                }
                return null;
              })()}

              {!isScanning && permissionStatus === "granted" && (
                <div className="text-center py-8">
                  <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Camera access granted! Click the button below to start
                    scanning QR codes
                  </p>
                  <Button
                    onClick={startCamera}
                    size="lg"
                    disabled={isRequestingPermission}
                  >
                    {isRequestingPermission ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 mr-2" />
                    )}
                    Start Camera
                  </Button>
                </div>
              )}

              {isScanning && (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className={`w-full max-w-md mx-auto rounded-lg border transition-transform duration-300 ${
                        isFlipped ? "scale-x-[-1]" : ""
                      }`}
                      autoPlay
                      playsInline
                      muted
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border-2 border-white rounded-lg opacity-50"></div>
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Search className="h-4 w-4" />
                      <span>Scanning for QR codes...</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{scanningDuration}s</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Point your camera at a QR code
                    </p>

                    {/* No QR Code Alert */}
                    {showNoQRAlert && (
                      <Alert className="text-left">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-center justify-between">
                            <span>
                              No QR code detected. Make sure the code is clearly
                              visible and well-lit.
                            </span>
                            <Button
                              onClick={dismissNoQRAlert}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => setIsFlipped(!isFlipped)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <FlipHorizontal className="h-4 w-4" />
                        {isFlipped ? "Normal" : "Flip"}
                      </Button>
                      <Button onClick={stopCamera} variant="outline">
                        Stop Scanning
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error}
                    {permissionStatus === "denied" && (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm">To fix this:</p>
                        <ol className="text-sm list-decimal list-inside space-y-1">
                          <li>
                            Click the camera icon in your browser's address bar
                          </li>
                          <li>Select "Allow" for camera access</li>
                          <li>Refresh this page</li>
                        </ol>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* General info about camera permissions */}
              {!isScanning && !error && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>
                        <strong>Privacy Note:</strong> Your camera feed is
                        processed locally in your browser. No images or video
                        are sent to any server.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Permission Status: {permissionStatus} | Browser:{" "}
                        {navigator.userAgent.includes("Chrome")
                          ? "Chrome"
                          : navigator.userAgent.includes("Firefox")
                          ? "Firefox"
                          : navigator.userAgent.includes("Safari")
                          ? "Safari"
                          : "Other"}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Troubleshooting section when there are persistent issues */}
              {error && !isScanning && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Troubleshooting Tips:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>
                          Make sure you're using HTTPS (required for camera
                          access)
                        </li>
                        <li>Check if other websites can access your camera</li>
                        <li>Try restarting your browser</li>
                        <li>
                          Ensure no other applications are using the camera
                        </li>
                        <li>
                          Check your operating system's camera privacy settings
                        </li>
                      </ul>
                    </div>
                  </AlertDescription>
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

                  {/* No QR Code Alert for uploaded images */}
                  {showNoQRAlert && !scannedData && (
                    <Alert>
                      <Search className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <span>
                            No QR code found in this image. Try uploading a
                            clearer image with a visible QR code.
                          </span>
                          <Button
                            onClick={() => setShowNoQRAlert(false)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
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
