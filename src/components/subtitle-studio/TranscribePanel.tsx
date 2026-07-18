"use client";

// Step 1 of Subtitle Studio: turn an uploaded video into a word-timed CueDoc.
// Reads video dimensions from an offscreen <video> element, decodes audio to
// 16kHz mono, runs it through an on-device Whisper pipeline with word-level
// timestamps, and folds the words into cues via fromWhisperWords.

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadIcon, VideoIcon, InfoIcon } from "lucide-react";
import { getPipeline, type LoadProgress } from "@/lib/hf-pipeline";
import { decodeToMono16k } from "@/lib/media/decode-audio";
import { fromWhisperWords, type CueDoc, type Word } from "@/lib/subtitles/cues";

const MODEL = "Xenova/whisper-base";

// A word-timed chunk as returned by Whisper when return_timestamps: "word".
type WordChunk = { timestamp: [number, number | null]; text: string };

// The ASR pipeline call signature we rely on (subset of Transformers.js).
type Transcriber = (
  audio: Float32Array,
  options: Record<string, unknown>
) => Promise<{ text: string; chunks?: WordChunk[] }>;

// Read the intrinsic pixel dimensions of a video file via an offscreen
// <video> element. Falls back to a common 720p frame if the browser ever
// reports zero (some codecs briefly report 0x0 before the first frame).
function readVideoDims(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const w = video.videoWidth || 1280;
      const h = video.videoHeight || 720;
      URL.revokeObjectURL(url);
      resolve({ w, h });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read video metadata"));
    };
    video.src = url;
  });
}

// Adapt Whisper's word-level Chunk[] into the shared Word[] shape expected by
// fromWhisperWords. Drops empty chunks (Whisper occasionally emits a
// whitespace-only trailing chunk).
function chunksToWords(chunks: WordChunk[]): Word[] {
  return chunks
    .map((c) => ({
      start: c.timestamp[0] ?? 0,
      end: c.timestamp[1] ?? c.timestamp[0] ?? 0,
      text: c.text.trim(),
    }))
    .filter((w) => w.text.length > 0);
}

export interface TranscribePanelProps {
  onTranscribed: (
    doc: CueDoc,
    file: File,
    dims: { w: number; h: number }
  ) => void;
}

export function TranscribePanel({ onTranscribed }: TranscribePanelProps) {
  const t = useTranslations("Tools.SubtitleStudio");

  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [transcribing, setTranscribing] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
  }, []);

  const transcribe = useCallback(async () => {
    if (!file) {
      toast.error(t("noFile"));
      return;
    }
    setBusy(true);
    setTranscribing(false);
    try {
      const [dims, audio] = await Promise.all([
        readVideoDims(file),
        decodeToMono16k(file),
      ]);

      const transcriber = await getPipeline<Transcriber>(
        "automatic-speech-recognition",
        MODEL,
        { device: "auto", onProgress: setProgress }
      );

      setTranscribing(true);
      const out = await transcriber(audio, {
        return_timestamps: "word",
        chunk_length_s: 30,
        stride_length_s: 5,
      });

      const words = chunksToWords(Array.isArray(out.chunks) ? out.chunks : []);
      const doc = fromWhisperWords(words);
      onTranscribed(doc, file, dims);
      toast.success(t("done"));
    } catch (err) {
      console.error(err);
      toast.error(t("failed"));
    } finally {
      setBusy(false);
      setTranscribing(false);
      setProgress(null);
    }
  }, [file, onTranscribed, t]);

  return (
    <Card className="p-6 shadow-none space-y-4" data-testid="transcribe-panel">
      <FileDropzone
        onFiles={onDrop}
        accept={{ "video/*": [".mp4", ".webm", ".mov", ".mkv"] }}
        multiple={false}
        inputProps={{ "data-testid": "subtitle-video-input" }}
        className={({ isDragActive }) => `
          h-56 rounded-lg border-2 border-dashed
          flex flex-col items-center justify-center space-y-4 p-8
          cursor-pointer transition-[border-color,background-color] duration-150
          ${
            isDragActive
              ? "border-primary bg-primary/10 scale-[0.99]"
              : "border-muted-foreground hover:border-primary hover:bg-primary/5"
          }
        `}
      >
        {file ? (
          <div className="text-center">
            <VideoIcon className="w-12 h-12 mx-auto mb-3 text-primary" />
            <p className="font-medium break-all" dir="auto">
              {file.name}
            </p>
            <p className="text-sm text-muted-foreground" dir="ltr">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <UploadIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{t("dropHere")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("supportedFormats")}
            </p>
          </div>
        )}
      </FileDropzone>

      {busy && progress && progress.status === "progress" && (
        <div className="space-y-1">
          <Progress value={progress.percent} />
          <p className="text-xs text-muted-foreground">
            {t("loadingModel")} <span dir="ltr">{progress.percent}%</span>
          </p>
        </div>
      )}
      {transcribing && (
        <p className="text-xs text-muted-foreground">{t("longFilesNote")}</p>
      )}

      <div className="flex items-start gap-3 border-t pt-4">
        <InfoIcon className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
        <p className="text-sm text-muted-foreground">{t("modelNote")}</p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={transcribe}
          disabled={!file || busy}
          data-testid="transcribe-button"
        >
          {busy
            ? transcribing
              ? t("transcribing")
              : t("loadingModel")
            : t("transcribe")}
        </Button>
      </div>
    </Card>
  );
}
