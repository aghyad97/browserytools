"use client";

// The Subtitle Studio tool shell. Owns the top-level state shared across the
// whole flow — the loaded video File, its intrinsic dimensions, its true
// duration, the CueDoc produced by transcription, and the current
// CaptionStyle — and composes every step's panel once a transcript exists:
// live preview + style panel side by side, the cue editor below, and export
// at the bottom.
//
// `duration` is threaded through (not derived from the transcript) because
// the export step's MP4 burn uses ffmpeg's `-shortest`: a duration shorter
// than the real video would silently truncate the burned-in output. See
// TranscribePanel's readVideoDims, which reads it from the offscreen
// <video>'s `loadedmetadata` event.

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ToolShell } from "@/components/template/tool-shell";
import { TranscribePanel } from "@/components/subtitle-studio/TranscribePanel";
import { CueEditor } from "@/components/subtitle-studio/CueEditor";
import { StylePanel } from "@/components/subtitle-studio/StylePanel";
import { PreviewStage } from "@/components/subtitle-studio/PreviewStage";
import { ExportPanel } from "@/components/subtitle-studio/ExportPanel";
import { PRESETS, type CaptionStyle } from "@/lib/subtitles/styles";
import type { CueDoc } from "@/lib/subtitles/cues";

const DEFAULT_PRESET = "tiktok-bold";

export default function SubtitleStudio() {
  const t = useTranslations("Tools.SubtitleStudio");
  const tc = useTranslations("ToolsConfig");

  const [file, setFile] = useState<File | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [doc, setDoc] = useState<CueDoc>([]);
  const [style, setStyle] = useState<CaptionStyle>(PRESETS[DEFAULT_PRESET]);

  const handleTranscribed = useCallback(
    (
      newDoc: CueDoc,
      newFile: File,
      newDims: { w: number; h: number },
      newDuration: number
    ) => {
      setDoc(newDoc);
      setFile(newFile);
      setDims(newDims);
      setDuration(newDuration);
    },
    []
  );

  const reset = useCallback(() => {
    setDoc([]);
    setFile(null);
    setDims(null);
    setDuration(0);
    setStyle(PRESETS[DEFAULT_PRESET]);
  }, []);

  // Click-to-seek / split-at-playhead between the preview and the cue editor
  // is deferred (see task report): PreviewStage's object-URL and JASSUB
  // effects were just made StrictMode-safe under review and aren't touched
  // here. CueEditor's `onSeek` is wired to a no-op-safe handler and
  // `currentTime` is left undefined, which falls back to each cue's
  // midpoint for "split".
  const handleSeek = useCallback((_time: number) => {}, []);

  const hasDoc = doc.length > 0 && file !== null && dims !== null;

  return (
    <ToolShell
      slug="subtitle-studio"
      title={tc("tools.subtitle-studio.name")}
      sub={tc("tools.subtitle-studio.description")}
    >
      <div className="space-y-4" data-testid="subtitle-studio">
        {!hasDoc && <TranscribePanel onTranscribed={handleTranscribed} />}

        {hasDoc && file && dims && (
          <div className="space-y-4" data-testid="subtitle-studio-editor">
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={reset}>
                {t("startOver")}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
              <PreviewStage file={file} doc={doc} style={style} dims={dims} />
              <StylePanel value={style} onChange={setStyle} />
            </div>

            <CueEditor doc={doc} onChange={setDoc} onSeek={handleSeek} />

            <ExportPanel
              file={file}
              doc={doc}
              style={style}
              dims={dims}
              duration={duration}
            />
          </div>
        )}
      </div>
    </ToolShell>
  );
}
