"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { SliderRow } from "@/components/shared/SliderRow";
import { toast } from "sonner";
import {
  PlayIcon,
  PauseIcon,
  SquareIcon,
  RotateCcwIcon,
  DownloadIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { synthesizeSpeech, prepareVoice } from "@/lib/vits-loader";
import { ToolShell } from "@/components/template/tool-shell";
import { downloadUrl } from "@/lib/download";

type PlayState = "idle" | "playing" | "paused";

// Piper/VITS voices used for BOTH playback and download, so the voice you
// preview is exactly the voice you save. The engine + model load from a CDN
// on first use, then run entirely on-device.
const AI_VOICES: { id: string; label: string }[] = [
  { id: "en_US-hfc_female-medium", label: "English (US) — Female" },
  { id: "en_US-hfc_male-medium", label: "English (US) — Male" },
  { id: "en_US-amy-medium", label: "English (US) — Amy" },
  { id: "en_US-ryan-high", label: "English (US) — Ryan (HQ)" },
  { id: "en_GB-alan-medium", label: "English (UK) — Alan" },
  { id: "en_GB-cori-high", label: "English (UK) — Cori (HQ)" },
  { id: "ar_JO-kareem-medium", label: "العربية — كريم" },
  { id: "es_ES-davefx-medium", label: "Español — Dave" },
  { id: "fr_FR-siwis-medium", label: "Français — Siwis" },
  { id: "de_DE-thorsten-medium", label: "Deutsch — Thorsten" },
];

export default function TextToSpeech() {
  const t = useTranslations("Tools.TextToSpeech");
  const tc = useTranslations("ToolsConfig");

  const [text, setText] = useState("");
  const [voiceId, setVoiceId] = useState(AI_VOICES[0].id);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preparing, setPreparing] = useState(false);
  const [ready, setReady] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Cache the last synthesized WAV so Play → Download (same text + voice)
  // doesn't re-synthesize.
  const cacheRef = useRef<{ key: string; url: string } | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.onended = () => setPlayState("idle");
    audio.onpause = () => {
      // currentTime===0 means we explicitly stopped, otherwise it's a pause.
      setPlayState((s) => (audio.ended || audio.currentTime === 0 ? "idle" : s));
    };
    audioRef.current = audio;
    return () => {
      audio.pause();
      if (cacheRef.current) URL.revokeObjectURL(cacheRef.current.url);
    };
  }, []);

  // Keep live controls in sync with the playing audio.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, [rate]);

  // Preload the selected voice's model on mount and whenever the voice changes,
  // so Play/Download are instant. No-ops if the model is already cached.
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setPreparing(true);
    setProgress(0);
    prepareVoice(voiceId, (p) => {
      if (!cancelled) setProgress(p);
    })
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err) => {
        console.error(err);
        // Non-fatal: Play/Download will retry the download on demand.
      })
      .finally(() => {
        if (!cancelled) setPreparing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [voiceId]);

  // Changing the text or voice invalidates the cached audio.
  const invalidate = useCallback(() => {
    if (cacheRef.current) {
      URL.revokeObjectURL(cacheRef.current.url);
      cacheRef.current = null;
    }
  }, []);

  // Synthesize (or reuse) the WAV for the current text + voice, returning a URL.
  const ensureAudioUrl = useCallback(async (): Promise<string> => {
    const key = `${voiceId}::${text}`;
    if (cacheRef.current?.key === key) return cacheRef.current.url;

    setBusy(true);
    setProgress(0);
    try {
      const wav = await synthesizeSpeech(text, voiceId, setProgress);
      if (cacheRef.current) URL.revokeObjectURL(cacheRef.current.url);
      const url = URL.createObjectURL(wav);
      cacheRef.current = { key, url };
      return url;
    } finally {
      setBusy(false);
    }
  }, [text, voiceId]);

  const handlePlay = useCallback(async () => {
    if (!text.trim()) {
      toast.error(t("enterText"));
      return;
    }
    try {
      const url = await ensureAudioUrl();
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.src !== url) audio.src = url;
      audio.playbackRate = rate;
      audio.volume = volume;
      await audio.play();
      setPlayState("playing");
    } catch (err) {
      console.error(err);
      toast.error(t("audioFailed"));
    }
  }, [text, ensureAudioUrl, rate, volume, t]);

  const handlePause = useCallback(() => {
    audioRef.current?.pause();
    setPlayState("paused");
  }, []);

  const handleResume = useCallback(() => {
    audioRef.current?.play();
    setPlayState("playing");
  }, []);

  const handleStop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setPlayState("idle");
  }, []);

  const handleDownload = useCallback(async () => {
    if (!text.trim()) {
      toast.error(t("enterText"));
      return;
    }
    try {
      const url = await ensureAudioUrl();
      downloadUrl(url, "speech.wav");
      toast.success(t("audioDownloaded"));
    } catch (err) {
      console.error(err);
      toast.error(t("audioFailed"));
    }
  }, [text, ensureAudioUrl, t]);

  const handleReset = useCallback(() => {
    setRate(1);
    setVolume(1);
  }, []);

  return (
    <ToolShell
      slug="text-to-speech"
      title={tc("tools.text-to-speech.name")}
      sub={tc("tools.text-to-speech.description")}
    >
      <div className="space-y-4">
          <SettingsCard>
            <OptionRow label={t("inputLabel")} htmlFor="tts-input">
              <Textarea
                id="tts-input"
                dir="auto"
                placeholder={t("inputPlaceholder")}
                className="min-h-[180px]"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  invalidate();
                }}
              />
            </OptionRow>
          </SettingsCard>

          <SettingsCard>
            <OptionRow
              label={t("voice")}
              hint={
                preparing
                  ? `${t("preparingVoice")} ${progress}%`
                  : ready
                    ? t("voiceReady")
                    : undefined
              }
            >
              <Select
                value={voiceId}
                onValueChange={(v) => {
                  setVoiceId(v);
                  invalidate();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_VOICES.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </OptionRow>

            <div className="grid gap-5 sm:grid-cols-2">
              <SliderRow
                label={t("rate")}
                value={rate}
                display={`${rate.toFixed(1)}x`}
                min={0.5}
                max={2}
                step={0.1}
                onChange={setRate}
              />
              <SliderRow
                label={t("volume")}
                value={volume}
                display={`${Math.round(volume * 100)}%`}
                min={0}
                max={1}
                step={0.05}
                onChange={setVolume}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {playState === "playing" ? (
                <Button onClick={handlePause} variant="outline">
                  <PauseIcon className="h-4 w-4 me-2" />
                  {t("pause")}
                </Button>
              ) : playState === "paused" ? (
                <Button onClick={handleResume}>
                  <PlayIcon className="h-4 w-4 me-2" />
                  {t("resume")}
                </Button>
              ) : (
                <Button onClick={handlePlay} disabled={busy}>
                  <PlayIcon className="h-4 w-4 me-2" />
                  {busy ? t("preparing") : t("play")}
                </Button>
              )}

              <Button
                onClick={handleStop}
                variant="outline"
                disabled={playState === "idle"}
              >
                <SquareIcon className="h-4 w-4 me-2" />
                {t("stop")}
              </Button>

              <Button onClick={handleDownload} variant="secondary" disabled={busy}>
                <DownloadIcon className="h-4 w-4 me-2" />
                {busy ? t("preparing") : t("downloadAudio")}
              </Button>

              <Button onClick={handleReset} variant="ghost">
                <RotateCcwIcon className="h-4 w-4 me-2" />
                {t("reset")}
              </Button>

              <span className="text-sm text-muted-foreground ms-auto">
                {playState === "playing"
                  ? t("statusSpeaking")
                  : playState === "paused"
                    ? t("statusPaused")
                    : t("statusIdle")}
              </span>
            </div>

            {(busy || preparing) && (
              <div className="space-y-1">
                <Progress value={progress} />
                <p className="text-xs text-muted-foreground">
                  {preparing ? t("preparingVoice") : t("preparing")}{" "}
                  <span dir="ltr">{progress}%</span>
                </p>
              </div>
            )}
          </SettingsCard>

          <SettingsCard description={t("modelNote")} />
      </div>
    </ToolShell>
  );
}
