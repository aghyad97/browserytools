"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Play, Pause, RotateCcw, SkipForward, Settings, X, Timer, Coffee, Brain } from "lucide-react";
import { toast } from "sonner";

type SessionType = "work" | "shortBreak" | "longBreak";

interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  soundEnabled: boolean;
  autoAdvance: boolean;
}

interface DailyStats {
  date: string;
  completedSessions: number;
  totalFocusSeconds: number;
  breaksTaken: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  soundEnabled: true,
  autoAdvance: false,
};

const SESSION_COLORS: Record<SessionType, { bg: string; text: string; ring: string; badge: string }> = {
  work: { bg: "from-red-50 to-rose-100 dark:from-red-950/30 dark:to-rose-900/20", text: "text-red-600 dark:text-red-400", ring: "stroke-red-500", badge: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300" },
  shortBreak: { bg: "from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-900/20", text: "text-emerald-600 dark:text-emerald-400", ring: "stroke-emerald-500", badge: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300" },
  longBreak: { bg: "from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-900/20", text: "text-blue-600 dark:text-blue-400", ring: "stroke-blue-500", badge: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300" },
};

function getDuration(type: SessionType, s: PomodoroSettings): number {
  return (type === "work" ? s.workDuration : type === "shortBreak" ? s.shortBreakDuration : s.longBreakDuration) * 60;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function formatFocusTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadSettings(): PomodoroSettings {
  try {
    const s = localStorage.getItem("pomodoro-settings");
    return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}

function saveSettings(s: PomodoroSettings) {
  try { localStorage.setItem("pomodoro-settings", JSON.stringify(s)); } catch {}
}

function loadStats(): DailyStats {
  try {
    const s = localStorage.getItem("pomodoro-stats");
    if (s) {
      const parsed = JSON.parse(s) as DailyStats;
      if (parsed.date === getTodayKey()) return parsed;
    }
  } catch {}
  return { date: getTodayKey(), completedSessions: 0, totalFocusSeconds: 0, breaksTaken: 0 };
}

function saveStats(s: DailyStats) {
  try { localStorage.setItem("pomodoro-stats", JSON.stringify(s)); } catch {}
}

let audioCtxSingleton: AudioContext | null = null;
function getAudioCtx(): AudioContext | null {
  try {
    if (!audioCtxSingleton) audioCtxSingleton = new AudioContext();
    return audioCtxSingleton;
  } catch { return null; }
}

function playBeep(ctx: AudioContext, type: "tick" | "end") {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g);
  g.connect(ctx.destination);
  if (type === "end") {
    o.frequency.setValueAtTime(880, ctx.currentTime);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.8);
  }
}

export default function PomodoroTimer() {
  const t = useTranslations("Tools.PomodoroTimer");
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [sessionType, setSessionType] = useState<SessionType>("work");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.workDuration * 60);
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_SETTINGS.workDuration * 60);
  const [workSessionCount, setWorkSessionCount] = useState(0);
  const [stats, setStats] = useState<DailyStats>({ date: getTodayKey(), completedSessions: 0, totalFocusSeconds: 0, breaksTaken: 0 });
  const [showSettings, setShowSettings] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const focusAccumulatorRef = useRef(0);
  const settingsRef = useRef(settings);
  const sessionTypeRef = useRef(sessionType);
  const workSessionCountRef = useRef(workSessionCount);

  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { sessionTypeRef.current = sessionType; }, [sessionType]);
  useEffect(() => { workSessionCountRef.current = workSessionCount; }, [workSessionCount]);

  useEffect(() => {
    const s = loadSettings();
    const st = loadStats();
    setSettings(s);
    setStats(st);
    setTimeLeft(s.workDuration * 60);
    setTotalSeconds(s.workDuration * 60);
  }, []);

  const doAdvanceSession = useCallback((
    currentType: SessionType,
    currentCount: number,
    currentSettings: PomodoroSettings,
    andRun: boolean
  ) => {
    let nextType: SessionType;
    let nextCount = currentCount;
    if (currentType === "work") {
      nextCount = currentCount + 1;
      if (nextCount >= currentSettings.sessionsBeforeLongBreak) {
        nextType = "longBreak";
        nextCount = 0;
      } else {
        nextType = "shortBreak";
      }
    } else {
      nextType = "work";
      nextCount = 0;
    }
    const duration = getDuration(nextType, currentSettings);
    setSessionType(nextType);
    setWorkSessionCount(nextCount);
    setTimeLeft(duration);
    setTotalSeconds(duration);
    if (andRun) setIsRunning(true);
  }, []);

  const handleSessionEndRef = useRef<() => void>(() => {});
  handleSessionEndRef.current = () => {
    const s = settingsRef.current;
    const currentType = sessionTypeRef.current;
    const currentCount = workSessionCountRef.current;
    if (s.soundEnabled) {
      const ctx = getAudioCtx();
      if (ctx) playBeep(ctx, "end");
    }
    setStats((prev) => {
      let next: DailyStats;
      if (currentType === "work") {
        next = { ...prev, completedSessions: prev.completedSessions + 1, totalFocusSeconds: prev.totalFocusSeconds + focusAccumulatorRef.current, date: getTodayKey() };
        toast.success(t("focusSessionComplete"), { duration: 4000 });
      } else {
        next = { ...prev, breaksTaken: prev.breaksTaken + 1, date: getTodayKey() };
        toast.success(t("breakOver"), { duration: 4000 });
      }
      focusAccumulatorRef.current = 0;
      saveStats(next);
      return next;
    });
    doAdvanceSession(currentType, currentCount, s, s.autoAdvance);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setTimeout(() => handleSessionEndRef.current(), 0);
            return 0;
          }
          if (sessionTypeRef.current === "work") focusAccumulatorRef.current += 1;
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  useEffect(() => {
    const sessionLabels: Record<SessionType, string> = {
      work: "Focus Time",
      shortBreak: "Short Break",
      longBreak: "Long Break",
    };
    if (isRunning) {
      document.title = `${formatTime(timeLeft)} — ${sessionLabels[sessionType]} | Pomodoro`;
    } else {
      document.title = "Pomodoro Timer | BrowseryTools";
    }
    return () => { document.title = "Pomodoro Timer | BrowseryTools"; };
  }, [timeLeft, isRunning, sessionType]);

  const handleStartPause = () => {
    if (!isRunning) {
      const ctx = getAudioCtx();
      if (ctx && ctx.state === "suspended") ctx.resume();
    }
    setIsRunning((r) => !r);
  };

  const handleReset = () => {
    setIsRunning(false);
    focusAccumulatorRef.current = 0;
    setTimeLeft(getDuration(sessionType, settings));
    setTotalSeconds(getDuration(sessionType, settings));
  };

  const handleSkip = () => {
    setIsRunning(false);
    focusAccumulatorRef.current = 0;
    doAdvanceSession(sessionType, workSessionCount, settings, false);
  };

  const handleSwitchSession = (type: SessionType) => {
    if (isRunning) { toast.info(t("pauseFirst")); return; }
    focusAccumulatorRef.current = 0;
    setSessionType(type);
    setTimeLeft(getDuration(type, settings));
    setTotalSeconds(getDuration(type, settings));
  };

  const updateSetting = <K extends keyof PomodoroSettings>(key: K, value: PomodoroSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      if (!isRunning) {
        setTimeLeft(getDuration(sessionType, next));
        setTotalSeconds(getDuration(sessionType, next));
      }
      return next;
    });
  };

  const sessionLabels: Record<SessionType, string> = {
    work: t("focus"),
    shortBreak: t("shortBreakLabel"),
    longBreak: t("longBreakLabel"),
  };

  const colors = SESSION_COLORS[sessionType];
  const progress = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;
  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference * (1 - progress);
  const currentSessionNumber = sessionType === "work" ? workSessionCount + 1 : null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Timer className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t("title")}</h1>
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSettings((s) => !s)}
            className={showSettings ? "border-primary text-primary" : ""}
          >
            {showSettings ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          </Button>
        </div>

        {showSettings && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("settings")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {([
                  { key: "workDuration" as const, label: t("workDuration"), min: 1, max: 90 },
                  { key: "shortBreakDuration" as const, label: t("shortBreak"), min: 1, max: 30 },
                  { key: "longBreakDuration" as const, label: t("longBreak"), min: 1, max: 60 },
                  { key: "sessionsBeforeLongBreak" as const, label: t("sessionsBeforeLongBreak"), min: 1, max: 10 },
                ]).map(({ key, label, min, max }) => (
                  <div key={key} className="space-y-1.5">
                    <Label className="text-sm">{label}</Label>
                    <input
                      type="number" min={min} max={max} value={settings[key]}
                      onChange={(e) => updateSetting(key, Math.max(min, Math.min(max, Number(e.target.value))))}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">{t("soundNotifications")}</Label>
                  <Switch checked={settings.soundEnabled} onCheckedChange={(v) => updateSetting("soundEnabled", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">{t("autoAdvance")}</Label>
                  <Switch checked={settings.autoAdvance} onCheckedChange={(v) => updateSetting("autoAdvance", v)} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className={`bg-gradient-to-br ${colors.bg} border-0 shadow-lg`}>
          <CardContent className="pt-8 pb-6">
            <div className="flex gap-2 justify-center mb-8 flex-wrap">
              {(["work", "shortBreak", "longBreak"] as SessionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleSwitchSession(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    sessionType === type
                      ? `${SESSION_COLORS[type].badge} border`
                      : "text-muted-foreground border-transparent hover:border-border"
                  }`}
                >
                  {sessionLabels[type]}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 240 240">
                  <circle cx="120" cy="120" r="110" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                  <circle
                    cx="120" cy="120" r="110" fill="none" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                    className={`${colors.ring} transition-all duration-1000 ease-linear`}
                  />
                </svg>
                <div className="text-center z-10 select-none">
                  <div dir="ltr" className={`text-6xl font-mono font-bold tracking-tight ${colors.text}`}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 font-medium">
                    {sessionLabels[sessionType]}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i < workSessionCount
                        ? "bg-red-500"
                        : i === workSessionCount && sessionType === "work"
                          ? "bg-red-300 animate-pulse"
                          : "bg-muted"
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1.5">
                  {currentSessionNumber
                    ? t("sessionOf", { current: currentSessionNumber, total: settings.sessionsBeforeLongBreak })
                    : sessionLabels[sessionType]}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={handleReset} className="rounded-full w-11 h-11" title="Reset">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  size="lg" onClick={handleStartPause}
                  className={`rounded-full w-16 h-16 text-white shadow-md transition-colors ${
                    sessionType === "work" ? "bg-red-500 hover:bg-red-600"
                    : sessionType === "shortBreak" ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </Button>
                <Button variant="outline" size="icon" onClick={handleSkip} className="rounded-full w-11 h-11" title="Skip">
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              {t("todayStats")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div dir="ltr" className="text-2xl font-bold text-red-500">{formatFocusTime(stats.totalFocusSeconds)}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t("focusTime")}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div dir="ltr" className="text-2xl font-bold text-primary">{stats.completedSessions}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t("sessionsDone")}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div dir="ltr" className="text-2xl font-bold text-emerald-500">{stats.breaksTaken}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t("breaksTaken")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Coffee className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
              <p>
                {t("workFor")} <strong className="text-foreground">{settings.workDuration} {t("min")}</strong>
                {", "}
                {t("thenTake")} <strong className="text-foreground">{settings.shortBreakDuration}-{t("min")}</strong>{" "}
                {t("shortBreakMin")}{" "}
                <strong className="text-foreground">{settings.sessionsBeforeLongBreak}</strong>{" "}
                {t("sessions")}{" "}
                <strong className="text-foreground">{settings.longBreakDuration}-{t("min")}</strong>{" "}
                {t("longBreakMin")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
