"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ToolShell } from "@/components/template/tool-shell";
import { Button } from "@/components/ui/button";
import { parseSrt, activeCue, type SubtitleCue } from "@/lib/subtitles/srt";
import { Maximize, Minimize, Play, Pause, Upload, Search, Settings2 } from "lucide-react";
import styles from "./subtitle-cinema-player.module.css";

const formatTime = (time: number) => `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

export default function SubtitleCinemaPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [cues, setCues] = useState<SubtitleCue[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [offset, setOffset] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [query, setQuery] = useState("");
  const [fontSize, setFontSize] = useState(1);
  const [cinema, setCinema] = useState(false);
  const [status, setStatus] = useState("Choose a video and an SRT file to begin.");

  useEffect(() => () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }, [videoUrl]);
  const current = activeCue(cues, currentTime, offset);
  const filtered = useMemo(() => cues.filter((cue) => cue.text.toLowerCase().includes(query.toLowerCase())), [cues, query]);

  const loadVideo = (file?: File) => {
    if (!file) return;
    setVideoUrl((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(file); });
    setStatus(`${file.name} loaded locally.`);
  };
  const loadSrt = async (file?: File) => {
    if (!file) return;
    const parsed = parseSrt(await file.text());
    setCues(parsed);
    setStatus(`${parsed.length} subtitle cues loaded locally.`);
  };
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play(); else video.pause();
  };
  const seek = (time: number) => { if (videoRef.current) videoRef.current.currentTime = Math.max(0, time); setCurrentTime(Math.max(0, time)); };
  const toggleFullscreen = async () => {
    if (!stageRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen(); else await stageRef.current.requestFullscreen?.();
  };

  return <ToolShell slug="subtitle-cinema-player" title="Watch with precision." sub="A private local video and subtitle player.">
    <div className={styles.player} data-cinema={cinema}>
      <div className={styles.imports}>
        <label className={styles.fileButton}><Upload size={16} /> Video<input type="file" accept="video/*" onChange={(e) => loadVideo(e.target.files?.[0])} /></label>
        <label className={styles.fileButton}><Upload size={16} /> SRT<input type="file" accept=".srt,text/plain" onChange={(e) => loadSrt(e.target.files?.[0])} /></label>
        <span role="status" className={styles.status}>{status}</span>
      </div>
      <div ref={stageRef} className={styles.stage}>
        {videoUrl ? <video ref={videoRef} src={videoUrl} className={styles.video} onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onRateChange={(e) => setSpeed(e.currentTarget.playbackRate)} aria-label="Local video preview" /> : <div className={styles.empty}>Your video stays on this device.</div>}
        {current && <div className={styles.subtitle} style={{ fontSize: `${fontSize}em` }} aria-live="polite">{current.text}</div>}
        <div className={styles.controls}>
          <Button size="icon" variant="ghost" onClick={togglePlay} aria-label={playing ? "Pause video" : "Play video"}>{playing ? <Pause /> : <Play />}</Button>
          <input aria-label="Video progress" type="range" min="0" max={videoRef.current?.duration || 0} step="0.01" value={currentTime} onChange={(e) => seek(Number(e.target.value))} />
          <span className={styles.time}>{formatTime(currentTime)} / {formatTime(videoRef.current?.duration || 0)}</span>
          <Button size="icon" variant="ghost" onClick={toggleFullscreen} aria-label="Toggle fullscreen"><Maximize /></Button>
        </div>
      </div>
      <div className={styles.toolbar}>
        <label>Offset <input aria-label="Subtitle offset" type="number" step="0.1" value={offset} onChange={(e) => setOffset(Number(e.target.value) || 0)} /> s</label>
        <label>Speed <select aria-label="Playback speed" value={speed} onChange={(e) => { const value = Number(e.target.value); setSpeed(value); if (videoRef.current) videoRef.current.playbackRate = value; }}><option value="0.5">0.5×</option><option value="0.75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label>
        <label>Text <input aria-label="Subtitle text size" type="range" min="0.8" max="1.6" step="0.1" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} /></label>
        <Button variant="outline" onClick={() => setCinema((value) => !value)}><Settings2 size={16} /> Cinema</Button>
      </div>
      <section className={styles.transcript} aria-label="Searchable transcript">
        <div className={styles.transcriptHeader}><h2>Transcript</h2><label className={styles.search}><Search size={16} /><input aria-label="Search transcript" placeholder="Search cues" value={query} onChange={(e) => setQuery(e.target.value)} /></label></div>
        {filtered.map((cue) => <button key={cue.id} className={cue === current ? styles.activeCue : styles.cue} onClick={() => seek(Math.max(0, cue.start - offset))}><time>{formatTime(cue.start)}</time><span>{cue.text}</span></button>)}
        {!filtered.length && <p className={styles.muted}>Load an SRT file to see clickable cues.</p>}
      </section>
    </div>
  </ToolShell>;
}
