"use client";

import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
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
  Moon,
  Sun,
  Music2,
  Radio,
  Trash2,
} from "lucide-react";

export default function AudioEditor() {
  const {
    audioFile,
    audioBuffer,
    isPlaying,
    volume,
    duration,
    currentTime,
    selection,
    effects,
    setAudioFile,
    setAudioBuffer,
    setIsPlaying,
    setVolume,
    setDuration,
    setCurrentTime,
    setSpeed,
    setSelection,
    addEffect,
    removeEffect,
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
      toast.error("Please select a valid audio file");
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

      toast.success("Audio file loaded successfully");
    } catch (error) {
      toast.error("Error loading audio file");
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
      toast.error("Error processing audio file");
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

    // Draw selection region if exists
    if (selection.start !== selection.end) {
      const startX = (selection.start / duration) * canvas.width;
      const endX = (selection.end / duration) * canvas.width;
      ctx.fillStyle = "rgba(14, 165, 233, 0.2)";
      ctx.fillRect(startX, 0, endX - startX, canvas.height);
    }

    ctx.strokeStyle = "#0ea5e9";
    ctx.stroke();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !duration) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / rect.width) * duration;

    setSelection({
      start: Math.min(time, selection.end),
      end: Math.max(time, selection.start),
    });

    if (audioBuffer) {
      drawWaveform(audioBuffer);
    }
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

  const applyFadeEffect = (type: "fadeIn" | "fadeOut") => {
    if (!audioBuffer) return;

    const duration = 2; // 2 seconds fade
    addEffect({ type, value: duration });
    toast.success(`${type === "fadeIn" ? "Fade in" : "Fade out"} applied`);

    if (audioBuffer) {
      drawWaveform(audioBuffer);
    }
  };

  const applyEchoEffect = () => {
    if (!audioBuffer) return;

    addEffect({ type: "echo", value: 0.3 });
    toast.success("Echo effect applied");

    if (audioBuffer) {
      drawWaveform(audioBuffer);
    }
  };

  const changePlaybackSpeed = (newSpeed: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = newSpeed;
    setSpeed(newSpeed);
    toast.success(`Playback speed set to ${newSpeed}x`);
  };

  const downloadProcessedAudio = async () => {
    if (!audioBuffer || !audioFile) return;

    try {
      const context = new AudioContext();
      const source = context.createBufferSource();
      source.buffer = audioBuffer;

      const destination = context.createMediaStreamDestination();
      source.connect(destination);

      const mediaRecorder = new MediaRecorder(destination.stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `edited_${audioFile.name}`;
        a.click();
        URL.revokeObjectURL(url);
      };

      source.start();
      mediaRecorder.start();

      setTimeout(() => {
        mediaRecorder.stop();
        source.stop();
      }, audioBuffer.duration * 1000);

      toast.success("Processing audio for download...");
    } catch (error) {
      toast.error("Error processing audio for download");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-between items-center p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div>
          <h1 className="text-3xl font-bold">Audio Editor</h1>
          <p className="text-muted-foreground mt-1">
            Edit and process audio files in your browser
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <div className="max-w-7xl mx-auto space-y-4">
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
                    Drop audio file here or click to upload
                  </p>
                </label>
              ) : (
                <div className="text-center">
                  <p className="font-medium">{audioFile.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Math.round(duration)} seconds
                  </p>
                </div>
              )}
            </div>
          </Card>

          {audioFile && (
            <Card className="p-6 space-y-6">
              <canvas
                ref={canvasRef}
                className="w-full h-32 bg-muted rounded-lg cursor-crosshair"
                width={800}
                height={128}
                onClick={handleCanvasClick}
              />

              <div className="text-sm text-muted-foreground text-center">
                Current Time: {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
              </div>

              <Tabs defaultValue="playback" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="playback">Playback</TabsTrigger>
                  <TabsTrigger value="effects">Effects</TabsTrigger>
                  <TabsTrigger value="trim">Trim</TabsTrigger>
                </TabsList>

                <TabsContent value="playback" className="space-y-4">
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
                </TabsContent>

                <TabsContent value="effects" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => applyFadeEffect("fadeIn")}
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Fade In
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => applyFadeEffect("fadeOut")}
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Fade Out
                    </Button>
                    <Button variant="outline" onClick={applyEchoEffect}>
                      <Radio className="h-4 w-4 mr-2" />
                      Add Echo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => changePlaybackSpeed(1)}
                    >
                      <Music2 className="h-4 w-4 mr-2" />
                      Reset Speed
                    </Button>
                  </div>

                  {effects.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">
                        Applied Effects
                      </h3>
                      <div className="space-y-2">
                        {effects.map((effect) => (
                          <div
                            key={effect.id}
                            className="flex items-center justify-between p-2 bg-muted rounded-md"
                          >
                            <span className="text-sm">
                              {effect.type} ({effect.value}s)
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeEffect(effect.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="trim" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Selection: {selection.start.toFixed(2)}s -{" "}
                        {selection.end.toFixed(2)}s
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={downloadProcessedAudio}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
