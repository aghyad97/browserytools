"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { OptionRow, SettingsCard } from "@/components/shared/SettingsCard";
import { StatStrip } from "@/components/shared/StatStrip";
import { TwoPane } from "@/components/shared/TwoPane";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseSrt, activeCue, type SubtitleCue } from "@/lib/subtitles/srt";
import { FastForward, Maximize, Minimize, Pause, Play, Rewind, Search, Upload } from "lucide-react";

const formatTime = (time: number) => `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;
const ACCEPT_VIDEO = { "video/*": [] };
const ACCEPT_SRT = { "text/plain": [".srt"], "application/x-subrip": [".srt"] };
const fonts = ["system-ui", "Arial", "Verdana", "Georgia", "monospace"];

type SubtitleStyle = { size: number; color: string; background: string; opacity: number; outline: boolean; shadow: boolean; position: "top" | "center" | "bottom"; font: string };
const defaultStyle: SubtitleStyle = { size: 1.25, color: "#ffffff", background: "#000000", opacity: 75, outline: true, shadow: true, position: "bottom", font: "system-ui" };

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
  const [style, setStyle] = useState(defaultStyle);
  const [cinema, setCinema] = useState(false);
  const [status, setStatus] = useState("Choose an SRT file to begin. Video is optional.");

  useEffect(() => () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }, [videoUrl]);
  useEffect(() => {
    if (!playing || videoUrl) return;
    const timer = window.setInterval(() => setCurrentTime((time) => {
      const end = duration || cues.at(-1)?.end || 0;
      if (end && time >= end) { setPlaying(false); return 0; }
      return time + 0.1 * Number(speed);
    }), 100);
    return () => window.clearInterval(timer);
  }, [playing, videoUrl, duration, cues, speed]);

  const current = activeCue(cues, currentTime, offset);
  const filtered = useMemo(() => cues.filter((cue) => cue.text.toLowerCase().includes(query.toLowerCase())), [cues, query]);
  const subtitleStyle = {
    color: style.color,
    fontFamily: style.font,
    fontSize: `${style.size}em`,
    backgroundColor: `${style.background}${Math.round(style.opacity * 2.55).toString(16).padStart(2, "0")}`,
    textShadow: [style.outline ? "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" : "", style.shadow ? "0 2px 4px rgb(0 0 0 / 90%)" : ""].filter(Boolean).join(", "),
  };
  const positionClass = style.position === "top" ? "top-8" : style.position === "center" ? "top-1/2 -translate-y-1/2" : "bottom-16";
  const updateStyle = <K extends keyof SubtitleStyle>(key: K, value: SubtitleStyle[K]) => setStyle((old) => ({ ...old, [key]: value }));

  const loadVideo = (files: File[]) => { const file = files[0]; if (!file) return; setVideoUrl((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(file); }); setVideoName(file.name); setCurrentTime(0); setDuration(0); setStatus(`${file.name} loaded locally. SRT playback remains available without it.`); };
  const loadSrt = async (files: File[]) => { const file = files[0]; if (!file) return; const parsed = parseSrt(await file.text()); setCues(parsed); setCurrentTime(0); setDuration(videoUrl ? 0 : parsed.at(-1)?.end || 0); setPlaying(false); setStatus(`${parsed.length} subtitle cues loaded locally. Ready for SRT-only playback.`); };
  const togglePlay = useCallback(() => { const video = videoRef.current; if (video) { if (video.paused) void video.play(); else video.pause(); } else if (cues.length) setPlaying((value) => !value); }, [cues.length]);
  const seek = useCallback((time: number) => { const end = duration || cues.at(-1)?.end || 0; const next = Math.min(end || Number.POSITIVE_INFINITY, Math.max(0, time)); if (videoRef.current) videoRef.current.currentTime = next; setCurrentTime(next); }, [cues, duration]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable || target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.tagName === "SELECT") return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const amount = event.shiftKey ? 5 : 1;
        seek(currentTime + (event.key === "ArrowLeft" ? -amount : amount));
      } else if (event.key === " ") {
        event.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTime, seek, togglePlay]);
  const toggleFullscreen = async () => { if (!stageRef.current) return; if (document.fullscreenElement) await document.exitFullscreen(); else await stageRef.current.requestFullscreen?.(); };

  return <ToolShell slug="subtitle-cinema-player" title="Watch with precision." sub="A private local subtitle player. Add video only when you want it." width="wide">
    <div className="space-y-6">
      <SettingsCard title="Import subtitles first" description="SRT playback works on its own. Video is optional and stays on this device.">
        <FileDropzone onFiles={loadSrt} accept={ACCEPT_SRT} title="Drop an SRT file, or click to choose" subtitle="Searchable, clickable subtitle cues — video not required" inputProps={{ "aria-label": "Choose SRT subtitle file" }}>
          <div className="flex flex-col items-center gap-2 text-center"><Upload className="h-5 w-5 text-primary" aria-hidden="true" /><span className="font-medium">{cues.length ? `${cues.length} cues loaded` : "Choose subtitles"}</span><span className="text-sm text-muted-foreground">SRT format</span></div>
        </FileDropzone>
        <details className="mt-4 rounded-md border p-3"><summary className="cursor-pointer text-sm font-medium">Optional: add a local video</summary><div className="mt-3"><FileDropzone onFiles={loadVideo} accept={ACCEPT_VIDEO} title="Drop a video, or click to choose" subtitle="MP4, WebM, MOV and browser-supported formats" inputProps={{ "aria-label": "Choose optional video" }}><span className="text-sm">{videoName || "Choose optional video"}</span></FileDropzone></div></details>
        <p role="status" className="mt-3 text-sm text-muted-foreground">{status}</p>
      </SettingsCard>

      <div ref={stageRef} data-cinema={cinema} className="relative aspect-video overflow-hidden rounded-lg border bg-black text-white shadow-sm data-[cinema=true]:fixed data-[cinema=true]:inset-0 data-[cinema=true]:z-50 data-[cinema=true]:rounded-none">
        {videoUrl ? <video ref={videoRef} src={videoUrl} className="h-full w-full object-contain" onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} aria-label="Local video preview" /> : <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/60">{cues.length ? "SRT-only cinema mode — use play to step through your transcript." : "Choose an SRT file above to begin."}</div>}
        {current && <div className={`pointer-events-none absolute inset-x-[5%] text-center font-semibold leading-tight ${positionClass}`} style={subtitleStyle} aria-live="polite">{current.text}</div>}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8"><Button size="sm" variant="ghost" className="shrink-0 px-2 text-white hover:bg-white/20 hover:text-white" onClick={() => seek(currentTime - 5)} aria-label="Seek backward 5 seconds"><Rewind className="mr-1 h-4 w-4" />-5s</Button><Button size="sm" variant="ghost" className="shrink-0 px-2 text-white hover:bg-white/20 hover:text-white" onClick={() => seek(currentTime - 1)} aria-label="Seek backward 1 second"><Rewind className="mr-1 h-4 w-4" />-1s</Button><Button size="icon" variant="ghost" className="shrink-0 text-white hover:bg-white/20 hover:text-white" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause /> : <Play />}</Button><Button size="sm" variant="ghost" className="shrink-0 px-2 text-white hover:bg-white/20 hover:text-white" onClick={() => seek(currentTime + 1)} aria-label="Seek forward 1 second">+1s<FastForward className="ml-1 h-4 w-4" /></Button><Button size="sm" variant="ghost" className="shrink-0 px-2 text-white hover:bg-white/20 hover:text-white" onClick={() => seek(currentTime + 5)} aria-label="Seek forward 5 seconds">+5s<FastForward className="ml-1 h-4 w-4" /></Button><input aria-label="Video progress" className="h-1 min-w-0 flex-1 accent-primary" type="range" min="0" max={duration || cues.at(-1)?.end || 0} step="0.01" value={currentTime} onChange={(e) => seek(Number(e.target.value))} disabled={!cues.length} /><span className="shrink-0 font-mono text-xs tabular-nums">{formatTime(currentTime)} / {formatTime(duration || cues.at(-1)?.end || 0)}</span><Button size="icon" variant="ghost" className="shrink-0 text-white hover:bg-white/20 hover:text-white" onClick={toggleFullscreen} aria-label="Toggle fullscreen">{cinema ? <Minimize /> : <Maximize />}</Button></div>
      </div>

      <TwoPane ratio={1.25} start={<SettingsCard title="Playback and subtitle style" description="Tune timing, appearance, and readability.">
        <OptionRow label="Offset" hint="seconds" htmlFor="subtitle-offset"><Input id="subtitle-offset" aria-label="Subtitle offset" type="number" step="0.1" value={offset} onChange={(e) => setOffset(Number(e.target.value) || 0)} /></OptionRow>
        <OptionRow label="Speed" htmlFor="playback-speed"><Select value={speed} onValueChange={(value) => { setSpeed(value); if (videoRef.current) videoRef.current.playbackRate = Number(value); }}><SelectTrigger id="playback-speed" aria-label="Playback speed"><SelectValue /></SelectTrigger><SelectContent>{["0.5", "0.75", "1", "1.25", "1.5", "2"].map((value) => <SelectItem key={value} value={value}>{value}×</SelectItem>)}</SelectContent></Select></OptionRow>
        <OptionRow label="Font size" hint={`${style.size.toFixed(1)}×`} htmlFor="subtitle-size"><Input id="subtitle-size" aria-label="Subtitle text size" type="range" min="0.8" max="2" step="0.1" value={style.size} onChange={(e) => updateStyle("size", Number(e.target.value))} /></OptionRow>
        <OptionRow label="Text color"><input aria-label="Subtitle text color" type="color" value={style.color} onChange={(e) => updateStyle("color", e.target.value)} className="h-9 w-full rounded border" /></OptionRow>
        <OptionRow label="Background color"><input aria-label="Subtitle background color" type="color" value={style.background} onChange={(e) => updateStyle("background", e.target.value)} className="h-9 w-full rounded border" /></OptionRow>
        <OptionRow label="Background opacity" hint={`${style.opacity}%`} htmlFor="subtitle-opacity"><Input id="subtitle-opacity" aria-label="Subtitle background opacity" type="range" min="0" max="100" step="5" value={style.opacity} onChange={(e) => updateStyle("opacity", Number(e.target.value))} /></OptionRow>
        <OptionRow label="Position" htmlFor="subtitle-position"><Select value={style.position} onValueChange={(value: SubtitleStyle["position"]) => updateStyle("position", value)}><SelectTrigger id="subtitle-position" aria-label="Subtitle position"><SelectValue /></SelectTrigger><SelectContent>{["top", "center", "bottom"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></OptionRow>
        <OptionRow label="Font family" htmlFor="subtitle-font"><Select value={style.font} onValueChange={(value) => updateStyle("font", value)}><SelectTrigger id="subtitle-font" aria-label="Subtitle font family"><SelectValue /></SelectTrigger><SelectContent>{fonts.map((font) => <SelectItem key={font} value={font}>{font}</SelectItem>)}</SelectContent></Select></OptionRow>
        <div className="flex gap-2"><Button variant={style.outline ? "default" : "outline"} onClick={() => updateStyle("outline", !style.outline)}>Outline</Button><Button variant={style.shadow ? "default" : "outline"} onClick={() => updateStyle("shadow", !style.shadow)}>Shadow</Button></div>
        <Button variant="outline" className="mt-2 w-full" onClick={() => setCinema((value) => !value)}>{cinema ? <Minimize /> : <Maximize />} {cinema ? "Exit cinema" : "Cinema mode"}</Button>
      </SettingsCard>} end={<StatStrip items={[{ label: "Subtitle cues", value: cues.length }, { label: "Visible results", value: filtered.length }, { label: "Position", value: formatTime(currentTime), sub: duration ? `${Math.round((currentTime / duration) * 100)}% watched` : "SRT-only mode" }]} />} />

      <Tabs defaultValue="transcript"><TabsList><TabsTrigger value="transcript">Transcript</TabsTrigger><TabsTrigger value="about">About</TabsTrigger></TabsList><TabsContent value="transcript"><SettingsCard title="Searchable transcript" description="Select any cue to seek the subtitle experience to its start."><div className="relative"><Search className="pointer-events-none absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" /><Input aria-label="Search transcript" className="ps-9" placeholder="Search cues" value={query} onChange={(e) => setQuery(e.target.value)} /></div><div className="max-h-96 overflow-y-auto rounded-md border">{filtered.map((cue) => <button key={cue.id} type="button" className={`flex w-full gap-4 border-b p-3 text-start text-sm last:border-0 hover:bg-muted ${cue === current ? "bg-primary/10 text-primary" : ""}`} onClick={() => seek(Math.max(0, cue.start - offset))}><time className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{formatTime(cue.start)}</time><span>{cue.text}</span></button>)}{!filtered.length && <p className="p-6 text-center text-sm text-muted-foreground">Load an SRT file to see clickable cues.</p>}</div></SettingsCard></TabsContent><TabsContent value="about"><p className="rounded-md border p-4 text-sm text-muted-foreground">SRT and optional video are processed locally in your browser. Nothing is uploaded.</p></TabsContent></Tabs>
    </div>
  </ToolShell>;
}
