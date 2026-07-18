"use client";

// The Subtitle Studio tool shell. Owns the top-level state shared across the
// whole flow — the loaded video File, its intrinsic dimensions, the CueDoc
// produced by transcription, and the current CaptionStyle — and hosts each
// step's panel. Today that's just the Transcribe step; the cue editor, style
// panel, live preview, and export panel arrive in later tasks and will read
// from / write back to this same state.

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolShell } from "@/components/template/tool-shell";
import { TranscribePanel } from "@/components/subtitle-studio/TranscribePanel";
import { PRESETS, type CaptionStyle } from "@/lib/subtitles/styles";
import type { CueDoc } from "@/lib/subtitles/cues";

const DEFAULT_PRESET = "tiktok-bold";

export default function SubtitleStudio() {
  const t = useTranslations("Tools.SubtitleStudio");
  const tc = useTranslations("ToolsConfig");

  const [file, setFile] = useState<File | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [doc, setDoc] = useState<CueDoc>([]);
  // Stub for now — the style panel (a later task) will let the user pick a
  // different preset and tweak it; this seeds a sensible default.
  const [style, setStyle] = useState<CaptionStyle>(PRESETS[DEFAULT_PRESET]);

  const handleTranscribed = useCallback(
    (newDoc: CueDoc, newFile: File, newDims: { w: number; h: number }) => {
      setDoc(newDoc);
      setFile(newFile);
      setDims(newDims);
    },
    []
  );

  const reset = useCallback(() => {
    setDoc([]);
    setFile(null);
    setDims(null);
    setStyle(PRESETS[DEFAULT_PRESET]);
  }, []);

  const hasDoc = doc.length > 0 && file !== null && dims !== null;

  return (
    <ToolShell
      slug="subtitle-studio"
      title={tc("tools.subtitle-studio.name")}
      sub={tc("tools.subtitle-studio.description")}
    >
      <div className="space-y-4" data-testid="subtitle-studio">
        {!hasDoc && <TranscribePanel onTranscribed={handleTranscribed} />}

        {hasDoc && (
          <Card
            className="p-6 space-y-3"
            data-testid="subtitle-studio-transcribed"
          >
            <p className="font-medium" dir="auto">
              {file?.name}
            </p>
            <p
              className="text-sm text-muted-foreground"
              data-testid="subtitle-studio-cue-count"
            >
              {t("cuesGenerated", { count: doc.length })}
            </p>
            <p className="text-xs text-muted-foreground" dir="ltr">
              {dims?.w}×{dims?.h}
            </p>
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={reset}>
                {t("startOver")}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </ToolShell>
  );
}
