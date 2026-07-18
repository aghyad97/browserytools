"use client";

// Step 5 (final) of Subtitle Studio: export. Two independent paths —
// instant SRT/VTT sidecar downloads (no re-encoding, always available once
// there's a doc), and an in-browser MP4 burn-in gated by envelopeStatus
// (see @/lib/subtitles/burn for the envelope thresholds). `duration` MUST be
// the video's true duration (not the last cue's end) — see SubtitleStudio's
// duration threading — because burnMp4 uses `-shortest` and would otherwise
// truncate the output to the caption track's length.

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { DownloadIcon, FilmIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { buildSrt, buildVtt, type CueDoc } from "@/lib/subtitles/cues";
import { toAss } from "@/lib/subtitles/ass";
import { burnMp4, envelopeStatus } from "@/lib/subtitles/burn";
import { downloadBlob, downloadText } from "@/lib/download";
import type { CaptionStyle } from "@/lib/subtitles/styles";

export interface ExportPanelProps {
  file: File;
  doc: CueDoc;
  style: CaptionStyle;
  dims: { w: number; h: number };
  duration: number;
}

// Strips the extension from the video's filename for sidecar/output names;
// falls back to "subtitles" when the name is empty or is only an extension
// (e.g. a file named ".mp4").
function baseName(fileName: string): string {
  const stripped = fileName.replace(/\.[^./\\]+$/, "");
  return stripped.trim().length > 0 ? stripped : "subtitles";
}

export function ExportPanel({ file, doc, style, dims, duration }: ExportPanelProps) {
  const t = useTranslations("Tools.SubtitleStudio");
  const [burning, setBurning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const base = baseName(file.name);
  const status = envelopeStatus(duration, dims.h);
  const hasDoc = doc.length > 0;

  const handleSrt = () => {
    downloadText(buildSrt(doc), `${base}.srt`);
  };

  const handleVtt = () => {
    downloadText(buildVtt(doc), `${base}.vtt`);
  };

  const handleBurn = async () => {
    if (status === "blocked" || burning) return;
    setError(null);
    setBurning(true);
    setProgress(0);
    try {
      const ass = toAss(doc, style, dims);
      const blob = await burnMp4({
        videoFile: file,
        ass,
        dims,
        duration,
        onProgress: setProgress,
      });
      downloadBlob(blob, `${base}.mp4`);
      toast.success(t("burnComplete"));
    } catch (err) {
      console.error(err);
      setError(t("burnFailed"));
      toast.error(t("burnFailed"));
    } finally {
      setBurning(false);
      setProgress(0);
    }
  };

  return (
    <SettingsCard
      title={t("exportTitle")}
      description={t("exportDescription")}
      data-testid="export-panel"
    >
      <OptionRow label={t("exportSidecarLabel")} hint={t("exportSidecarHint")}>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSrt}
            disabled={!hasDoc}
            data-testid="export-srt"
          >
            <DownloadIcon className="h-4 w-4" />
            {t("exportSrtButton")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleVtt}
            disabled={!hasDoc}
            data-testid="export-vtt"
          >
            <DownloadIcon className="h-4 w-4" />
            {t("exportVttButton")}
          </Button>
        </div>
      </OptionRow>

      <OptionRow label={t("exportMp4Label")}>
        <div className="w-full space-y-2">
          <div
            className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground"
            role="note"
          >
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p>{t("exportMp4Note")}</p>
          </div>

          {status === "warn" && (
            <div
              className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground"
              role="note"
              data-testid="export-warn-banner"
            >
              <TriangleAlertIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <p>{t("exportWarnMessage")}</p>
            </div>
          )}

          {status === "blocked" && (
            <div
              className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground"
              role="note"
              data-testid="export-blocked-message"
            >
              <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <p>{t("exportBlockedMessage")}</p>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive" data-testid="export-error">
              {error}
            </p>
          )}

          {burning && (
            <div className="space-y-1">
              <Progress
                value={progress}
                aria-label={t("exportProgressLabel")}
                data-testid="export-progress"
              />
              <p className="text-xs text-muted-foreground" dir="ltr">
                {progress}%
              </p>
            </div>
          )}

          <Button
            type="button"
            onClick={handleBurn}
            disabled={status === "blocked" || burning || !hasDoc}
            data-testid="export-mp4"
          >
            <FilmIcon className="h-4 w-4" />
            {burning ? t("burning") : t("exportMp4Button")}
          </Button>
        </div>
      </OptionRow>
    </SettingsCard>
  );
}
