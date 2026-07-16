"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
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
import { useMediaDevices } from "./useMediaDevices";

/**
 * Microphone half of the mic/camera tester: device picker + live input-level
 * meter (RMS → dB → 0–100%). Owns its own audio-only stream plus the
 * AudioContext/AnalyserNode graph, torn down on stop and on unmount, so it can
 * stand alone as the `/tools/mic-test` landing tool.
 */
export function MicTesterPanel() {
  const t = useTranslations("Tools.MicCameraTester");
  const { mics } = useMediaDevices();
  const [selectedMic, setSelectedMic] = useState<string>("");
  const [hasStream, setHasStream] = useState<boolean>(false);
  const [audioDb, setAudioDb] = useState<number>(-Infinity);

  const streamRef = useRef<MediaStream | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const smoothRmsRef = useRef<number>(0);

  useEffect(() => {
    if (!selectedMic && mics[0]) setSelectedMic(mics[0].deviceId);
  }, [mics, selectedMic]);

  const stopCurrent = useCallback(() => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    setHasStream(false);
    if (audioAnalyserRef.current) audioAnalyserRef.current.disconnect();
    if (micSourceRef.current) micSourceRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    audioAnalyserRef.current = null;
    micSourceRef.current = null;
    audioContextRef.current = null;
  }, []);

  const setupAudioLevel = (s: MediaStream) => {
    try {
      const audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
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
        const db = 20 * Math.log10(Math.max(1e-6, rmsRaw));
        setAudioDb(db);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    } catch {}
  };

  const startPreview = async () => {
    try {
      stopCurrent();
      const s = await navigator.mediaDevices.getUserMedia({
        audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
      });
      streamRef.current = s;
      setHasStream(true);
      setupAudioLevel(s);
      toast.success(t("previewStarted"));
    } catch {
      toast.error(t("errorAccessingDevices"));
    }
  };

  useEffect(() => {
    return () => stopCurrent();
  }, [stopCurrent]);

  const levelPercent = (() => {
    const db = isFinite(audioDb) ? audioDb : -90;
    const clamped = Math.max(-60, Math.min(0, db));
    return Math.round(((clamped + 60) / 60) * 100);
  })();

  return (
    <div className="space-y-4">
      <SettingsCard>
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

        <div className="flex gap-2">
          <Button onClick={startPreview}>{t("startPreview")}</Button>
          <Button variant="outline" onClick={stopCurrent} disabled={!hasStream}>
            {t("stop")}
          </Button>
        </div>
      </SettingsCard>

      <Card className="p-4">
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
            <span>{isFinite(audioDb) ? `${audioDb.toFixed(1)} dB` : ""}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
