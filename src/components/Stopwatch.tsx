"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer, Play, Pause, RotateCcw, Flag, Download } from "lucide-react";
import { toast } from "sonner";

interface Lap {
  number: number;
  lapTime: number;
  totalTime: number;
}

function formatTime(ms: number): string {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSec = Math.floor(totalCs / 100);
  const sec = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const min = totalMin % 60;
  const hr = Math.floor(totalMin / 60);
  return `${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunningRef = useRef(false);
  const elapsedRef = useRef(0);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  const startInterval = useCallback(() => {
    startTimeRef.current = performance.now();
    intervalRef.current = setInterval(() => {
      const now = performance.now();
      const current = accumulatedRef.current + (now - startTimeRef.current);
      setElapsed(current);
    }, 10);
  }, []);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    accumulatedRef.current = elapsedRef.current;
  }, []);

  const handleStartPause = useCallback(() => {
    if (isRunningRef.current) {
      stopInterval();
      setIsRunning(false);
    } else {
      startInterval();
      setIsRunning(true);
    }
  }, [startInterval, stopInterval]);

  const handleLap = useCallback(() => {
    if (!isRunningRef.current) return;
    const total = elapsedRef.current;
    setLaps((prev) => {
      const lastTotal = prev.length > 0 ? prev[0].totalTime : 0;
      const lapTime = total - lastTotal;
      return [{ number: prev.length + 1, lapTime, totalTime: total }, ...prev];
    });
  }, []);

  const handleReset = useCallback(() => {
    if (isRunningRef.current) return;
    accumulatedRef.current = 0;
    setElapsed(0);
    setLaps([]);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        handleStartPause();
      } else if (e.code === "KeyL") {
        handleLap();
      } else if (e.code === "KeyR") {
        handleReset();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleStartPause, handleLap, handleReset]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const fastestLapTime = laps.length >= 2 ? Math.min(...laps.map((l) => l.lapTime)) : null;
  const slowestLapTime = laps.length >= 2 ? Math.max(...laps.map((l) => l.lapTime)) : null;

  const exportCSV = () => {
    if (laps.length === 0) {
      toast.error("No laps to export");
      return;
    }
    const rows = ["Lap #,Lap Time,Total Time", ...laps.slice().reverse().map((l) => `${l.number},${formatTime(l.lapTime)},${formatTime(l.totalTime)}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stopwatch-laps.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Laps exported as CSV");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Timer className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Stopwatch</h1>
            <p className="text-sm text-muted-foreground">Precise lap tracking with keyboard shortcuts</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-8 pb-6 flex flex-col items-center gap-6">
            <div className="font-mono text-6xl md:text-7xl font-bold tracking-tight tabular-nums select-none text-primary">
              {formatTime(elapsed)}
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Button
                size="lg"
                onClick={handleStartPause}
                className={isRunning ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
              >
                {isRunning ? <><Pause className="w-4 h-4 mr-2" />Pause</> : <><Play className="w-4 h-4 mr-2" />Start</>}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleLap}
                disabled={!isRunning}
              >
                <Flag className="w-4 h-4 mr-2" />
                Lap
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                disabled={isRunning}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Keyboard: <Badge variant="outline" className="text-xs mx-0.5">Space</Badge> start/pause &nbsp;
              <Badge variant="outline" className="text-xs mx-0.5">L</Badge> lap &nbsp;
              <Badge variant="outline" className="text-xs mx-0.5">R</Badge> reset
            </p>
          </CardContent>
        </Card>

        {laps.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Laps ({laps.length})</CardTitle>
                <Button variant="outline" size="sm" onClick={exportCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-80">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">Lap</th>
                      <th className="text-right px-4 py-2 font-medium text-muted-foreground">Lap Time</th>
                      <th className="text-right px-4 py-2 font-medium text-muted-foreground">Total Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {laps.map((lap) => {
                      const isFastest = laps.length >= 2 && lap.lapTime === fastestLapTime;
                      const isSlowest = laps.length >= 2 && lap.lapTime === slowestLapTime;
                      return (
                        <tr
                          key={lap.number}
                          className={`border-t transition-colors ${
                            isFastest
                              ? "bg-green-50 dark:bg-green-950/30"
                              : isSlowest
                              ? "bg-red-50 dark:bg-red-950/30"
                              : "hover:bg-muted/30"
                          }`}
                        >
                          <td className="px-4 py-2.5 font-medium">
                            #{lap.number}
                            {isFastest && <Badge className="ml-2 bg-green-500 text-white text-xs py-0">Best</Badge>}
                            {isSlowest && <Badge className="ml-2 bg-red-500 text-white text-xs py-0">Slowest</Badge>}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono tabular-nums">{formatTime(lap.lapTime)}</td>
                          <td className="px-4 py-2.5 text-right font-mono tabular-nums text-muted-foreground">{formatTime(lap.totalTime)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
