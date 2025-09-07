"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Camera,
  Settings,
  Shield,
  RefreshCw,
  AlertCircle,
  Info,
  FlipHorizontal,
} from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  isScanning: boolean;
  onScanningChange: (scanning: boolean) => void;
  onError: (error: string) => void;
  overlayElement?: React.ReactNode;
  className?: string;
}

export interface CameraCaptureRef {
  videoElement: HTMLVideoElement | null;
  canvasElement: HTMLCanvasElement | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

const CameraCapture = forwardRef<CameraCaptureRef, CameraCaptureProps>(
  (
    { isScanning, onScanningChange, onError, overlayElement, className },
    ref
  ) => {
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<
      "unknown" | "granted" | "denied" | "prompt"
    >("unknown");
    const [isRequestingPermission, setIsRequestingPermission] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Expose ref methods
    useImperativeHandle(ref, () => ({
      videoElement: videoRef.current,
      canvasElement: canvasRef.current,
      startCamera,
      stopCamera,
    }));

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
      onError("");

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
        onScanningChange(true);
        setPermissionStatus("granted");
        toast.success("Camera access granted!");
      } catch (err: any) {
        console.error("Camera error:", err);

        if (err.name === "NotAllowedError") {
          setPermissionStatus("denied");
          onError(
            "Camera access denied. You may need to allow camera access when prompted by your browser, or check your browser settings if no prompt appeared."
          );
        } else if (err.name === "NotFoundError") {
          onError("No camera found on this device.");
        } else if (err.name === "NotSupportedError") {
          onError("Camera is not supported on this device or browser.");
        } else if (err.name === "NotReadableError") {
          onError(
            "Camera is already in use by another application. Please close other camera apps and try again."
          );
        } else if (err.name === "OverconstrainedError") {
          onError(
            "Camera settings not supported. Trying with default settings..."
          );
          // Try again with basic settings
          try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({
              video: true,
            });
            setCameraStream(fallbackStream);
            onScanningChange(true);
            setPermissionStatus("granted");
            toast.success("Camera access granted with fallback settings!");
          } catch (fallbackErr) {
            onError("Unable to access camera with any settings.");
          }
        } else {
          onError(
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
      onScanningChange(false);
    };

    // Set up video stream when scanning starts
    useEffect(() => {
      if (isScanning && videoRef.current && cameraStream) {
        const video = videoRef.current;
        video.srcObject = cameraStream;
        video.play();
      }
    }, [isScanning, cameraStream]);

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
        toast.info(
          "Please check your browser settings to enable camera access"
        );
      }
    };

    const testCameraAccess = async () => {
      onError("");
      try {
        console.log("Testing camera access...");
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        if (videoDevices.length === 0) {
          onError("No camera devices found on this device.");
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
        onError(`Camera test failed: ${err.message || err.name}`);
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
            "This tool needs camera access to scan. Your browser should show a permission prompt when you click the button below.",
          action: isRequestingPermission
            ? "Requesting..."
            : "Request Camera Access",
          icon: <Shield className="h-5 w-5" />,
          variant: "default" as const,
        };
      }
      return null;
    };

    return (
      <div className={className}>
        {/* Permission guidance section */}
        {(() => {
          const guidance = getPermissionGuidance();
          if (guidance && !isScanning) {
            return (
              <Alert variant={guidance.variant} className="mb-4">
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
              Camera access granted! Click the button below to start scanning
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
              {overlayElement && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {overlayElement}
                </div>
              )}
            </div>
            <div className="text-center space-y-3">
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

        {/* Privacy note when not scanning */}
        {!isScanning && (
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  <strong>Privacy Note:</strong> Your camera feed is processed
                  locally in your browser. No images or video are sent to any
                  server.
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
      </div>
    );
  }
);

CameraCapture.displayName = "CameraCapture";

export default CameraCapture;
