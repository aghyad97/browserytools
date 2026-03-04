"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Monitor, Square, Download, Trash2, CircleDot } from "lucide-react";
import { toast } from "sonner";

interface RecordingEntry {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  size: number;
  createdAt: Date;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ScreenRecorder() {
  const t = useTranslations("Tools.ScreenRecorder");
  const [isRecording, setIsRecording] = useState(false);
  const [includeAudio, setIncludeAudio] = useState(false);
  const [videoQuality, setVideoQuality] = useState<"720" | "1080" | "max">("720");
  const [elapsed, setElapsed] = useState(0);
  const [recordings, setRecordings] = useState<RecordingEntry[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      recordings.forEach((r) => URL.revokeObjectURL(r.url));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getSupportedMimeType = () => {
    const types = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
      "video/mp4",
    ];
    return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
  };

  const startRecording = async () => {
    try {
      const videoConstraints: MediaTrackConstraints = {
        width: videoQuality === "1080" ? 1920 : videoQuality === "720" ? 1280 : undefined,
        height: videoQuality === "1080" ? 1080 : videoQuality === "720" ? 720 : undefined,
        frameRate: 30,
      };

      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: videoConstraints,
        audio: includeAudio,
      });

      let finalStream = displayStream;

      if (includeAudio) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          const tracks = [...displayStream.getTracks(), ...audioStream.getAudioTracks()];
          finalStream = new MediaStream(tracks);
        } catch {
          // mic not available, use display audio only
        }
      }

      streamRef.current = finalStream;
      chunksRef.current = [];

      const mimeType = getSupportedMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(finalStream, options);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || "video/webm" });
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

      // Stop recording if user stops screen share
      finalStream.getVideoTracks()[0].onended = () => {
        if (recorder.state !== "inactive") recorder.stop();
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
      const msg = err instanceof Error ? err.message : "Failed to start recording";
      if (msg.includes("Permission denied") || msg.includes("NotAllowedError")) {
        toast.error(t("permissionDenied"));
      } else {
        toast.error(msg || t("startFailed"));
      }
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    stopTimer();
    setIsRecording(false);
  };

  const downloadRecording = (entry: RecordingEntry) => {
    const a = document.createElement("a");
    a.href = entry.url;
    a.download = `recording-${entry.createdAt.toISOString().slice(0, 19).replace(/[:]/g, "-")}.webm`;
    a.click();
    toast.success(t("downloadStarted"));
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
                <div className="space-y-1.5">
                  <Label>{t("videoQuality")}</Label>
                  <Select
                    value={videoQuality}
                    onValueChange={(v) => setVideoQuality(v as "720" | "1080" | "max")}
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
                      <div className="font-semibold text-destructive">{t("recording")}</div>
                      <div className="text-sm font-mono" dir="ltr">{formatDuration(elapsed)}</div>
                    </div>
                  </div>
                  <Button variant="destructive" className="w-full gap-2" onClick={stopRecording}>
                    <Square className="w-4 h-4" /> {t("stopRecording")}
                  </Button>
                </div>
              ) : (
                <Button className="w-full gap-2" onClick={startRecording}>
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
            <h2 className="text-sm font-semibold">{t("recordingsCount")} ({recordings.length})</h2>
            {recordings.map((entry) => (
              <Card key={entry.id} className={`cursor-pointer transition-colors ${previewUrl === entry.url ? "border-primary" : ""}`}>
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
                          <Badge variant="outline" className="text-xs">{formatDuration(entry.duration)}</Badge>
                          <Badge variant="outline" className="text-xs">{formatSize(entry.size)}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => downloadRecording(entry)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteRecording(entry.id)}>
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
    </div>
  );
}
