"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Volume2Icon,
  PlayIcon,
  PauseIcon,
  SquareIcon,
  RotateCcwIcon,
  InfoIcon,
  DownloadIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

type SpeakState = "idle" | "speaking" | "paused";

// Offline AI voices (Piper/VITS via @diffusionstudio/vits-web). Unlike the
// native browser voices these can be synthesized to a downloadable WAV file.
// The engine + voice model (~20-60MB) are fetched from a CDN on first use.
// Typed as `string` so the bundler/TS treat it as a runtime URL, not a module.
const VITS_CDN: string = "https://esm.sh/@diffusionstudio/vits-web@1.0.3";
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

  const [supported, setSupported] = useState(true);
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [state, setState] = useState<SpeakState>("idle");

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Offline AI-voice download (WASM TTS — produces a real WAV file).
  const [aiVoice, setAiVoice] = useState<string>(AI_VOICES[0].id);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);

  const handleDownloadAudio = useCallback(async () => {
    if (!text.trim()) {
      toast.error(t("enterText"));
      return;
    }
    setAiBusy(true);
    setAiProgress(0);
    try {
      // Loaded from a CDN at runtime (not bundled): the library ships Node-only
      // `require("fs")` code in a dead browser branch that breaks the bundler.
      // The voice model is fetched from a CDN on first use anyway.
      const tts = (await import(
        /* webpackIgnore: true */ /* @vite-ignore */ VITS_CDN
      )) as {
        predict: (
          cfg: { text: string; voiceId: string },
          cb?: (p: { loaded: number; total: number }) => void
        ) => Promise<Blob>;
      };
      const wav = await tts.predict({ text, voiceId: aiVoice }, (p) => {
        if (p.total > 0) {
          setAiProgress(Math.min(100, Math.round((p.loaded / p.total) * 100)));
        }
      });
      const url = URL.createObjectURL(wav);
      const a = document.createElement("a");
      a.href = url;
      a.download = "speech.wav";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(t("audioDownloaded"));
    } catch (err) {
      console.error(err);
      toast.error(t("audioFailed"));
    } finally {
      setAiBusy(false);
    }
  }, [text, aiVoice, t]);

  // Detect support + load voices (async voiceschanged event).
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
        setVoiceURI((prev) => prev || available[0].voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlay = useCallback(() => {
    if (!supported) return;
    if (!text.trim()) {
      toast.error(t("enterText"));
      return;
    }

    // Cancel anything currently queued before starting fresh.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find((v) => v.voiceURI === voiceURI);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setState("speaking");
  }, [supported, text, voices, voiceURI, rate, pitch, volume, t]);

  const handlePause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setState("paused");
  }, [supported]);

  const handleResume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setState("speaking");
  }, [supported]);

  const handleStop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setState("idle");
  }, [supported]);

  const handleReset = useCallback(() => {
    setRate(1);
    setPitch(1);
    setVolume(1);
  }, []);

  if (!supported) {
    return (
      <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <InfoIcon className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold mb-1">{t("title")}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t("notSupported")}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Volume2Icon className="h-5 w-5" />
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>

          <Card className="p-4 space-y-2">
            <label className="text-sm font-medium" htmlFor="tts-input">
              {t("inputLabel")}
            </label>
            <Textarea
              id="tts-input"
              dir="auto"
              placeholder={t("inputPlaceholder")}
              className="min-h-[180px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Card>

          <Card className="p-4 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("voice")}</label>
              <Select value={voiceURI} onValueChange={setVoiceURI}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("selectVoice")} />
                </SelectTrigger>
                <SelectContent>
                  {voices.length === 0 ? (
                    <SelectItem value="__none__" disabled>
                      {t("noVoices")}
                    </SelectItem>
                  ) : (
                    voices.map((v) => (
                      <SelectItem key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t("rate")}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {rate.toFixed(1)}x
                  </span>
                </div>
                <Slider
                  aria-label={t("rate")}
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[rate]}
                  onValueChange={(v) => setRate(v[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t("pitch")}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {pitch.toFixed(1)}
                  </span>
                </div>
                <Slider
                  aria-label={t("pitch")}
                  min={0}
                  max={2}
                  step={0.1}
                  value={[pitch]}
                  onValueChange={(v) => setPitch(v[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t("volume")}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <Slider
                  aria-label={t("volume")}
                  min={0}
                  max={1}
                  step={0.05}
                  value={[volume]}
                  onValueChange={(v) => setVolume(v[0])}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {state === "speaking" ? (
                <Button onClick={handlePause} variant="outline">
                  <PauseIcon className="h-4 w-4 me-2" />
                  {t("pause")}
                </Button>
              ) : state === "paused" ? (
                <Button onClick={handleResume}>
                  <PlayIcon className="h-4 w-4 me-2" />
                  {t("resume")}
                </Button>
              ) : (
                <Button onClick={handlePlay}>
                  <PlayIcon className="h-4 w-4 me-2" />
                  {t("play")}
                </Button>
              )}

              <Button
                onClick={handleStop}
                variant="outline"
                disabled={state === "idle"}
              >
                <SquareIcon className="h-4 w-4 me-2" />
                {t("stop")}
              </Button>

              <Button onClick={handleReset} variant="ghost">
                <RotateCcwIcon className="h-4 w-4 me-2" />
                {t("reset")}
              </Button>

              <span className="text-sm text-muted-foreground ms-auto">
                {state === "speaking"
                  ? t("statusSpeaking")
                  : state === "paused"
                    ? t("statusPaused")
                    : t("statusIdle")}
              </span>
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <div>
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <DownloadIcon className="h-4 w-4" />
                {t("downloadTitle")}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t("downloadDesc")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("aiVoice")}</label>
                <Select value={aiVoice} onValueChange={setAiVoice}>
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
              </div>

              <Button onClick={handleDownloadAudio} disabled={aiBusy}>
                <DownloadIcon className="h-4 w-4 me-2" />
                {aiBusy ? t("downloading") : t("downloadAudio")}
              </Button>
            </div>

            {aiBusy && (
              <div className="space-y-1">
                <Progress value={aiProgress} />
                <p className="text-xs text-muted-foreground" dir="ltr">
                  {aiProgress}%
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground">{t("modelNote")}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-start gap-3">
              <InfoIcon className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">{t("note")}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
