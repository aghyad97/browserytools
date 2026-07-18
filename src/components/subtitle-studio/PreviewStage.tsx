"use client";

// Step 4 of Subtitle Studio: the live preview — a real <video> with the
// SAME JASSUB renderer used by the burn pipeline overlaid on top, so what
// plays here is (by construction, see ass.ts) what gets burned into the
// exported file. Owns the JASSUB handle's lifecycle: one mountPreview() per
// `file`, and setAss() (never a remount) whenever `doc` or `style` changes —
// remounting on every edit would leak a JASSUB worker per keystroke.
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { PlayIcon, PauseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mountPreview, type JassubHandle } from "@/lib/subtitles/jassub";
import { toAss } from "@/lib/subtitles/ass";
import type { CueDoc } from "@/lib/subtitles/cues";
import type { CaptionStyle } from "@/lib/subtitles/styles";

export interface PreviewStageProps {
  file: File;
  doc: CueDoc;
  style: CaptionStyle;
  dims: { w: number; h: number };
}

function formatTime(seconds: number): string {
  const total = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const mins = Math.floor(total / 60);
  const secs = Math.floor(total % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function PreviewStage({ file, doc, style, dims }: PreviewStageProps) {
  const t = useTranslations("Tools.SubtitleStudio");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<JassubHandle | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Computed synchronously during render (not in an effect) so the <video>
  // below always has a valid `src` on the very first paint for a given
  // `file` — an effect-based version would need an extra render round-trip
  // before the mount effect below could see it, which also risks racing
  // against a same-string-back mock in tests.
  const objectUrl = useMemo(() => URL.createObjectURL(file), [file]);

  // Revokes the PREVIOUS render's object URL whenever `file` changes, and on
  // unmount.
  useEffect(() => {
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  // Resets playback state whenever `file` changes (including the initial
  // mount, where it's a no-op against the defaults above).
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [file]);

  // Mounts JASSUB the first time video+canvas exist for this `file`
  // (handleRef.current is null right after the destroy effect below tears
  // the previous instance down), then re-feeds the SAME handle via setAss()
  // on every later doc/style change for that same file — never a remount
  // (a remount per keystroke would leak a JASSUB worker every time).
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ass = toAss(doc, style, dims);
    if (!handleRef.current) {
      handleRef.current = mountPreview(video, canvas, ass);
    } else {
      handleRef.current.setAss(ass);
    }
  }, [file, doc, style, dims]);

  // Tears the handle down whenever `file` changes, or on unmount —
  // deliberately keyed on `file` alone (not doc/style) so an edit never
  // triggers a destroy+remount, only this effect's dependency does.
  useEffect(() => {
    return () => {
      handleRef.current?.destroy();
      handleRef.current = null;
    };
  }, [file]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      void video.play();
    }
  };

  const handleSeek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <div className="space-y-2" data-testid="preview-stage">
      <div className="relative w-full overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          src={objectUrl}
          className="block w-full"
          data-testid="preview-video"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          data-testid="preview-canvas"
          aria-hidden
        />
      </div>

      <div className="flex items-center gap-2" dir="ltr">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          data-testid="preview-play-pause"
          aria-label={isPlaying ? t("pause") : t("play")}
          onClick={handlePlayPause}
        >
          {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
        </Button>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          data-testid="preview-seek"
          aria-label={t("seekLabel")}
          className="h-2 flex-1 accent-primary"
          onChange={(e) => handleSeek(Number(e.target.value))}
        />

        <span
          className="w-24 shrink-0 text-right text-xs text-muted-foreground"
          data-testid="preview-time"
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
