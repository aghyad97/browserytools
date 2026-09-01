"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { StatStrip } from "@/components/shared/StatStrip";
import { TwoPane } from "@/components/shared/TwoPane";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  FileVideo,
  Loader2,
  RefreshCw,
  Upload,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { getFFmpeg, terminateFFmpeg } from "@/lib/media/ffmpeg";
import { parseTimeInput } from "@/lib/media/time";
import {
  AUDIO_BITRATES,
  AUDIO_MODES,
  DEFAULT_AUDIO_BITRATE,
  FORMAT_SPECS,
  INPUT_EXTENSIONS,
  OUTPUT_FORMATS,
  QUALITIES,
  RESOLUTIONS,
  buildConvertArgs,
  computeProgressStats,
  fileExtension,
  formatEta,
  formatSpeed,
  isValidTrimRange,
  outputFilename,
  parseDurationLine,
  parseProgressTime,
  targetDuration,
  type AudioMode,
  type OutputFormat,
  type Quality,
  type Resolution,
} from "@/lib/media/video-convert";
import { downloadUrl } from "@/lib/download";
import { formatBytes } from "@/lib/format";

const MAX_FILE_SIZE = 250 * 1024 * 1024;

interface VideoInfo {
  file: File;
  url: string;
  name: string;
  size: number;
}

interface OutputInfo {
  url: string;
  size: number;
  format: OutputFormat;
  filename: string;
}

/** Live numbers for the in-flight run; everything shown is derived from these. */
interface RunState {
  processedSec: number;
  targetSec: number | null;
  elapsedSec: number;
  fallbackRatio: number;
}

const INITIAL_RUN: RunState = {
  processedSec: 0,
  targetSec: null,
  elapsedSec: 0,
  fallbackRatio: 0,
};

/** Thrown when ffmpeg exits non-zero without the worker itself dying. */
class FfmpegExitError extends Error {
  constructor(code: number) {
    super(`ffmpeg exited with code ${code}`);
  }
}

export default function VideoConverter() {
  const t = useTranslations("Tools.VideoConverter");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [video, setVideo] = useState<VideoInfo | null>(null);
  const [inputPreviewFailed, setInputPreviewFailed] = useState(false);
  const [format, setFormat] = useState<OutputFormat>("mp4");
  const [quality, setQuality] = useState<Quality>("medium");
  const [resolution, setResolution] = useState<Resolution>("original");
  const [audioMode, setAudioMode] = useState<AudioMode>("keep");
  const [audioBitrate, setAudioBitrate] = useState<string>(
    DEFAULT_AUDIO_BITRATE,
  );
  const [trimStart, setTrimStart] = useState("");
  const [trimEnd, setTrimEnd] = useState("");
  const [trimError, setTrimError] = useState(false);

  const [converting, setConverting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [run, setRun] = useState<RunState>(INITIAL_RUN);
  const [output, setOutput] = useState<OutputInfo | null>(null);

  const inputUrlRef = useRef<string | null>(null);
  const outputUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Bumped on every file swap and every run start. A progress event or a
  // result from a superseded run checks this before touching state
  // (CompressVideo's activeVideoTokenRef pattern).
  const runTokenRef = useRef(0);
  const cancelRef = useRef(false);
  const startMsRef = useRef(0);

  useEffect(() => {
    return () => {
      if (inputUrlRef.current) URL.revokeObjectURL(inputUrlRef.current);
      if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
    };
  }, []);

  // Elapsed-time tick while a run is live; speed/ETA are derived from it at
  // render time so the readout keeps moving between ffmpeg's stats lines.
  useEffect(() => {
    if (!converting) return;
    const id = window.setInterval(() => {
      setRun((prev) => ({
        ...prev,
        elapsedSec: (performance.now() - startMsRef.current) / 1000,
      }));
    }, 500);
    return () => window.clearInterval(id);
  }, [converting]);

  const clearOutput = useCallback(() => {
    if (outputUrlRef.current) {
      URL.revokeObjectURL(outputUrlRef.current);
      outputUrlRef.current = null;
    }
    setOutput(null);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (file.size > MAX_FILE_SIZE) {
        toast.error(t("videoTooLarge"));
        return;
      }
      if (inputUrlRef.current) URL.revokeObjectURL(inputUrlRef.current);
      clearOutput();
      const url = URL.createObjectURL(file);
      inputUrlRef.current = url;
      runTokenRef.current += 1;
      setVideo({ file, url, name: file.name, size: file.size });
      setInputPreviewFailed(false);
      setRun(INITIAL_RUN);
      setConverting(false);
      setCancelling(false);
      setTrimError(false);
    },
    [clearOutput, t],
  );

  const handleCancel = useCallback(() => {
    if (!converting || cancelling) return;
    cancelRef.current = true;
    setCancelling(true);
    // Kills the worker: the pending exec rejects and the finally block below
    // settles the UI. A fresh engine boots on the next convert.
    terminateFFmpeg();
  }, [converting, cancelling]);

  const handleConvert = useCallback(async () => {
    if (!video || converting) return;

    const start = trimStart.trim() !== "" ? parseTimeInput(trimStart) : null;
    const end = trimEnd.trim() !== "" ? parseTimeInput(trimEnd) : null;
    const startInvalid = trimStart.trim() !== "" && start === null;
    const endInvalid = trimEnd.trim() !== "" && end === null;
    if (startInvalid || endInvalid || !isValidTrimRange(start, end)) {
      setTrimError(true);
      toast.error(t("invalidTrim"));
      return;
    }
    setTrimError(false);

    runTokenRef.current += 1;
    const token = runTokenRef.current;
    const isCurrentRun = () => token === runTokenRef.current;
    cancelRef.current = false;
    setCancelling(false);
    setConverting(true);
    clearOutput();
    startMsRef.current = performance.now();
    setRun({
      ...INITIAL_RUN,
      targetSec: targetDuration(null, start, end),
    });

    const spec = FORMAT_SPECS[format];
    const inputName = `input.${fileExtension(video.name)}`;
    const outputName = `output.${spec.ext}`;

    let ffmpeg: Awaited<ReturnType<typeof getFFmpeg>> | null = null;
    let sourceDuration: number | null = null;

    const onLog = ({ message }: { message: string }) => {
      if (!isCurrentRun()) return;
      if (sourceDuration === null) {
        const d = parseDurationLine(message);
        if (d !== null) {
          sourceDuration = d;
          setRun((prev) => ({
            ...prev,
            targetSec: targetDuration(d, start, end),
          }));
          return;
        }
      }
      const processed = parseProgressTime(message);
      if (processed !== null) {
        setRun((prev) => ({
          ...prev,
          processedSec: Math.max(prev.processedSec, processed),
          elapsedSec: (performance.now() - startMsRef.current) / 1000,
        }));
      }
    };
    const onProgress = ({ progress }: { progress: number }) => {
      if (!isCurrentRun()) return;
      const ratio = Number.isFinite(progress)
        ? Math.max(0, Math.min(1, progress))
        : 0;
      setRun((prev) => ({ ...prev, fallbackRatio: ratio }));
    };

    try {
      try {
        ffmpeg = await getFFmpeg();
      } catch (err) {
        if (!cancelRef.current) {
          console.error(err);
          if (isCurrentRun()) toast.error(t("engineLoadFailed"));
        }
        return;
      }
      // Cancelled while the engine was still booting — terminateFFmpeg()
      // already scheduled this instance's teardown; don't drive it.
      if (cancelRef.current || !isCurrentRun()) return;

      ffmpeg.on("log", onLog);
      ffmpeg.on("progress", onProgress);

      const fileBytes = new Uint8Array(await video.file.arrayBuffer());
      await ffmpeg.writeFile(inputName, fileBytes);

      const args = buildConvertArgs(inputName, outputName, {
        format,
        quality,
        resolution,
        audio: audioMode,
        audioBitrate,
        trimStart: start,
        trimEnd: end,
      });

      console.log("Running ffmpeg with args:", args);
      const code = await ffmpeg.exec(args);
      console.log("ffmpeg exec return code:", code);
      if (typeof code === "number" && code !== 0) {
        throw new FfmpegExitError(code);
      }

      const data = (await ffmpeg.readFile(outputName)) as Uint8Array;
      if (!data || data.length === 0) throw new FfmpegExitError(-1);

      if (!isCurrentRun()) return;

      const bytes = new Uint8Array(data);
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: spec.mime });
      const url = URL.createObjectURL(blob);
      outputUrlRef.current = url;
      setOutput({
        url,
        size: blob.size,
        format,
        filename: outputFilename(video.name, format),
      });
      toast.success(t("convertSuccess"));
    } catch (err) {
      if (cancelRef.current) {
        if (isCurrentRun()) toast.info(t("cancelled"));
      } else {
        console.error(err);
        if (isCurrentRun()) toast.error(t("convertFailed"));
      }
    } finally {
      if (ffmpeg) {
        ffmpeg.off("log", onLog);
        ffmpeg.off("progress", onProgress);
        // After a cancel the worker is gone — nothing to clean up (and every
        // call would just reject).
        if (!cancelRef.current) {
          for (const name of [inputName, outputName]) {
            try {
              await ffmpeg.deleteFile(name);
            } catch {
              // best-effort cleanup
            }
          }
        }
      }
      if (isCurrentRun()) {
        setConverting(false);
        setCancelling(false);
      }
    }
  }, [
    audioBitrate,
    audioMode,
    clearOutput,
    converting,
    format,
    quality,
    resolution,
    t,
    trimEnd,
    trimStart,
    video,
  ]);

  const handleDownload = () => {
    if (!output) return;
    downloadUrl(output.url, output.filename);
    toast.success(t("downloadedSuccess"));
  };

  const spec = FORMAT_SPECS[format];
  const stats = computeProgressStats(run);
  const percent = converting ? stats.percent : output ? 100 : 0;
  const sizeDelta =
    video && output ? Math.round((1 - output.size / video.size) * 100) : null;

  const formatLabel = (f: OutputFormat) =>
    t(`format_${f}` as "format_mp4");

  const outputPreview = () => {
    if (!output) {
      return (
        <div className="text-center">
          <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {converting ? t("convertingPlaceholder") : t("outputPlaceholder")}
          </p>
        </div>
      );
    }
    const preview = FORMAT_SPECS[output.format].preview;
    if (preview === "video") {
      return (
        <video
          src={output.url}
          controls
          className="w-full h-full object-contain"
        />
      );
    }
    if (preview === "image") {
      return (
        <img
          src={output.url}
          alt={output.filename}
          className="w-full h-full object-contain"
        />
      );
    }
    return (
      <div className="text-center px-4">
        <FileVideo className="w-12 h-12 mx-auto mb-4 text-primary" />
        <p className="font-medium truncate">{output.filename}</p>
        <p className="text-sm text-muted-foreground">
          {t("previewUnavailable")}
        </p>
      </div>
    );
  };

  return (
    <ToolShell
      slug="video-converter"
      title={tc("tools.video-converter.name")}
      sub={tc("tools.video-converter.description")}
      primaryAction={{
        label: converting ? t("cancel") : t("convert"),
        onClick: converting ? handleCancel : handleConvert,
        disabled: converting ? cancelling : !video,
      }}
    >
      <TwoPane
        start={
          <div className="space-y-4">
            {video && (
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
                <FileVideo className="w-8 h-8 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{video.name}</p>
                  <p className="text-sm text-muted-foreground" dir="ltr">
                    {formatBytes(video.size)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={converting}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <RefreshCw className="w-4 h-4 me-1" />
                  {t("change")}
                </Button>
              </div>
            )}

            <Card className="p-6 shadow-none">
              {video ? (
                <div className="w-full h-64 relative flex items-center justify-center">
                  {inputPreviewFailed ? (
                    <div className="text-center px-4">
                      <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {t("inputPreviewUnavailable")}
                      </p>
                    </div>
                  ) : (
                    <video
                      src={video.url}
                      controls
                      className="w-full h-full object-contain"
                      onError={() => setInputPreviewFailed(true)}
                    />
                  )}
                </div>
              ) : (
                <FileDropzone
                  onFiles={onDrop}
                  accept={{
                    "video/*": [".mp4", ".mov", ".webm", ".mkv", ".avi", ".m4v", ".flv", ".wmv", ".ts"],
                  }}
                  multiple={false}
                  className={({ isDragActive }) => `
                    h-64 rounded-lg border-2 border-dashed
                    flex flex-col items-center justify-center space-y-4 p-8
                    cursor-pointer transition-[border-color,background-color] duration-150
                    ${
                      isDragActive
                        ? "border-primary bg-primary/10 scale-[0.99]"
                        : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      {t("dropVideoHere")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("supportedFormats")}
                    </p>
                  </div>
                </FileDropzone>
              )}
            </Card>
            <input
              ref={fileInputRef}
              type="file"
              accept={INPUT_EXTENSIONS.join(",")}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onDrop([file]);
                e.target.value = "";
              }}
            />

            <SettingsCard title={t("settings")}>
              <OptionRow label={t("outputFormat")} htmlFor="vc-format">
                <Select
                  value={format}
                  onValueChange={(v) => setFormat(v as OutputFormat)}
                  disabled={converting}
                >
                  <SelectTrigger id="vc-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OUTPUT_FORMATS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {formatLabel(f)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </OptionRow>

              <OptionRow label={t("quality")} htmlFor="vc-quality">
                <Select
                  value={quality}
                  onValueChange={(v) => setQuality(v as Quality)}
                  disabled={converting}
                >
                  <SelectTrigger id="vc-quality">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALITIES.map((q) => (
                      <SelectItem key={q} value={q}>
                        {t(`quality_${q}` as "quality_high")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </OptionRow>

              <OptionRow label={t("resolution")} htmlFor="vc-resolution">
                <Select
                  value={resolution}
                  onValueChange={(v) => setResolution(v as Resolution)}
                  disabled={converting}
                >
                  <SelectTrigger id="vc-resolution">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOLUTIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r === "original" ? t("resolutionOriginal") : r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </OptionRow>

              <OptionRow
                label={t("audio")}
                htmlFor="vc-audio"
                hint={spec.hasAudio ? undefined : t("gifNoAudio")}
              >
                <Select
                  value={audioMode}
                  onValueChange={(v) => setAudioMode(v as AudioMode)}
                  disabled={converting || !spec.hasAudio}
                >
                  <SelectTrigger id="vc-audio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIO_MODES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {t(`audio_${m}` as "audio_keep")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </OptionRow>

              {spec.hasAudio && audioMode === "bitrate" && (
                <OptionRow label={t("bitrate")} htmlFor="vc-audio-bitrate">
                  <Select
                    value={audioBitrate}
                    onValueChange={setAudioBitrate}
                    disabled={converting}
                  >
                    <SelectTrigger id="vc-audio-bitrate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIO_BITRATES.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </OptionRow>
              )}

              <div className="grid grid-cols-2 gap-2">
                <OptionRow label={t("trimStart")} htmlFor="vc-trim-start">
                  <Input
                    id="vc-trim-start"
                    dir="ltr"
                    value={trimStart}
                    placeholder={t("trimPlaceholder")}
                    disabled={converting}
                    aria-invalid={trimError || undefined}
                    onChange={(e) => {
                      setTrimStart(e.target.value);
                      setTrimError(false);
                    }}
                  />
                </OptionRow>
                <OptionRow label={t("trimEnd")} htmlFor="vc-trim-end">
                  <Input
                    id="vc-trim-end"
                    dir="ltr"
                    value={trimEnd}
                    placeholder={t("trimPlaceholder")}
                    disabled={converting}
                    aria-invalid={trimError || undefined}
                    onChange={(e) => {
                      setTrimEnd(e.target.value);
                      setTrimError(false);
                    }}
                  />
                </OptionRow>
              </div>
              <p
                className={`text-xs -mt-2 ${trimError ? "text-destructive" : "text-muted-foreground"}`}
              >
                {trimError ? t("invalidTrim") : t("trimHint")}
              </p>

              <Button
                onClick={converting ? handleCancel : handleConvert}
                className="w-full mt-4"
                disabled={converting ? cancelling : !video}
              >
                {converting && (
                  <Loader2 className="w-4 h-4 me-2 animate-spin" />
                )}
                {converting
                  ? cancelling
                    ? t("cancelling")
                    : t("cancel")
                  : t("convert")}
              </Button>
            </SettingsCard>
          </div>
        }
        end={
          <div className="space-y-4">
            <Card className="p-6">
              <div className="h-64 rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center overflow-hidden">
                {outputPreview()}
              </div>
            </Card>

            {converting && (
              <div className="space-y-3" data-testid="vc-progress">
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="flex-1">
                    {cancelling ? t("cancelling") : t("converting")}
                  </span>
                  <span dir="ltr" className="tabular-nums">
                    {percent}%
                  </span>
                </div>
                <Progress value={percent} />
                <StatStrip
                  items={[
                    {
                      label: t("speed"),
                      value: (
                        <span dir="ltr">
                          {stats.speed !== null
                            ? formatSpeed(stats.speed)
                            : "—"}
                        </span>
                      ),
                    },
                    {
                      label: t("eta"),
                      value: (
                        <span dir="ltr">
                          {stats.etaSec !== null
                            ? formatEta(stats.etaSec)
                            : t("calculating")}
                        </span>
                      ),
                    },
                    {
                      label: t("elapsed"),
                      value: <span dir="ltr">{formatEta(run.elapsedSec)}</span>,
                    },
                  ]}
                />
              </div>
            )}

            {output && video && (
              <StatStrip
                items={[
                  {
                    label: t("originalSize"),
                    value: <span dir="ltr">{formatBytes(video.size)}</span>,
                  },
                  {
                    label: t("outputSize"),
                    value: <span dir="ltr">{formatBytes(output.size)}</span>,
                  },
                  ...(sizeDelta !== null
                    ? [
                        {
                          label: t("sizeChange"),
                          value: (
                            <span dir="ltr">
                              {sizeDelta >= 0 ? `-${sizeDelta}%` : `+${-sizeDelta}%`}
                            </span>
                          ),
                        },
                      ]
                    : []),
                ]}
              />
            )}

            <Button
              onClick={handleDownload}
              className="w-full"
              disabled={!output}
              variant="secondary"
            >
              <Download className="w-4 h-4 me-2" />
              {tCommon("download")}
            </Button>
          </div>
        }
      />
    </ToolShell>
  );
}
