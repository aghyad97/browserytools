"use client";

// Step 2 of Subtitle Studio: the per-cue editing table. Lets the user fix up
// text and timing after transcription — edit a cue's text, nudge its start/
// end, split it at the playhead, or merge it into the next cue. All the
// actual editing logic lives in the pure ops in `@/lib/subtitles/cues`; this
// component only wires UI events to those ops and reports the resulting doc
// via onChange.

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PlayIcon, ScissorsIcon, CombineIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { splitCue, mergeCues, retime, type Cue, type CueDoc } from "@/lib/subtitles/cues";

export interface CueEditorProps {
  doc: CueDoc;
  onChange: (doc: CueDoc) => void;
  onSeek: (time: number) => void;
  /**
   * Current video playhead position in seconds, used by "split at playhead".
   * Optional because the cue editor can be used before a preview player is
   * wired up (a later task) — falls back to the cue's midpoint when absent
   * or outside the cue's span.
   */
  currentTime?: number;
}

export function CueEditor({ doc, onChange, onSeek, currentTime }: CueEditorProps) {
  const t = useTranslations("Tools.SubtitleStudio");

  const handleTextCommit = useCallback(
    (id: string, text: string) => {
      onChange(doc.map((c) => (c.id === id ? { ...c, text } : c)));
    },
    [doc, onChange]
  );

  const handleRetime = useCallback(
    (id: string, changes: { start?: number; end?: number }) => {
      onChange(retime(doc, id, changes));
    },
    [doc, onChange]
  );

  const handleSplit = useCallback(
    (cue: Cue) => {
      const atTime =
        currentTime !== undefined && currentTime > cue.start && currentTime < cue.end
          ? currentTime
          : (cue.start + cue.end) / 2;
      onChange(splitCue(doc, cue.id, atTime));
    },
    [doc, onChange, currentTime]
  );

  const handleMergeNext = useCallback(
    (id: string, nextId: string) => {
      onChange(mergeCues(doc, id, nextId));
    },
    [doc, onChange]
  );

  if (doc.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="cue-editor-empty">
        {t("noCues")}
      </p>
    );
  }

  return (
    <div className="space-y-2" data-testid="cue-editor">
      {doc.map((cue, index) => {
        const next = doc[index + 1];
        return (
          <CueRow
            key={cue.id}
            cue={cue}
            nextId={next?.id}
            onTextCommit={handleTextCommit}
            onRetime={handleRetime}
            onSplit={handleSplit}
            onMergeNext={handleMergeNext}
            onSeek={onSeek}
          />
        );
      })}
    </div>
  );
}

interface CueRowProps {
  cue: Cue;
  /** Adjacent next cue's id, undefined for the last row — "merge with next"
   * is only ever offered between adjacent cues (see module doc in cues.ts:
   * mergeCues doesn't guard against non-adjacent merges, which can strand an
   * overlapping cue in between). */
  nextId: string | undefined;
  onTextCommit: (id: string, text: string) => void;
  onRetime: (id: string, changes: { start?: number; end?: number }) => void;
  onSplit: (cue: Cue) => void;
  onMergeNext: (id: string, nextId: string) => void;
  onSeek: (time: number) => void;
}

function CueRow({
  cue,
  nextId,
  onTextCommit,
  onRetime,
  onSplit,
  onMergeNext,
  onSeek,
}: CueRowProps) {
  const t = useTranslations("Tools.SubtitleStudio");

  // Edited locally and only committed on blur, so the field never fights the
  // user by re-formatting mid-keystroke (e.g. retime's overlap clamping
  // snapping the value back while they're still typing).
  const [text, setText] = useState(cue.text);
  const [start, setStart] = useState(String(cue.start));
  const [end, setEnd] = useState(String(cue.end));

  useEffect(() => setText(cue.text), [cue.id, cue.text]);
  useEffect(() => setStart(String(cue.start)), [cue.id, cue.start]);
  useEffect(() => setEnd(String(cue.end)), [cue.id, cue.end]);

  const commitText = () => {
    if (text !== cue.text) onTextCommit(cue.id, text);
  };

  const commitStart = () => {
    if (start.trim() === "") {
      setStart(String(cue.start));
      return;
    }
    const value = Number(start);
    if (!Number.isNaN(value) && value !== cue.start) {
      onRetime(cue.id, { start: value });
    } else {
      setStart(String(cue.start));
    }
  };

  const commitEnd = () => {
    if (end.trim() === "") {
      setEnd(String(cue.end));
      return;
    }
    const value = Number(end);
    if (!Number.isNaN(value) && value !== cue.end) {
      onRetime(cue.id, { end: value });
    } else {
      setEnd(String(cue.end));
    }
  };

  return (
    <div
      className="rounded-md border p-3 space-y-2 cursor-pointer transition-colors hover:border-primary/50"
      data-testid="cue-row"
      onClick={() => onSeek(cue.start)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          data-testid="cue-seek"
          aria-label={t("seekToCue")}
          onClick={(e) => {
            e.stopPropagation();
            onSeek(cue.start);
          }}
        >
          <PlayIcon className="h-3.5 w-3.5" />
        </Button>

        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
          dir="ltr"
        >
          <Input
            type="number"
            step="0.1"
            value={start}
            data-testid="cue-start-input"
            aria-label={t("startLabel")}
            className="h-8 w-24"
            onChange={(e) => setStart(e.target.value)}
            onBlur={commitStart}
          />
          <span className="text-xs text-muted-foreground">–</span>
          <Input
            type="number"
            step="0.1"
            value={end}
            data-testid="cue-end-input"
            aria-label={t("endLabel")}
            className="h-8 w-24"
            onChange={(e) => setEnd(e.target.value)}
            onBlur={commitEnd}
          />
        </div>

        <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-testid="cue-split"
            onClick={() => onSplit(cue)}
          >
            <ScissorsIcon className="h-3.5 w-3.5" />
            {t("split")}
          </Button>
          {nextId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-testid="cue-merge-next"
              onClick={() => onMergeNext(cue.id, nextId)}
            >
              <CombineIcon className="h-3.5 w-3.5" />
              {t("mergeNext")}
            </Button>
          )}
        </div>
      </div>

      <Textarea
        value={text}
        data-testid="cue-text-input"
        rows={2}
        className="resize-none"
        dir="auto"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setText(e.target.value)}
        onBlur={commitText}
      />
    </div>
  );
}
