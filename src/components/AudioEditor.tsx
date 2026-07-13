"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { ToolShell } from "@/components/template/tool-shell";
import { downloadBlob } from "@/lib/download";
import { useAudioStore } from "@/store/audio-store";
import {
  Play,
  Pause,
  Upload,
  Volume2,
  VolumeX,
  Download,
  FastForward,
  Rewind,
  RotateCcw,
} from "lucide-react";

export default function AudioEditor() {
  const t = useTranslations("Tools.AudioEditor");
  const tc = useTranslations("ToolsConfig");
  const {
    audioFile,
    audioBuffer,
    isPlaying,
    volume,
    duration,
    currentTime,
    setAudioFile,
    setAudioBuffer,
    setIsPlaying,
    setVolume,
    setDuration,
    setCurrentTime,
    setSpeed,
    reset,
  } = useAudioStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        animationFrameRef.current = requestAnimationFrame(updateTime);
      }
    };

    if (isPlaying) {
      updateTime();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, setCurrentTime]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file?.type.startsWith("audio/")) {
      toast.error(t("invalidAudioFile"));
      return;
    }

    try {
      setAudioFile(file);
      const audio = new Audio(URL.createObjectURL(file));
      audioRef.current = audio;

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
        initializeAudioContext(file);
      });

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
      });

      toast.success(t("fileLoadedSuccess"));
    } catch (error) {
      toast.error(t("errorLoadingFile"));
      reset();
    }
  };

  const initializeAudioContext = async (file: File) => {
    try {
      const context = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);

      const gainNode = context.createGain();
      gainNode.connect(context.destination);
      gainNode.gain.value = volume;

      audioContextRef.current = context;
      gainNodeRef.current = gainNode;
      setAudioBuffer(audioBuffer);
      drawWaveform(audioBuffer);
    } catch (error) {
      toast.error(t("errorProcessingFile"));
    }
  };

  const drawWaveform = (audioBuffer: AudioBuffer) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / canvas.width);
    const amp = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, amp);

    for (let i = 0; i < canvas.width; i++) {
      let min = 1.0;
      let max = -1.0;

      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }

      ctx.lineTo(i, (1 + min) * amp);
      ctx.lineTo(i, (1 + max) * amp);
    }

    // content value: waveform stroke drawn onto a <canvas> (no CSS var access in 2D context)
    ctx.strokeStyle = "#0ea5e9";
    ctx.stroke();
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  };

  const changePlaybackSpeed = (newSpeed: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = newSpeed;
    setSpeed(newSpeed);
    toast.success(t("speedSet", { speed: newSpeed }));
  };

  const downloadOriginal = () => {
    if (!audioFile) return;
    downloadBlob(audioFile, audioFile.name);
  };

  return (
    <ToolShell
      slug="audio"
      title={tc("tools.audio.name")}
      sub={tc("tools.audio.description")}
    >
      <div className="space-y-4">
          <Card className="p-6">
            <div
              className={`
                h-32 rounded-lg border-2 border-dashed
                flex flex-col items-center justify-center space-y-4
                ${!audioFile ? "border-muted-foreground" : "border-primary"}
              `}
            >
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileUpload}
                id="audio-upload"
              />
              {!audioFile ? (
                <label
                  htmlFor="audio-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {t("dropHere")}
                  </p>
                </label>
              ) : (
                <div className="text-center">
                  <p className="font-medium">{audioFile.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("seconds", { count: Math.round(duration) })}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {audioFile && (
            <Card className="p-6 space-y-6">
              <canvas
                ref={canvasRef}
                className="w-full h-32 bg-muted rounded-lg"
                width={800}
                height={128}
              />

              <div className="text-sm text-muted-foreground text-center">
                {t("currentTime", { current: currentTime.toFixed(2), total: duration.toFixed(2) })}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => changePlaybackSpeed(0.5)}
                  >
                    <Rewind className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => changePlaybackSpeed(2)}
                  >
                    <FastForward className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => changePlaybackSpeed(1)}
                    aria-label={t("resetSpeed")}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  {volume === 0 ? (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Slider
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-24"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={downloadOriginal}>
                  <Download className="h-4 w-4 me-2" />
                  {t("downloadOriginal")}
                </Button>
              </div>
            </Card>
          )}
      </div>
    </ToolShell>
  );
}
