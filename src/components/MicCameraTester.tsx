"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface MediaDeviceInfoLite {
  deviceId: string;
  label: string;
}

export default function MicCameraTester() {
  const t = useTranslations("Tools.MicCameraTester");
  const tc = useTranslations("ToolsConfig");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfoLite[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfoLite[]>([]);
  const [selectedCam, setSelectedCam] = useState<string>("");
  const [selectedMic, setSelectedMic] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [audioDb, setAudioDb] = useState<number>(-Infinity);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const smoothRmsRef = useRef<number>(0);

  const listDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices
        .filter((d) => d.kind === "videoinput" && d.deviceId)
        .map((d) => ({ deviceId: d.deviceId, label: d.label || "Camera" }));
      const microphones = devices
        .filter((d) => d.kind === "audioinput" && d.deviceId)
        .map((d) => ({ deviceId: d.deviceId, label: d.label || "Microphone" }));
      setCameras(cams);
      setMics(microphones);
      if (!selectedCam && cams[0]) setSelectedCam(cams[0].deviceId);
      if (!selectedMic && microphones[0])
        setSelectedMic(microphones[0].deviceId);
    } catch (e) {
      toast.error(t("errorListingDevices"));
    }
  };

  useEffect(() => {
    listDevices();
    navigator.mediaDevices.addEventListener?.("devicechange", listDevices);
    return () => {
      navigator.mediaDevices.removeEventListener?.("devicechange", listDevices);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCurrent = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    if (audioAnalyserRef.current) audioAnalyserRef.current.disconnect();
    if (micSourceRef.current) micSourceRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    audioAnalyserRef.current = null;
    micSourceRef.current = null;
    audioContextRef.current = null;
  };

  const startPreview = async () => {
    try {
      stopCurrent();
      const constraints: MediaStreamConstraints = {
        video: selectedCam ? { deviceId: { exact: selectedCam } } : true,
        audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
      };
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      setupAudioLevel(s);
      toast.success(t("previewStarted"));
    } catch (e) {
      toast.error(t("errorAccessingDevices"));
    }
  };

  const setupAudioLevel = (s: MediaStream) => {
    try {
      const audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.8;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      const source = audioCtx.createMediaStreamSource(s);
      source.connect(analyser);
      audioContextRef.current = audioCtx;
      audioAnalyserRef.current = analyser;
      micSourceRef.current = source;

      const dataArray = new Float32Array(analyser.fftSize);
      const tick = () => {
        if (!audioAnalyserRef.current) return;
        audioAnalyserRef.current.getFloatTimeDomainData(dataArray);
        let sum = 0;
        let peak = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i];
          sum += v * v;
          const a = Math.abs(v);
          if (a > peak) peak = a;
        }
        const rmsRaw = Math.sqrt(sum / dataArray.length);
        const alpha = 0.2;
        const prev = smoothRmsRef.current || 0;
        const rms = alpha * rmsRaw + (1 - alpha) * prev;
        smoothRmsRef.current = rms;
        setAudioLevel(rms);
        const db = 20 * Math.log10(Math.max(1e-6, rmsRaw));
        setAudioDb(db);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    } catch {}
  };

  useEffect(() => {
    return () => stopCurrent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const levelPercent = (() => {
    const db = isFinite(audioDb) ? audioDb : -90;
    const clamped = Math.max(-60, Math.min(0, db));
    return Math.round(((clamped + 60) / 60) * 100);
  })();

  return (
    <ToolShell
      slug="mic-camera"
      title={tc("tools.mic-camera.name")}
      sub={tc("tools.mic-camera.description")}
    >
      <div className="space-y-4">
        <SettingsCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OptionRow label={t("camera")} htmlFor="mct-camera">
                <Select value={selectedCam} onValueChange={setSelectedCam}>
                  <SelectTrigger id="mct-camera">
                    <SelectValue placeholder={t("chooseCamera")} />
                  </SelectTrigger>
                  <SelectContent>
                    {cameras.map((c) => (
                      <SelectItem key={c.deviceId} value={c.deviceId}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </OptionRow>
              <OptionRow label={t("microphone")} htmlFor="mct-mic">
                <Select value={selectedMic} onValueChange={setSelectedMic}>
                  <SelectTrigger id="mct-mic">
                    <SelectValue placeholder={t("chooseMic")} />
                  </SelectTrigger>
                  <SelectContent>
                    {mics.map((m) => (
                      <SelectItem key={m.deviceId} value={m.deviceId}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </OptionRow>
            </div>

            <div className="flex gap-2">
              <Button onClick={startPreview}>{t("startPreview")}</Button>
              <Button
                variant="outline"
                onClick={stopCurrent}
                disabled={!stream}
              >
                {t("stop")}
              </Button>
            </div>
        </SettingsCard>

        <Card className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 border rounded overflow-hidden bg-black/5 dark:bg-white/5">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full aspect-video object-contain"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("micLevel")}</Label>
                <div className="h-3 w-full bg-muted rounded">
                  {/* status color, no bt token: live audio-level meter fill */}
                  <div
                    className="h-3 rounded bg-green-500 transition-[width] duration-100"
                    style={{ width: `${levelPercent}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground flex justify-between">
                  <span>{levelPercent}%</span>
                  <span>
                    {isFinite(audioDb) ? `${audioDb.toFixed(1)} dB` : ""}
                  </span>
                </div>
              </div>
            </div>
        </Card>
      </div>
    </ToolShell>
  );
}
