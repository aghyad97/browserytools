"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { SliderRow } from "@/components/shared/SliderRow";
import { StatStrip } from "@/components/shared/StatStrip";
import { downloadUrl } from "@/lib/download";
import { formatBytes } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Download, Video, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getFFmpeg } from "@/lib/media/ffmpeg";

interface VideoInfo {
  file: File;
  url: string;
  size: number;
  name: string;
}

const presetOptions = [
  "ultrafast",
  "superfast",
  "veryfast",
  "faster",
  "fast",
  "medium",
  "slow",
] as const;

const resolutionOptions = [
  { value: "original", scale: "" },
  { value: "1080p", scale: "scale=-2:1080" },
  { value: "720p", scale: "scale=-2:720" },
  { value: "480p", scale: "scale=-2:480" },
] as const;

export default function CompressVideo() {
  const t = useTranslations("Tools.CompressVideo");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [video, setVideo] = useState<VideoInfo | null>(null);
  const [crf, setCrf] = useState(28);
  const [preset, setPreset] = useState<string>("veryfast");
  const [resolution, setResolution] = useState<string>("original");
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);

  const inputUrlRef = useRef<string | null>(null);
  const outputUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (inputUrlRef.current) URL.revokeObjectURL(inputUrlRef.current);
      if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
    };
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (file.size > 500 * 1024 * 1024) {
        toast.error(t("videoTooLarge"));
        return;
      }
      if (inputUrlRef.current) URL.revokeObjectURL(inputUrlRef.current);
      if (outputUrlRef.current) {
        URL.revokeObjectURL(outputUrlRef.current);
        outputUrlRef.current = null;
      }
      const url = URL.createObjectURL(file);
      inputUrlRef.current = url;
      setVideo({ file, url, size: file.size, name: file.name });
      setOutputUrl(null);
      setOutputSize(0);
      setProgress(0);
    },
    [t]
  );

  const handleCompress = async () => {
    if (!video || isCompressing) return;
    setIsCompressing(true);
    setProgress(0);
    if (outputUrlRef.current) {
      URL.revokeObjectURL(outputUrlRef.current);
      outputUrlRef.current = null;
    }
    setOutputUrl(null);

    let ffmpeg: import("@ffmpeg/ffmpeg").FFmpeg | null = null;
    const onProgress = ({ progress: p }: { progress: number }) => {
      setProgress(Math.min(100, Math.max(0, Math.round(p * 100))));
    };

    try {
      const { fetchFile } = await import("@ffmpeg/util");
      ffmpeg = await getFFmpeg();
      ffmpeg.on("progress", onProgress);

      const inputName = "input";
      const outputName = "output.mp4";
      await ffmpeg.writeFile(inputName, await fetchFile(video.file));

      const scale = resolutionOptions.find(
        (r) => r.value === resolution
      )?.scale;
      const args = [
        "-i",
        inputName,
        "-c:v",
        "libx264",
        "-crf",
        String(crf),
        "-preset",
        preset,
        ...(scale ? ["-vf", scale] : []),
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        outputName,
      ];

      await ffmpeg.exec(args);
      const data = (await ffmpeg.readFile(outputName)) as Uint8Array;

      const bytes = new Uint8Array(data);
      const blob = new Blob([bytes.buffer as ArrayBuffer], {
        type: "video/mp4",
      });
      const url = URL.createObjectURL(blob);
      outputUrlRef.current = url;
      setOutputUrl(url);
      setOutputSize(blob.size);
      setProgress(100);
      toast.success(t("compressedSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("compressFailed"));
    } finally {
      // Detach the per-run progress listener so repeat compressions on the
      // now-shared singleton don't stack subscriptions.
      ffmpeg?.off("progress", onProgress);
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!outputUrl || !video) return;
    const base = video.name.replace(/\.[^.]+$/, "");
    downloadUrl(outputUrl, `${base}_compressed.mp4`);
    toast.success(t("downloadedSuccess"));
  };

  const savings =
    video && outputSize > 0
      ? Math.round((1 - outputSize / video.size) * 100)
      : null;

  return (
    <ToolShell
      slug="compress-video"
      title={tc("tools.compress-video.name")}
      sub={tc("tools.compress-video.description")}
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card className="p-6 shadow-none">
              <FileDropzone
                onFiles={onDrop}
                accept={{
                  "video/*": [".mp4", ".mov", ".webm", ".mkv", ".avi", ".m4v"],
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
                {video ? (
                  <div className="w-full h-full relative">
                    <video
                      src={video.url}
                      controls
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-0 start-0 end-0 bg-black/50 text-white p-2 text-sm flex justify-between">
                      <span className="truncate">{video.name}</span>
                      <span dir="ltr">{formatBytes(video.size)}</span>
                    </div>
                  </div>
                ) : (
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
                )}
              </FileDropzone>
            </Card>

            <SettingsCard>
              <SliderRow
                label={t("quality")}
                value={crf}
                min={18}
                max={35}
                step={1}
                onChange={setCrf}
                disabled={isCompressing}
                display={<span dir="ltr">{t("crf")} {crf}</span>}
              />
              <p className="text-xs text-muted-foreground -mt-2">{t("crfHint")}</p>

              <OptionRow label={t("preset")} htmlFor="cv-preset">
                <Select
                  value={preset}
                  onValueChange={setPreset}
                  disabled={isCompressing}
                >
                  <SelectTrigger id="cv-preset">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {presetOptions.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </OptionRow>

              <OptionRow label={t("resolution")} htmlFor="cv-resolution">
                <Select
                  value={resolution}
                  onValueChange={setResolution}
                  disabled={isCompressing}
                >
                  <SelectTrigger id="cv-resolution">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {resolutionOptions.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.value === "original"
                          ? t("resolutionOriginal")
                          : r.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </OptionRow>

              <Button
                onClick={handleCompress}
                className="w-full"
                disabled={!video || isCompressing}
              >
                {isCompressing && (
                  <Loader2 className="w-4 h-4 me-2 animate-spin" />
                )}
                {isCompressing ? t("compressing") : t("compress")}
              </Button>

              {isCompressing && (
                <div className="space-y-1">
                  <Progress value={progress} />
                  <p
                    className="text-xs text-muted-foreground text-end"
                    dir="ltr"
                  >
                    {progress}%
                  </p>
                </div>
              )}
            </SettingsCard>
          </div>

          <div className="space-y-4">
            <Card className="p-6">
              <div className="h-64 rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center overflow-hidden">
                {outputUrl ? (
                  <video
                    src={outputUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {t("outputPlaceholder")}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {outputUrl && (
              <StatStrip
                items={[
                  { label: t("originalSize"), value: <span dir="ltr">{formatBytes(video?.size ?? 0)}</span> },
                  { label: t("compressedSize"), value: <span dir="ltr">{formatBytes(outputSize)}</span> },
                  ...(savings !== null
                    ? [{ label: t("savings"), value: <span dir="ltr">{savings}%</span> }]
                    : []),
                ]}
              />
            )}

            <Button
              onClick={handleDownload}
              className="w-full"
              disabled={!outputUrl}
              variant="secondary"
            >
              <Download className="w-4 h-4 me-2" />
              {tCommon("download")}
            </Button>
          </div>
        </div>
    </ToolShell>
  );
}
