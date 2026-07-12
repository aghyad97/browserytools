"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { SliderRow } from "@/components/shared/SliderRow";
import { downloadUrl } from "@/lib/download";
import { formatBytes } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Upload,
  Download,
  Video as VideoIcon,
  Scissors,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Info,
  FileVideo,
  ImagePlay,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { encodeGif, type GifFrame } from "@/lib/media/gif-encode";

interface VideoInfo {
  url: string;
  size: number;
  type: string;
  name: string;
  duration: number;
  width: number;
  height: number;
}

interface TrimRange {
  start: number;
  end: number;
}

const formatOptions = [
  { value: "video/mp4", label: "MP4", extension: "mp4" },
  { value: "video/webm", label: "WebM", extension: "webm" },
  { value: "video/ogg", label: "OGV", extension: "ogv" },
];

export default function VideoEditor() {
  const t = useTranslations("Tools.VideoEditor");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");
  const [video, setVideo] = useState<VideoInfo | null>(null);
  const [trimRange, setTrimRange] = useState<TrimRange>({ start: 0, end: 0 });
  const [targetFormat, setTargetFormat] = useState("video/mp4");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [processedVideo, setProcessedVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ── GIF conversion state ──────────────────────────────────────────────────
  const [gifFps, setGifFps] = useState(10);
  const [gifWidth, setGifWidth] = useState(480);
  const [gifQuality, setGifQuality] = useState<"high" | "medium" | "low">(
    "medium"
  );
  const [gifDither, setGifDither] = useState(true);
  const [isGifProcessing, setIsGifProcessing] = useState(false);
  const [gifProgress, setGifProgress] = useState(0);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gifAbortRef = useRef<AbortController | null>(null);
  const gifUrlRef = useRef<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        toast.error(t("videoTooLarge"));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const videoElement = document.createElement("video");
        videoElement.src = reader.result as string;

        videoElement.onloadedmetadata = () => {
          setVideo({
            url: reader.result as string,
            size: file.size,
            type: file.type,
            name: file.name,
            duration: videoElement.duration,
            width: videoElement.videoWidth,
            height: videoElement.videoHeight,
          });
          setTrimRange({ start: 0, end: videoElement.duration });
          setProcessedVideo(null);
          // Default GIF width: cap at native width, max 480 for sane file size.
          setGifWidth(Math.min(480, videoElement.videoWidth || 480));
          if (gifUrlRef.current) {
            URL.revokeObjectURL(gifUrlRef.current);
            gifUrlRef.current = null;
          }
          setGifUrl(null);
          setGifSize(0);
          setGifProgress(0);
        };
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTrim = async () => {
    if (!video || !canvasRef.current) return;

    setIsProcessing(true);
    try {
      const videoElement = document.createElement("video");
      videoElement.src = video.url;
      videoElement.crossOrigin = "anonymous";

      await new Promise((resolve) => {
        videoElement.onloadedmetadata = resolve;
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      canvas.width = video.width;
      canvas.height = video.height;

      // Set video to start time
      videoElement.currentTime = trimRange.start;
      await new Promise((resolve) => {
        videoElement.onseeked = resolve;
      });

      // Create MediaRecorder for trimming
      const stream = canvas.captureStream(30); // 30 FPS
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: targetFormat,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: targetFormat });
        const url = URL.createObjectURL(blob);
        setProcessedVideo(url);
        setIsProcessing(false);
        toast.success(t("trimmedSuccess"));
      };

      // Start recording
      mediaRecorder.start();

      // Draw frames for the duration
      const duration = trimRange.end - trimRange.start;
      const frameRate = 30;
      const totalFrames = Math.floor(duration * frameRate);
      const frameDuration = 1 / frameRate;

      for (let i = 0; i < totalFrames; i++) {
        const currentTime = trimRange.start + i * frameDuration;
        videoElement.currentTime = currentTime;

        await new Promise((resolve) => {
          videoElement.onseeked = () => {
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            resolve(void 0);
          };
        });
      }

      // Stop recording
      mediaRecorder.stop();
    } catch (error) {
      console.error("Error trimming video:", error);
      toast.error(t("trimFailed"));
      setIsProcessing(false);
    }
  };

  const handleConvert = async () => {
    if (!video) return;

    setIsProcessing(true);
    try {
      const videoElement = document.createElement("video");
      videoElement.src = video.url;
      videoElement.crossOrigin = "anonymous";

      await new Promise((resolve) => {
        videoElement.onloadedmetadata = resolve;
      });

      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas not available");

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      canvas.width = video.width;
      canvas.height = video.height;

      // Create MediaRecorder for conversion
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: targetFormat,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: targetFormat });
        const url = URL.createObjectURL(blob);
        setProcessedVideo(url);
        setIsProcessing(false);
        toast.success(t("convertedSuccess"));
      };

      // Start recording
      mediaRecorder.start();

      // Draw all frames
      const frameRate = 30;
      const totalFrames = Math.floor(video.duration * frameRate);
      const frameDuration = 1 / frameRate;

      for (let i = 0; i < totalFrames; i++) {
        const currentTime = i * frameDuration;
        videoElement.currentTime = currentTime;

        await new Promise((resolve) => {
          videoElement.onseeked = () => {
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            resolve(void 0);
          };
        });
      }

      // Stop recording
      mediaRecorder.stop();
    } catch (error) {
      console.error("Error converting video:", error);
      toast.error(t("convertFailed"));
      setIsProcessing(false);
    }
  };

  const handleConvertToGif = async () => {
    if (!video) return;

    const start = trimRange.start;
    const end = trimRange.end > start ? trimRange.end : video.duration;
    const span = end - start;
    if (span <= 0) {
      toast.error(t("gifInvalidRange"));
      return;
    }

    setIsGifProcessing(true);
    setGifProgress(0);
    if (gifUrlRef.current) {
      URL.revokeObjectURL(gifUrlRef.current);
      gifUrlRef.current = null;
    }
    setGifUrl(null);
    setGifSize(0);

    try {
      const videoElement = document.createElement("video");
      videoElement.src = video.url;
      videoElement.crossOrigin = "anonymous";
      videoElement.muted = true;

      await new Promise<void>((resolve, reject) => {
        videoElement.onloadedmetadata = () => resolve();
        videoElement.onerror = () => reject(new Error("metadata"));
      });

      const aspect = video.height / video.width;
      const outWidth = Math.max(16, Math.round(gifWidth));
      const outHeight = Math.max(2, Math.round(outWidth * aspect));

      const qualityMap = { high: 1, medium: 10, low: 20 } as const;
      const controller = new AbortController();
      gifAbortRef.current = controller;

      const fps = Math.min(30, Math.max(1, gifFps));
      const frameDelay = Math.round(1000 / fps);
      const totalFrames = Math.max(1, Math.floor(span * fps));

      // Each frame gets its own canvas so every snapshot survives until
      // encoding (a single reused canvas would only hold the last frame).
      const gifFrames: GifFrame[] = [];
      for (let i = 0; i < totalFrames; i++) {
        if (controller.signal.aborted) throw new Error("GIF encode aborted");
        const seekTime = start + i / fps;
        videoElement.currentTime = Math.min(seekTime, end);
        await new Promise<void>((resolve) => {
          videoElement.onseeked = () => resolve();
        });
        const canvas = document.createElement("canvas");
        canvas.width = outWidth;
        canvas.height = outHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");
        ctx.drawImage(videoElement, 0, 0, outWidth, outHeight);
        gifFrames.push({ source: canvas, delayMs: frameDelay });
        // Capture phase is ~half the work; render reports the rest via onProgress.
        setGifProgress(Math.round(((i + 1) / totalFrames) * 50));
      }

      const blob = await encodeGif(gifFrames, {
        width: outWidth,
        height: outHeight,
        quality: qualityMap[gifQuality],
        dither: gifDither ? "FloydSteinberg" : false,
        onProgress: (p) => setGifProgress(50 + Math.round(p * 50)),
        signal: controller.signal,
      });

      const url = URL.createObjectURL(blob);
      gifUrlRef.current = url;
      setGifUrl(url);
      setGifSize(blob.size);
      setGifProgress(100);
      toast.success(t("gifSuccess"));
    } catch (error) {
      if (error instanceof Error && error.message === "GIF encode aborted") {
        toast.info(t("gifCancelled"));
      } else {
        console.error("Error converting to GIF:", error);
        toast.error(t("gifFailed"));
      }
    } finally {
      gifAbortRef.current = null;
      setIsGifProcessing(false);
    }
  };

  const handleCancelGif = () => {
    if (gifAbortRef.current) {
      gifAbortRef.current.abort();
      gifAbortRef.current = null;
    }
    setIsGifProcessing(false);
  };

  const handleDownloadGif = () => {
    if (!gifUrl || !video) return;
    downloadUrl(gifUrl, `${video.name.split(".")[0]}.gif`);
    toast.success(t("downloadedSuccess"));
  };

  const handleDownload = () => {
    if (!processedVideo || !video) return;

    const formatOption = formatOptions.find((f) => f.value === targetFormat);
    const extension = formatOption?.extension || "mp4";
    const filename = `${video.name.split(".")[0]}_processed.${extension}`;

    downloadUrl(processedVideo, filename);
    toast.success(t("downloadedSuccess"));
  };

  const handleReset = () => {
    setVideo(null);
    setTrimRange({ start: 0, end: 0 });
    setProcessedVideo(null);
    setCurrentTime(0);
    setIsPlaying(false);
    if (gifAbortRef.current) {
      gifAbortRef.current.abort();
      gifAbortRef.current = null;
    }
    if (gifUrlRef.current) {
      URL.revokeObjectURL(gifUrlRef.current);
      gifUrlRef.current = null;
    }
    setGifUrl(null);
    setGifSize(0);
    setGifProgress(0);
    setIsGifProcessing(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Revoke the GIF object URL on unmount to avoid memory leaks.
  useEffect(() => {
    return () => {
      if (gifUrlRef.current) URL.revokeObjectURL(gifUrlRef.current);
    };
  }, []);

  // Heuristic memory warning: many frames at a large width can blow up RAM.
  const gifFrameEstimate = video
    ? Math.floor(
        ((trimRange.end > trimRange.start
          ? trimRange.end - trimRange.start
          : video.duration) *
          Math.min(30, Math.max(1, gifFps)))
      )
    : 0;
  const showGifWarning = gifFrameEstimate > 300 || gifWidth > 800;

  return (
    <ToolShell
      slug="video"
      title={tc("tools.video.name")}
      sub={tc("tools.video.description")}
    >
        <div className="space-y-6">
          {!video ? (
            <Card className="p-6">
              <FileDropzone
                onFiles={onDrop}
                accept={{
                  "video/*": [".mp4", ".webm", ".ogg", ".mov", ".avi"],
                }}
                multiple={false}
                className={({ isDragActive }) => `
                  h-64 rounded-lg border-2 border-dashed
                  flex flex-col items-center justify-center space-y-4 p-8
                  cursor-pointer transition-[border-color,background-color] duration-150
                  ${
                    isDragActive
                      ? "border-primary bg-primary/10 scale-[0.99]"
                      : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                  }
                `}
              >
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    {t("dropHere")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("supportedFormats")}
                  </p>
                </div>
              </FileDropzone>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{t("videoPlayer")}</h3>
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        <RotateCcw className="w-4 h-4 me-2" />
                        {tCommon("reset")}
                      </Button>
                    </div>

                    <div className="relative">
                      <video
                        ref={videoRef}
                        src={video.url}
                        className="w-full rounded-lg h-[300px]"
                        onTimeUpdate={handleTimeUpdate}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />

                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 rounded-b-lg">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>
                            {formatTime(currentTime)} /{" "}
                            {formatTime(video.duration)}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleMuteToggle}
                              className="text-white hover:bg-white/20"
                            >
                              {isMuted ? (
                                <VolumeX className="w-4 h-4" />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handlePlayPause}
                              className="text-white hover:bg-white/20"
                            >
                              {isPlaying ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Slider
                            value={[currentTime]}
                            onValueChange={([value]) => handleSeek(value)}
                            min={0}
                            max={video.duration}
                            step={0.1}
                            className="w-full"
                          />
                          <div className="flex items-center gap-2">
                            <VolumeX className="w-3 h-3" />
                            <Slider
                              value={[volume]}
                              onValueChange={([value]) =>
                                handleVolumeChange(value)
                              }
                              min={0}
                              max={1}
                              step={0.1}
                              className="flex-1"
                            />
                            <Volume2 className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <SettingsCard
                  title={
                    <span className="inline-flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      {t("videoInfo")}
                    </span>
                  }
                >
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {t("infoName")}
                        </span>
                        <span className="text-sm font-medium">
                          {video.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {t("infoSize")}
                        </span>
                        <span className="text-sm font-medium">
                          {formatBytes(video.size)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {t("infoDuration")}
                        </span>
                        <span className="text-sm font-medium">
                          {formatTime(video.duration)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {t("infoResolution")}
                        </span>
                        <span className="text-sm font-medium">
                          {video.width} × {video.height}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {t("infoFormat")}
                        </span>
                        <span className="text-sm font-medium">
                          {video.type}
                        </span>
                      </div>
                    </div>
                </SettingsCard>
              </div>

              <Tabs defaultValue="edit" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="edit" className="gap-2">
                    <Scissors className="w-4 h-4" />
                    {t("tabEdit")}
                  </TabsTrigger>
                  <TabsTrigger value="gif" className="gap-2">
                    <ImagePlay className="w-4 h-4" />
                    {t("tabGif")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Scissors className="w-5 h-5" />
                      {t("trimVideo")}
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t("startTime", { time: formatTime(trimRange.start) })}</Label>
                        <Slider
                          value={[trimRange.start]}
                          onValueChange={([value]) =>
                            setTrimRange((prev) => ({ ...prev, start: value }))
                          }
                          min={0}
                          max={video.duration}
                          step={0.1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{t("endTime", { time: formatTime(trimRange.end) })}</Label>
                        <Slider
                          value={[trimRange.end]}
                          onValueChange={([value]) =>
                            setTrimRange((prev) => ({ ...prev, end: value }))
                          }
                          min={0}
                          max={video.duration}
                          step={0.1}
                        />
                      </div>

                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <strong>{t("duration")}</strong>{" "}
                          {formatTime(trimRange.end - trimRange.start)}
                        </p>
                      </div>

                      <Button
                        onClick={handleTrim}
                        className="w-full"
                        disabled={
                          isProcessing || trimRange.start >= trimRange.end
                        }
                      >
                        {isProcessing ? t("processing") : t("trimAction")}
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileVideo className="w-5 h-5" />
                      {t("convertFormat")}
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t("targetFormat")}</Label>
                        <Select
                          value={targetFormat}
                          onValueChange={setTargetFormat}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {formatOptions.map((format) => (
                              <SelectItem
                                key={format.value}
                                value={format.value}
                              >
                                {format.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <strong>{t("current")}</strong> {video.type}
                        </p>
                        <p className="text-sm">
                          <strong>{t("target")}</strong>{" "}
                          {
                            formatOptions.find((f) => f.value === targetFormat)
                              ?.label
                          }
                        </p>
                      </div>

                      <Button
                        onClick={handleConvert}
                        className="w-full"
                        disabled={isProcessing || video.type === targetFormat}
                      >
                        {isProcessing ? t("converting") : t("convertAction")}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t("processedPreview")}</h3>
                  <div className="h-64 rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center">
                    {processedVideo ? (
                      <video
                        src={processedVideo}
                        controls
                        className="w-full h-full rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <VideoIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {t("processedPlaceholder")}
                        </p>
                      </div>
                    )}
                  </div>

                  {processedVideo && (
                    <Button
                      onClick={handleDownload}
                      className="w-full"
                      variant="secondary"
                    >
                      <Download className="w-4 h-4 me-2" />
                      {t("downloadProcessed")}
                    </Button>
                  )}
                </div>
              </Card>
                </TabsContent>

                <TabsContent value="gif" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SettingsCard
                      title={
                        <span className="inline-flex items-center gap-2">
                          <ImagePlay className="w-4 h-4" />
                          {t("gifTitle")}
                        </span>
                      }
                      description={t("gifDescription")}
                    >
                        {/* Trim range kept bespoke (dual-slider editing flow shared with the Edit tab). */}
                        <div className="space-y-2">
                          <Label>{t("gifTrimHint")}</Label>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                              {t("startTime", {
                                time: formatTime(trimRange.start),
                              })}
                            </Label>
                            <Slider
                              value={[trimRange.start]}
                              onValueChange={([value]) =>
                                setTrimRange((prev) => ({
                                  ...prev,
                                  start: value,
                                }))
                              }
                              min={0}
                              max={video.duration}
                              step={0.1}
                              disabled={isGifProcessing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                              {t("endTime", { time: formatTime(trimRange.end) })}
                            </Label>
                            <Slider
                              value={[trimRange.end]}
                              onValueChange={([value]) =>
                                setTrimRange((prev) => ({ ...prev, end: value }))
                              }
                              min={0}
                              max={video.duration}
                              step={0.1}
                              disabled={isGifProcessing}
                            />
                          </div>
                        </div>

                        <SliderRow
                          label={t("gifFps")}
                          value={gifFps}
                          min={1}
                          max={30}
                          step={1}
                          onChange={setGifFps}
                          disabled={isGifProcessing}
                          display={<span className="font-mono">{gifFps}</span>}
                        />

                        <OptionRow
                          label={t("gifWidth")}
                          htmlFor="gif-width"
                          hint={t("gifHeightAuto", {
                            height: video.width
                              ? Math.max(
                                  2,
                                  Math.round(
                                    gifWidth * (video.height / video.width)
                                  )
                                )
                              : 0,
                          })}
                        >
                          <Input
                            id="gif-width"
                            type="number"
                            dir="ltr"
                            value={gifWidth}
                            min={16}
                            max={1920}
                            onChange={(e) =>
                              setGifWidth(Number(e.target.value) || 0)
                            }
                            disabled={isGifProcessing}
                          />
                        </OptionRow>

                        <OptionRow label={t("gifQuality")} htmlFor="gif-quality">
                          <Select
                            value={gifQuality}
                            onValueChange={(v) =>
                              setGifQuality(v as "high" | "medium" | "low")
                            }
                            disabled={isGifProcessing}
                          >
                            <SelectTrigger id="gif-quality">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">
                                {t("gifQualityHigh")}
                              </SelectItem>
                              <SelectItem value="medium">
                                {t("gifQualityMedium")}
                              </SelectItem>
                              <SelectItem value="low">
                                {t("gifQualityLow")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </OptionRow>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="gif-dither">{t("gifDither")}</Label>
                          <Switch
                            id="gif-dither"
                            checked={gifDither}
                            onCheckedChange={setGifDither}
                            disabled={isGifProcessing}
                          />
                        </div>

                        {showGifWarning && (
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted">
                            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-muted-foreground">
                              {t("gifMemoryWarning")}
                            </p>
                          </div>
                        )}

                        {isGifProcessing ? (
                          <div className="space-y-3">
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-primary transition-[width]"
                                style={{ width: `${gifProgress}%` }}
                              />
                            </div>
                            <p
                              className="text-sm text-center text-muted-foreground"
                              dir="ltr"
                            >
                              {gifProgress}%
                            </p>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={handleCancelGif}
                            >
                              {tCommon("cancel")}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={handleConvertToGif}
                            className="w-full"
                            disabled={trimRange.start >= trimRange.end}
                          >
                            <ImagePlay className="w-4 h-4 me-2" />
                            {t("gifConvertAction")}
                          </Button>
                        )}
                    </SettingsCard>

                    <Card className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          {t("gifPreview")}
                        </h3>
                        <div className="h-64 rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center overflow-hidden">
                          {gifUrl ? (
                            <img
                              src={gifUrl}
                              alt={t("gifPreviewAlt")}
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <div className="text-center">
                              <ImagePlay className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-muted-foreground">
                                {t("gifPlaceholder")}
                              </p>
                            </div>
                          )}
                        </div>

                        {gifUrl && (
                          <>
                            <div className="flex justify-between p-3 bg-muted rounded-lg">
                              <span className="text-sm text-muted-foreground">
                                {t("gifFileSize")}
                              </span>
                              <span className="text-sm font-medium" dir="ltr">
                                {formatBytes(gifSize)}
                              </span>
                            </div>
                            <Button
                              onClick={handleDownloadGif}
                              className="w-full"
                              variant="secondary"
                            >
                              <Download className="w-4 h-4 me-2" />
                              {t("gifDownload")}
                            </Button>
                          </>
                        )}
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Hidden canvas for video processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
    </ToolShell>
  );
}
