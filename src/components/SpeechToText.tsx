"use client";

import { useEffect, useRef, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { MicIcon, MicOffIcon, Download, Trash2, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";
import { downloadBlob } from "@/lib/download";

// ── Minimal Web Speech API typings ──────────────────────────────────────────
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionErrorEventLike {
  error: string;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const LANGUAGES: { value: string; label: string }[] = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "ar-SA", label: "العربية" },
  { value: "es-ES", label: "Español" },
  { value: "fr-FR", label: "Français" },
  { value: "de-DE", label: "Deutsch" },
  { value: "it-IT", label: "Italiano" },
  { value: "pt-BR", label: "Português (BR)" },
  { value: "ru-RU", label: "Русский" },
  { value: "hi-IN", label: "हिन्दी" },
  { value: "ja-JP", label: "日本語" },
  { value: "ko-KR", label: "한국어" },
  { value: "zh-CN", label: "中文 (简体)" },
  { value: "tr-TR", label: "Türkçe" },
];

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function SpeechToText() {
  const t = useTranslations("Tools.SpeechToText");
  const tc = useTranslations("ToolsConfig");

  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [continuous, setContinuous] = useState(true);
  const [interimResults, setInterimResults] = useState(true);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const listeningRef = useRef(false);

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const stopListening = () => {
    listeningRef.current = false;
    recognitionRef.current?.stop();
    setListening(false);
    setInterim("");
  };

  const startListening = () => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setSupported(false);
      toast.error(t("notSupported"));
      return;
    }

    const recognition = new Ctor();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onresult = (event) => {
      let finalChunk = "";
      let interimChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalChunk += text;
        } else {
          interimChunk += text;
        }
      }
      if (finalChunk) {
        setTranscript((prev) =>
          prev ? `${prev.trimEnd()} ${finalChunk.trim()}` : finalChunk.trim()
        );
      }
      setInterim(interimChunk);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        toast.error(t("micDenied"));
      } else if (event.error === "no-speech") {
        toast.error(t("noSpeech"));
      } else if (event.error !== "aborted") {
        toast.error(t("recognitionError"));
      }
    };

    recognition.onend = () => {
      // Auto-restart in continuous mode unless the user stopped it.
      if (listeningRef.current && continuous) {
        try {
          recognition.start();
          return;
        } catch {
          /* ignore */
        }
      }
      listeningRef.current = false;
      setListening(false);
      setInterim("");
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      listeningRef.current = true;
      setListening(true);
      toast.success(t("started"));
    } catch {
      toast.error(t("recognitionError"));
    }
  };

  const toggleListening = () => {
    if (listening) {
      stopListening();
      toast.success(t("stopped"));
    } else {
      startListening();
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    setInterim("");
    toast.success(t("cleared"));
  };

  const downloadTranscript = () => {
    if (!transcript.trim()) {
      toast.error(t("nothingToDownload"));
      return;
    }
    downloadBlob(new Blob([transcript], { type: "text/plain" }), "transcript.txt");
    toast.success(t("downloaded"));
  };

  return (
    <ToolShell
      slug="speech-to-text"
      title={tc("tools.speech-to-text.name")}
      sub={tc("tools.speech-to-text.description")}
      controls={
        <>
          <CopyButton
            text={transcript}
            label={t("copy")}
            successMessage={t("copied")}
            errorMessage={t("copyFailed")}
            disabled={!transcript.trim()}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={downloadTranscript}
            aria-label={t("download")}
          >
            <Download className="h-4 w-4 me-2" />
            {t("download")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearTranscript}
            aria-label={t("clear")}
          >
            <Trash2 className="h-4 w-4 me-2" />
            {t("clear")}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
          {!supported && (
            <Card className="p-4 border-amber-500/50 bg-amber-500/10">
              <div className="flex items-start gap-2 text-sm">
                <Info className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
                <p data-testid="unsupported-notice">{t("notSupported")}</p>
              </div>
            </Card>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={language}
              onValueChange={setLanguage}
              disabled={listening}
            >
              <SelectTrigger className="w-[200px]" aria-label={t("language")}>
                <SelectValue placeholder={t("language")} />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                id="continuous"
                data-testid="continuous-toggle"
                checked={continuous}
                onCheckedChange={(v) => setContinuous(Boolean(v))}
                disabled={listening}
              />
              {t("continuous")}
            </label>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                id="interim"
                data-testid="interim-toggle"
                checked={interimResults}
                onCheckedChange={(v) => setInterimResults(Boolean(v))}
                disabled={listening}
              />
              {t("interim")}
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={toggleListening}
              disabled={!supported}
              variant={listening ? "destructive" : "default"}
              aria-label={listening ? t("stop") : t("start")}
              data-testid="mic-button"
            >
              {listening ? (
                <MicOffIcon className="h-4 w-4 me-2" />
              ) : (
                <MicIcon className="h-4 w-4 me-2" />
              )}
              {listening ? t("stop") : t("start")}
            </Button>

            {listening && (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                </span>
                {t("listening")}
              </span>
            )}
          </div>

          <Card className="p-4">
            <Textarea
              data-testid="transcript"
              dir="auto"
              placeholder={t("placeholder")}
              className="min-h-[340px] text-base leading-relaxed"
              value={interim ? `${transcript} ${interim}`.trim() : transcript}
              onChange={(e) => {
                setTranscript(e.target.value);
                setInterim("");
              }}
            />
          </Card>

          <Card className="p-4">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">{t("tipTitle")}</p>
                <p>{t("tipBody")}</p>
              </div>
            </div>
          </Card>
      </div>
    </ToolShell>
  );
}
