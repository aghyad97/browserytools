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
import { useTranslations } from "next-intl";

export default function QRScanner() {
  const t = useTranslations("Tools.QRScanner");
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
      toast.success(t("cameraAccessGranted"));
    } catch (err: any) {
      console.error("Camera error:", err);

      if (err.name === "NotAllowedError") {
        setPermissionStatus("denied");
        setError(t("errorAccessDenied"));
      } else if (err.name === "NotFoundError") {
        setError(t("errorNoCameraFound"));
      } else if (err.name === "NotSupportedError") {
        setError(t("errorCameraNotSupportedDevice"));
      } else if (err.name === "NotReadableError") {
        setError(t("errorCameraInUse"));
      } else if (err.name === "OverconstrainedError") {
        setError(t("errorOverconstrained"));
        // Try again with basic settings
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setCameraStream(fallbackStream);
          setIsScanning(true);
          setPermissionStatus("granted");
          toast.success(t("cameraFallbackGranted"));
        } catch (fallbackErr) {
          setError(t("errorNoFallbackSettings"));
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
      toast.success(t("copiedToClipboard"));
    } catch (err) {
      toast.error(t("copyFailed"));
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
      toast.info(t("safariSettingsToast"));
      return;
    } else if (userAgent.includes("edge")) {
      settingsUrl = "edge://settings/content/camera";
    }

    if (settingsUrl) {
      window.open(settingsUrl, "_blank");
    } else {
      toast.info(t("checkBrowserSettingsToast"));
    }
  };

  const getPermissionGuidance = () => {
    if (permissionStatus === "denied") {
      return {
        title: t("cameraAccessDeniedTitle"),
        message: t("cameraAccessDeniedMsg"),
        action: t("openSettings"),
        icon: <Settings className="h-5 w-5" />,
        variant: "destructive" as const,
      };
    } else if (
      permissionStatus === "prompt" ||
      permissionStatus === "unknown"
    ) {
      return {
        title: t("cameraPermissionRequiredTitle"),
        message: t("cameraPermissionRequiredMsg"),
        action: isRequestingPermission ? t("requesting") : t("requestCameraAccess"),
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
        setError(t("errorNoCamerasFound"));
        return;
      }

      console.log("Found cameras:", videoDevices.length);

      // Test basic camera access
      const testStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      testStream.getTracks().forEach((track) => track.stop());

      toast.success(t("cameraTestSuccessful"));
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
          <TabsTrigger value="camera">{t("cameraScan")}</TabsTrigger>
          <TabsTrigger value="upload">{t("uploadImage")}</TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {t("cameraScannerTitle")}
              </CardTitle>
              <CardDescription>
                {t("cameraScannerDesc")}
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
                      <div className="ms-2">
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
                                <Settings className="h-4 w-4 me-2" />
                                {t("openSettings")}
                              </Button>
                              <Button
                                onClick={testCameraAccess}
                                size="sm"
                                variant="outline"
                              >
                                <Camera className="h-4 w-4 me-2" />
                                {t("testCamera")}
                              </Button>
                              <Button
                                onClick={() => window.location.reload()}
                                size="sm"
                                variant="outline"
                              >
                                <RefreshCw className="h-4 w-4 me-2" />
                                {t("refreshPage")}
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
                                  <RefreshCw className="h-4 w-4 me-2 animate-spin" />
                                ) : (
                                  <Shield className="h-4 w-4 me-2" />
                                )}
                                {guidance.action}
                              </Button>
                              <Button
                                onClick={testCameraAccess}
                                size="sm"
                                variant="outline"
                              >
                                <Camera className="h-4 w-4 me-2" />
                                {t("testCamera")}
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
                    {t("cameraAccessGrantedStart")}
                  </p>
                  <Button
                    onClick={startCamera}
                    size="lg"
                    disabled={isRequestingPermission}
                  >
                    {isRequestingPermission ? (
                      <RefreshCw className="h-4 w-4 me-2 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 me-2" />
                    )}
                    {t("startCamera")}
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
                      <span>{t("scanningFor")}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{scanningDuration}s</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("pointCamera")}
                    </p>

                    {/* No QR Code Alert */}
                    {showNoQRAlert && (
                      <Alert className="text-left rtl:text-right">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-center justify-between">
                            <span>
                              {t("noQRDetected")}
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
                        {isFlipped ? t("normal") : t("flip")}
                      </Button>
                      <Button onClick={stopCamera} variant="outline">
                        {t("stopScanning")}
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
                        <p className="text-sm">{t("fixTitle")}</p>
                        <ol className="text-sm list-decimal list-inside space-y-1">
                          <li>{t("fixStep1")}</li>
                          <li>{t("fixStep2")}</li>
                          <li>{t("fixStep3")}</li>
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
                        <strong>{t("privacyNote")}</strong> {t("privacyNoteDesc")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Permission Status: {permissionStatus} | Browser:{" "}
                        {typeof navigator !== "undefined" && navigator.userAgent.includes("Chrome")
                          ? "Chrome"
                          : typeof navigator !== "undefined" && navigator.userAgent.includes("Firefox")
                          ? "Firefox"
                          : typeof navigator !== "undefined" && navigator.userAgent.includes("Safari")
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
                      <p className="font-medium">{t("troubleshootingTitle")}</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>{t("tip1")}</li>
                        <li>{t("tip2")}</li>
                        <li>{t("tip3")}</li>
                        <li>{t("tip4")}</li>
                        <li>{t("tip5")}</li>
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
                {t("imageUploadTitle")}
              </CardTitle>
              <CardDescription>
                {t("imageUploadDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload">{t("selectImage")}</Label>
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
                            {t("noQRInImage")}
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
              {t("scanResult")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("detectedData")}</Label>
              <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                {scannedData}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isUrl(scannedData) && <Badge variant="secondary">URL</Badge>}
              <Badge variant="outline">{t("charCount", { count: scannedData.length })}</Badge>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => copyToClipboard(scannedData)}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4 me-2" />
                {t("copy")}
              </Button>
              <Button onClick={downloadResult} variant="outline" size="sm">
                <Download className="h-4 w-4 me-2" />
                {t("download")}
              </Button>
              {isUrl(scannedData) && (
                <Button
                  onClick={() => window.open(scannedData, "_blank")}
                  variant="outline"
                  size="sm"
                >
                  {t("openLink")}
                </Button>
              )}
              <Button onClick={clearResults} variant="outline" size="sm">
                {t("clear")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
