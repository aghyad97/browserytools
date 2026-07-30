"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Download, Loader2, ScissorsIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { getFFmpeg } from "@/lib/media/ffmpeg";
import { parseTimeInput } from "@/lib/media/time";
import { downloadUrl } from "@/lib/download";
import { formatBytes } from "@/lib/format";

const FORMAT_OPTIONS = [
  { value: "mp3", codec: "libmp3lame", mime: "audio/mpeg", bitrate: true },
  { value: "m4a", codec: "aac", mime: "audio/mp4", bitrate: true },
  { value: "ogg", codec: "libvorbis", mime: "audio/ogg", bitrate: true },
  { value: "wav", codec: "pcm_s16le", mime: "audio/wav", bitrate: false },
] as const;

const BITRATE_OPTIONS = ["128k", "192k", "256k", "320k"] as const;

const MAX_FILE_SIZE = 500 * 1024 * 1024;

type ItemStatus = "queued" | "converting" | "done" | "error";

interface QueueItem {
  id: string;
  file: File;
  name: string;
  size: number;
  status: ItemStatus;
  progress: number;
  trimStart: string;
  trimEnd: string;
  trimOpen: boolean;
  trimError: boolean;
  outputUrl: string | null;
  outputName: string | null;
  errorKey: "noAudio" | "convertFailed" | null;
}

/** Marks a "successful" ffmpeg run that produced no usable audio (0-byte or
 * missing output) so the catch block can pick the honest copy key. */
class NoAudioError extends Error {}

function fileExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx >= 0 && idx < name.length - 1 ? name.slice(idx + 1) : "bin";
}

/** A row "Convert all" will act on: fresh queue entries, and error rows from
 * a conversion failure (retryable) — but not trim-error rows, which need the
 * user to actually fix the trim value first (updateTrimField requeues those
 * itself once edited). */
function isProcessable(it: QueueItem): boolean {
  return it.status === "queued" || (it.status === "error" && it.errorKey !== null);
}

export default function VideoToAudio() {
  const t = useTranslations("Tools.VideoToAudio");
  const tc = useTranslations("ToolsConfig");

  const [items, setItems] = useState<QueueItem[]>([]);
  const [format, setFormat] = useState<string>("mp3");
  const [bitrate, setBitrate] = useState<string>("192k");
  const [converting, setConverting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // itemsRef mirrors `items` synchronously so the sequential convert loop can
  // read live status/trim values across awaits without waiting on React's
  // render cycle (setState alone would lag behind the loop's own steps).
  const itemsRef = useRef<QueueItem[]>([]);
  const cancelRef = useRef(false);
  // Bumped on every convert run. A progress event from a superseded run
  // (cancelled, then restarted) checks this before touching state.
  const runTokenRef = useRef(0);
  // Every object URL ever handed out, so unmount can revoke whatever wasn't
  // already revoked by a manual row removal.
  const liveUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      for (const url of liveUrlsRef.current) URL.revokeObjectURL(url);
      liveUrlsRef.current.clear();
    };
  }, []);

  const applyItems = useCallback(
    (updater: (prev: QueueItem[]) => QueueItem[]) => {
      const next = updater(itemsRef.current);
      itemsRef.current = next;
      setItems(next);
    },
    []
  );

  const handleFiles = useCallback(
    (files: File[]) => {
      const accepted: QueueItem[] = [];
      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(t("videoTooLarge"));
          continue;
        }
        accepted.push({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          status: "queued",
          progress: 0,
          trimStart: "",
          trimEnd: "",
          trimOpen: false,
          trimError: false,
          outputUrl: null,
          outputName: null,
          errorKey: null,
        });
      }
      if (accepted.length > 0) {
        applyItems((prev) => [...prev, ...accepted]);
      }
    },
    [applyItems, t]
  );

  const removeItem = useCallback(
    (id: string) => {
      const item = itemsRef.current.find((it) => it.id === id);
      if (item?.outputUrl) {
        URL.revokeObjectURL(item.outputUrl);
        liveUrlsRef.current.delete(item.outputUrl);
      }
      applyItems((prev) => prev.filter((it) => it.id !== id));
    },
    [applyItems]
  );

  const toggleTrim = useCallback(
    (id: string) => {
      applyItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, trimOpen: !it.trimOpen } : it))
      );
    },
    [applyItems]
  );

  const updateTrimField = useCallback(
    (id: string, field: "trimStart" | "trimEnd", value: string) => {
      applyItems((prev) =>
        prev.map((it) => {
          if (it.id !== id) return it;
          const next = { ...it, [field]: value };
          // Editing a trim value on an errored row is the user's signal that
          // they're retrying it — put it back in the queue so the next
          // "Convert all" picks it up (otherwise a fixed trim is a dead end:
          // idsToProcess only ever looks at "queued" rows).
          if (it.status === "error") {
            next.status = "queued";
            next.trimError = false;
            next.errorKey = null;
            next.progress = 0;
          }
          return next;
        })
      );
    },
    [applyItems]
  );

  const handleCancel = useCallback(() => {
    cancelRef.current = true;
    setCancelling(true);
  }, []);

  const handleConvertAll = useCallback(async () => {
    if (converting || !itemsRef.current.some(isProcessable)) return;

    cancelRef.current = false;
    setCancelling(false);
    runTokenRef.current += 1;
    const token = runTokenRef.current;
    setConverting(true);

    let ffmpeg: Awaited<ReturnType<typeof getFFmpeg>>;
    let fetchFile: typeof import("@ffmpeg/util").fetchFile;
    try {
      const utilMod = await import("@ffmpeg/util");
      fetchFile = utilMod.fetchFile;
      ffmpeg = await getFFmpeg();
    } catch (err) {
      console.error(err);
      toast.error(t("engineLoadFailed"));
      setConverting(false);
      return;
    }

    const fmt = FORMAT_OPTIONS.find((f) => f.value === format) ?? FORMAT_OPTIONS[0];
    const idsToProcess = itemsRef.current.filter(isProcessable).map((it) => it.id);
    // A stale run (superseded by a newer convert-all) must never write into a
    // cleared/reloaded queue — every state write below checks this first,
    // mirroring CompressVideo's activeVideoTokenRef guard.
    const isCurrentRun = () => token === runTokenRef.current;

    for (let i = 0; i < idsToProcess.length; i++) {
      if (cancelRef.current) break;
      const id = idsToProcess[i];
      const item = itemsRef.current.find((it) => it.id === id);
      if (!item) continue; // removed mid-run

      const startRaw = item.trimStart;
      const endRaw = item.trimEnd;
      const start = startRaw.trim() !== "" ? parseTimeInput(startRaw) : null;
      const end = endRaw.trim() !== "" ? parseTimeInput(endRaw) : null;
      const startInvalid = startRaw.trim() !== "" && start === null;
      const endInvalid = endRaw.trim() !== "" && end === null;
      const rangeInvalid = start !== null && end !== null && start >= end;

      if (startInvalid || endInvalid || rangeInvalid) {
        if (!isCurrentRun()) return;
        applyItems((prev) =>
          prev.map((it) =>
            it.id === id ? { ...it, status: "error", trimError: true, errorKey: null } : it
          )
        );
        continue;
      }

      if (!isCurrentRun()) return;
      applyItems((prev) =>
        prev.map((it) =>
          it.id === id
            ? { ...it, status: "converting", progress: 0, errorKey: null, trimError: false }
            : it
        )
      );

      const onProgress = ({ progress: p }: { progress: number }) => {
        if (token !== runTokenRef.current) return;
        const pct = Math.min(100, Math.max(0, Math.round(p * 100)));
        applyItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, progress: pct } : it))
        );
      };
      ffmpeg.on("progress", onProgress);

      const inputName = `input_${i}.${fileExtension(item.name)}`;
      const outputName = `output_${i}.${fmt.value}`;

      try {
        await ffmpeg.writeFile(inputName, await fetchFile(item.file));

        const args = [
          "-i",
          inputName,
          ...(start !== null ? ["-ss", String(start)] : []),
          ...(end !== null ? ["-to", String(end)] : []),
          "-vn",
          "-c:a",
          fmt.codec,
          ...(fmt.bitrate ? ["-b:a", bitrate] : []),
          outputName,
        ];

        await ffmpeg.exec(args);

        let data: Uint8Array;
        try {
          data = (await ffmpeg.readFile(outputName)) as Uint8Array;
        } catch {
          throw new NoAudioError();
        }
        if (!data || data.length === 0) {
          throw new NoAudioError();
        }

        const bytes = new Uint8Array(data);
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: fmt.mime });
        const url = URL.createObjectURL(blob);
        liveUrlsRef.current.add(url);
        const base = item.name.replace(/\.[^.]+$/, "");
        const downloadName = `${base}.${fmt.value}`;

        if (!isCurrentRun()) return;
        applyItems((prev) =>
          prev.map((it) =>
            it.id === id
              ? {
                  ...it,
                  status: "done",
                  progress: 100,
                  outputUrl: url,
                  outputName: downloadName,
                  errorKey: null,
                }
              : it
          )
        );
      } catch (err) {
        console.error(err);
        if (!isCurrentRun()) return;
        const errorKey = err instanceof NoAudioError ? "noAudio" : "convertFailed";
        applyItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, status: "error", errorKey } : it))
        );
      } finally {
        ffmpeg.off("progress", onProgress);
        try {
          await ffmpeg.deleteFile(inputName);
        } catch {
          // best-effort cleanup
        }
        try {
          await ffmpeg.deleteFile(outputName);
        } catch {
          // best-effort cleanup
        }
      }
    }

    if (!isCurrentRun()) return;
    setConverting(false);
    setCancelling(false);
  }, [applyItems, bitrate, converting, format, t]);

  const fmtOption = FORMAT_OPTIONS.find((f) => f.value === format) ?? FORMAT_OPTIONS[0];

  // "Convert all" is a no-op (and shouldn't boot the ~31 MB ffmpeg engine for
  // nothing) unless there's at least one queued row or a retryable error row.
  const hasProcessableRows = items.some(isProcessable);

  function statusLabel(status: ItemStatus): string {
    switch (status) {
      case "queued":
        return t("statusQueued");
      case "converting":
        return t("statusConverting");
      case "done":
        return t("statusDone");
      case "error":
        return t("statusError");
    }
  }

  function statusVariant(status: ItemStatus): "outline" | "secondary" | "destructive" {
    if (status === "error") return "destructive";
    if (status === "done") return "secondary";
    return "outline";
  }

  return (
    <ToolShell
      slug="video-to-audio"
      title={tc("tools.video-to-audio.name")}
      sub={tc("tools.video-to-audio.description")}
    >
      <div className="space-y-4">
        <FileDropzone
          onFiles={handleFiles}
          multiple
          accept={{ "video/*": [".mp4", ".mov", ".webm", ".mkv", ".avi", ".m4v"] }}
          className={({ isDragActive }) => `
            rounded-lg border-2 border-dashed cursor-pointer
            flex flex-col items-center justify-center gap-2 text-center
            transition-[border-color,background-color] duration-150
            ${items.length > 0 ? "p-4" : "p-8"}
            ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-muted-foreground hover:border-primary hover:bg-primary/5"
            }
          `}
        >
          <Upload className="w-6 h-6 text-primary" />
          <div>
            <p className="font-medium">
              {items.length > 0 ? t("addMore") : t("dropVideosHere")}
            </p>
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {t("supportedFormats")}
              </p>
            )}
          </div>
        </FileDropzone>

        <SettingsCard>
          <OptionRow label={t("format")} htmlFor="vta-format">
            <Select value={format} onValueChange={setFormat} disabled={converting}>
              <SelectTrigger id="vta-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.value.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </OptionRow>

          <OptionRow label={t("bitrate")} htmlFor="vta-bitrate">
            <Select
              value={bitrate}
              onValueChange={setBitrate}
              disabled={converting || !fmtOption.bitrate}
            >
              <SelectTrigger id="vta-bitrate">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BITRATE_OPTIONS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </OptionRow>
        </SettingsCard>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            {t("emptyQueueHint")}
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      {formatBytes(item.size)}
                    </p>
                    {item.status === "error" && !item.trimError && item.errorKey && (
                      <p className="text-xs text-destructive">
                        {item.errorKey === "noAudio" ? t("noAudio") : t("convertFailed")}
                      </p>
                    )}
                  </div>
                  <Badge variant={statusVariant(item.status)}>
                    {statusLabel(item.status)}
                  </Badge>
                  {item.status !== "converting" && !converting && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <XIcon className="w-4 h-4 me-1" />
                      {t("remove")}
                    </Button>
                  )}
                  {item.status === "done" && item.outputUrl && item.outputName && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadUrl(item.outputUrl as string, item.outputName as string)}
                    >
                      <Download className="w-4 h-4 me-1" />
                      {t("download")}
                    </Button>
                  )}
                </div>

                {item.status === "converting" && (
                  <Progress value={item.progress} />
                )}

                {item.status === "error" && item.trimError && (
                  <p className="text-xs text-destructive">{t("invalidTrim")}</p>
                )}

                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTrim(item.id)}
                  >
                    <ScissorsIcon className="w-4 h-4 me-1" />
                    {t("trim")}
                  </Button>
                  {item.trimOpen && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <OptionRow label={t("trimStart")} htmlFor={`trim-start-${item.id}`}>
                        <Input
                          id={`trim-start-${item.id}`}
                          dir="ltr"
                          value={item.trimStart}
                          placeholder={t("trimPlaceholder")}
                          disabled={item.status === "converting" || item.status === "done"}
                          onChange={(e) =>
                            updateTrimField(item.id, "trimStart", e.target.value)
                          }
                        />
                      </OptionRow>
                      <OptionRow label={t("trimEnd")} htmlFor={`trim-end-${item.id}`}>
                        <Input
                          id={`trim-end-${item.id}`}
                          dir="ltr"
                          value={item.trimEnd}
                          placeholder={t("trimPlaceholder")}
                          disabled={item.status === "converting" || item.status === "done"}
                          onChange={(e) =>
                            updateTrimField(item.id, "trimEnd", e.target.value)
                          }
                        />
                      </OptionRow>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <Button
          onClick={converting ? handleCancel : handleConvertAll}
          disabled={converting ? false : !hasProcessableRows}
          className="w-full"
        >
          {converting && <Loader2 className="w-4 h-4 me-2 animate-spin" />}
          {converting ? t("cancel") : t("convertAll")}
        </Button>
        {converting && cancelling && (
          <p className="text-xs text-muted-foreground text-center">
            {t("finishingCurrent")}
          </p>
        )}
      </div>
    </ToolShell>
  );
}
