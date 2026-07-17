"use client";

import { useCallback, useState } from "react";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  UploadIcon,
  AudioLinesIcon,
  DownloadIcon,
  InfoIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { downloadText } from "@/lib/download";
import { getPipeline, type LoadProgress } from "@/lib/hf-pipeline";
import { decodeToMono16k } from "@/lib/media/decode-audio";
import { srtTime, buildSrt, buildVtt, type CueDoc } from "@/lib/subtitles/cues";

const MODEL = "Xenova/whisper-base";

// A timestamped segment as returned by Whisper's return_timestamps.
type Chunk = { timestamp: [number, number | null]; text: string };

// The ASR pipeline call signature we rely on (subset of Transformers.js).
type Transcriber = (
  audio: Float32Array,
  options: Record<string, unknown>
) => Promise<{ text: string; chunks?: Chunk[] }>;

// Adapt Whisper's Chunk[] into the shared CueDoc shape expected by the
// SRT/VTT builders in @/lib/subtitles/cues.
function chunksToCueDoc(chunks: Chunk[]): CueDoc {
  return chunks.map((c, i) => ({
    id: String(i),
    start: c.timestamp[0] ?? 0,
    end: c.timestamp[1] ?? c.timestamp[0] ?? 0,
    text: c.text,
  }));
}

export default function AudioTranscriber() {
  const t = useTranslations("Tools.AudioTranscriber");
  const tc = useTranslations("ToolsConfig");

  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [text, setText] = useState("");
  const [chunks, setChunks] = useState<Chunk[]>([]);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setText("");
    setChunks([]);
  }, []);

  const transcribe = useCallback(async () => {
    if (!file) {
      toast.error(t("noFile"));
      return;
    }
    setBusy(true);
    setTranscribing(false);
    setText("");
    setChunks([]);
    try {
      const audio = await decodeToMono16k(file);

      const transcriber = await getPipeline<Transcriber>(
        "automatic-speech-recognition",
        MODEL,
        { device: "auto", onProgress: setProgress }
      );

      setTranscribing(true);
      const out = await transcriber(audio, {
        return_timestamps: true,
        chunk_length_s: 30,
        stride_length_s: 5,
      });

      setText((out.text ?? "").trim());
      setChunks(Array.isArray(out.chunks) ? out.chunks : []);
      toast.success(t("done"));
    } catch (err) {
      console.error(err);
      toast.error(t("failed"));
    } finally {
      setBusy(false);
      setTranscribing(false);
      setProgress(null);
    }
  }, [file, t]);

  const baseName = file ? file.name.replace(/\.[^.]+$/, "") : "transcript";

  const download = useCallback(
    (content: string, ext: string, mime: string) => {
      downloadText(content, `${baseName}.${ext}`, mime);
      toast.success(t("downloaded"));
    },
    [baseName, t]
  );

  const hasChunks = chunks.length > 0;

  return (
    <ToolShell
      slug="audio-transcriber"
      title={tc("tools.audio-transcriber.name")}
      sub={tc("tools.audio-transcriber.description")}
      primaryAction={{
        label: busy
          ? transcribing
            ? t("transcribing")
            : t("loadingModel")
          : t("transcribe"),
        onClick: transcribe,
        disabled: !file || busy,
      }}
    >
      <div className="space-y-4">
        <Card className="p-6 shadow-none">
          <FileDropzone
            onFiles={onDrop}
            accept={{
              "audio/*": [".mp3", ".wav", ".m4a", ".ogg"],
              "video/*": [".mp4", ".webm"],
            }}
            multiple={false}
            inputProps={{ "data-testid": "audio-input" }}
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
                <AudioLinesIcon className="w-12 h-12 mx-auto mb-3 text-primary" />
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
                <h3 className="text-lg font-semibold mb-1">
                  {t("dropHere")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("supportedFormats")}
                </p>
              </div>
            )}
          </FileDropzone>

          {busy && progress && progress.status === "progress" && (
            <div className="space-y-1 mt-3">
              <Progress value={progress.percent} />
              <p className="text-xs text-muted-foreground">
                {t("loadingModel")}{" "}
                <span dir="ltr">{progress.percent}%</span>
              </p>
            </div>
          )}
          {transcribing && (
            <p className="text-xs text-muted-foreground mt-3">
              {t("longFilesNote")}
            </p>
          )}
        </Card>

        {text && (
          <Card className="p-4 space-y-3" data-testid="transcript-result">
            <OutputPanel
              text={text}
              title={t("transcriptLabel")}
              copyLabel={t("copyText")}
              copySuccessMessage={t("copied")}
              copyErrorMessage={t("copyFailed")}
            >
              <Textarea
                id="at-transcript"
                dir="auto"
                className="min-h-[180px] rounded-none border-0 bg-transparent focus-visible:ring-0"
                value={text}
                readOnly
              />
            </OutputPanel>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => download(text, "txt", "text/plain")}
              >
                <DownloadIcon className="h-4 w-4 me-2" />
                {t("downloadTxt")}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={!hasChunks}
                onClick={() =>
                  download(buildSrt(chunksToCueDoc(chunks)), "srt", "text/plain")
                }
              >
                <DownloadIcon className="h-4 w-4 me-2" />
                {t("downloadSrt")}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={!hasChunks}
                onClick={() =>
                  download(buildVtt(chunksToCueDoc(chunks)), "vtt", "text/vtt")
                }
              >
                <DownloadIcon className="h-4 w-4 me-2" />
                {t("downloadVtt")}
              </Button>
              <CopyButton
                text={hasChunks ? buildSrt(chunksToCueDoc(chunks)) : ""}
                label={t("copySrt")}
                successMessage={t("copied")}
                errorMessage={t("copyFailed")}
                disabled={!hasChunks}
              />
            </div>

            {hasChunks && (
              <div className="space-y-1 border-t pt-3">
                {chunks.map((c, i) => (
                  <div
                    key={i}
                    className="flex gap-3 text-sm"
                    data-testid="transcript-chunk"
                  >
                    <span
                      className="text-muted-foreground tabular-nums shrink-0"
                      dir="ltr"
                    >
                      {srtTime(c.timestamp[0] ?? 0)}
                    </span>
                    <span dir="auto">{c.text.trim()}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <InfoIcon className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
            <p className="text-sm text-muted-foreground">{t("modelNote")}</p>
          </div>
        </Card>
      </div>
    </ToolShell>
  );
}
