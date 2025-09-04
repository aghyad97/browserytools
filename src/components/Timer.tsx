"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Bell,
} from "lucide-react";

type Mode = "countdown" | "stopwatch";

function formatTime(totalMs: number): {
  hh: number;
  mm: number;
  ss: number;
  ms: number;
} {
  const clamped = Math.max(0, Math.floor(totalMs));
  const ms = clamped % 1000;
  const totalSeconds = Math.floor(clamped / 1000);
  const ss = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const mm = totalMinutes % 60;
  const hh = Math.floor(totalMinutes / 60);
  return { hh, mm, ss, ms };
}

export default function Timer() {
  const [mode, setMode] = useState<Mode>("countdown");
  const [isRunning, setIsRunning] = useState(false);
  const [initialMs, setInitialMs] = useState(5 * 60 * 1000); // default 5 min
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const requestRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hideControlsTimeoutRef = useRef<number | null>(null);
  const playTone = useCallback((frequency: number, duration: number = 0.2) => {
    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + duration
      );
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + duration);
    } catch (_e) {}
  }, []);

  const playBeep = useCallback(() => {
    playTone(880, 0.6);
  }, [playTone]);

  // Remaining or elapsed display value in ms
  const displayMs = useMemo(() => {
    if (mode === "countdown") {
      return Math.max(0, initialMs - elapsedMs);
    }
    return elapsedMs;
  }, [mode, initialMs, elapsedMs]);

  const { hh, mm, ss } = formatTime(displayMs);

  const tick = useCallback(
    (now: number) => {
      if (!isRunning) return;
      if (lastTickRef.current == null) {
        lastTickRef.current = now;
      }
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      setElapsedMs((prev) => {
        const next = prev + delta;
        if (mode === "countdown" && next >= initialMs) {
          // completion
          cancelAnimationFrame(requestRef.current ?? 0);
          requestRef.current = null;
          lastTickRef.current = null;
          setIsRunning(false);
          // play sound
          playBeep();
          return initialMs;
        }
        return next;
      });

      requestRef.current = requestAnimationFrame(tick);
    },
    [isRunning, mode, initialMs]
  );

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(tick);
      return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    }
  }, [isRunning, tick]);

  const handleStartPause = () => {
    if (isRunning) {
      setIsRunning(false);
      lastTickRef.current = null;
      // manual pause cue: lower pitch
      playTone(440, 0.15);
    } else {
      setIsRunning(true);
      // manual start cue: higher pitch
      playTone(880, 0.15);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    lastTickRef.current = null;
    setElapsedMs(0);
  };

  const handleApplyCountdown = (h: number, m: number, s: number) => {
    const msValue = Math.max(0, (h * 3600 + m * 60 + s) * 1000);
    setInitialMs(msValue);
    setElapsedMs(0);
    setIsRunning(false);
  };

  const enterFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
      setShowControls(true);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
      hideControlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } catch (_e) {}
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      setIsFullscreen(false);
      setShowControls(true);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
        hideControlsTimeoutRef.current = null;
      }
    } catch (_e) {}
  };

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Auto-hide controls on inactivity while in fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    const handleActivity = () => {
      setShowControls(true);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
      hideControlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const target = containerRef.current || document;
    target.addEventListener("mousemove", handleActivity);
    target.addEventListener(
      "touchstart",
      handleActivity as any,
      {
        passive: true,
      } as any
    );
    target.addEventListener("keydown", handleActivity as any);

    return () => {
      target.removeEventListener("mousemove", handleActivity);
      target.removeEventListener("touchstart", handleActivity as any);
      target.removeEventListener("keydown", handleActivity as any);
    };
  }, [isFullscreen]);

  // Inputs for countdown
  const [hInput, setHInput] = useState(0);
  const [mInput, setMInput] = useState(5);
  const [sInput, setSInput] = useState(0);

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? "fixed inset-0 bg-background"
          : "container mx-auto p-6 max-w-4xl"
      }
    >
      {isFullscreen ? (
        <div className="h-full w-full flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-7xl md:text-[180px] font-mono flex items-center gap-6 select-none">
              <NumberFlow value={hh} format={{ minimumIntegerDigits: 2 }} />
              <span>:</span>
              <NumberFlow value={mm} format={{ minimumIntegerDigits: 2 }} />
              <span>:</span>
              <NumberFlow value={ss} format={{ minimumIntegerDigits: 2 }} />
            </div>
          </div>
          <div
            className={`pb-10 flex justify-center transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex items-center gap-4">
              <Button onClick={handleStartPause} className="min-w-32">
                {isRunning ? (
                  <span className="inline-flex items-center gap-2">
                    <Pause className="w-5 h-5" /> Pause
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Play className="w-5 h-5" /> Start
                  </span>
                )}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={exitFullscreen}>
                <Minimize2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Timer & Countdown</CardTitle>
            <CardDescription>
              Minimal timer with animated digits, fullscreen, and completion
              sound.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={mode}
              onValueChange={(v) => {
                setMode(v as Mode);
                handleReset();
              }}
            >
              <TabsList>
                <TabsTrigger value="countdown">Countdown</TabsTrigger>
                <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
              </TabsList>
              <TabsContent value="countdown" className="space-y-4">
                <div className="grid grid-cols-3 gap-3 max-w-md">
                  <div className="space-y-2">
                    <Label>Hours</Label>
                    <Input
                      type="number"
                      min={0}
                      value={hInput}
                      onChange={(e) =>
                        setHInput(Math.max(0, Number(e.target.value)))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Minutes</Label>
                    <Input
                      type="number"
                      min={0}
                      value={mInput}
                      onChange={(e) =>
                        setMInput(Math.max(0, Number(e.target.value)))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Seconds</Label>
                    <Input
                      type="number"
                      min={0}
                      value={sInput}
                      onChange={(e) =>
                        setSInput(Math.max(0, Number(e.target.value)))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Button
                    variant="outline"
                    onClick={() => handleApplyCountdown(hInput, mInput, sInput)}
                  >
                    Apply
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="stopwatch">
                <p className="text-sm text-muted-foreground">
                  Counts up from 0.
                </p>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex flex-col items-center gap-6">
              <div className="text-6xl md:text-8xl font-mono flex items-center gap-4 select-none">
                <NumberFlow value={hh} format={{ minimumIntegerDigits: 2 }} />
                <span>:</span>
                <NumberFlow value={mm} format={{ minimumIntegerDigits: 2 }} />
                <span>:</span>
                <NumberFlow value={ss} format={{ minimumIntegerDigits: 2 }} />
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleStartPause} className="min-w-28">
                  {isRunning ? (
                    <span className="inline-flex items-center gap-2">
                      <Pause className="w-4 h-4" /> Pause
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Play className="w-4 h-4" /> Start
                    </span>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={enterFullscreen}>
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" onClick={playBeep} title="Test sound">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
