"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Tabs removed to present all options in a single view
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
} from "lucide-react";
import { toast } from "sonner";

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
  const [video, setVideo] = useState<VideoInfo | null>(null);
  const [trimRange, setTrimRange] = useState<TrimRange>({ start: 0, end: 0 });
  const [targetFormat, setTargetFormat] = useState("video/mp4");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [processedVideo, setProcessedVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        toast.error("Video size should be less than 100MB");
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
        };
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".webm", ".ogg", ".mov", ".avi"],
    },
    multiple: false,
  });

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
        toast.success("Video trimmed successfully!");
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
      toast.error("Failed to trim video. Please try again.");
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
        toast.success("Video converted successfully!");
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
      toast.error("Failed to convert video. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedVideo || !video) return;

    const formatOption = formatOptions.find((f) => f.value === targetFormat);
    const extension = formatOption?.extension || "mp4";
    const filename = `${video.name.split(".")[0]}_processed.${extension}`;

    const link = document.createElement("a");
    link.href = processedVideo;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Video downloaded!");
  };

  const handleReset = () => {
    setVideo(null);
    setTrimRange({ start: 0, end: 0 });
    setProcessedVideo(null);
    setCurrentTime(0);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-end items-center p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"></div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {!video ? (
            <Card className="p-6">
              <div
                {...getRootProps()}
                className={`
                  h-64 rounded-lg border-2 border-dashed
                  flex flex-col items-center justify-center space-y-4 p-8
                  cursor-pointer transition-all duration-200
                  ${
                    isDragActive
                      ? "border-primary bg-primary/10 scale-[0.99]"
                      : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                  }
                `}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    Drop your video here
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Supports MP4, WebM, OGG, MOV, AVI files (max 100MB)
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Video Player</h3>
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
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

                <Card className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Video Information
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Name:
                        </span>
                        <span className="text-sm font-medium">
                          {video.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Size:
                        </span>
                        <span className="text-sm font-medium">
                          {(video.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Duration:
                        </span>
                        <span className="text-sm font-medium">
                          {formatTime(video.duration)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Resolution:
                        </span>
                        <span className="text-sm font-medium">
                          {video.width} × {video.height}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Format:
                        </span>
                        <span className="text-sm font-medium">
                          {video.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Scissors className="w-5 h-5" />
                      Trim Video
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Start Time: {formatTime(trimRange.start)}</Label>
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
                        <Label>End Time: {formatTime(trimRange.end)}</Label>
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
                          <strong>Duration:</strong>{" "}
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
                        {isProcessing ? "Processing..." : "Trim Video"}
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileVideo className="w-5 h-5" />
                      Convert Format
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Target Format</Label>
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
                          <strong>Current:</strong> {video.type}
                        </p>
                        <p className="text-sm">
                          <strong>Target:</strong>{" "}
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
                        {isProcessing ? "Converting..." : "Convert Video"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Processed Preview</h3>
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
                          Processed video will appear here
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
                      <Download className="w-4 h-4 mr-2" />
                      Download Processed Video
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Hidden canvas for video processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}
