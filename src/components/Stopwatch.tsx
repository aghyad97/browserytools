"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Flag, Download } from "lucide-react";
import { toast } from "sonner";
import { formatStopwatch } from "@/lib/time-format";
import { ToolShell } from "@/components/template/tool-shell";
import { downloadBlob } from "@/lib/download";
import { SettingsCard } from "@/components/shared/SettingsCard";

interface Lap {
  number: number;
  lapTime: number;
  totalTime: number;
}

export default function Stopwatch() {
  const t = useTranslations("Tools.Stopwatch");
  const tc = useTranslations("ToolsConfig");
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
      toast.error(t("noLapsToExport"));
      return;
    }
    const rows = ["Lap #,Lap Time,Total Time", ...laps.slice().reverse().map((l) => `${l.number},${formatStopwatch(l.lapTime)},${formatStopwatch(l.totalTime)}`)];
    downloadBlob(new Blob([rows.join("\n")], { type: "text/csv" }), "stopwatch-laps.csv");
    toast.success(t("lapsExported"));
  };

  return (
    <ToolShell
      slug="stopwatch"
      title={tc("tools.stopwatch.name")}
      sub={tc("tools.stopwatch.description")}
      controls={
        <>
          <Button variant="outline" onClick={handleLap} disabled={!isRunning}>
            <Flag className="w-4 h-4 me-2" />
            {t("lap")}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={isRunning}>
            <RotateCcw className="w-4 h-4 me-2" />
            {t("reset")}
          </Button>
        </>
      }
      primaryAction={{
        label: isRunning ? t("pause") : t("start"),
        onClick: handleStartPause,
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-8 pb-6 flex flex-col items-center gap-6">
            <div dir="ltr" className="font-mono text-6xl md:text-7xl font-bold tracking-tight tabular-nums select-none text-primary">
              {formatStopwatch(elapsed)}
            </div>

            <p className="text-xs text-muted-foreground">
              {t("keyboardHint")} <Badge variant="outline" className="text-xs mx-0.5">Space</Badge> {t("startPauseKey")} &nbsp;
              <Badge variant="outline" className="text-xs mx-0.5">L</Badge> {t("lapKey")} &nbsp;
              <Badge variant="outline" className="text-xs mx-0.5">R</Badge> {t("resetKey")}
            </p>
          </CardContent>
        </Card>

        {laps.length > 0 && (
          <SettingsCard
            title={`${t("laps")} (${laps.length})`}
            action={
              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="w-4 h-4 me-2" />
                {t("exportCSV")}
              </Button>
            }
          >
            <div className="overflow-auto max-h-80 -mx-5">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
                  <tr>
                    <th className="text-start px-4 py-2 font-medium text-muted-foreground">{t("lapColumn")}</th>
                    <th className="text-end px-4 py-2 font-medium text-muted-foreground">{t("lapTime")}</th>
                    <th className="text-end px-4 py-2 font-medium text-muted-foreground">{t("totalTime")}</th>
                  </tr>
                </thead>
                <tbody>
                  {laps.map((lap) => {
                    const isFastest = laps.length >= 2 && lap.lapTime === fastestLapTime;
                    const isSlowest = laps.length >= 2 && lap.lapTime === slowestLapTime;
                    return (
                      <tr
                        key={lap.number}
                        // status color, no bt token: fastest/slowest lap highlight
                        className={`border-t transition-colors ${
                          isFastest
                            ? "bg-green-50 dark:bg-green-950/30"
                            : isSlowest
                            ? "bg-red-50 dark:bg-red-950/30"
                            : "hover:bg-muted/30"
                        }`}
                      >
                        <td className="px-4 py-2.5 font-medium">
                          <span dir="ltr">#{lap.number}</span>
                          {isFastest && <Badge className="ms-2 bg-green-500 text-white text-xs py-0">{t("best")}</Badge>}
                          {isSlowest && <Badge className="ms-2 bg-red-500 text-white text-xs py-0">{t("slowest")}</Badge>}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums" dir="ltr">{formatStopwatch(lap.lapTime)}</td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-muted-foreground" dir="ltr">{formatStopwatch(lap.totalTime)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SettingsCard>
        )}
      </div>
    </ToolShell>
  );
}
