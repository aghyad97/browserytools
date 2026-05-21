"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Monitor,
  Square,
  Download,
  Trash2,
  CircleDot,
  Camera,
  Film,
} from "lucide-react";
import { toast } from "sonner";

type Quality = "720" | "1080" | "max";
type PipPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface RecordingEntry {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  size: number;
  createdAt: Date;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function qualityDimensions(q: Quality): { width?: number; height?: number } {
  if (q === "1080") return { width: 1920, height: 1080 };
  if (q === "720") return { width: 1280, height: 720 };
  return {};
}

export default function ScreenRecorder() {
  const t = useTranslations("Tools.ScreenRecorder");

  // Settings
  const [includeAudio, setIncludeAudio] = useState(false);
  const [includeWebcam, setIncludeWebcam] = useState(false);
  const [videoQuality, setVideoQuality] = useState<Quality>("720");
  const [pipPosition, setPipPosition] = useState<PipPosition>("bottom-right");
  const [pipSize, setPipSize] = useState(20); // % of canvas width
  const [useCountdown, setUseCountdown] = useState(true);

  // Runtime state
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [recordings, setRecordings] = useState<RecordingEntry[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [gifBusyId, setGifBusyId] = useState<string | null>(null);
  const [gifProgress, setGifProgress] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Streams + compositing refs
  const displayStreamRef = useRef<MediaStream | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const canvasStreamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Latest PiP settings for the rAF loop (avoid stale closure)
  const pipPositionRef = useRef(pipPosition);
  const pipSizeRef = useRef(pipSize);
  useEffect(() => {
    pipPositionRef.current = pipPosition;
  }, [pipPosition]);
  useEffect(() => {
    pipSizeRef.current = pipSize;
  }, [pipSize]);

  const stopAllTracks = useCallback(() => {
    [
      displayStreamRef.current,
      webcamStreamRef.current,
      audioStreamRef.current,
      canvasStreamRef.current,
    ].forEach((s) => s?.getTracks().forEach((tr) => tr.stop()));
    displayStreamRef.current = null;
    webcamStreamRef.current = null;
    audioStreamRef.current = null;
    canvasStreamRef.current = null;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  const recordingsRef = useRef(recordings);
  recordingsRef.current = recordings;
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopAllTracks();
      recordingsRef.current.forEach((r) => URL.revokeObjectURL(r.url));
    };
  }, [stopAllTracks]);

  const getSupportedMimeType = () => {
    const types = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
      "video/mp4",
    ];
    return types.find((ty) => MediaRecorder.isTypeSupported(ty)) ?? "";
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Composite screen + webcam PiP onto canvas, return a captured stream.
  const buildCompositeStream = async (
    displayStream: MediaStream,
    webcamStream: MediaStream
  ): Promise<MediaStream> => {
    const screenTrack = displayStream.getVideoTracks()[0];
    const settings = screenTrack.getSettings();
    const { width: qw, height: qh } = qualityDimensions(videoQuality);
    const width = qw ?? settings.width ?? 1280;
    const height = qh ?? settings.height ?? 720;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d");

    const screenVideo = document.createElement("video");
    screenVideo.muted = true;
    screenVideo.srcObject = displayStream;
    screenVideoRef.current = screenVideo;
    await screenVideo.play().catch(() => {});

    const webcamVideo = document.createElement("video");
    webcamVideo.muted = true;
    webcamVideo.srcObject = webcamStream;
    webcamVideoRef.current = webcamVideo;
    await webcamVideo.play().catch(() => {});

    const draw = () => {
      if (ctx) {
        ctx.drawImage(screenVideo, 0, 0, width, height);
        const pipW = (pipSizeRef.current / 100) * width;
        const camAspect =
          webcamVideo.videoHeight && webcamVideo.videoWidth
            ? webcamVideo.videoHeight / webcamVideo.videoWidth
            : 0.5625;
        const pipH = pipW * camAspect;
        const margin = width * 0.02;
        let x = margin;
        let y = margin;
        const pos = pipPositionRef.current;
        if (pos === "top-right" || pos === "bottom-right")
          x = width - pipW - margin;
        if (pos === "bottom-left" || pos === "bottom-right")
          y = height - pipH - margin;
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = Math.max(2, width * 0.002);
        ctx.drawImage(webcamVideo, x, y, pipW, pipH);
        ctx.strokeRect(x, y, pipW, pipH);
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    const stream = canvas.captureStream(30);
    canvasStreamRef.current = stream;
    return stream;
  };

  const beginRecording = async () => {
    try {
      const { width, height } = qualityDimensions(videoQuality);
      const videoConstraints: MediaTrackConstraints = {
        width,
        height,
        frameRate: 30,
      };

      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: videoConstraints,
        audio: includeAudio,
      });
      displayStreamRef.current = displayStream;

      // Optional microphone audio
      let micTracks: MediaStreamTrack[] = [];
      if (includeAudio) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });
          audioStreamRef.current = audioStream;
          micTracks = audioStream.getAudioTracks();
        } catch {
          // mic unavailable — fall back to display audio if any
        }
      }

      let videoTracks: MediaStreamTrack[];
      if (includeWebcam) {
        try {
          const webcamStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false,
          });
          webcamStreamRef.current = webcamStream;
          const composite = await buildCompositeStream(
            displayStream,
            webcamStream
          );
          videoTracks = composite.getVideoTracks();
        } catch {
          toast.error(t("webcamFailed"));
          videoTracks = displayStream.getVideoTracks();
        }
      } else {
        videoTracks = displayStream.getVideoTracks();
      }

      const displayAudio = includeAudio ? displayStream.getAudioTracks() : [];
      const finalStream = new MediaStream([
        ...videoTracks,
        ...micTracks,
        ...displayAudio,
      ]);

      chunksRef.current = [];
      const mimeType = getSupportedMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(finalStream, options);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        const entry: RecordingEntry = {
          id: Math.random().toString(36).slice(2),
          blob,
          url,
          duration,
          size: blob.size,
          createdAt: new Date(),
        };
        setRecordings((prev) => [entry, ...prev]);
        setPreviewUrl(url);
        toast.success(`${t("recordingSaved")} (${formatDuration(duration)})`);
      };

      // Stop if user ends the screen share from browser UI.
      displayStream.getVideoTracks()[0].onended = () => {
        if (recorder.state !== "inactive") recorder.stop();
        stopAllTracks();
        stopTimer();
        setIsRecording(false);
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      startTimeRef.current = Date.now();
      setElapsed(0);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setElapsed(Math.round((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      toast.success(t("recordingStarted"));
    } catch (err) {
      stopAllTracks();
      const msg = err instanceof Error ? err.message : "Failed to start recording";
      if (msg.includes("Permission denied") || msg.includes("NotAllowedError")) {
        toast.error(t("permissionDenied"));
      } else {
        toast.error(msg || t("startFailed"));
      }
    }
  };

  const startRecording = async () => {
    if (!useCountdown) {
      await beginRecording();
      return;
    }
    // 3-2-1 countdown
    setCountdown(3);
    await new Promise<void>((resolve) => {
      let n = 3;
      const id = setInterval(() => {
        n -= 1;
        if (n <= 0) {
          clearInterval(id);
          setCountdown(null);
          resolve();
        } else {
          setCountdown(n);
        }
      }, 1000);
    });
    await beginRecording();
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    stopAllTracks();
    stopTimer();
    setIsRecording(false);
  };

  const downloadRecording = (entry: RecordingEntry) => {
    const a = document.createElement("a");
    a.href = entry.url;
    a.download = `recording-${entry.createdAt
      .toISOString()
      .slice(0, 19)
      .replace(/[:]/g, "-")}.webm`;
    a.click();
    toast.success(t("downloadStarted"));
  };

  // Export a recording to an animated GIF by replaying it into a canvas and
  // sampling frames. Uses gif.js with a self-hosted worker (public/vendor).
  const exportGif = async (entry: RecordingEntry) => {
    if (gifBusyId) return;
    setGifBusyId(entry.id);
    setGifProgress(0);
    const tid = toast.loading(t("gifEncoding"));
    try {
      const { default: GIF } = await import("gif.js");

      const video = document.createElement("video");
      video.src = entry.url;
      video.muted = true;
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("video load failed"));
      });

      const maxW = 480;
      const scale = video.videoWidth ? Math.min(1, maxW / video.videoWidth) : 1;
      const gw = Math.max(1, Math.round((video.videoWidth || maxW) * scale));
      const gh = Math.max(1, Math.round((video.videoHeight || 270) * scale));

      const canvas = document.createElement("canvas");
      canvas.width = gw;
      canvas.height = gh;
      const ctx = canvas.getContext("2d");

      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: gw,
        height: gh,
        workerScript: "/gif.worker.js",
      });

      gif.on("progress", (p: number) => setGifProgress(Math.round(p * 100)));

      const fps = 8;
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const total = Math.max(1, Math.floor(duration * fps));

      const grab = (time: number) =>
        new Promise<void>((resolve) => {
          const onSeeked = () => {
            video.removeEventListener("seeked", onSeeked);
            if (ctx) ctx.drawImage(video, 0, 0, gw, gh);
            gif.addFrame(canvas, { copy: true, delay: 1000 / fps });
            resolve();
          };
          video.addEventListener("seeked", onSeeked);
          video.currentTime = time;
        });

      for (let i = 0; i < total; i++) {
        await grab(Math.min(i / fps, Math.max(0, duration - 0.01)));
      }

      const blob = await new Promise<Blob>((resolve, reject) => {
        gif.on("finished", (b: Blob) => resolve(b));
        gif.on("abort", () => reject(new Error("gif aborted")));
        gif.render();
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recording-${entry.createdAt
        .toISOString()
        .slice(0, 19)
        .replace(/[:]/g, "-")}.gif`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.dismiss(tid);
      toast.success(t("gifReady"));
    } catch {
      toast.dismiss(tid);
      toast.error(t("gifFailed"));
    } finally {
      setGifBusyId(null);
      setGifProgress(0);
    }
  };

  const deleteRecording = (id: string) => {
    setRecordings((prev) => {
      const entry = prev.find((r) => r.id === id);
      if (entry) {
        URL.revokeObjectURL(entry.url);
        if (previewUrl === entry.url) setPreviewUrl(null);
      }
      return prev.filter((r) => r.id !== id);
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Monitor className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t("includeMicrophone")}</Label>
                  <Switch
                    checked={includeAudio}
                    onCheckedChange={setIncludeAudio}
                    disabled={isRecording}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t("includeWebcam")}</Label>
                  <Switch
                    checked={includeWebcam}
                    onCheckedChange={setIncludeWebcam}
                    disabled={isRecording}
                    data-testid="webcam-switch"
                  />
                </div>

                {includeWebcam && (
                  <div className="space-y-4 rounded-lg bg-muted/40 p-3">
                    <div className="space-y-1.5">
                      <Label>{t("webcamPosition")}</Label>
                      <Select
                        value={pipPosition}
                        onValueChange={(v) => setPipPosition(v as PipPosition)}
                        disabled={isRecording}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top-left">
                            {t("posTopLeft")}
                          </SelectItem>
                          <SelectItem value="top-right">
                            {t("posTopRight")}
                          </SelectItem>
                          <SelectItem value="bottom-left">
                            {t("posBottomLeft")}
                          </SelectItem>
                          <SelectItem value="bottom-right">
                            {t("posBottomRight")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label>{t("webcamSize")}</Label>
                        <span className="text-xs text-muted-foreground" dir="ltr">
                          {pipSize}%
                        </span>
                      </div>
                      <Slider
                        value={[pipSize]}
                        min={10}
                        max={40}
                        step={1}
                        onValueChange={(v) => setPipSize(v[0])}
                        disabled={isRecording}
                        aria-label={t("webcamSize")}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label>{t("countdown")}</Label>
                  <Switch
                    checked={useCountdown}
                    onCheckedChange={setUseCountdown}
                    disabled={isRecording}
                    data-testid="countdown-switch"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>{t("videoQuality")}</Label>
                  <Select
                    value={videoQuality}
                    onValueChange={(v) => setVideoQuality(v as Quality)}
                    disabled={isRecording}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720">{t("quality720")}</SelectItem>
                      <SelectItem value="1080">{t("quality1080")}</SelectItem>
                      <SelectItem value="max">{t("qualityMax")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isRecording ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <CircleDot className="w-5 h-5 text-destructive animate-pulse" />
                    <div>
                      <div className="font-semibold text-destructive">
                        {t("recording")}
                      </div>
                      <div className="text-sm font-mono" dir="ltr">
                        {formatDuration(elapsed)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={stopRecording}
                  >
                    <Square className="w-4 h-4" /> {t("stopRecording")}
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full gap-2"
                  onClick={startRecording}
                  disabled={countdown !== null}
                >
                  <CircleDot className="w-4 h-4" /> {t("startRecording")}
                </Button>
              )}

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• {t("privacyNote1")}</p>
                <p>• {t("privacyNote2")}</p>
                <p>• {t("privacyNote3")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardContent className="pt-6">
              {previewUrl ? (
                <video
                  src={previewUrl}
                  controls
                  className="w-full rounded-lg"
                  style={{ maxHeight: "280px" }}
                />
              ) : (
                <div className="flex items-center justify-center h-[200px] rounded-lg bg-muted/50 text-muted-foreground text-sm">
                  {t("previewPlaceholder")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recordings list */}
        {recordings.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">
              {t("recordingsCount")} ({recordings.length})
            </h2>
            {recordings.map((entry) => (
              <Card
                key={entry.id}
                className={`cursor-pointer transition-colors ${
                  previewUrl === entry.url ? "border-primary" : ""
                }`}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="flex items-center gap-3 flex-1 min-w-0"
                      onClick={() => setPreviewUrl(entry.url)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Monitor className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">
                          {entry.createdAt.toLocaleTimeString()}
                        </div>
                        <div className="flex gap-2 mt-0.5">
                          <Badge variant="outline" className="text-xs">
                            {formatDuration(entry.duration)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {formatSize(entry.size)}
                          </Badge>
                          {gifBusyId === entry.id && (
                            <Badge variant="outline" className="text-xs" dir="ltr">
                              {gifProgress}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadRecording(entry)}
                        aria-label={t("downloadWebm")}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => exportGif(entry)}
                        disabled={gifBusyId !== null}
                        aria-label={t("exportGif")}
                      >
                        <Film className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteRecording(entry.id)}
                        aria-label={t("delete")}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Countdown overlay */}
      {countdown !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          data-testid="countdown-overlay"
        >
          <div className="flex flex-col items-center gap-4">
            <Camera className="w-10 h-10 text-primary" />
            <div className="text-7xl font-bold tabular-nums text-primary" dir="ltr">
              {countdown}
            </div>
            <p className="text-sm text-muted-foreground">{t("getReady")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
