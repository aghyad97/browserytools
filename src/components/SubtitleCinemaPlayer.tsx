"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { OptionRow, SettingsCard } from "@/components/shared/SettingsCard";
import { StatStrip } from "@/components/shared/StatStrip";
import { TwoPane } from "@/components/shared/TwoPane";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseSrt, activeCue, type SubtitleCue } from "@/lib/subtitles/srt";
import { Maximize, Minimize, Pause, Play, Search, Upload } from "lucide-react";

const formatTime = (time: number) =>
  `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

const ACCEPT_VIDEO = { "video/*": [] };
const ACCEPT_SRT = { "text/plain": [".srt"], "application/x-subrip": [".srt"] };

export default function SubtitleCinemaPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoName, setVideoName] = useState("");
  const [cues, setCues] = useState<SubtitleCue[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [offset, setOffset] = useState(0);
  const [speed, setSpeed] = useState("1");
  const [query, setQuery] = useState("");
  const [fontSize, setFontSize] = useState(1);
  const [cinema, setCinema] = useState(false);
  const [status, setStatus] = useState("Choose a video and an SRT file to begin.");

  useEffect(() => () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
  }, [videoUrl]);

  const current = activeCue(cues, currentTime, offset);
  const filtered = useMemo(
    () => cues.filter((cue) => cue.text.toLowerCase().includes(query.toLowerCase())),
    [cues, query],
  );

  const loadVideo = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setVideoUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
    setVideoName(file.name);
    setCurrentTime(0);
    setDuration(0);
    setStatus(`${file.name} loaded locally.`);
  };

  const loadSrt = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const parsed = parseSrt(await file.text());
    setCues(parsed);
    setStatus(`${parsed.length} subtitle cues loaded locally.`);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  const seek = (time: number) => {
    const next = Math.max(0, time);
    if (videoRef.current) videoRef.current.currentTime = next;
    setCurrentTime(next);
  };

  const toggleFullscreen = async () => {
    if (!stageRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await stageRef.current.requestFullscreen?.();
  };

  return (
    <ToolShell
      slug="subtitle-cinema-player"
      title="Watch with precision."
      sub="A private local video and subtitle player."
      width="wide"
    >
      <div className="space-y-6">
        <SettingsCard title="Import media" description="Everything stays on this device.">
          <TwoPane
            ratio={1}
            start={
              <FileDropzone
                onFiles={loadVideo}
                accept={ACCEPT_VIDEO}
                title="Drop a video, or click to choose"
                subtitle="MP4, WebM, MOV and other browser-supported formats"
                inputProps={{ "aria-label": "Choose video" }}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <Upload className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="font-medium">{videoName || "Choose a video"}</span>
                  <span className="text-sm text-muted-foreground">Local playback only</span>
                </div>
              </FileDropzone>
            }
            end={
              <FileDropzone
                onFiles={loadSrt}
                accept={ACCEPT_SRT}
                title="Drop an SRT file, or click to choose"
                subtitle="Searchable, clickable subtitle cues"
                inputProps={{ "aria-label": "Choose SRT subtitle file" }}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <Upload className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="font-medium">{cues.length ? `${cues.length} cues loaded` : "Choose subtitles"}</span>
                  <span className="text-sm text-muted-foreground">SRT format</span>
                </div>
              </FileDropzone>
            }
          />
          <p role="status" className="text-sm text-muted-foreground">{status}</p>
        </SettingsCard>

        <div
          ref={stageRef}
          data-cinema={cinema}
          className="relative aspect-video overflow-hidden rounded-lg border bg-black text-white shadow-sm data-[cinema=true]:fixed data-[cinema=true]:inset-0 data-[cinema=true]:z-50 data-[cinema=true]:rounded-none"
        >
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="h-full w-full object-contain"
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              aria-label="Local video preview"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/60">
              Your video stays on this device. Choose a video above to begin.
            </div>
          )}
          {current && (
            <div
              className="pointer-events-none absolute inset-x-[5%] bottom-16 text-center text-xl font-semibold leading-tight text-white [text-shadow:0_2px_4px_rgb(0_0_0_/_90%)] sm:text-2xl"
              style={{ fontSize: `${fontSize}em` }}
              aria-live="polite"
            >
              {current.text}
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8">
            <Button size="icon" variant="ghost" className="shrink-0 text-white hover:bg-white/20 hover:text-white" onClick={togglePlay} aria-label={playing ? "Pause video" : "Play video"}>
              {playing ? <Pause /> : <Play />}
            </Button>
            <input aria-label="Video progress" className="h-1 min-w-0 flex-1 accent-primary" type="range" min="0" max={duration} step="0.01" value={Math.min(currentTime, duration || 0)} onChange={(event) => seek(Number(event.target.value))} disabled={!videoUrl} />
            <span className="shrink-0 font-mono text-xs tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</span>
            <Button size="icon" variant="ghost" className="shrink-0 text-white hover:bg-white/20 hover:text-white" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
              {cinema ? <Minimize /> : <Maximize />}
            </Button>
          </div>
        </div>

        <TwoPane
          ratio={1.25}
          start={
            <SettingsCard title="Playback" description="Tune timing and readability.">
              <OptionRow label="Offset" hint="seconds" htmlFor="subtitle-offset">
                <Input id="subtitle-offset" aria-label="Subtitle offset" type="number" step="0.1" value={offset} onChange={(event) => setOffset(Number(event.target.value) || 0)} />
              </OptionRow>
              <OptionRow label="Speed" htmlFor="playback-speed">
                <Select value={speed} onValueChange={(value) => { setSpeed(value); if (videoRef.current) videoRef.current.playbackRate = Number(value); }}>
                  <SelectTrigger id="playback-speed" aria-label="Playback speed"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['0.5', '0.75', '1', '1.25', '1.5', '2'].map((value) => <SelectItem key={value} value={value}>{value}×</SelectItem>)}
                  </SelectContent>
                </Select>
              </OptionRow>
              <OptionRow label="Text size" hint={`${fontSize.toFixed(1)}×`} htmlFor="subtitle-size">
                <Input id="subtitle-size" aria-label="Subtitle text size" type="range" min="0.8" max="1.6" step="0.1" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} />
              </OptionRow>
              <Button variant="outline" className="w-full" onClick={() => setCinema((value) => !value)}>{cinema ? <Minimize /> : <Maximize />} {cinema ? "Exit cinema" : "Cinema mode"}</Button>
            </SettingsCard>
          }
          end={
            <StatStrip
              items={[
                { label: "Subtitle cues", value: cues.length },
                { label: "Visible results", value: filtered.length },
                { label: "Position", value: formatTime(currentTime), sub: duration ? `${Math.round((currentTime / duration) * 100)}% watched` : "waiting for video" },
              ]}
            />
          }
        />

        <Tabs defaultValue="transcript">
          <TabsList>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="transcript">
            <SettingsCard title="Searchable transcript" description="Select any cue to seek the video to its start.">
              <div className="relative">
                <Search className="pointer-events-none absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input aria-label="Search transcript" className="ps-9" placeholder="Search cues" value={query} onChange={(event) => setQuery(event.target.value)} />
              </div>
              <div className="max-h-96 overflow-y-auto rounded-md border">
                {filtered.map((cue) => (
                  <button key={cue.id} type="button" className={`flex w-full gap-4 border-b p-3 text-start text-sm last:border-0 hover:bg-muted ${cue === current ? "bg-primary/10 text-primary" : ""}`} onClick={() => seek(Math.max(0, cue.start - offset))}>
                    <time className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{formatTime(cue.start)}</time>
                    <span>{cue.text}</span>
                  </button>
                ))}
                {!filtered.length && <p className="p-6 text-center text-sm text-muted-foreground">Load an SRT file to see clickable cues.</p>}
              </div>
            </SettingsCard>
          </TabsContent>
          <TabsContent value="about">
            <p className="rounded-md border p-4 text-sm text-muted-foreground">Video and subtitles are processed locally in your browser. Nothing is uploaded.</p>
          </TabsContent>
        </Tabs>
      </div>
    </ToolShell>
  );
}
